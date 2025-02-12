async function fetchData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');

        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return null;
    }
}

// Solicitar países
function getCountries(data, selectId) {
    if (!data || !selectId) return;

    // Ordenar los países por nombre
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // Seleccionar el <select> por ID
    const countrySelect = document.getElementById(selectId);
    if (!countrySelect) return;

    // Limpiar el <select>
    countrySelect.innerHTML = '';

    // Agregar opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '--Seleccionar País--';
    countrySelect.appendChild(defaultOption);

    // Llenar el <select> con los países
    data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name.common;
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
    });
}

// Ejemplo de cómo usar la función para llenar múltiples <select>
fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        // selecct para la seccion de datos personales
        getCountries(data, 'country');

        // selecct para la seccion de formacion academica
        getCountries(data, 'paisFormacion');

        // select para la seccion de experiencia laboral
        getCountries(data, 'paisEmpresa');

        // select para la seccion de experiencia laboral - docente
        getCountries(data, 'paisDocente');

        // select para la seccion de experiencia laboral - par evaluador
        getCountries(data, 'paisEvaluador');
    })
    .catch(error => console.error('Error al obtener los países:', error));

// Solicitar nacionalidades
// function getNationalities(data) {
//     if (!data) return;

//     data.sort((a, b) => a.name.common.localeCompare(b.name.common));

//     const nationalitySelect = document.getElementById('nationality');
//     nationalitySelect.innerHTML = ''; //limpiar el select

//     //agregar opcion por defecto
//     const defaultOption = document.createElement('option');
//     defaultOption.value = '';
//     defaultOption.textContent = '--Seleccionar Nacionalidad--';
//     nationalitySelect.appendChild(defaultOption);

//     data.forEach(country => {
//         if (country.demonyms && country.demonyms.eng) {
//             const option = document.createElement('option');
//             option.value = country.demonyms.eng.m;
//             option.textContent = country.demonyms.eng.m;
//             nationalitySelect.appendChild(option);
//         }
//     });
// }

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchData();
    getCountries(data);
    // getNationalities(data);
});