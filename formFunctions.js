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