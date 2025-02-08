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

// Función para avanzar a la siguiente sección
function nextSection() {
    // Validar la sección actual antes de avanzar
    if (!validateSection(sections[currentSection])) {
        return; // Detener si la validación falla
    }

    // Validación específica para la sección de experiencia laboral (Sección 4)
    if (currentSection === 3 && !validateExperienceSection()) {
        return; // Detener si no cumple con los 10 años de experiencia
    }

    // Avanzar a la siguiente sección si la validación es exitosa
    if (currentSection < sections.length - 1) {
        currentSection++;
        showSection(currentSection);
    }
}

// Función para retroceder a la sección anterior
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

// Función para validar todos los campos requeridos en una sección
function validateSection(section) {
    const requiredInputs = section.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid'); // Marcar campo como inválido
            showError(input, 'Este campo es requerido.'); // Mostrar mensaje de error
        } else {
            input.classList.remove('is-invalid'); // Remover marca de inválido
            hideError(input); // Ocultar mensaje de error
        }
    });

    if (!isValid) {
        alert('Por favor, complete todos los campos requeridos antes de continuar.');
    }

    return isValid;
}

// Función para validar la experiencia laboral (mínimo 10 años)
function validateExperienceSection() {
    const experienceRows = document.querySelectorAll('#tablaExperiencia tr');
    let totalYears = 0;

    experienceRows.forEach(row => {
        const startDate = row.querySelector('input[name="fechaInicio"]').value;
        const endDate = row.querySelector('input[name="fechaRetiro"]').value;

        if (startDate && endDate) {
            const startYear = new Date(startDate).getFullYear();
            const endYear = new Date(endDate).getFullYear();
            totalYears += (endYear - startYear);
        }
    });

    if (totalYears < 10) {
        alert('Debe tener al menos 10 años de experiencia laboral para continuar.');
        return false;
    }

    return true;
}

// Función para mostrar un mensaje de error debajo de un campo
function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.classList.add('is-invalid');
    input.parentNode.appendChild(errorDiv);
}

// Función para ocultar un mensaje de error
function hideError(input) {
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Inicializar la primera sección visible
showSection(currentSection);