function showPreviewInModal() {
    // Validar la sección 8 antes de continuar
    if (!validateSection8()) {
        alert("Por favor, marcar todos las casillas y proporciona una firma antes de continuar.");
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

    let content = styleContent;

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

    const sections = document.querySelectorAll('.form-section');
    sections.forEach((section) => {
        let sectionContent = `<div class="section">`;

        const sectionTitleElem = section.querySelector('h2');
        if (sectionTitleElem) {
            sectionContent += `<h4>${sectionTitleElem.innerText}</h4>`;
        }

        sectionContent += processSubsections(section, section.id);

        sectionContent += `</div>`;
        content += sectionContent;
    });

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

function processSubsections(section, sectionId) {
    let content = '';

    const subsections = section.querySelectorAll('.section-title');
    if (subsections.length > 0) {
        subsections.forEach(subsection => {
            content += processSubsection(subsection, sectionId);
        });
    } else {
        content += processFields(section.querySelectorAll('input, select, textarea'));
    }

    return content;
}

function processSubsection(subsection, sectionId) {
    let content = `<div class="subsection">`;

    const subsectionTitle = subsection.querySelector('h4');
    if (subsectionTitle) {
        content += `<h5>${subsectionTitle.innerText}</h5>`;
    }

    const fieldsContainer = subsection.nextElementSibling;
    if (fieldsContainer) {
        content += processFields(fieldsContainer.querySelectorAll('input, select, textarea'));
    }

    const table = subsection.nextElementSibling?.nextElementSibling;
    if (table && table.tagName === 'TABLE') {
        content += processTable(table);
    }

    // Ordenar las subsecciones de la sección 3
    if (sectionId === 'section3') {
        if (subsectionTitle.innerText === "Cursos y Seminarios") {
            const tableTitles = [
                'Relacionados a su campo profesional:',
                'Relacionados a su ámbito académico:',
                'Relacionados a su ámbito de evaluación con fines de acreditación:'
            ];
            tableTitles.forEach(title => {
                const relatedTable = document.querySelector(`table[data-title="${title}"]`);
                if (relatedTable) {
                    content += `<h5>${title}</h5>`;
                    content += processTable(relatedTable);
                }
            });
        }
    }

    content += `</div>`;
    return content;
}

function processFields(fields) {
    let content = '';

    fields.forEach(field => {
        if (['LABEL', 'button', 'submit', 'hidden', 'file'].includes(field.tagName) || field.name === 'firma' || field.type === 'file') {
            return;
        }

        let labelText = '';
        const parentLabel = field.parentElement.querySelector('label');
        if (parentLabel) {
            labelText = parentLabel.innerText.replace(":", "").trim();
        } else if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
            labelText = field.previousElementSibling.innerText.replace(":", "").trim();
        }

        let value = '';
        if (field.type === 'checkbox') {
            value = field.checked ? "Sí" : "No";
        } else if (field.tagName === "SELECT") {
            const selectedOption = field.options[field.selectedIndex];
            value = selectedOption ? selectedOption.text : '';
            if (value.includes("--Seleccionar") || value.includes("Selecciona")) {
                return;
            }
        } else {
            value = field.value.trim();
        }

        if (field.closest('.input-group') && field.id === "basic-url" && value === "https://example.com/") {
            return;
        }

        if (field.closest('.input-group') && field.id === "phoneNumber") {
            const phoneCode = document.getElementById('phoneCode').value;
            value = `${phoneCode} ${value}`;
            labelText = "Número de Celular";
        }

        if (field.closest('.input-group') && field.id === "basic-url") {
            labelText = "Red Profesional";
        }

        if (value) {
            content += `<p><strong>${labelText}:</strong> ${value}</p>`;
        }
    });

    return content;
}

function processTable(table) {
    const clonedTable = table.cloneNode(true);

    const headers = clonedTable.querySelectorAll('th');
    let actionIndex = -1;
    headers.forEach((header, index) => {
        if (header.textContent.includes("Acción") || header.textContent.includes("Anexos")) {
            actionIndex = index;
        }
    });

    if (actionIndex !== -1) {
        const rows = clonedTable.querySelectorAll('tr');
        rows.forEach(row => {
            const actionCell = row.children[actionIndex];
            if (actionCell) {
                actionCell.remove();
            }
        });
    }

    return `<table>${clonedTable.innerHTML}</table>`;
}


//funcion de descarga de pdf
function downloadPDF() {
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    const previewContent = document.getElementById('previewModalBody');

    let margin = 10;
    let lineHeight = 10;
    let currentY = margin;
    const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;

    // Agregar el logo y el título
    const logoImg = new Image();
    logoImg.src = '/assets/ICACIT_2025.jpg'; // Asegúrate de tener el logo en la ruta especificada

    logoImg.onload = function() {
        pdf.addImage(logoImg, 'PNG', margin, margin, 30, 30); // Logo en la esquina superior izquierda
        pdf.setFontSize(10);
        pdf.text(`Fecha de Registro: ${new Date().toLocaleDateString()}`, pageWidth - margin, margin + 5, { align: 'right' }); // Fecha en la esquina superior derecha

        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Formulario de Inscripción ICACIT 2025', pageWidth / 2, margin + 20, { align: 'center' });
        currentY += 40;

        const addText = (text, fontSize = 12, isBold = false, align = 'left') => {
            pdf.setFontSize(fontSize);
            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
            pdf.text(text, margin, currentY, { align });
            currentY += lineHeight;
        };

        const addImage = (imgSrc, width, height) => {
            pdf.addImage(imgSrc, 'PNG', pageWidth - margin - width, currentY, width, height);
            currentY += height + lineHeight;
        };

        const addTable = (table) => {
            const rows = table.querySelectorAll('tr');
            const data = [];

            rows.forEach(row => {
                const rowData = [];
                const cells = row.querySelectorAll('th, td');
                cells.forEach(cell => {
                    rowData.push(cell.textContent.trim());
                });
                data.push(rowData);
            });

            pdf.autoTable({
                startY: currentY,
                head: [data[0]],
                body: data.slice(1),
                margin: { left: margin },
            });

            currentY = pdf.autoTable.previous.finalY + lineHeight;
        };

        // Recorrer el contenido de la previsualización
        previewContent.querySelectorAll('h4, h5, p, img, table').forEach(element => {
            if (element.tagName === 'H4') {
                addText(element.textContent, 16, true);
            } else if (element.tagName === 'H5') {
                addText(element.textContent, 14, true);
            } else if (element.tagName === 'P') {
                addText(element.textContent, 12);
            } else if (element.tagName === 'IMG') {
                const imgSrc = element.src;
                let imgWidth, imgHeight;

                if (element.classList.contains('profile-pic')) {
                    imgWidth = 30;
                    imgHeight = (element.naturalHeight * imgWidth) / element.naturalWidth;
                } else if (element.classList.contains('signature')) {
                    imgWidth = 80;
                    imgHeight = (element.naturalHeight * imgWidth) / element.naturalWidth;
                } else {
                    imgWidth = 50;
                    imgHeight = (element.naturalHeight * imgWidth) / element.naturalWidth;
                }

                addImage(imgSrc, imgWidth, imgHeight);
            } else if (element.tagName === 'TABLE') {
                addTable(element);
            }
        });

        pdf.save('Formulario_Inscripcion_ICACIT_2025.pdf');
    };

    function addText(text, fontSize = 12, isBold = false, align = 'left') {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.text(text, margin, currentY, { align });
        currentY += lineHeight;
    }

    function addImage(imgSrc, width, height) {
        pdf.addImage(imgSrc, 'PNG', margin, currentY, width, height);
        currentY += height + lineHeight;
    }

    function addTable(table) {
        const rows = table.querySelectorAll('tr');
        const data = [];

        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            cells.forEach(cell => {
                if (cell.querySelector('.pdf-icon')) {
                    rowData.push("Adjunto");
                } else {
                    rowData.push(cell.textContent.trim());
                }
            });
            data.push(rowData);
        });

        pdf.autoTable({
            startY: currentY,
            head: [data[0]],
            body: data.slice(1),
            margin: { left: margin },
        });

        currentY = pdf.autoTable.previous.finalY + lineHeight;
    }
}