function getEstabelecimentos(callbackDone, callbackFail){

    var url = 'http://web.farroupilha.ifrs.edu.br/tcc2/locus_service/estabelecimentos';
    return $.ajax({url,
        type: "GET",
        dataType: "json",
        url: url,
        timeout: 60 * 1000
    }).done(function (data) {
        callbackDone(data);
    }).fail(function (a, b, c) {
        callbackFail(a, b, c);
    });
}

function getPisos(paEstab, callbackDone, callbackFail) {
    var url = 'http://web.farroupilha.ifrs.edu.br/tcc2/locus_service/pisos/'  + paEstab ;
    return $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        timeout: 60 * 1000
    }).done(function (data) {
        callbackDone(data);
    }).fail(function (a, b, c) {
        callbackFail(a, b, c);
    });

    return vlJsonPlanta;
}

function getPlanta(paPiso, callbackDone, callbackFail) {
    var url = 'http://web.farroupilha.ifrs.edu.br/tcc2/locus_service/piso/'  + paPiso ;
    return $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        timeout: 60 * 1000
    }).done(function (data) {
        callbackDone(data);
    }).fail(function (a, b, c) {
        callbackFail(a, b, c);
    });

    return vlJsonPlanta;

    /*
    vlJsonPlanta = {
        estabelecimento: 'IFRS',
        revisao: 1,
        x: 1.00,
        y: 5.00,
        beacons: [
            {
                UUID: '003e8c80-ea01-4ebb-b888-78da19df9e55',
                Major: 768,
                Minor: 2554,
                x: 0.8,
                y: 0.1,
                z: 0.8,
            },
            {
                UUID: '003e8c80-ea01-4ebb-b888-78da19df9e55',
                Major: 768,
                Minor: 785,
                x: 2.5,
                y: 1.04,
                z: 0.8,
            },
            {
                UUID: '003e8c80-ea01-4ebb-b888-78da19df9e55',
                Major: 768,
                Minor: 1703,
                x: 1.0,
                y: 2.9,
                z: 0.8,
            },
            {
                UUID: '003e8c80-ea01-4ebb-b888-78da19df9e55',
                Major: 768,
                Minor: 792,
                x: 5.0,
                y: 5.0,
                z: 0.8,
            }
        ]
    }
    return vlJsonPlanta;
    */
}