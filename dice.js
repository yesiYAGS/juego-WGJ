// funcion encrgada de generar un numero desde el 1 hasta el 6 teniendo asi un dado 

function lanzarDado() {
    // Generar un número aleatorio entre 1 y 6 (ambos inclusive)
    const resultado = Math.floor(Math.random() * 6) + 1;    
    document.getElementById("resultado").textContent = "Resultado del lanzamiento: " + resultado;
    return resultado

    // Mostrar el resultado en el elemento con id "resultado"
    console.log(resultado);
}
  