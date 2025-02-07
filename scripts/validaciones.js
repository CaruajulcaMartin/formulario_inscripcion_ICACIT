//validacion de foto de perfil solo jpg y png
document.addEventListener("DOMContentLoaded", function() {
    let inputFoto = document.getElementById("fotoPerfil");
    let errorMensaje = document.getElementById("errorFotoPerfil");
    
    inputFoto.addEventListener("change", function() {
        let archivo = this.files[0]; // Obtener el archivo seleccionado
        let maxSizeMB = 25; // Tamaño máximo permitido en MB
        let maxSizeBytes = maxSizeMB * 1024 * 1024; // Convertir MB a bytes
        let formatosValidos = ["image/jpg", "image/png"]; // Formatos permitidos

        if (archivo) {
            if (!formatosValidos.includes(archivo.type)) {
                errorMensaje.textContent = "Formato inválido. Solo se permiten archivos JPG o PNG.";
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
});

//validacion textarea de seccion 1 referencias domicilio
document.addEventListener("DOMContentLoaded", function() {
    let textarea = document.getElementById("observaciones");
    let contador = document.getElementById("contadorObservaciones");
    let errorMensaje = document.getElementById("errorObservaciones");
    const MAX_PALABRAS = 150;

    textarea.addEventListener("input", function() {
        let palabras = this.value.trim().split(/\s+/).filter(word => word.length > 0);
        let totalPalabras = palabras.length;

        contador.textContent = `Máximo 150 palabras. Palabras actuales: ${totalPalabras}`;

        if (totalPalabras > MAX_PALABRAS) {
            errorMensaje.style.display = "block";

            // Limitar a 150 palabras eliminando el exceso
            this.value = palabras.slice(0, MAX_PALABRAS).join(" ");

        } else {
            errorMensaje.style.display = "none";
        }
    });
});




// Validación de palabras en textarea dela seccion 7
document.addEventListener("DOMContentLoaded", function() {
    let textarea = document.getElementById("descripcionContribucion");
    let contador = document.getElementById("contadorPalabras");
    let mensajeError = document.getElementById("mensajeError");

    textarea.addEventListener("input", function() {
        let palabras = this.value.trim().split(/\s+/).filter(word => word.length > 0);
        let totalPalabras = palabras.length;

        contador.textContent = `Mínimo 400 palabras. Palabras actuales: ${totalPalabras}`;

        if (totalPalabras < 400) {
            mensajeError.style.display = "block";
            textarea.setCustomValidity("Debe tener al menos 400 palabras.");
        } else {
            mensajeError.style.display = "none";
            textarea.setCustomValidity("");
        }
    });
});