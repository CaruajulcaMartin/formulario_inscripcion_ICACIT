let currentSection = 0;
const sections = document.querySelectorAll(".form-section");
const progressBar = document.getElementById("progressBar");

// Mostrar la sección actual
function showSection(index) {
    sections.forEach((section, i) => {
        section.style.display = i === index ? "block" : "none";
        section.classList.toggle("active", i === index);
    });
    updateProgress(index);
}

// Avanzar a la siguiente sección
function nextSection() {
    if (!validateSection(sections[currentSection])) return;

    if (currentSection < sections.length - 1) {
        currentSection++;
        showSection(currentSection);
    }
}

// Retroceder a la sección anterior
function prevSection() {
    if (currentSection > 0) {
        currentSection--;
        showSection(currentSection);
    }
}

// Actualizar la barra de progreso
function updateProgress(index) {
    const stepPercentage = ((index + 1) / sections.length) * 100;
    progressBar.style.width = `${stepPercentage}%`;
    progressBar.innerText = `Paso ${index + 1} de ${sections.length}`;
}

// Validar la sección actual
function validateSection(section) {
    const sectionName = section.querySelector("h2")?.textContent || "Sección desconocida";

    let isValidCheckboxes = true;
    let isValidCanvas = true;

    if (section.id === "section8") {
        isValidCheckboxes = validateCheckboxes();
        isValidCanvas = validateCanvas();
    }

    return isValidCheckboxes && isValidCanvas;
}

// Validar checkboxes
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

// Validar canvas (firma)
function validateCanvas() {
    const firmaInput = document.getElementById("firmaInput");
    const firmaValue = firmaInput.value.trim();

    if (!firmaValue || firmaValue === "data:,") {
        showError(firmaInput, "Por favor, proporciona tu firma para continuar.");
        return false;
    } else {
        hideError(firmaInput);
        return true;
    }
}

// Mostrar mensaje de error
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

// Ocultar mensaje de error
function hideError(input) {
    const errorDiv = input.parentNode.querySelector(".invalid-feedback");
    if (errorDiv) errorDiv.remove();
    input.classList.remove("is-invalid");
}

// Inicializar la primera sección visible
showSection(currentSection);