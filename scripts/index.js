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

    // Si la sección actual es la que contiene el canvas de la firma, inicialízalo
    if (index === sections.length - 1) {
        initializeSignatureCanvas();
    }
}

// Avanzar a la siguiente sección
function nextSection() {
    if (!validateSection(sections[currentSection])) return;

    // Si estamos en la sección 4, validar experiencia laboral con el script externo
    if (currentSection === 3 && !validarExperienciaLaboral()) return;

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
    progressBar.style.width = stepPercentage + "%";
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
    
    return validateRequiredFields(section, sectionName) && validateTables(section) && isValidCheckboxes && isValidCanvas;
    // return isValidCheckboxes && isValidCanvas;
}

// Validar campos requeridos
function validateRequiredFields(section, sectionName) {
    let isValid = true;
    const requiredInputs = section.querySelectorAll('input[required], select[required], textarea[required]');

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showError(input, `En la sección "${sectionName}", el campo "${input.name}" es requerido.`);
        } else {
            hideError(input);
        }
    });

    return isValid;
}

// Validar solo las tablas obligatorias
function validateTables(section) {
    let isValid = true;

    const requiredTables = section.querySelectorAll('table.required'); // Solo valida tablas con la clase 'required'

    requiredTables.forEach(table => {
        if (table.querySelectorAll('tbody tr').length === 0) {
            isValid = false;
            alert(`Debe agregar al menos un registro en la tabla: "${table.previousElementSibling.textContent.trim()}".`);
        }
    });

    return isValid;
}

// Validar los checkboxes
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

// Validar el canvas de la firma
function validarCanvas() {
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
    let errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    input.classList.add('is-invalid');
}

// Ocultar mensaje de error
function hideError(input) {
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) errorDiv.remove();
    input.classList.remove('is-invalid');
}

// Inicializar la primera sección visible
showSection(currentSection);