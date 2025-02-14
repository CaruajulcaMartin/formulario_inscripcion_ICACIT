function validateSection8() {
  let valid = true;

  // Validar checkboxes
  const checkboxes = document.querySelectorAll("#section8 input[type='checkbox']");
  checkboxes.forEach(checkbox => {
    const label = checkbox.nextElementSibling; // Obtener el label asociado al checkbox
    const labelText = label ? label.textContent.trim() : "Campo requerido";

    if (!checkbox.checked) {
      valid = false;
      showError(checkbox, `Debe marcar todas las opciones.`);
    } else {
      hideError(checkbox);
    }
  });

  // Validar el canvas de la firma
  const firmaInput = document.getElementById("firmaInput");
  const firmaValue = firmaInput ? firmaInput.value.trim() : "";

  if (!firmaValue || firmaValue === "data:,") {
    valid = false;
    showError(firmaInput, "Por favor, proporciona tu firma para continuar.");
  } else {
    hideError(firmaInput);
  }

  return valid;
}

// Funciones auxiliares para mostrar y ocultar errores
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