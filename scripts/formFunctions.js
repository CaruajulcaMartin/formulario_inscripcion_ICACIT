let tipoPregradoAgregado = false;

function agregarFormacion() {
    // Obtener los valores ingresados
    let tipo = document.getElementById("tipoFormacion").value;
    let institucion = document.getElementById("institucionEducativa").value;
    let pais = document.getElementById("pais").value;
    let especialidad = document.getElementById("especialidad").value;
    let grado = document.getElementById("gradoObtenido").value;
    let año = document.getElementById("añoGraduacion").value;

    // Validar que todos los campos estén llenos
    if (tipo === "--Seleccionar--" || institucion === "" || pais === "" || especialidad === "" || grado === "" || año === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Validar que el tipo de formación PREGRADO no sea agregado dos veces
    if (tipo === "Pregrado" && tipoPregradoAgregado) {
        alert("Ya has agregado una formación de Pregrado. Por favor, selecciona otro tipo de formación.");
        return;
    }

    if (tipo === "Pregrado") {
        tipoPregradoAgregado = true;
    }

    // Crear una nueva fila en la tabla
    let tabla = document.getElementById("tablaFormacion");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${tipo}</td>
        <td>${institucion}</td>
        <td>${pais}</td>
        <td>${especialidad}</td>
        <td>${grado}</td>
        <td>${año}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;

    tabla.appendChild(fila);

    // Limpiar los campos después de agregar
    document.getElementById("tipoFormacion").value = "--Seleccionar--";
    document.getElementById("institucionEducativa").value = "";
    document.getElementById("pais").value = "";
    document.getElementById("especialidad").value = "";
    document.getElementById("gradoObtenido").value = "";
    document.getElementById("añoGraduacion").value = "";
}

function eliminarFila(boton) {
    let fila = boton.parentElement.parentElement;
    fila.remove();

    // Si se elimina la fila de Pregrado, habilitar nuevamente la opción
    if (fila.cells[0].innerHTML === "Pregrado") {
        tipoPregradoAgregado = false;
    }
}


//script para mostrar los idiomas agregados
function agregarIdioma() {
    //obtener los datos
    let idioma = document.getElementById("idioma").value;
    let competenciaEscrita = document.getElementById("competenciaEscrita").value;
    let competenciaLectora = document.getElementById("competenciaLectora").value;
    let competenciaOral = document.getElementById("competenciaOral").value;

    //validar que los campos esten llenos
    if (idioma === "" || competenciaEscrita === "--Seleccionar--" || competenciaLectora === "--Seleccionar--" || competenciaOral === "--Seleccionar--") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    //crear una fila en la tabla
    let tabla = document.getElementById("tablaIdiomas");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${idioma}</td>
        <td>${competenciaEscrita}</td>
        <td>${competenciaLectora}</td>
        <td>${competenciaOral}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tabla.appendChild(fila);

    //limpiar los campos
    document.getElementById("idioma").value = "";
    document.getElementById("competenciaEscrita").value = "--Seleccionar--";
    document.getElementById("competenciaLectora").value = "--Seleccionar--";
    document.getElementById("competenciaOral").value = "--Seleccionar--";
}

function eliminarFila(boton) {
    let fila = boton.parentElement.parentElement;
    fila.remove();
}

//script para mostrar los cursos o seminarios agregados
function agregarCursos() {
    //obtener los datos
    let enRelacionA = document.getElementById("enRelacionA").value;
    let año = document.getElementById("añoCertificado").value;
    let institucion = document.getElementById("institucion").value;
    let cursoSeminario = document.getElementById("cursoSeminario").value;
    let duracion = document.getElementById("duracion").value;

    //validar que los campos esten llenos
    if (año === "" || institucion === "" || cursoSeminario === "" || duracion === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    //crear una fila en la tabla
    let tabla = document.getElementById("tablaCursos");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${enRelacionA}</td>
        <td>${año}</td>
        <td>${institucion}</td>
        <td>${cursoSeminario}</td>
        <td>${duracion}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tabla.appendChild(fila);

    //limpiar los campos
    document.getElementById("enRelacionA").value = "--Seleccionar--";
    document.getElementById("añoCertificado").value = "";
    document.getElementById("institucion").value = "";
    document.getElementById("cursoSeminario").value = "";
    document.getElementById("duracion").value = "";
}

//script para mostrar las experiencias laborales
function agregarExperiencia() {
    //obtener los datos
    let empresa = document.getElementById("institucionEmpresa").value;
    let cargo = document.getElementById("cargoDesempeñado").value;
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaRetiro").value;
    let pais = document.getElementById("paisEmpresa").value;
    let ciudad = document.getElementById("ciudadEmpresa").value;

    //validar que los campos esten llenos
    if (empresa === "" || cargo === "" || fechaInicio === "" || fechaFin === "" || pais === "" || ciudad === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }
    //crear una fila en la tabla
    let tabla = document.getElementById("tablaExperiencia");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${empresa}</td>
        <td>${cargo}</td>
        <td>${fechaInicio}</td>
        <td>${fechaFin}</td>
        <td>${pais}</td>
        <td>${ciudad}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tabla.appendChild(fila);

    //limpiar los campos
    document.getElementById("institucionEmpresa").value = "";
    document.getElementById("cargoDesempeñado").value = "";
    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaRetiro").value = "";
    document.getElementById("paisEmpresa").value = "";
    document.getElementById("ciudadEmpresa").value = "";
}

// script para mostrar la experiencia como docente
function agregarExperienciaDocente() {
    //obtener los datos
    let institucion = document.getElementById("institucionDocente").value;
    let paisDocente = document.getElementById("paisDocente").value;
    let ciudadDocente = document.getElementById("ciudadDocente").value;
    let programa = document.getElementById("programaProfesional").value;
    let cursosImpartidos = document.getElementById("cursosImpartidos").value;
    let fechaInicioDocente = document.getElementById("fechaInicioDocente").value;
    let fechaRetiroDocente = document.getElementById("fechaRetiroDocente").value;

    //validar que los campos esten llenos
    if (institucion === "" || paisDocente === "" || ciudadDocente === "" || programa === "" || cursosImpartidos === "" || fechaInicioDocente === "" || fechaRetiroDocente === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    //crear una fila en la tabla
    let tabla = document.getElementById("tablaExperienciaDocente");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${institucion}</td>
        <td>${paisDocente}</td>
        <td>${ciudadDocente}</td>
        <td>${programa}</td>
        <td>${cursosImpartidos}</td>
        <td>${fechaInicioDocente}</td>
        <td>${fechaRetiroDocente}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tabla.appendChild(fila);

    //limpiar los campos
    document.getElementById("institucionDocente").value = "";
    document.getElementById("paisDocente").value = "";
    document.getElementById("ciudadDocente").value = "";
    document.getElementById("programaProfesional").value = "";
    document.getElementById("cursosImpartidos").value = "";
    document.getElementById("fechaInicioDocente").value = "";
    document.getElementById("fechaRetiroDocente").value = "";
}

// script para mostrar experiencia como parte de comite de calidad
function agregarExperienciaComite() {
    //obtener los datos
    let institucion = document.getElementById("institucionComite").value;
    let cargoComite = document.getElementById("cargoComite").value;
    let modelosCalidad = document.getElementById("modelosCalidad").value;
    let fechaInicioComite = document.getElementById("fechaInicioComite").value;
    let fechaRetiroComite = document.getElementById("fechaRetiroComite").value;

    //validar que los campos esten llenos
    if (institucion === "" || cargoComite === "" || modelosCalidad === "" || fechaInicioComite === "" || fechaRetiroComite === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    //crear una fila en la tabla
    let tabla = document.getElementById("tablaExperienciaComite");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${institucion}</td>
        <td>${cargoComite}</td>
        <td>${modelosCalidad}</td>
        <td>${fechaInicioComite}</td>
        <td>${fechaRetiroComite}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tabla.appendChild(fila);

    //limpiar los campos
    document.getElementById("institucionComite").value = "";
    document.getElementById("cargoComite").value = "";
    document.getElementById("modelosCalidad").value = "";
    document.getElementById("fechaInicioComite").value = "";
    document.getElementById("fechaRetiroComite").value = "";
}

//script para mostrar experiencia como par evaluador
let experienciaEvaluadorAgregada = 0;
function agregarExperienciaEvaluador() {
    //obtener los datos
    let nombreEntidad = document.getElementById("nombreEntidad").value;
    let programaEvaluador = document.getElementById("programaEvaluador").value;
    let cargoEvaluador = document.getElementById("cargoEvaluador").value;
    let paisEvaluador = document.getElementById("paisEvaluador").value;
    let ciudadEvaluador = document.getElementById("ciudadEvaluador").value;
    let fechaEvaluacion = document.getElementById("fechaEvaluacion").value;

    //validar que los campos esten llenos
    if (nombreEntidad === "" || programaEvaluador === "" || cargoEvaluador === "" || paisEvaluador === "" || ciudadEvaluador === "" || fechaEvaluacion === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }
    //validar que no se hayan agregado dos experiencias
    if (experienciaEvaluadorAgregada === 2) {
        alert("Solo puedes agregar dos experiencias como par evaluador.");
        return;
    }

    //crear una fila en la tabla
    let tabla = document.getElementById("tablaExperienciaEvaluador");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${nombreEntidad}</td>
        <td>${programaEvaluador}</td>
        <td>${cargoEvaluador}</td>
        <td>${paisEvaluador}</td>
        <td>${ciudadEvaluador}</td>
        <td>${fechaEvaluacion}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;

    tabla.appendChild(fila);

    //incrementar la variable
    experienciaEvaluadorAgregada++;
    //limpiar los campos
    document.getElementById("nombreEntidad").value = "";
    document.getElementById("programaEvaluador").value = "";
    document.getElementById("cargoEvaluador").value = "";
    document.getElementById("paisEvaluador").value = "";
    document.getElementById("ciudadEvaluador").value = "";
    document.getElementById("fechaEvaluacion").value = "";
}


//script para mostrar membresías en Asociaciones Profesionales
function agregarMembresia() {
    //obtener los datos
    let asociacionProfesional = document.getElementById("asociacionProfesional").value;
    let numeroMembresia = document.getElementById("numeroMembresia").value;
    let gradoMembresia = document.getElementById("gradoMembresia").value;

    //validar que los campos esten llenos
    if (asociacionProfesional === "" || numeroMembresia === "" || gradoMembresia === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    //crear una fila en la tabla
    let tabla = document.getElementById("tablaMembresias");
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${asociacionProfesional}</td>
        <td>${numeroMembresia}</td>    
        <td>${gradoMembresia}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tabla.appendChild(fila);

    //limpiar los campos
    document.getElementById("asociacionProfesional").value = "";
    document.getElementById("numeroMembresia").value = "";  
    document.getElementById("gradoMembresia").value = "";
}