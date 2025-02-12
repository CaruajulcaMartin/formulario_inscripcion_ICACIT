// Función para mostrar la previsualización
function showPreviewModal() {
    // Validar la sección actual antes de mostrar la previsualización
    if (!validateSection(document.getElementById("section8"))) {
        return; // Detener si la validación falla
    }

    // Obtener los valores de los checkboxes
    const conductaEtica = document.getElementById("condutaEtica").checked ? "Sí" : "No";
    const conductaEticaValores = document.getElementById("condutaEticaValores").checked ? "Sí" : "No";

    // Obtener el valor de la firma (canvas)
    const firmaInput = document.getElementById("firmaInput").value;
    const tieneFirma = firmaInput ? "Sí" : "No";

    // Crear el mensaje de previsualización
    const previewMessage = `
        Previsualización del Formulario:
        - Conducta intachable y valores éticos: ${conductaEtica}
        - Información consignada es verdadera: ${conductaEticaValores}
        - Firma proporcionada: ${tieneFirma}
    `;

    // Mostrar la previsualización en un alert
    alert(previewMessage);
}

// Función para validar la sección actual
function validateSection(section) {
    const isValidCheckboxes = validateCheckboxes();
    const isValidCanvas = validateCanvas();

    return isValidCheckboxes && isValidCanvas;
}

// Función para validar los checkboxes
function validateCheckboxes() {
    const checkboxes = document.querySelectorAll("#section8 input[type='checkbox']");
    let allChecked = true;

    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling; // Obtener el label asociado al checkbox
        const labelText = label ? label.textContent.trim() : "Campo requerido";

        if (!checkbox.checked) {
            allChecked = false;
            showError(checkbox, `Debe marcar la opción: "${labelText}".`);
        } else {
            hideError(checkbox);
        }
    });

    return allChecked;
}

// Función para validar el canvas (firma)
function validateCanvas() {
    const firmaInput = document.getElementById("firmaInput");

    if (!firmaInput.value.trim()) {
        showError(firmaInput, "Por favor, proporciona tu firma para continuar.");
        return false;
    } else {
        hideError(firmaInput);
        return true;
    }
}

// Función para mostrar mensajes de error
function showError(input, message) {
    let errorDiv = input.parentNode.querySelector(".invalid-feedback");
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "invalid-feedback";
        input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    input.classList.add("is-invalid");
}

// Función para ocultar mensajes de error
function hideError(input) {
    const errorDiv = input.parentNode.querySelector(".invalid-feedback");
    if (errorDiv) errorDiv.remove();
    input.classList.remove("is-invalid");
}

// Asignar la función al botón de previsualización
document.querySelector("#section8 .next").addEventListener("click", showPreviewModal);