function showPreviewInModal() {
    // Definir estilos en línea para la previsualización (puedes moverlos a tu CSS si prefieres)
    const styleContent = `
        <style>
            .header { text-align: center; margin-bottom: 20px; }
            .profile-picture { max-width: 150px; border-radius: 10px; }
            .section { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            h2 { color: #003366; }
            h4 { color: #006699; margin-bottom: 5px; }
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
    content += `
        <div class="header">
            <img src="/assets/ICACIT_2025.jpg" alt="Logo ICACIT">
            <h1>Previsualización del Formulario de Inscripción - Evaluador ICACIT</h1>
        </div>
    `;

    // Mostrar la foto de perfil si se subió
    const fotoPerfilInput = document.querySelector('input[name="fotoPerfil"]');
    if (fotoPerfilInput && fotoPerfilInput.files.length > 0) {
        const fotoPerfil = URL.createObjectURL(fotoPerfilInput.files[0]);
        content += `
            <div class="section">
                <h2>Foto de Perfil</h2>
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
            sectionContent += `<h2>${sectionTitleElem.innerText}</h2>`;
        }

        // Extraer datos de los campos que NO estén dentro de una tabla
        const fields = section.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            // Excluir campos de tipo file, button, submit, hidden y el campo de firma
            if (['button', 'submit', 'file', 'hidden'].includes(field.type) || field.name === 'firma') {
                return;
            }
            // Omitir si el campo está dentro de una tabla
            if (field.closest('table')) {
                return;
            }
            let labelText = "";
            // Buscar la etiqueta asociada: en el mismo contenedor o justo antes
            const parentLabel = field.parentElement.querySelector('label');
            if (parentLabel) {
                labelText = parentLabel.innerText.replace(":", "");
            } else if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
                labelText = field.previousElementSibling.innerText.replace(":", "");
            }
            let value = "";
            if (field.tagName === "SELECT") {
                const selectedOption = field.options[field.selectedIndex];
                value = selectedOption ? selectedOption.text : "";
                // Omitir si es la opción de placeholder
                if (value.includes("--Seleccionar--")) {
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
            // Si existe un título previo (por ejemplo, un h4 en .section-title), se incluye
            const subTitleElem = table.previousElementSibling && table.previousElementSibling.matches('.section-title')
                ? table.previousElementSibling.innerText
                : "";
            if (subTitleElem) {
                sectionContent += `<h4>${subTitleElem}</h4>`;
            }
            // Obtener encabezados y sus índices, omitiendo la columna "Acción"
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
            // Recorrer las filas de la tabla
            const rows = table.querySelectorAll("tbody tr");
            rows.forEach(row => {
                sectionContent += `<tr>`;
                headers.forEach(header => {
                    const cell = row.querySelectorAll("td")[header.index];
                    if (cell) {
                        let cellContent = cell.innerText.trim();
                        // Si la columna es "Anexos" y hay contenido, mostrar como enlace
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

    // 1) Insertar el contenido en el cuerpo del modal
    document.getElementById("previewModalBody").innerHTML = content;

    // 2) Iniciar y mostrar el modal (asegúrate de tener bootstrap.min.js y el CSS de Bootstrap cargados)
    const modalElement = document.getElementById('previewModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}
