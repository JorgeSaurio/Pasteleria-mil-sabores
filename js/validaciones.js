// Validaciones de formularios
const formElement = document.getElementById("signup-form");
const inputs = document.querySelectorAll("#signup-form input");

inputs.forEach((input) => {
    input.addEventListener("keyup", (event) => {

        const inputName = event.target.name;
        const value = event.target.value;

        switch(inputName) {
            case "name":


                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    console.log("El dato no puede estar vacío");
                    return;
                }

                if (value.length > 50){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    console.log("Maximo 50 caracteres");
                    return;
                }
                
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");

                break;
            case "email":


                if (value.length == 0){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    console.log("El correo no puede estar vacío");
                    return;
                }

                if (value.length > 100){
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    console.log("Maximo 100 caracteres");
                    return;

                }

                const regexDominiosPermitidos =
                    /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

                if (!regexDominiosPermitidos.test(value)) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    console.log("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
                    return;
                }


                input.classList.remove("is-invalid");
                input.classList.add("is-valid");


                break;
            default:
                break;
        }
    });
});