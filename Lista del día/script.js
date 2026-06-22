const entrada = document.getElementById("textareaEntrada");
const resultado = document.getElementById("resultado");
const botonTurnos = document.getElementById("btnProcesarTurnos");
const botonCopiar = document.getElementById("btnCopiar");

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

botonTurnos.addEventListener("click", () => {
    if (entrada.value.trim() === "") {
        return;
    }

    let diccionarioTurnos = {};
    let mensajeCompleto = entrada.value;
    let listaTurnos = mensajeCompleto.split("\n").filter(linea => linea.trim() !== "");

    for (let i = 0; i < listaTurnos.length; i += 2) {
        let hora = transformarHora(listaTurnos[i]);
        let descripcion = listaTurnos[i + 1];
        if (!diccionarioTurnos[hora]) {
            diccionarioTurnos[hora] = [];
        }
        diccionarioTurnos[hora].push(descripcion);
    }

    let textoFinal = "";

    for (let hora in diccionarioTurnos) {
        textoFinal += hora + "\n";
        for (let descripcion of diccionarioTurnos[hora]) {
            textoFinal += descripcion + "\n";
        }
        textoFinal += "\n";
    }

    resultado.textContent = textoFinal;
});

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
});