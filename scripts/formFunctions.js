let tipoPregradoAgregado = false;
let tipoPosdoctoradoAgregado = false;
let experienciaEvaluadorAgregada = 0;

// Función genérica para validar campos
function validarCampos(campos) {
    for (let campo of campos) {
        if (campo.value === "" || campo.value === "--Seleccionar--") {
            alert("Por favor, completa todos los campos.");
            return false;
        }
    }
    return true;
}

// Función genérica para validar archivos PDF
function validarPDF(pdfInput, maxSize = 25 * 1024 * 1024) {
    if (pdfInput.files.length === 0) {
        alert("Por favor, adjunta un PDF.");
        return false;
    }

    let pdfFile = pdfInput.files[0];
    if (pdfFile.type !== "application/pdf") {
        alert("Por favor, adjunta un archivo PDF válido.");
        return false;
    }

    if (pdfFile.size > maxSize) {
        alert("El archivo PDF no puede exceder los 25 MB.");
        return false;
    }

    return pdfFile;
}

// Función genérica para crear una fila en la tabla
function crearFila(tablaId, valores, incluirPDF = false) {
    let tabla = document.getElementById(tablaId);
    let fila = document.createElement("tr");

    let contenido = valores.map(valor => `<td>${valor}</td>`).join('');

    if (incluirPDF) {
        let pdfUrl = URL.createObjectURL(incluirPDF);
        let pdfIcon = `<a href="${pdfUrl}" target="_blank"><i class="fa-regular fa-file-pdf" style="color: red; font-size: 1.5em;"></i></a>`;
        contenido += `<td>${pdfIcon}</td>`;
    }

    contenido += `<td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>`;
    fila.innerHTML = contenido;
    tabla.appendChild(fila);
}

// Función genérica para limpiar campos
function limpiarCampos(campos) {
    campos.forEach(campo => campo.value = "");
}

// Función para eliminar filas
function eliminarFila(boton) {
    let fila = boton.parentElement.parentElement;
    let tipo = fila.cells[0].innerHTML;

    if (tipo === "Pregrado") tipoPregradoAgregado = false;
    if (tipo === "Posdoctorado") tipoPosdoctoradoAgregado = false;

    fila.remove();
}

// Función para agregar formación
function agregarFormacion() {
    let campos = [
        document.getElementById("tipoFormacion"),
        document.getElementById("institucionEducativa"),
        document.getElementById("pais"),
        document.getElementById("especialidad"),
        document.getElementById("nombreGrado"),
        document.getElementById("anoGraduacion")
    ];

    let pdfInput = document.getElementById("pdfFormacion");

    if (!validarCampos(campos) || !validarPDF(pdfInput)) return;

    let tipo = campos[0].value;
    if (tipo === "Pregrado" && tipoPregradoAgregado) {
        alert("Ya has agregado una formación de Pregrado.");
        return;
    }
    if (tipo === "Posdoctorado" && tipoPosdoctoradoAgregado) {
        alert("Ya has agregado una formación de Posdoctorado.");
        return;
    }

    if (tipo === "Pregrado") tipoPregradoAgregado = true;
    if (tipo === "Posdoctorado") tipoPosdoctoradoAgregado = true;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaFormacion", valores, pdfInput.files[0]);
    limpiarCampos([...campos, pdfInput]);
}

// Función para agregar idioma
function agregarIdioma() {
    let campos = [
        document.getElementById("idioma"),
        document.getElementById("competenciaEscrita"),
        document.getElementById("competenciaLectora"),
        document.getElementById("competenciaOral")
    ];

    if (!validarCampos(campos)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaIdiomas", valores);
    limpiarCampos(campos);
}

// Función para campo profesional 
function agregarCursosAmbitoProfesional(){
    let campos = [
        document.getElementById("anoCertificadoCampoProfesional"),
        document.getElementById("institucionCampoProfesional"),
        document.getElementById("cursoSeminarioCampoProfesional"),
        document.getElementById("duracionCampoProfesional"),
    ];

    if (!validarCampos(campos)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaCursosAmbitoProfesional", valores);
    limpiarCampos(campos);
}

//funcion para ambito academico
function agregarCursosAmbitoAcademico(){
    let campos = [
        document.getElementById("anoCertificadoAmbitoAcademico"),
        document.getElementById("institucionAmbitoAcademico"),
        document.getElementById("cursoSeminarioAmbitoAcademico"),
        document.getElementById("duracionAmbitoAcademico"),
    ];

    if (!validarCampos(campos)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaCursosAmbitoAcademico", valores);
    limpiarCampos(campos);
}

function agregarCursos() {
    let campos = [
        document.getElementById("anoCertificado"),
        document.getElementById("institucion"),
        document.getElementById("cursoSeminario"),
        document.getElementById("duracion")
    ];

    if (!validarCampos(campos)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaCursos", valores);
    limpiarCampos(campos);
}

// Función para agregar experiencia laboral
function agregarExperiencia() {
    let campos = [
        document.getElementById("institucionEmpresa"),
        document.getElementById("cargoDesempeñado"),
        document.getElementById("fechaInicio"),
        document.getElementById("fechaRetiro"),
        document.getElementById("paisEmpresa"),
        document.getElementById("ciudadEmpresa")
    ];

    let pdfInput = document.getElementById("pdfExperiencia");

    if (!validarCampos(campos) || !validarPDF(pdfInput)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaExperiencia", valores, pdfInput.files[0]);
    limpiarCampos([...campos, pdfInput]);
}

// Función para agregar experiencia docente
function agregarExperienciaDocente() {
    let campos = [
        document.getElementById("institucionDocente"),
        document.getElementById("paisDocente"),
        document.getElementById("ciudadDocente"),
        document.getElementById("programaProfesional"),
        document.getElementById("cursosImpartidos"),
        document.getElementById("fechaInicioDocente"),
        document.getElementById("fechaRetiroDocente")
    ];

    let pdfInput = document.getElementById("pdfExperienciaDocente");

    if (!validarCampos(campos) || !validarPDF(pdfInput)) return;

    let fechaInicio = new Date(campos[5].value);
    let fechaFin = new Date(campos[6].value);
    let tiempo = fechaFin.getFullYear() - fechaInicio.getFullYear();

    if (tiempo < 1) {
        alert("El tiempo de experiencia debe ser de al menos un año.");
        return;
    }

    let valores = campos.map(campo => campo.value);
    // valores.push(`${tiempo} años`);
    crearFila("tablaExperienciaDocente", valores, pdfInput.files[0]);
    limpiarCampos(campos);
}

// Función para agregar membresías
function agregarMembresia() {
    let campos = [
        document.getElementById("asociacionProfesional"),
        document.getElementById("numeroMembresia"),
        document.getElementById("gradoMembresia")
    ];

    if (!validarCampos(campos)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaMembresias", valores);
    limpiarCampos(campos);
}

// Función para agregar investigaciones
function agregarInvestigacion() {
    let campos = [
        document.getElementById("fechaPublicacion"),
        document.getElementById("nombreInvestigacion"),
        document.getElementById("autores"),
        document.getElementById("revistaCongreso"),
        document.getElementById("baseDatos")
    ];

    if (!validarCampos(campos)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaInvestigaciones", valores);
    limpiarCampos(campos);
}

// Función para agregar premios
function agregarPremio() {
    let campos = [
        document.getElementById("anoReconocimiento"),
        document.getElementById("institucionReconocimiento"),
        document.getElementById("nombreReconocimiento"),
        document.getElementById("descripcionReconocimiento")
    ];

    if (!validarCampos(campos)) return;

    let valores = campos.map(campo => campo.value);
    crearFila("tablaPremios", valores);
    limpiarCampos(campos);
}

// Función para generar años en un select
function generarOpcionesAnios(selectId, rangoInicio, rangoFin) {
    const select = document.getElementById(selectId);
    for (let año = rangoInicio; año <= rangoFin; año++) {
        const option = document.createElement("option");
        option.value = año;
        option.text = año;
        select.appendChild(option);
    }
}

// Generar opciones para los años
generarOpcionesAnios("fechaInicioEvaluador", 1990, 2025);
generarOpcionesAnios("fechaRetiroEvaluador", 1990, 2025);