var app = (function () {
    //Variaveis de detalhes da planta
    var vlPlanta;

    // Application object.
    var app = {};

    //Array dos beacons
    var vfBeaconArray = new Array();
    var vfCodEstabelecimento;
    var vfCodPiso;

    app.initialize = function () {
        document.addEventListener('deviceready', onDeviceReady, false); 
    }

    function onDeviceReady() {
        getEstabelecimentos(app.montaEstabelecimentos, app.failAjax);
    }
    
    app.failAjax = function(a, b, c){
        console.log("DEU FAIL");
        console.log(a);
        console.log(b);
        console.log(c);
    }

    app.montaEstabelecimentos = function(data){
        $('#estabelecimentos').empty();
        $('#estabelecimentos').css("display", "block");
        $('#pisos').empty();
        $('#pisos').css("display", "none");
        $('#info').css("display", "none");
        var vlEstabs = data.estabelecimentos;
        if (!vlEstabs){
            return;
        }

        for (var i = vlEstabs.length - 1; i >= 0; --i) {
            var vlEstab = vlEstabs[i];
            var element = $(
                '<button type="button"'
                + 'onclick="carregaEstab(' +  vlEstab.id + ')">'
                + '<strong>' + vlEstab.nome_curto + ' </strong>'
                + '</span>'
                + '</button><br/>'
                );
            $('#estabelecimentos').append(element);
        }
    }
    
    app.carregaEstab = function(id){
        
        vfCodEstabelecimento = id;
        getPisos(id , app.montaPisos, app.failAjax );
    
    }

    app.montaPisos = function(data){
        $('#estabelecimentos').empty();
        $('#estabelecimentos').css("display", "none");
        $('#pisos').empty();
        $('#pisos').css("display", "block");
        var vlPisos = data.pisos;
        if (!vlPisos){
            return;
        }

        for (var i = vlPisos.length - 1; i >= 0; --i) {
            var vlPiso = vlPisos[i];
            var element = $(
                '<button type="button"'
                + 'onclick="carregaPiso(' +  vlPiso.id + ')">'
                + '<strong>' + vlPiso.nome_curto + ' </strong>'
                + '</span>'
                + '</button><br/>'
                );
            $('#pisos').append(element);
        }
    }

    app.carregaPiso = function(id){

        vfCodPiso = id;
        getPlanta(id , app.montaPlanta, app.failAjax );
    
    }

    app.montaPlanta = function(data){
        $('#pisos').empty();
        $('#pisos').css("display", "none");
        vlPlanta = {
            x: data.piso.xMetros,
            y: data.piso.yMetros,
            beacons: data.piso.beacons
        };
        vlBeacons = vlPlanta.beacons;

        for (var i = 0; i < vlBeacons.length; i++) {
            vlBeacon = vlBeacons[i];
            vfBeaconArray.push(new LocusBeacon((i + 1).toString(), 
                                               vlBeacon.UUID, 
                                               vlBeacon.Major, 
                                               vlBeacon.Minor, 
                                               '',  //Proximity
                                               0.0, //DIstance
                                               0,   //RSSI
                                               vlBeacon.xMetros,
                                               vlBeacon.yMetros, 
                                               vlBeacon.zMetros, 
                                               false));

        }
        
        montaMapa();
    
        startMonitoringAndRanging();

    }
    
    //FUNÇÃO PRINCIPAL!
    function startMonitoringAndRanging(mess) {
        function onDidRangeBeaconsInRegion(result) {
            updateRengeBeacons(result.beacons);
        }
    
        function onDidExitRegion(result) {
            var vlIx = LocusFindBeaconIndex(vfBeaconArray,
                result.region.uuid,
                result.region.major,
                result.region.minor);
            /* vfBeaconArray[vlIx].Active = false; */
            displayBeacons();
        }
    
        function onDidEnterRegion(result) {
            var vlIx = LocusFindBeaconIndex(vfBeaconArray,
                result.region.uuid,
                result.region.major,
                result.region.minor);
            vfBeaconArray[vlIx].Active = true;
            displayBeacons();
        }
    
        function onError(errorMessage) {
        }
    
        // Request permission from user to access location info.
        cordova.plugins.locationManager.requestAlwaysAuthorization();
        cordova.plugins.locationManager.isBluetoothEnabled()
        .then(function (isEnabled) {
            if (!isEnabled) {
                cordova.plugins.locationManager.enableBluetooth();
            }
        })
        .fail(function (e) { console.error(e); })
        .done();
    
    
        // Create delegate object that holds beacon callback functions.
        var delegate = new cordova.plugins.locationManager.Delegate();
        cordova.plugins.locationManager.setDelegate(delegate);
    
        // Set delegate functions.
        delegate.didExitRegion = onDidExitRegion;
        delegate.didEnterRegion = onDidEnterRegion;
        delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion;
    
        // Start monitoring and ranging beacons.
        startMonitoringAndRangingRegions(vfBeaconArray, onError);
    }
    
    function startMonitoringAndRangingRegions(beacons, errorCallback) {
        /*
        Chama função de início do monitoramento e o distanciamento para região do array de regiões
        */
        // Start monitoring and ranging regions.
        for (var i in beacons) {
            startMonitoringAndRangingRegion(beacons[i], errorCallback);
        }
    }
    
    function startMonitoringAndRangingRegion(beacon, errorCallback) {
        /*
        Inicia o monitoramento e o distanciamento para região do parâmetro
        */
        // Create a region object.
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
            beacon.Id,
            beacon.UUID,
            beacon.Major,
            beacon.Minor);
    
        // Start ranging.
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail(errorCallback)
            .done();
    
        // Start monitoring.
        cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
            .fail(errorCallback)
            .done();
    }

    function displayBeacons() {
        
        plotDotLocation();
    
        return;
    
        $('#beacons').empty();
    
        var vlBeaconActive = LocusFindBeaconActiveAndNoZeroDistance(vfBeaconArray);
    
        if (vlBeaconActive === null) {
            return;
        }
    
        for (var i = vlBeaconActive.length - 1; i >= 0; --i) {
            var beacon = vlBeaconActive[i];
    
            if (!$('#' + beacon.UUID + beacon.Major + beacon.Minor).length) {
                // Update element.
                var element = $(
                    '<li id=' + beacon.UUID + beacon.Major + beacon.Minor + '>'
                    + '<span><strong>Beacon: ' + beacon.Id + ' </strong></span><br />'
                    + '<span id="x">X: ' + beacon.x + '</span>'
                    + '<span id="y"> Y: ' + beacon.y + ' </span><br />'
                    + '<span id="r">R: ' + beacon.Distance + '</span>'
                    + '</li>'
                    );
                $('#beacons').append(element);
            }
        }
    
        if (vlBeaconActive.length >= 3) {
            var posicao = calculaPosicao(vlBeaconActive[0], vlBeaconActive[1], vlBeaconActive[2]);
    
            if (posicao.x) {
                $('#lblX').text(posicao.x.toFixed(4));
                $('#lblY').text(posicao.y.toFixed(4));
            }
        }
        else {
            $('#lblX').text(0);
            $('#lblY').text(0);
        }
    }
    
    function updateRengeBeacons(beacons) {
        for (var i = 0; i < beacons.length; ++i) {
            var vlIX = LocusFindBeaconIndex(vfBeaconArray, beacons[i].uuid,  beacons[i].major,  beacons[i].minor);
            
            if (vlIX >= 0 && beacons[i].accuracy != 0) {
                vfBeaconArray[vlIX].Proximity = beacons[i].proximity;
                vfBeaconArray[vlIX].Distance = beacons[i].accuracy;
                vfBeaconArray[vlIX].RSSI = beacons[i].rssi;
            }
        }
        LocusSortByDistance(vfBeaconArray);
        displayBeacons();
    }
    
    function montaMapa(){
        var htmlTabela = "<table>";
        var x, i;
        var aux = true;
    
        xMax =  (vlPlanta.x * 10) + 2;
        yMax = (vlPlanta.y * 10) + 2;
    
        for (var y = 0; y <= yMax; y++) {
            htmlTabela = htmlTabela + "<tr>";
            for (var x = 0; x <= xMax; x++) {
                htmlTabela = htmlTabela + "<td ";
                htmlTabela = htmlTabela + "id='celx" + x + "y" + y + "'";
                if(x == xMax || y == yMax || x == 0 || y == 0){
                    htmlTabela = htmlTabela + "bgcolor='#CCCCCC'";
                }
                htmlTabela = htmlTabela + "></td>";
            }
            aux = !aux;
            htmlTabela = htmlTabela + "</tr>";
        }
        htmlTabela = htmlTabela + "</table>";

        
        $('#info').css("display", "block");
        $('#info').css("font-size", "small");
        $("#minimap").html(htmlTabela);
        $('#minimap').css("display", "block");
    
        var cel = "#celx"
        cel = cel + parseInt(xMax/2);
        cel = cel + "y";
        cel = cel + parseInt(yMax/2);
        $(cel).css("background-color", "#000000");
    
    }
    
    
    function plotDotLocation() {    
        $('#beacons').empty();
    
        var vlBeaconActive = LocusFindBeaconActiveAndNoZeroDistance(vfBeaconArray);
    
        if (vlBeaconActive === null) {
            $("#txtBeacons").text(0);
            return;
        }
    
        $("#txtBeacons").text(vlBeaconActive.length);
    
        if (vlBeaconActive.length >= 3) {
            var posicao = calculaPosicao(vlBeaconActive[0], vlBeaconActive[1], vlBeaconActive[2]);
            
            if (posicao.x != undefined && posicao.y != undefined
            &&  posicao.x >= 0         && posicao.y >= 0) {
                deletDotLocation();
                
                var x = (posicao.x * 10) + 1;
                var y = (posicao.y * 10) + 1;
                x = x.toFixed(0);
                y = y.toFixed(0);

                $("#txtLocation").text("X: " + x +" Y: " + y);
    
                var cel = "#celx"
                cel = cel + x;
                cel = cel + "y";
                cel = cel + y;
                $(cel).css("background-color", "#000000");
    
            }
            else{
                $("#txtLocation").text("Calculando posição...");
            }
        }
    }
    
    function deletDotLocation() {
        xMax =(vlPlanta.x * 10) + 1;
        yMax =(vlPlanta.y * 10) + 1;
    
        for (var y = 1; y <= yMax; y++) {
            for (var x = 1; x <= xMax; x++) {
                var cel = "#celx"
                cel = cel + x;
                cel = cel + "y";
                cel = cel + y;
                $(cel).css("background-color", "#FFFFFF");
            }
        }
    
    }
    
    return app;

})();

app.initialize();

function voltarInicio(){
    getEstabelecimentos(app.montaEstabelecimentos, app.failAjax);
}

function carregaEstab(id){
    app.carregaEstab(id);
}
function carregaPiso(id){
    app.carregaPiso(id);
}