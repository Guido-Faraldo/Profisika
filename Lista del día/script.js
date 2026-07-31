const entrada = document.getElementById("textareaEntrada");
const resultado = document.getElementById("resultado");
const botonPegar = document.getElementById("btnProcesarTurnos");
const botonCopiar = document.getElementById("btnCopiar");
const botonBorrarTurnos = document.getElementById("btnBorrarTurnos");

function transformarPM(hora){
    switch (hora) {
        case "1":
            hora = "13"
            break;
        case "2":
            hora = "14"
            break;
        case "3":
            hora = "15"
            break;
        case "4":
            hora = "16"
            break;
        case "5":
            hora = "17"
            break;
        case "6":
            hora = "18"
            break;
        case "7":
            hora = "19"
            break;
        case "8":
            hora = "20"
            break;
        case "9":
            hora = "21"
            break;
        case "10":
            hora = "22"
            break;
        case "11":
            hora = "23"
            break;
        case "12":
            hora = "12"
            break;
    }
    return hora;
}

function transformarHora(hora){
    if (hora.toLowerCase() === "todo el día"){
        return "Todo el día";
    }
    let listaHora = hora.split(" ");
    let inicio = listaHora[0];
    let final = listaHora[2];
    if (final.endsWith("am") && !inicio.endsWith("pm")){
        hora = inicio;
    }
    else if (final.endsWith("pm") && !inicio.endsWith("am")) {
        if (inicio.includes(":")){
            let listaInicio = inicio.split(":");
            hora = transformarPM(listaInicio[0]) + ":" + listaInicio[1];  
        }else{
            hora = transformarPM(inicio)
        }
    }
    else if (inicio.endsWith("am") && final.endsWith("pm")){
        hora = inicio.slice(0, -2);
    }
    else if (inicio.endsWith("pm") && final.endsWith("am")){
        if (inicio.includes(":")){
            let listaInicio = inicio.split(":");
            hora = transformarPM(listaInicio[0]) + ":" + listaInicio[1];  
            hora = hora.slice(0, -2);
        }else{
            inicio = inicio.slice(0, -2);
            hora = transformarPM(inicio);
        }
    }
    if (!(hora.endsWith(":15") || hora.endsWith(":30") || hora.endsWith(":45"))){
        hora = hora + "hs";
    }
    return hora;
}

async function obtenerPortapapeles() {
    try {
        const texto = await navigator.clipboard.readText();
        return texto;
    } catch (error) {
        alert("POR ALGUN MOTIVO NO SE PUDO LEER EL PORTAPAPELES");
    }
}

botonPegar.addEventListener("click", async () => {
    let texto = await obtenerPortapapeles(); //Obtengo lo que esta copiado en el portapapeles

    if (!texto) {//Verifico que no esté vacío
        alert("NO HAY TEXTO EN EL PORTAPAPELES. TIENES QUE COPIAR ALGO");
        return;
    }

    let valido = validarTexto(texto)

    if(!valido){
        alert("ERROR\nSe copio mal el texto.");
        alert("Intentalo con otro.");
        return;
    }

    entrada.value = texto;

    texto = texto.replace(/\r\n/g, "\n"); //Reemplazo las \r y \n por simples "\n" para poder manipular el texto mas facil

    let diccionarioTurnos = {};
    
    let listaTurnos = texto.split("\n").filter(linea => linea.trim() !== ""); //Hace la lista veificando que no haya espacios vacios.
    
    for (let i = 0; i < listaTurnos.length; i += 2) { //Aca voy metiendo en el diccionario creado previamente los turnos en sus horas correspondientes.
        let hora = transformarHora(listaTurnos[i]);
        let descripcion = listaTurnos[i + 1];
        if (!diccionarioTurnos[hora]) {
            diccionarioTurnos[hora] = [];
        }
        diccionarioTurnos[hora].push(descripcion);
    }

    let textoFinal = "";

    for (let hora in diccionarioTurnos) { //Aca creo el mensaje final para ponerlo en el area de resultado
        textoFinal += hora + "\n";
        for (let descripcion of diccionarioTurnos[hora]) {
            textoFinal += descripcion + "\n";
        }
        textoFinal += "\n";
        textoFinal += "--------------------------------------------------------------------------------------------------\n";
        textoFinal += "\n";
    }

    resultado.textContent = textoFinal;
});

function validarTexto(texto){
    texto = texto.replace(/\r\n/g, "\n"); //Reemplazo las \r y \n por simples "\n" para poder manipular el texto mas facil
    let listaTurnos = texto.split("\n").filter(linea => linea.trim() !== ""); //Hace la lista veificando que no haya espacios vacios.
    
    let partes = listaTurnos[0].split(" ");

    let valoresInvalidos = ["0", "15", "30", ":15", ":30","am", "pm", ":15am", ":30am", "m", ":15pm", ":30pm",];

    if (partes.includes("") || partes.length !== 3 || valoresInvalidos.includes(partes[0])){
        return false;
    }

    if (listaTurnos[0].toLowerCase() == "todo el día" || listaTurnos[0].endsWith("am") || listaTurnos[0].endsWith("pm")){
        return true;
    }

}

botonCopiar.addEventListener("click", () => {
    if (resultado.textContent.trim() === "") {
        return;
    }

    navigator.clipboard.writeText(resultado.textContent);

    botonCopiar.textContent = "¡Copiado! ✅";
    botonCopiar.classList.add("copiado");

    setTimeout(() => {
        botonCopiar.textContent = "🗐 Copiar";
        botonCopiar.classList.remove("copiado");
    }, 1500);

    setTimeout(() => {
        resultado.textContent = "";
        entrada.value = "";
    }, 4000);
});

botonBorrarTurnos.addEventListener("click", () => {
    entrada.value = "";
    resultado.textContent = "";
});