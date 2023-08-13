// funcion encrgada de generar un numero desde el 1 hasta el 6 teniendo asi un dado 

function lanzarDados() {
    // Generar un número aleatorio entre 1 y 6 (ambos inclusive)
    const resultado = Math.floor(Math.random() * 6) + 1;    
    document.getElementById("resultadoDado").innerText = "Resultado del dado: " + resultado;
    dadoLanzado = true;
    const imagenDado = document.getElementById("imagenDado");
    console.log("🚀 ~ file: dice.js:8 ~ imagenDado:", resultado)
    imagenDado.setAttribute("src",`assets/dado-${resultado}.svg`)
    activarMovimiento(resultado)
    direccionElegida = false;
    habilitarBotonLanzarDado(false);
    habilitarBotonesDireccion(true);
}
   