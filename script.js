const entrada = document.getElementById("textareaEntrada");
const resultado = document.getElementById("resultado");
const botonTurnos = document.getElementById("btnProcesarTurnos");
const botonCopiar = document.getElementById("btnCopiar");
let listaTurnosMensajeCompleto = [];
let textoFinal = "";
let servicio = "";
let palabrasClaves = ["IOMA", "COLONIA", "SANCOR", "SWISS", "PART", "OSPIA", "OSSEG", "LUIS PASTEUR",
"OSPSA", "ACCORD", "UP", "ACCORS SALUD", "SALUD", "UNION PERSONAL", "EX ", "FX", "OSMECON", "DASUTEN", 
"ELEVAR", "GALENO", "IOSFA", "MEDIFE", "OMINT", "OPDEA","OSDE", "OSPE", "OSPEDYC", "OSPEP", "OSPTV", 
"PODER JUDICIAL", "PODER", "JUDICIAL", "PREVENCION SALUD", "PREVENCION", "RAS", "LUMBALGIA", "MTO", 
"CERVICALGIA", "ROT", "SX", "FEMUR", "POP", "RTR", "CX", "LUMBAR", "CERVICAL", "MANO", "DEDO", "CODO",
"MUÑECA", "BRAZO", "HOMBRO", "CADERA", "PIERNA", "GEMELO", "RODILLA", "DER", "IZQ", "TOBILLO", "PIE", 
"TALON", "AQUILES", "TEND", "QUIRO", "RPG", "MASAJES", "DESCONTRACTURANTES", "CHOQUE", "ONDAS"]

function cambiarMinuscula(lista){
    for (let i = 0; i < lista.length; i++) {
        lista[i] = lista[i].toLowerCase();
    }
    return lista;
}

function transformarMes(mes){
    switch (mes) {
        case "ene":
            mes = "01";
            break;
        case "feb":
            mes = "02";
            break;
        case "mar":
            mes = "03";
            break;
        case "abr":
            mes = "04";
            break;
        case "may":
            mes = "05";
            break;
        case "jun":
            mes = "06";
            break;
        case "jul":
            mes = "07";
            break;
        case "ago":
            mes = "08";
            break;
        case "sept":
            mes = "09";
            break;
        case "oct":
            mes = "10";
            break;
        case "nov":
            mes = "11";
            break;
        case "dic":
            mes = "12";
            break;
        default:
            mes = "???";
    }
    return mes;
}

function transformarDia(dia){
    switch (dia) {
        case "lun":
            dia = "Lun.";
            break;
        case "mar":
            dia = "Mar.";
            break;
        case "mié":
            dia = "Mié.";
            break;
        case "jue":
            dia = "Jue.";
            break;
        case "vie":
            dia = "Vie.";
            break;
        case "sáb":
            dia = "Sáb.";
            break;
        case "dom":
            dia = "Dom.";
            break;
        default:
            dia = "???";
    }
    return dia;
}

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

botonTurnos.addEventListener("click" , () => {
    if (entrada.value.trim() === "") {
        return;
    }
    let mensajeCompleto = entrada.value;
    let listaTurnos = mensajeCompleto.split("\n\n");

    if (listaTurnos.length > 8) {
        resultado.style.fontSize = "17px";
    }else{
        resultado.style.fontSize = "25px";
    }

    if (palabrasClaves.some(palabra => mensajeCompleto.toUpperCase().includes(palabra))){
        servicio = "sesiones"
    }else{
        servicio = "clases"
    }

    if (listaTurnos.length > 1){
        listaTurnosMensajeCompleto.push(`Próximas ${listaTurnos.length} ${servicio}:`);
    }else{
        if (servicio === "sesiones") {
            listaTurnosMensajeCompleto.push(`Próxima sesión:`);
        }
        else{
            listaTurnosMensajeCompleto.push(`Próxima clase:`);
        }
    }

    listaTurnos = cambiarMinuscula(listaTurnos);
    for (let i = 0; i < listaTurnos.length; i++) {
        let turno = listaTurnos[i]; //"22 
                                    //jun de 2026, lun
                                    //7 – 8pm
                                    //part- guido faraldo - artralgia muñeca"
        let lineas = turno.split("\n"); //['22', 
                                        //'jun de 2026, lun', 
                                        // '7 – 8pm', 
                                        // 'part- guido faraldo - artralgia muñeca']

        let listaMesDia = lineas[1].split(" ");
        let mes = transformarMes(listaMesDia[0]);
        let dia = transformarDia(listaMesDia.at(-1));
        let hora = transformarHora(lineas[2]);

        let lineaDeTurno = `*${dia} ${lineas[0]}/${mes} - ${hora}`;
        listaTurnosMensajeCompleto.push(lineaDeTurno);
    }

    textoFinal = listaTurnosMensajeCompleto.join("\n");

    resultado.textContent = textoFinal;
    listaTurnosMensajeCompleto = [];
})

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