/**
 * Comentários
 * em
 * todas as
 * linhas
 * automaticamente
 */
/*var olaMundo = "Hello World!"

console.log(olaMundo);
console.log(olaMundo);
console.log(olaMundo);
console.log(olaMundo);*/

/*let a = 10;
const b = "10";

console.log(a == b); //true
console.log(a === b); //false

console.log(a !== b); //true
console.log(a != b); //false

console.log(a == b && typeof b == 'string'); //as duas verdadeiras
console.log(a == b || typeof a == 'string'); //um ou outro verdade*/

/*let cor = "amarelo";

if (cor === "verde") {

    console.log("Siga");

} else if (cor === "amarelo") {

    console.log("Cuidado");
    
} else {

    console.log("Pare!");

}*/

/*let n = 5;

for (let i = 0; i <= 10; i++) {

    console.log(`${i} X ${n} = ${i*n}`);
    //console.log(i + " X " + n + " = " + (i * n));
    

}*/

/*function calc(x1, x2, operator) {

    return eval (`${x1} ${operator} ${x2}`);

}

let resultado = calc(1, 2, "+");

console.log(resultado);*/

/*window.addEventListener('focus', event => {

    console.log("focus");
});

document.addEventListener('click', event => {
    console.log('click')
});*/

/*let agora = new Date();

console.log(agora.toLocaleDateString("pt-br"));*/

/*let carros = ["palio98", "toro", "uno", "marea", 10, true, new Date(), function(){}];

/*console.log(carros[6].getFullYear());*/

/*carros.forEach(function(value, index){
    console.log(index, value);
});*/

/*let carros = ["Ferrari", "Lamborghini", "Maseratti", "Jaguar", "McLaren"];

carros.forEach(function(value, index){
    console.log(index, value);

});*/

/*let celular = function (){

    this.cor = "prata";

    this.ligar = function() {
        console.log("uma ligação");
        return "ligando";
    }

}

let objeto = new celular();
console.log(objeto.ligar());*/

class celular {

    constructor(){

        this.color = "prata";

    }

    ligar() {
        console.log("uma ligação");
        return"ligando";
    }

}

let objeto = new celular();

console.log(objeto.ligar());