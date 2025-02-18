document.addEventListener("DOMContentLoaded", function () {
    // Validación de campos de texto (solo letras), excluyendo el campo de número de documento
    const textInputs = document.querySelectorAll('input[type="text"]:not([name="numDoc"])');
    textInputs.forEach(input => {
        input.addEventListener("input", function () {
            // Remover cualquier carácter que no sea letra o espacio
            this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        });
    });

    // Validación de la fecha de nacimiento (no permitir fechas futuras)
    const fechaNacimientoInput = document.querySelector('input[name="fechaNacimiento"]');
    if (fechaNacimientoInput) {
        fechaNacimientoInput.addEventListener("change", function () {
            const fechaNacimiento = new Date(this.value);
            const fechaActual = new Date();
            if (fechaNacimiento > fechaActual) {
                alert("La fecha de nacimiento no puede ser futura.");
                this.value = ""; // Limpiar el campo si la fecha es futura
            }
        });
    }

    // Validación de email (mejorada)
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(emailInput => {
        // Crear un elemento para mostrar el mensaje de error
        const errorMessage = document.createElement("div");
        errorMessage.className = "text-danger mt-1";
        emailInput.parentNode.appendChild(errorMessage);

        // Función para validar el correo electrónico
        const validarCorreoElectronico = () => {
            const email = emailInput.value.trim();
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular mejorada

            if (!emailPattern.test(email)) {
                errorMessage.textContent = "Ingrese un correo electrónico válido.";
                emailInput.setCustomValidity("Ingrese un correo electrónico válido.");
            } else {
                // Verificar el dominio manualmente (sin llamadas a API)
                const dominioValido = validarDominioCorreo(email);
                if (!dominioValido) {
                    errorMessage.textContent = "El dominio del correo electrónico no es válido.";
                    emailInput.setCustomValidity("El dominio del correo electrónico no es válido.");
                } else {
                    errorMessage.textContent = "";
                    emailInput.setCustomValidity("");
                }
            }
        };

        // Aplicar la validación cuando el usuario escribe
        emailInput.addEventListener("input", validarCorreoElectronico);

        // Aplicar la validación cuando el campo pierde el foco
        emailInput.addEventListener("blur", validarCorreoElectronico);
    });

    // Función para validar el dominio del correo electrónico
    const validarDominioCorreo = (email) => {
        const dominiosPermitidos = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"]; // Lista de dominios permitidos
        const dominio = email.split("@")[1]; // Extraer el dominio del correo

        if (dominio && dominiosPermitidos.includes(dominio.toLowerCase())) {
            return true; // Dominio válido
        } else {
            return false; // Dominio no válido
        }
    };

    // Validación de tipo de identidad
    const tipoIdentidadSelect = document.querySelector('select[name="tipoIdentidad"]');
    const numDocInput = document.querySelector('input[name="numDoc"]');

    if (tipoIdentidadSelect && numDocInput) {
        // Crear un elemento para mostrar el mensaje de error
        const errorMessage = document.createElement("div");
        errorMessage.className = "text-danger mt-1";
        numDocInput.parentNode.appendChild(errorMessage);

        // Variable para almacenar la función de validación actual
        let validacionActual = null;

        // Función para validar el número de documento según el tipo de identidad
        const validarNumeroDocumento = () => {
            const tipoIdentidad = tipoIdentidadSelect.value;

            // Limpiar el campo de número de documento cuando cambia el tipo de identidad
            numDocInput.value = "";

            // Eliminar la validación anterior si existe
            if (validacionActual) {
                numDocInput.removeEventListener("input", validacionActual);
            }

            // Aplicar validaciones según el tipo de identidad seleccionado
            if (tipoIdentidad === "DNI (Documento Nacional de Identidad)") {
                // Validación para DNI: solo números, máximo 8 dígitos
                numDocInput.setAttribute("pattern", "\\d{1,8}");
                numDocInput.setAttribute("title", "El DNI debe tener máximo 8 dígitos.");
                validacionActual = function () {
                    this.value = this.value.replace(/\D/g, ''); // Solo números
                    if (this.value.length > 8) {
                        this.value = this.value.slice(0, 8); // Limitar a 8 dígitos
                    }
                };
            } else if (tipoIdentidad === "Pasaporte") {
                // Validación para Pasaporte: letras y números, máximo 12 caracteres
                numDocInput.removeAttribute("pattern");
                numDocInput.setAttribute("title", "El pasaporte puede contener letras y números, máximo 12 caracteres.");
                validacionActual = function () {
                    this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, ''); // Solo letras, números y espacios
                    if (this.value.length > 12) {
                        this.value = this.value.slice(0, 12); // Limitar a 12 caracteres
                    }
                };
            } else if (tipoIdentidad === "Carnet de Extranjeria") {
                // Validación para Carnet de Extranjería: solo números, máximo 12 caracteres
                numDocInput.removeAttribute("pattern");
                numDocInput.setAttribute("title", "El carnet de extranjería debe contener solo números, máximo 12 caracteres.");
                validacionActual = function () {
                    this.value = this.value.replace(/\D/g, ''); // Solo números
                    if (this.value.length > 12) {
                        this.value = this.value.slice(0, 12); // Limitar a 12 dígitos
                    }
                };
            } else {
                // Si no se selecciona un tipo de identidad, no aplicar ninguna validación
                numDocInput.removeAttribute("pattern");
                numDocInput.removeAttribute("title");
                validacionActual = null;
            }

            // Aplicar la nueva validación
            if (validacionActual) {
                numDocInput.addEventListener("input", validacionActual);
            }
        };

        // Aplicar la validación cuando cambia el tipo de identidad
        tipoIdentidadSelect.addEventListener("change", validarNumeroDocumento);

        // Mostrar mensajes de error en tiempo real
        numDocInput.addEventListener("input", function () {
            const tipoIdentidad = tipoIdentidadSelect.value;
            if (tipoIdentidad === "DNI (Documento Nacional de Identidad)" && this.value.length > 8) {
                errorMessage.textContent = "El DNI no puede tener más de 8 dígitos.";
            } else if (tipoIdentidad === "Pasaporte" && this.value.length > 12) {
                errorMessage.textContent = "El pasaporte no puede tener más de 12 caracteres.";
            } else if (tipoIdentidad === "Carnet de Extranjeria" && this.value.length > 12) {
                errorMessage.textContent = "El carnet de extranjería no puede tener más de 12 dígitos.";
            } else {
                errorMessage.textContent = "";
            }
        });

        // Aplicar la validación inicial al cargar la página
        validarNumeroDocumento();
    }
});