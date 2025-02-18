function validarExperienciaLaboral() {
    const tablaExperiencia = document.getElementById("tablaExperiencia");
    if (!tablaExperiencia) {
        alert("Error: La tabla de experiencia laboral no fue encontrada.");
        return false;
    }

    const filas = tablaExperiencia.querySelectorAll("tbody tr");
    console.log(`Número de filas detectadas: ${filas.length}`);

    if (filas.length === 0) {
        alert("Debes agregar al menos una experiencia laboral.");
        return false;
    }

    let totalAnios = 0;

    filas.forEach(fila => {
        const fechaInicioTexto = fila.cells[2]?.textContent.trim();
        const fechaRetiroTexto = fila.cells[3]?.textContent.trim();

        if (!fechaInicioTexto || !fechaRetiroTexto) {
            alert("Error: Hay fechas vacías en la tabla de experiencia laboral.");
            return false;
        }

        const fechaInicio = new Date(fechaInicioTexto);
        const fechaRetiro = new Date(fechaRetiroTexto);

        console.log(`Fecha inicio: ${fechaInicio}, Fecha retiro: ${fechaRetiro}`);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaRetiro.getTime())) {
            alert("Error: Las fechas ingresadas no son válidas.");
            return false;
        }

        // Calcular la diferencia en años
        const anios = fechaRetiro.getFullYear() - fechaInicio.getFullYear();
        totalAnios += anios;
    });

    console.log(`Total años calculados: ${totalAnios}`);

    if (totalAnios < 10) {
        alert(`Debes tener al menos 10 años de experiencia laboral. Actualmente tienes ${totalAnios} años.`);
        return false;
    }

    return true;
}
