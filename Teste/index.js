$('document').ready(function(){
    
});

function calculaPosicao(){
    
    var x1 = $("#txtB1X").val();
    var y1 = $("#txtB1Y").val();
    var r1 = $("#txtB1R").val();

    var x2 = $("#txtB2X").val();
    var y2 = $("#txtB2Y").val();
    var r2 = $("#txtB2R").val();
    
    var x3 = $("#txtB3X").val();
    var y3 = $("#txtB3Y").val();
    var r3 = $("#txtB3R").val();

    var ponto1 = retornaPontoIntersect(x1, y1, r1, x2, y2, r2, x3, y3);
    var ponto2 = retornaPontoIntersect(x2, y2, r2, x3, y3, r3, x1, y1);
    var ponto3 = retornaPontoIntersect(x3, y3, r3, x1, y1, r1, x2, y2);

    alert("B1 U B2: \n" + ponto1.x + "," + ponto1.y);
    alert("B2 U B3: \n" + ponto2.x + "," + ponto2.y);
    alert("B3 U B1: \n" + ponto3.x + "," + ponto3.y);

    var pontoBaricentro = baricentro(ponto1.x, ponto1.y, ponto2.x, ponto2.y, ponto3.x, ponto3.y);

    $("#txtLX").val(pontoBaricentro.x);
    $("#txtLY").val(pontoBaricentro.y);

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

    var dist = ((x2 - x1)**2) + ((y2 - y1)**2);
    dist = Math.sqrt(dist);

    return dist;
    
}

function retornaPontoIntersect(b1x, b1y, b1r, b2x, b2y, b2r, b3x, b3y){

    //Fórmula matemática que calcula os pontos de intersecção de 2 círculos.
    var a = b1r**2 - b2r**2 - b1x**2 - b1y**2 + b2x**2 + b2y**2;
    var b = -2*b1x + 2*b2x;
    var c = -2*b1y + 2*b2y;
    
    d = 1 + (b**2 / c**2);
    e = (-2*a*b / c**2) - 2*b1x + (2*b1y*b/c);
    f = ((a**2)/(c**2)) - (2*b1y*a/c) +  b1x**2 + b1y**2 - b1r**2;
    
    i1x = (-e + Math.sqrt(e**2 - (4*d*f))) / (2*d);
    i2x = (-e - Math.sqrt(e**2 - (4*d*f))) / (2*d);

    i1y = (a-(i1x*b)) / c;
    i2y = (a-(i2x*b)) / c;

    i1dist = dist2Pontos(i1x, i1y, b3x, b3y); //Calcula a distância da intersecção 1 até beacon 3
    i2dist = dist2Pontos(i2x, i2y, b3x, b3y); //Calcula a distância da intersecção 2 até beacon 3

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