document.addEventListener("DOMContentLoaded", function () {
    // Función para validar archivos (foto de perfil)
    function validarArchivo(inputId, errorId, formatosValidos, maxSizeMB) {
        let input = document.getElementById(inputId);
        let errorMensaje = document.getElementById(errorId);
        
        input.addEventListener("change", function () {
            let archivo = this.files[0];
            let maxSizeBytes = maxSizeMB * 1024 * 1024;
            
            if (archivo) {
                // Convertir tipo de archivo a minúsculas para comparación
                let tipoArchivo = archivo.type.toLowerCase();

                // Permitir también archivos con extensión .jpg y .png
                if (!formatosValidos.includes(tipoArchivo) && !(tipoArchivo === "image/jpeg" && archivo.name.toLowerCase().endsWith(".jpg")) && !(tipoArchivo === "image/png" && archivo.name.toLowerCase().endsWith(".png"))) {
                    errorMensaje.textContent = `Formato inválido. Solo se permiten archivos ${formatosValidos.join(", ")}.`;
                    errorMensaje.style.display = "block";
                    this.value = ""; // Limpiar el input
                    return;
                }
                
                if (archivo.size > maxSizeBytes) {
                    errorMensaje.textContent = `El archivo es demasiado grande. Máximo permitido: ${maxSizeMB}MB.`;
                    errorMensaje.style.display = "block";
                    this.value = ""; // Limpiar el input
                    return;
                }
                
                // Si pasa ambas validaciones, ocultar mensaje de error
                errorMensaje.style.display = "none";
            }
        });
    }

    // Función para validar textarea (límite de palabras)
    function validarTextarea(textareaId, contadorId, errorId, maxPalabras) {
        let textarea = document.getElementById(textareaId);
        let contador = document.getElementById(contadorId);
        let errorMensaje = document.getElementById(errorId);

        textarea.addEventListener("input", function () {
            let palabras = this.value.trim().split(/\s+/).filter(word => word.length > 0);
            let totalPalabras = palabras.length;

            contador.textContent = `Máximo ${maxPalabras} palabras. Palabras actuales: ${totalPalabras}`;

            if (totalPalabras > maxPalabras) {
                errorMensaje.style.display = "block";
                errorMensaje.textContent = `No puedes escribir más de ${maxPalabras} palabras.`;
                this.value = palabras.slice(0, maxPalabras).join(" "); // Limitar a maxPalabras
            } else {
                errorMensaje.style.display = "none";
            }
        });
    }

    // Validación de foto de perfil (solo JPG y PNG, máximo 25 MB)
    validarArchivo("fotoPerfil", "errorFotoPerfil", ["image/jpg", "image/png"], 25);

    // Validación de textarea de sección 1 (referencias domicilio)
    validarTextarea("observaciones", "contadorObservaciones", "errorObservaciones", 150);

    // Validación de textarea de sección 4 (funciones principales)
    validarTextarea("funcionesPrincipales", "contadorObservacionesPrincipales", "errorObservaciones", 150);

    // Validación de textarea de sección 7 (descripción de contribución)
    validarTextarea("descripcionContribucion", "contadorPalabras", "mensajeError", 400);

    // Validación de textarea de descripción de reconocimiento
    validarTextarea("descripcionReconocimiento", "contadorDescripcion", "errorDescripcion", 150);
});
