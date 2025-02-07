let currentSection = 0;
const sections = document.querySelectorAll(".form-section");
const progressBar = document.getElementById("progressBar");

//seccion actual
function showSection(index) {
    sections.forEach((section, i) => {
        section.style.display = i === index ? "block" : "none";
        section.classList.toggle("active", i === index);
    });
    updateProgress(index);
}

//seccion siguiente
function nextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        showSection(currentSection);
    }
}

//seccion anterior
function prevSection() {
    if (currentSection > 0) {
        currentSection--;
        showSection(currentSection);
    }
}

//actualizar barra de progreso
function updateProgress(index) {
    const stepPercentage = ((index + 1) / sections.length) * 100;
    progressBar.style.width = stepPercentage + "%";
    progressBar.innerText = `Paso ${index + 1} de ${sections.length}`;
}


// Inicializar la primera sección visible
showSection(currentSection);

//funciones para generar vista previa y envio de datos
// document.getElementById("registrationForm").addEventListener("submit", function(event) {
//     event.preventDefault();
//     generatePreview();
// });

// function generatePreview() {
//     let previewHTML = "<h3>Vista Previa</h3><ul>";
//     document.querySelectorAll("input, textarea").forEach(input => {
//         if (input.type !== "checkbox" || input.checked) {
//             previewHTML += `<li><strong>${input.name}:</strong> ${input.value}</li>`;
//         }
//     });
//     previewHTML += "</ul>";
//     document.getElementById("previewData").innerHTML = previewHTML;
// }
