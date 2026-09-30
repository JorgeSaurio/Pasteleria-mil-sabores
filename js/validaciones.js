if (document.getElementById("signup-form")?.dataset.tipo === "registro-admin") {
    const sesion = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    if (!sesion || sesion.tipo !== "Administrador") {
        window.location.href = "login.html";
    }
}

const formElement = document.getElementById("signup-form");
const inputs = document.querySelectorAll("#signup-form input, #signup-form select, #signup-form textarea");









inputs.forEach((input) => {
    input.addEventListener("input", (event) => {

        const inputName = event.target.name;
        const value = event.target.value;

        let mensajeError = input.parentElement.querySelector(".invalid-feedback");

        if (!mensajeError) {
             mensajeError = document.createElement("div");
              mensajeError.classList.add("invalid-feedback");
               input.parentElement.appendChild(mensajeError);
        }
        switch(inputName) {

            case "run":
                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL RUN ES OBLIGATORIO.";
                    return;
                }

                if (value.length < 7){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL RUN DEBE TENER MINIMO 7 CARACTERES";
                    return;
                }

                if (value.length > 9){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "El rut debe tener maximo    9 caracteres";
                    return;
                }

                const regexRut = /^\d{7,8}[0-9kK]$/;

                if (!regexRut.test(value)){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "El RUN debe tener un formato válido. Ejemplo: 12345678k"; 
                    return;
                }

                // VALIDACÓN MODULO 11

                const cuerpo = value.slice(0,-1);
                const verificador = value.slice(-1).toLowerCase();

                let suma = 0;
                let multiplicador = 2

                for (let i = cuerpo.length -1; i >= 0; i--) {
                    suma += parseInt(cuerpo[i] * multiplicador);
                    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
                }

                const resto = suma % 11;
                const dvEsperado = 11 - resto;


                let dvCorrecto;
                if (dvEsperado === 11) {
                    dvCorrecto = '0';
                } else if (dvEsperado === 10) {
                    dvCorrecto = 'k';
                } else {
                    dvCorrecto = dvEsperado.toString();
                }

                if ((verificador === dvCorrecto) == false){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "El RUN no está correcto, por favor, revisar."; 
                    return;                    

                }

                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");

                break;


                


            case "name":


                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL NOMBRE NO PUEDE ESTAR VACÍO"; 
                    return;                    
                }

                if (value.length > 50){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL NOMBRE NO DEBE SUPERAR LOS 50 CARACTERES";
                    return;
                }
                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");

                break;

            

            case "apellidos":
            
                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "LOS APELLIDOS NO PUEDEN ESTAR VACÍOS"; 
                    return;                    
                }

                if (value.length > 100){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "LOS APELLIDOS NO DEBEN SUPERAR LOS 100 CARACTERES";
                    return;
                }
                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");

                break;

                
            case "email":


                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL CORREO NO PUEDE ESTAR VACÍO";
                    return;
                }

                if (value.length > 100){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL CORREO NO DEBE SUPERAR LOS 100 CARACTERES"
                    return;

                }

                const regexDominiosPermitidos =
                    /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

                if (!regexDominiosPermitidos.test(value)) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "SOLO SE PERMITEN CORREOS @duoc.cl, @profesor.duoc.cl y @gmail.com.";
                    return;
                }

                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");


                break;

            case "email2":

                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL CORREO NO PUEDE ESTAR VACÍO";
                    return;
                }

                if (value !== email.value) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "LOS CORREOS NO COINCIDEN";
                    return;
                }
                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");


                break;



    
                
            case "dir":
                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "INGRESA UNA DIRECCIÓN";
                    return;
                }

                if (value.length > 300){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "LA DIRECCIÓN NO PUEDE SUPERAR LOS 300 CARACTERES";
                    return;
                }
                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");


                break;


            case "password":
                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "INGRESA UNA CONTRASEÑA";
                    return;
                }
                
                if (value.length < 4){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "LA CONTRASEÑA DEBE SER MAYOR A 4 CARACTERES";
                    return;
                }
                
                if (value.length > 10){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "LA CONTRASEÑA DEBE SER MENOR A 10 CARACTERES";
                    return;
                }
                

                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");


                break;




            case "password2":

                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "INGRESA UNA CONTRASEÑA";
                    return;
                }

                if (value !== password.value) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "LAS CONTRASEÑAS NO COINCIDEN";
                    return;
                }
                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");


                break;


            case "tel":
                
                if (value.length == 0){
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                    mensajeError.textContent = "";
                    return;
                }
                const regexTelefono = /^(\+56)?9[0-9]{8}$/;
                if (!regexTelefono.test(value)) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "El teléfono debe tener un formato válido. Ejemplo: +56912345678";
                    return; 
                } 

                input.classList.remove("is-invalid"); 
                input.classList.add("is-valid"); 
                mensajeError.textContent = ""; 
                break;

            case "tipo":
                if (value === "") {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "SELECCIONA UN TIPO DE USUARIO";
                    return;
                }
                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
                break;
            



            case "nombrecontacto": {
                if (value.trim().length === 0) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL NOMBRE ES OBLIGATORIO";
                    return;
                }

                if (value.length > 100) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL NOMBRE NO DEBE SUPERAR LOS 100 CARACTERES";
                    return;
                }

                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
                break;
            }

            case "correocontacto": {
                const regexCorreoContacto =
                    /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

                if (value.length === 0) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL CORREO NO PUEDE ESTAR VACÍO";
                    return;
                }

                if (value.length > 100) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL CORREO NO DEBE SUPERAR LOS 100 CARACTERES";
                    return;
                }

                if (!regexCorreoContacto.test(value)) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "SOLO SE PERMITEN CORREOS @duoc.cl, @profesor.duoc.cl y @gmail.com.";
                    return;
                }

                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
                break;
            }

            case "comentariocontacto": {
                if (value.trim().length === 0) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL COMENTARIO ES OBLIGATORIO";
                    return;
                }

                if (value.length > 500) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    mensajeError.textContent = "EL COMENTARIO NO DEBE SUPERAR LOS 500 CARACTERES";
                    return;
                }

                mensajeError.textContent = "";
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
                break;
            }
            default:
                break;
        }


        if (inputName === "email" && email2.value) {
            email2.dispatchEvent(new Event("input"));
        }
        if (inputName === "password" && password2.value) {
            password2.dispatchEvent(new Event("input"));
        }
    });
});




function enviarContacto() {
    inputs.forEach((input) => {
        input.dispatchEvent(new Event("input", {bubbles: true}));

    });

    if (formElement.querySelectorAll(".is-invalid").length > 0){
        mostrarMensaje("El formulario tiene errores.");
        return;
    }

    const datos = Object.fromEntries(new FormData(formElement));
    datos.fecha = new Date().toISOString();

    const contactos = JSON.parse(localStorage.getItem("Contactos")) || [];
    contactos.push(datos);
    localStorage.setItem("contactos", JSON.stringify(contactos));

    mostrarMensaje("Comentario envíado correctamente.");
    formElement.reset();
    input.forEach((i) => i.classList.remove("is-valid"));
}



function Registrar(){
    const lista = JSON.parse(localStorage.getItem("registros")) || [];
    return lista.map((u) => ({ ...u, tipo: u.tipo || "Cliente" }));
}

if (!Registrar().some((u) => u.tipo === "Administrador")) {
    const lista = Registrar();
    lista.push({
        run: "173743882",
        name: "Jorge",
        apellidos: "Soto",
        email: "jorgesoto@gmail.com",
        dir: "Sin dirección",
        password: "admin1",
        tipo: "Administrador"
    });
    localStorage.setItem("registros", JSON.stringify(lista));
}

function guardarRegistro(){
    const datos = Object.fromEntries(new FormData(formElement));
    const registros = Registrar();

    if (registros.some((r) => r.run === datos.run)){
        mostrarMensaje("RUN ya registrado!");
        return false;

    }
    if (registros.some((r) => r.email.toLowerCase() === datos.email.toLowerCase())) {
        mostrarMensaje("Ya existe un usuario con ese correo.");
        return false;
    }

    const esAdmin = formElement.dataset.tipo === "registro-admin";
    datos.tipo = esAdmin ? datos.tipo : "Cliente";

    registros.push(datos);
    localStorage.setItem("registros", JSON.stringify(registros));
    return true;
}

function iniciarSesion(){
    const correo = document.getElementById("correoinicio").value.trim().toLowerCase();
    const contrasena = document.getElementById("contrasenainicio").value;

    if (correo === "" || contrasena === "") {
        mostrarMensaje("Ingresa tu correo y contraseña.");
        return;
    }

    const usuario = Registrar().find(
        (u) => u.email.toLowerCase() === correo && u.password === contrasena
    );

    if (!usuario) {
        mostrarMensaje("Correo o contraseña incorrectos.");
        return;
    }

    sessionStorage.setItem(
        "usuarioActivo",
        JSON.stringify({ run: usuario.run, name: usuario.name, email: usuario.email, tipo: usuario.tipo})
    );

    mostrarMensaje("¡Bienvenido/a, ${usuario.name}!", "success");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
}


function mostrarMensaje(texto, tipo = "danger") {
    // Elimina el mensaje anterior para no acumularlos
    const anterior = document.getElementById("mensaje-formulario");
    if (anterior) anterior.remove();

    const alerta = document.createElement("div");
    alerta.id = "mensaje-formulario";
    alerta.className = "alert alert-${tipo}";
    alerta.setAttribute("role", "alert");
    alerta.textContent = texto;

    formElement.prepend(alerta);
    alerta.scrollIntoView({ behavior: "smooth", block: "center" });
}

formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    if (formElement.dataset.tipo === "login"){
        iniciarSesion();
        return;
    }

    if (formElement.dataset.tipo === "contacto") {
        enviarContacto();
        return;
    }

    inputs.forEach((input) => {
        input.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );
    });
    const camposInvalidos = document.querySelectorAll(".is-invalid");
    if (!formElement.checkValidity()){
        mostrarMensaje("Hay campos obligatorios sin completar");
        return;
    }
    if (camposInvalidos.length > 0) {
        mostrarMensaje("El formulario contiene errores.");
        return;
    }

    if (guardarRegistro()) {
        mostrarMensaje("¡Registro exitoso!");
        formElement.reset();
        inputs.forEach((i) => i.classList.remove("is-valid"));
    }
    });