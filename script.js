const entrada = document.getElementById("textareaEntrada");
const resultado = document.getElementById("resultado");
const botonPegar = document.getElementById("btnProcesarTurnos");
const botonBorrarTurnos = document.getElementById("btnBorrarTurnos");
const botonCopiar = document.getElementById("btnCopiar");
let listaTurnosMensajeCompleto = [];
let textoFinal = "";
let servicio = "";
let contadorErrorTurno = 0;
let tipoDeError;
let mensajeError
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
    
    texto = texto.replace(/\r\n/g, "\n"); //Reemplazo las \r y \n por simples "\n" para poder manipular el texto mas facil

    contadorErrorTurno = 0;
    let valido = verificarTexto(texto); // Aca se valida el texto

    if (!valido){ //Si el texto no es valido no hace nada el boton, solo aparecen unos alerts indicando el problema
        switch (tipoDeError) {
            case "fecha":
                mensajeError = "El problema se encuentra en la 1er linea, es decir donde indica la FECHA."
                break;
            case "mes":
                mensajeError = "El problema se encuentra en la 2da linea, es decir en donde indica el MES."
                break;
            case "dia":
                mensajeError = "El problema se encuentra en la 2da linea, es decir donde indica el DÍA."
                break;
            case "hora":
                mensajeError = "El problema se encuentra en la 3er linea, es decir donde indica la HORA."
                break;
        }

        if (contadorErrorTurno == 1){
            alert("ERROR.\nEl mensaje copiado tiene un error en el primer turno.\n" + mensajeError)
        }else{
            alert("ERROR\nEl mensaje copiado tiene un error en el turno/clase N°:  " + contadorErrorTurno + ".\n" + mensajeError)
        }
        alert("Intentalo con otro texto.")
        contadorErrorTurno = 0;
        return;
    }

    //CODIGO QUE SE EJECUTA SI EL TEXTO ES VALIDO:
    entrada.value = texto; //Pongo lo que el ususario copio en el portapapeles en el textarea
    
    let listaTurnos = texto.split("\n\n"); //Creo la lista de todos los turnos en base a los dobles saltos de linea del texto

    if (listaTurnos.length > 8) { //Aca dependiendo de la cantidad de turnos que sean cambio el tamaño de la letra donde aparece el texto final para que quede mas lindo
        resultado.style.fontSize = "17px";
    }else{
        resultado.style.fontSize = "25px";
    }

    if (palabrasClaves.some(palabra => texto.toUpperCase().includes(palabra))){ //Aca determino si son sesiones o clases
        servicio = "sesiones"
    }else{
        servicio = "clases"
    }

    if (listaTurnos.length > 1){ //Aca cambio las palabras clave en base a la cantidad (si es mayor a 1)
        listaTurnosMensajeCompleto.push(`Próximas ${listaTurnos.length} ${servicio}:`);
    }else{
        if (servicio === "sesiones") {
            listaTurnosMensajeCompleto.push(`Próxima sesión:`);
        }
        else{
            listaTurnosMensajeCompleto.push(`Próxima clase:`);
        }
    }

    transfromarTextoAMensaje(listaTurnos) //Transformo el mensaje

    textoFinal = listaTurnosMensajeCompleto.join("\n"); //La lista con todos los los turnos y el mensaje principal lo pongo en un texto
    resultado.textContent = textoFinal; //Pongo el texto final en el textarea
    listaTurnosMensajeCompleto = []; //Vacío la lista del mensaje
});

function transfromarTextoAMensaje(listaTurnos){
    listaTurnos = cambiarMinuscula(listaTurnos); //Cambio todo el texto a minuscula

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

        let lineaDeTurno = `* ${dia} ${lineas[0]}/${mes} - ${hora}`;
        listaTurnosMensajeCompleto.push(lineaDeTurno);
    }
}

function verificarTexto(texto){
    let listaTurnos = texto.split("\n\n"); //Creo la lista de todos los turnos en base a los dobles saltos de linea del texto
    listaTurnos = cambiarMinuscula(listaTurnos); //Cambio todo el texto a minuscula
    for (let i = 0; i < listaTurnos.length; i++) {
        contadorErrorTurno += 1;
        
        let turno = listaTurnos[i]; 
        let lineas = turno.split("\n"); 

        if (/^\d+$/.test(lineas[0])) {
            console.log("Contiene números");
        } else {
            tipoDeError = "fecha";
            return false;
        }

        let listaMesDia = lineas[1].split(" ");
        let mes = transformarMes(listaMesDia[0]);
        let dia = transformarDia(listaMesDia.at(-1));

        if (mes == "???"){
            tipoDeError = "mes";
            return false;
        }else if (dia == "???"){
            tipoDeError = "dia";
            return false;
        }

        if (/^\d+$/.test(lineas[2][0]) && (lineas[2].endsWith("am") || lineas[2].endsWith("pm"))) {
            console.log("Contiene números y esta todo bien");
        } else {
            tipoDeError = "hora";
            return false;
        }
    }

    return true;
}

botonBorrarTurnos.addEventListener("click", () => {
    entrada.value = "";
    resultado.textContent = "";
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

    setTimeout(() => {
        resultado.textContent = "";
        entrada.value = "";
    }, 4000);
});
