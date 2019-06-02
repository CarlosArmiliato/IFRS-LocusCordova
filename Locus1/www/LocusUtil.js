class LocusBeacon {
    constructor(paId, paUUID, paMajor, paMinor, paProximity, paDistance, paRSSI, paX, paY, paZ, paActive) {
        this.Id = paId;
        this.UUID = paUUID;
        this.Major = paMajor;
        this.Minor = paMinor;
        this.Proximity = paProximity;
        this.Distance = paDistance;
        this.RSSI = paRSSI;
        this.x = paX;
        this.y = paY;
        this.z = paZ;
        this.Active = paActive;
    }
}

function LocusFindBeaconIndex(paArray, paUUID, paMajor, paMinor) {
    var aux = paArray.findIndex(x =>
        x.UUID == paUUID &&
        x.Major == paMajor &&
        x.Minor == paMinor);

    return aux;
}

function LocusFindBeaconActive(paArray) {
    return paArray.filter(
     function (paBeacon) {
         return paBeacon.Active === true;
     }
 );
}

function LocusFindBeaconActiveAndNoZeroDistance(paArray) {
    return paArray.filter(
     function (paBeacon) {
         return paBeacon.Active === true && paBeacon.Distance > 0;
     }
 );
}

function LocusSortByDistance(paArray) {
    return paArray.sort(function (a, b) {
        var x = a.Distance;
        var y = b.Distance;

        if (x == 0) {
            return 1
        } else {
            return y - x;
        }
    });
}


function calculaPosicao(paBeacon1, paBeacon2, paBeacon3){
    
    var x1 = paBeacon1.x;
    var y1 = paBeacon1.y;
    var r1 = ajustaDistancia(paBeacon1);

    var x2 = paBeacon2.x;
    var y2 = paBeacon2.y;
    var r2 = ajustaDistancia(paBeacon2);
    
    var x3 = paBeacon3.x;
    var y3 = paBeacon3.y;
    var r3 = ajustaDistancia(paBeacon3);

    var ponto1 = retornaPontoIntersect(x1, y1, r1, x2, y2, r2, x3, y3);
    var ponto2 = retornaPontoIntersect(x2, y2, r2, x3, y3, r3, x1, y1);
    var ponto3 = retornaPontoIntersect(x3, y3, r3, x1, y1, r1, x2, y2);

    var pontoBaricentro = baricentro(ponto1.x, ponto1.y, ponto2.x, ponto2.y, ponto3.x, ponto3.y);

    return pontoBaricentro;

}

function ajustaDistancia(paBeacon){
    var vlAltura = paBeacon.z - 0.5; //Desconta meio metro, altura fixa que o celular aproximadamente está do chão
    var vlDistanciaAjustada =  Math.sqrt((paBeacon.Distance * paBeacon.Distance) - (vlAltura * vlAltura));
    return vlDistanciaAjustada;
}

function baricentro(x1, y1, x2, y2, x3, y3){

    var x = (x1 + x2 + x3) / 3
    var y = (y1 + y2 + y3) / 3
    
    var ponto = {}
    ponto.x = x;
    ponto.y = y;
    return ponto;
   
}

function dist2Pontos(x1, y1, x2, y2){

    var dist = (Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2));
    dist = Math.sqrt(dist);

    return dist;
    
}

function retornaPontoIntersect(x1, y1, r1, x2, y2, r2, x3, y3){

    //Fórmula matemática que calcula os pontos de intersecção de 2 círculos.
    var a = (r1 * r1) - (r2 * r2) - (x1 * x1) - (y1 * y1) + (x2 * x2) + (y2 * x2);
    var b = (-2 * x1) + (2 * x2);
    var c = (-2 * y1) + (2 * y2); //desde que y1 != y2

    var d = 1 + (b * b / c * c);
    var e = (-2 * a * b / c * c) - 2 * x1 + (2 * y1 * b / c);
    var f = ((a * a) / (c * c)) - (2 * y1 * a / c) + x1 * x1 + y1 * y1 - r1 * r1;

    var delta = e * e - (4 * d * f);
    var i1x = (-e + Math.sqrt(delta)) / (2 * d);
    var i2x = (-e - Math.sqrt(delta)) / (2 * d);

    var i1y = (a - (i1x * b)) / c;
    var i2y = (a-(i2x*b)) / c;


    var i1dist = dist2Pontos(i1x, i1y, x3, y3); //Calcula a distância da intersecção 1 até beacon 3
    var i2dist = dist2Pontos(i2x, i2y, x3, y3); //Calcula a distância da intersecção 2 até beacon 3

    //Retorna o x e y da intersecção com a menor distância até beacon 3.
    //IMPORTANTE: Presupoem-se que nunca i1 e i2 vai dar igual, devido a utilização dos raios de 3 pontos
    var ponto = {}
    if (i1dist < i2dist){
        ponto.x = i1x;
        ponto.y = i1y;
        return ponto;
    }
    else {
        ponto.x = i2x;
        ponto.y = i2y;
        return ponto;
    }
}

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}