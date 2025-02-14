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
            .subsection { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; }
            .subsection h5 { width: 100%; color: #006699; margin-bottom: 10px; }
            .subsection p { flex: 1 1 45%; margin: 5px 0; }
            h4 { color: #003366; }
            h5 { color: #006699; margin-bottom: 5px; }
            h6 { color: #003366; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .signature { max-width: 200px; border: 1px solid #000; margin-top: 10px; }
            a { color: blue; text-decoration: underline; }
            .anexo-label { background-color: #007bff; color: white; padding: 2px 5px; border-radius: 3px; font-size: 0.9em; }
            .checkbox-label { display: block; margin: 5px 0; }
            .archivo-adjunto { color: #007bff; font-style: italic; }
        </style>
    `;

    // Empieza el contenido con los estilos
    let content = styleContent;

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

        // Verificar si la sección tiene subsecciones
        const subsections = section.querySelectorAll('.section-title');
        if (subsections.length > 0) {
            // Si tiene subsecciones, procesar cada una
            subsections.forEach(subsection => {
                let subsectionContent = `<div class="subsection">`;
                const subsectionTitle = subsection.querySelector('h4');
                if (subsectionTitle) {
                    subsectionContent += `<h5>${subsectionTitle.innerText}</h5>`;
                }

                // Obtener los campos dentro de la subsección actual
                const fieldsContainer = subsection.nextElementSibling;
                if (fieldsContainer) {
                    const fields = fieldsContainer.querySelectorAll('input, select, textarea, label');
                    fields.forEach(field => {
                        if (field.tagName === 'LABEL') {
                            // Si es un label, lo ignoramos porque lo manejamos junto con su input
                            return;
                        }

                        if (['button', 'submit', 'file', 'hidden'].includes(field.type) || field.name === 'firma') {
                            return;
                        }
                        if (field.closest('table')) {
                            return;
                        }

                        let labelText = "";
                        const parentLabel = field.parentElement.querySelector('label');
                        if (parentLabel) {
                            labelText = parentLabel.innerText.replace(":", "").trim();
                        } else if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
                            labelText = field.previousElementSibling.innerText.replace(":", "").trim();
                        }

                        if (field.id === "basic-url" && section.id === "section1") {
                            labelText = "Red Profesional";
                        }

                        let value = "";
                        if (field.type === 'checkbox') {
                            // Manejar checkbox
                            value = field.checked ? "Sí" : "No";
                            // Extraer el label asociado al checkbox
                            const label = field.parentElement.querySelector('label');
                            if (label) {
                                labelText = label.innerText.replace(":", "").trim();
                            }
                        } else if (field.tagName === "SELECT") {
                            const selectedOption = field.options[field.selectedIndex];
                            value = selectedOption ? selectedOption.text : "";
                            if (value.includes("--Seleccionar")) {
                                value = "";
                            }
                        } else if (field.type === 'file') {
                            // Manejar archivos adjuntos
                            if (field.files.length > 0) {
                                value = `<span class="archivo-adjunto">Archivo adjunto</span>`;
                            } else {
                                value = "";
                            }
                        } else {
                            value = field.value.trim();
                        }

                        if (value) {
                            subsectionContent += `<p><strong>${labelText}:</strong> ${value}</p>`;
                        }
                    });
                }

                // Procesar la tabla asociada a esta subsección
                const table = subsection.nextElementSibling?.nextElementSibling;
                if (table && table.tagName === 'TABLE') {
                    // Clonar la tabla para no modificar la original
                    const clonedTable = table.cloneNode(true);

                    // Buscar el encabezado que contiene "Acción"
                    const headers = clonedTable.querySelectorAll('th');
                    let actionIndex = -1;
                    headers.forEach((header, index) => {
                        if (header.textContent.includes("Acción")) {
                            actionIndex = index;
                        }
                    });

                    // Si se encontró el encabezado de "Acción", eliminar la columna correspondiente
                    if (actionIndex !== -1) {
                        const rows = clonedTable.querySelectorAll('tr');
                        rows.forEach(row => {
                            const actionCell = row.children[actionIndex];
                            if (actionCell) {
                                actionCell.remove();
                            }
                        });
                    }

                    // Reemplazar los anexos en la tabla por "Archivo adjunto"
                    const anexoCells = clonedTable.querySelectorAll('td.anexo');
                    anexoCells.forEach(cell => {
                        cell.innerHTML = `<span class="archivo-adjunto">Archivo adjunto</span>`;
                    });

                    subsectionContent += clonedTable.outerHTML;
                }

                subsectionContent += `</div>`;
                sectionContent += subsectionContent;
            });
        } else {
            // Si la sección no tiene subsecciones, procesar directamente los campos
            const fields = section.querySelectorAll('input, select, textarea, label');
            fields.forEach(field => {
                if (field.tagName === 'LABEL') {
                    // Si es un label, lo ignoramos porque lo manejamos junto con su input
                    return;
                }

                if (['button', 'submit', 'file', 'hidden'].includes(field.type) || field.name === 'firma') {
                    return;
                }
                if (field.closest('table')) {
                    return;
                }

                let labelText = "";
                const parentLabel = field.parentElement.querySelector('label');
                if (parentLabel) {
                    labelText = parentLabel.innerText.replace(":", "").trim();
                } else if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
                    labelText = field.previousElementSibling.innerText.replace(":", "").trim();
                }

                if (field.id === "basic-url" && section.id === "section1") {
                    labelText = "Red Profesional";
                }

                let value = "";
                if (field.type === 'checkbox') {
                    // Manejar checkbox
                    value = field.checked ? "Sí" : "No";
                    // Extraer el label asociado al checkbox
                    const label = field.parentElement.querySelector('label');
                    if (label) {
                        labelText = label.innerText.replace(":", "").trim();
                    }
                } else if (field.tagName === "SELECT") {
                    const selectedOption = field.options[field.selectedIndex];
                    value = selectedOption ? selectedOption.text : "";
                    if (value.includes("--Seleccionar")) {
                        value = "";
                    }
                } else if (field.type === 'file') {
                    // Manejar archivos adjuntos
                    if (field.files.length > 0) {
                        value = `<span class="archivo-adjunto">Archivo adjunto</span>`;
                    } else {
                        value = "";
                    }
                } else {
                    value = field.value.trim();
                }

                if (value) {
                    sectionContent += `<p><strong>${labelText}:</strong> ${value}</p>`;
                }
            });
        }

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

/*
function generatePreviewContent() {
    // Definir estilos en línea para la previsualización
    const styleContent = `
        <style>
            .header { text-align: center; margin-bottom: 20px; }
            .profile-picture { max-width: 150px; border-radius: 10px; }
            .section { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .subsection { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; }
            .subsection h5 { width: 100%; color: #006699; margin-bottom: 10px; }
            .subsection p { flex: 1 1 45%; margin: 5px 0; }
            h4 { color: #003366; }
            h5 { color: #006699; margin-bottom: 5px; }
            h6 { color: #003366; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .signature { max-width: 200px; border: 1px solid #000; margin-top: 10px; }
            a { color: blue; text-decoration: underline; }
            .anexo-label { background-color: #007bff; color: white; padding: 2px 5px; border-radius: 3px; font-size: 0.9em; }
            .checkbox-label { display: block; margin: 5px 0; }
            .archivo-adjunto { color: #007bff; font-style: italic; }
        </style>
    `;

    // Empieza el contenido con los estilos
    let content = styleContent;

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

        // Verificar si la sección tiene subsecciones
        const subsections = section.querySelectorAll('.section-title');
        if (subsections.length > 0) {
            // Si tiene subsecciones, procesar cada una
            subsections.forEach(subsection => {
                let subsectionContent = `<div class="subsection">`;
                const subsectionTitle = subsection.querySelector('h4');
                if (subsectionTitle) {
                    subsectionContent += `<h5>${subsectionTitle.innerText}</h5>`;
                }

                // Obtener los campos dentro de la subsección actual
                const fieldsContainer = subsection.nextElementSibling;
                if (fieldsContainer) {
                    const fields = fieldsContainer.querySelectorAll('input, select, textarea, label');
                    fields.forEach(field => {
                        if (field.tagName === 'LABEL') {
                            // Si es un label, lo ignoramos porque lo manejamos junto con su input
                            return;
                        }

                        if (['button', 'submit', 'file', 'hidden'].includes(field.type) || field.name === 'firma') {
                            return;
                        }
                        if (field.closest('table')) {
                            return;
                        }

                        let labelText = "";
                        const parentLabel = field.parentElement.querySelector('label');
                        if (parentLabel) {
                            labelText = parentLabel.innerText.replace(":", "").trim();
                        } else if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
                            labelText = field.previousElementSibling.innerText.replace(":", "").trim();
                        }

                        if (field.id === "basic-url" && section.id === "section1") {
                            labelText = "Red Profesional";
                        }

                        let value = "";
                        if (field.type === 'checkbox') {
                            // Manejar checkbox
                            value = field.checked ? "Sí" : "No";
                            // Extraer el label asociado al checkbox
                            const label = field.parentElement.querySelector('label');
                            if (label) {
                                labelText = label.innerText.replace(":", "").trim();
                            }
                        } else if (field.tagName === "SELECT") {
                            const selectedOption = field.options[field.selectedIndex];
                            value = selectedOption ? selectedOption.text : "";
                            if (value.includes("--Seleccionar")) {
                                value = "";
                            }
                        } else if (field.type === 'file') {
                            // Manejar archivos adjuntos
                            if (field.files.length > 0) {
                                value = `<span class="archivo-adjunto">Archivo adjunto</span>`;
                            } else {
                                value = "";
                            }
                        } else {
                            value = field.value.trim();
                        }

                        if (value) {
                            subsectionContent += `<p><strong>${labelText}:</strong> ${value}</p>`;
                        }
                    });
                }

                // Procesar la tabla asociada a esta subsección
                const table = subsection.nextElementSibling?.nextElementSibling;
                if (table && table.tagName === 'TABLE') {
                    // Clonar la tabla para no modificar la original
                    const clonedTable = table.cloneNode(true);

                    // Buscar el encabezado que contiene "Acción"
                    const headers = clonedTable.querySelectorAll('th');
                    let actionIndex = -1;
                    headers.forEach((header, index) => {
                        if (header.textContent.includes("Acción")) {
                            actionIndex = index;
                        }
                    });

                    // Si se encontró el encabezado de "Acción", eliminar la columna correspondiente
                    if (actionIndex !== -1) {
                        const rows = clonedTable.querySelectorAll('tr');
                        rows.forEach(row => {
                            const actionCell = row.children[actionIndex];
                            if (actionCell) {
                                actionCell.remove();
                            }
                        });
                    }

                    // Eliminar los anexos de la tabla
                    const anexoRows = clonedTable.querySelectorAll('td.anexo');
                    anexoRows.forEach(row => {
                        row.remove();
                    });

                    subsectionContent += clonedTable.outerHTML;
                }

                subsectionContent += `</div>`;
                sectionContent += subsectionContent;
            });
        } else {
            // Si la sección no tiene subsecciones, procesar directamente los campos
            const fields = section.querySelectorAll('input, select, textarea, label');
            fields.forEach(field => {
                if (field.tagName === 'LABEL') {
                    // Si es un label, lo ignoramos porque lo manejamos junto con su input
                    return;
                }

                if (['button', 'submit', 'file', 'hidden'].includes(field.type) || field.name === 'firma') {
                    return;
                }
                if (field.closest('table')) {
                    return;
                }

                let labelText = "";
                const parentLabel = field.parentElement.querySelector('label');
                if (parentLabel) {
                    labelText = parentLabel.innerText.replace(":", "").trim();
                } else if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
                    labelText = field.previousElementSibling.innerText.replace(":", "").trim();
                }

                if (field.id === "basic-url" && section.id === "section1") {
                    labelText = "Red Profesional";
                }

                let value = "";
                if (field.type === 'checkbox') {
                    // Manejar checkbox
                    value = field.checked ? "Sí" : "No";
                    // Extraer el label asociado al checkbox
                    const label = field.parentElement.querySelector('label');
                    if (label) {
                        labelText = label.innerText.replace(":", "").trim();
                    }
                } else if (field.tagName === "SELECT") {
                    const selectedOption = field.options[field.selectedIndex];
                    value = selectedOption ? selectedOption.text : "";
                    if (value.includes("--Seleccionar")) {
                        value = "";
                    }
                } else if (field.type === 'file') {
                    // Manejar archivos adjuntos
                    if (field.files.length > 0) {
                        value = `<span class="archivo-adjunto">Archivo adjunto</span>`;
                    } else {
                        value = "";
                    }
                } else {
                    value = field.value.trim();
                }

                if (value) {
                    sectionContent += `<p><strong>${labelText}:</strong> ${value}</p>`;
                }
            });
        }

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
*/

//funcion para descargar el pdf
function downloadPDF() {
    // Crear un nuevo documento PDF
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // Orientación: portrait, unidad: mm, tamaño: A4

    // Obtener el contenido de la previsualización
    const previewContent = document.getElementById('previewModalBody');

    // Configuración inicial
    let margin = 10; // Margen en mm
    let lineHeight = 10; // Altura de línea en mm
    let currentY = margin; // Posición Y actual

    // Función para agregar texto al PDF
    function addText(text, fontSize = 12, isBold = false, align = 'left') {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.text(text, margin, currentY, { align });
        currentY += lineHeight; // Aumentar la posición Y
    }

    // Función para agregar una imagen al PDF
    function addImage(imgSrc, width, height) {
        pdf.addImage(imgSrc, 'PNG', margin, currentY, width, height);
        currentY += height + lineHeight; // Aumentar la posición Y
    }

    // Función para agregar una tabla al PDF
    function addTable(table) {
        const rows = table.querySelectorAll('tr');
        const data = [];

        // Recorrer las filas de la tabla
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            data.push(rowData);
        });

        // Agregar la tabla al PDF usando el plugin autoTable
        pdf.autoTable({
            startY: currentY,
            head: [data[0]], // La primera fila es el encabezado
            body: data.slice(1), // El resto son las filas de datos
            margin: { left: margin },
        });

        currentY = pdf.autoTable.previous.finalY + lineHeight; // Actualizar la posición Y
    }

    // Recorrer el contenido de la previsualización
    previewContent.querySelectorAll('h4, h5, p, img, table').forEach(element => {
        if (element.tagName === 'H4') {
            // Agregar un título (h4)
            addText(element.textContent, 16, true);
        } else if (element.tagName === 'H5') {
            // Agregar un subtítulo (h5)
            addText(element.textContent, 14, true);
        } else if (element.tagName === 'P') {
            // Agregar un párrafo (p)
            addText(element.textContent, 12);
        } else if (element.tagName === 'IMG') {
            // Agregar una imagen (img)
            const imgSrc = element.src;
            const imgWidth = 50; // Ancho de la imagen en mm
            const imgHeight = (element.naturalHeight * imgWidth) / element.naturalWidth; // Altura proporcional
            addImage(imgSrc, imgWidth, imgHeight);
        } else if (element.tagName === 'TABLE') {
            // Agregar una tabla (table)
            addTable(element);
        }
    });

    // Guardar el PDF
    pdf.save('Formulario_Inscripcion_ICACIT_2025.pdf');
}

// Asignar la función al botón de descarga
document.getElementById('downloadPdf').addEventListener('click', downloadPDF);