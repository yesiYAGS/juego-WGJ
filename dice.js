// funcion encrgada de generar un numero desde el 1 hasta el 6 teniendo asi un dado 

function lanzarDado() {
    // Generar un número aleatorio entre 1 y 6 (ambos inclusive)
    const resultado = Math.floor(Math.random() * 6) + 1;

    // Mostrar el resultado en el elemento con id "resultado"
    document.getElementById("resultado").textContent = "Resultado del lanzamiento: " + resultado;
    console.log(resultado);
}
  