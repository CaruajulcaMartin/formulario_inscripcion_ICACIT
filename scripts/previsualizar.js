function showPreviewInModal() {
    // Validar la sección 8 antes de continuar
    if (!validateSection8()) {
        alert("Por favor, completa todos los checkboxes y proporciona tu firma antes de previsualizar.");
        return; // Detener la ejecución si la validación falla
    }

    // Generar el contenido de la previsualización
    const content = generatePreviewContent();

    // Insertar el contenido en el cuerpo del modal
    document.getElementById("previewModalBody").innerHTML = content;

    // Mostrar el modal manualmente
    const modalElement = document.getElementById('previewModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show(); // Abre el modal solo si la validación es exitosa
}


function generatePreviewContent() {
    // Definir estilos en línea para la previsualización
    const styleContent = `
        <style>
            .header { text-align: center; margin-bottom: 20px; }
            .profile-picture { max-width: 150px; border-radius: 10px; }
            .section { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            h4 { color: #003366; }
            h5 { color: #006699; margin-bottom: 5px; }
            h6 { color: #003366; }
            p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .signature { max-width: 200px; border: 1px solid #000; margin-top: 10px; }
            a { color: blue; text-decoration: underline; }
        </style>
    `;

    // Empieza el contenido con los estilos
    let content = styleContent;

    // Cabecera de la previsualización
    /*
    content += `
        <div class="header">
            <img src="/assets/ICACIT_2025.jpg" alt="Logo ICACIT">
        </div>
    `;
    */

    // Mostrar la foto de perfil si se subió
    const fotoPerfilInput = document.querySelector('input[name="fotoPerfil"]');
    if (fotoPerfilInput && fotoPerfilInput.files.length > 0) {
        const fotoPerfil = URL.createObjectURL(fotoPerfilInput.files[0]);
        content += `
            <div class="section">
                <h4>Foto de Perfil</h4>
                <img src="${fotoPerfil}" alt="Foto de Perfil" class="profile-picture">
            </div>
        `;
    }

    // Recorrer cada sección del formulario
    const sections = document.querySelectorAll('.form-section');
    sections.forEach((section) => {
        let sectionContent = `<div class="section">`;

        // Título de la sección (h2)
        const sectionTitleElem = section.querySelector('h2');
        if (sectionTitleElem) {
            sectionContent += `<h4>${sectionTitleElem.innerText}</h4>`;
        }

        // Extraer datos de los campos que NO estén dentro de una tabla
        const fields = section.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (['button', 'submit', 'file', 'hidden'].includes(field.type) || field.name === 'firma') {
                return;
            }
            if (field.closest('table')) {
                return;
            }
            let labelText = "";
            const parentLabel = field.parentElement.querySelector('label');
            if (parentLabel) {
                labelText = parentLabel.innerText.replace(":", "");
            } else if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
                labelText = field.previousElementSibling.innerText.replace(":", "");
            }
            if (field.id === "basic-url" && section.id === "section1") {
                labelText = "Red Profesional";
            }
            let value = "";
            if (field.tagName === "SELECT") {
                const selectedOption = field.options[field.selectedIndex];
                value = selectedOption ? selectedOption.text : "";
                if (value.includes("--Seleccionar")) {
                    value = "";
                }
            } else {
                value = field.value.trim();
            }
            if (value) {
                sectionContent += `<p><strong>${labelText}:</strong> ${value}</p>`;
            }
        });

        // Procesar tablas dentro de la sección
        const tables = section.querySelectorAll('table');
        tables.forEach(table => {
            const subTitleElem = table.previousElementSibling && table.previousElementSibling.matches('.section-title')
                ? table.previousElementSibling.innerText
                : "";
            if (subTitleElem) {
                sectionContent += `<h6>${subTitleElem}</h6>`;
            }
            let headers = [];
            const headerCells = table.querySelectorAll("thead th");
            headerCells.forEach((th, index) => {
                const headerText = th.innerText.trim();
                if (headerText.toLowerCase() !== "acción") {
                    headers.push({ text: headerText, index: index });
                }
            });
            if (headers.length > 0) {
                sectionContent += `<table><thead><tr>`;
                headers.forEach(header => {
                    sectionContent += `<th>${header.text}</th>`;
                });
                sectionContent += `</tr></thead><tbody>`;
            }
            const rows = table.querySelectorAll("tbody tr");
            rows.forEach(row => {
                sectionContent += `<tr>`;
                headers.forEach(header => {
                    const cell = row.querySelectorAll("td")[header.index];
                    if (cell) {
                        let cellContent = cell.innerText.trim();
                        if (header.text.toLowerCase() === "anexos" && cellContent) {
                            cellContent = `<a href="${cellContent}" target="_blank">Ver anexo</a>`;
                        }
                        sectionContent += `<td>${cellContent}</td>`;
                    }
                });
                sectionContent += `</tr>`;
            });
            if (headers.length > 0) {
                sectionContent += `</tbody></table>`;
            }
        });

        sectionContent += `</div>`;
        content += sectionContent;
    });

    // Procesar la firma: mostrar la imagen del canvas si tiene contenido significativo
    const canvas = document.getElementById('firmaCanvas');
    if (canvas) {
        const firmaURL = canvas.toDataURL();
        if (firmaURL && firmaURL.length > 100) {
            content += `
                <div class="section">
                    <h4>Firma</h4>
                    <img src="${firmaURL}" alt="Firma del usuario" class="signature">
                </div>
            `;
        }
    }

    return content;
}
