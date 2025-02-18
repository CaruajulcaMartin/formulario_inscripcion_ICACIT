const GEONAMES_USERNAME = 'caruajulcamartin'; // Reemplaza con tu usuario de GeoNames

// Mapeo de geonameId a nombres de países
let countryIdToNameMap = {};

// Función para obtener la lista de países
async function fetchCountries() {
    try {
        const response = await fetch(`http://api.geonames.org/countryInfoJSON?username=${GEONAMES_USERNAME}`);
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta.');
        }
        const json = await response.json();
        const countries = json.geonames; // GeoNames retorna un arreglo de países en la propiedad "geonames"

        // Crear el mapeo de geonameId a nombres de países
        countries.forEach(country => {
            countryIdToNameMap[country.geonameId] = country.countryName;
        });

        return countries;
    } catch (error) {
        console.error("Error al obtener los países:", error);
        return null;
    }
}

// Función para obtener el nombre del país por su geonameId
function getCountryNameById(geonameId) {
    return countryIdToNameMap[geonameId] || 'Desconocido';
}

// Función auxiliar para limpiar un <select> y agregar una opción por defecto
function clearAndSetDefault(selectElement, defaultText = '--Seleccionar--') {
    if (!selectElement) return;
    selectElement.innerHTML = ''; // Limpia el select
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    selectElement.appendChild(defaultOption);
}

// Función para obtener las regiones (estados) de un país
async function loadRegions(countryCode) {
    try {
        const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${countryCode}&username=${GEONAMES_USERNAME}`);
        if (!response.ok) throw new Error("Error al obtener regiones.");
        const result = await response.json();
        return result.geonames || []; // Retorna un arreglo de regiones (o estados)
    } catch (error) {
        console.error("Error al obtener regiones:", error);
        return [];
    }
}

// Función principal para llenar el <select> de países y regiones
function getCountries(data, countrySelectId, regionSelectId = null) {
    if (!data || !countrySelectId) return;

    const countrySelect = document.getElementById(countrySelectId);
    if (!countrySelect) return;
    clearAndSetDefault(countrySelect, '--Seleccionar País--');

    // Ordenar y llenar el select de países
    data.sort((a, b) => a.countryName.localeCompare(b.countryName));
    data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.geonameId; // Usamos el geonameId como valor
        option.textContent = country.countryName;
        countrySelect.appendChild(option);
    });

    // Establecer Perú como predeterminado
    const peruOption = Array.from(countrySelect.options).find(option => option.textContent === 'Peru');
    if (peruOption) {
        countrySelect.value = peruOption.value; // Selecciona Perú
        if (regionSelectId) {
            // Cargar regiones de Perú automáticamente
            loadRegions(peruOption.value).then(regions => {
                const regionSelect = document.getElementById(regionSelectId);
                if (regionSelect) {
                    clearAndSetDefault(regionSelect, '--Seleccionar Región / Estado--');
                    if (regions && regions.length) {
                        regions.sort((a, b) => a.name.localeCompare(b.name));
                        regions.forEach(region => {
                            const option = document.createElement('option');
                            option.value = region.geonameId; // Usamos el geonameId como valor
                            option.textContent = region.name;
                            regionSelect.appendChild(option);
                        });
                    } else {
                        console.warn("No se encontraron regiones para Perú.");
                    }
                }
            });
        }
    }

    // Si se proporcionó un select para regiones, configurar el evento change
    if (regionSelectId) {
        const regionSelect = document.getElementById(regionSelectId);
        if (!regionSelect) return;
        clearAndSetDefault(regionSelect, '--Seleccionar Región / Estado--');

        countrySelect.addEventListener('change', async function() {
            const selectedCountryId = this.value;
            clearAndSetDefault(regionSelect, '--Seleccionar Región / Estado--');
            if (selectedCountryId) {
                const regions = await loadRegions(selectedCountryId);
                if (regions && regions.length) {
                    regions.sort((a, b) => a.name.localeCompare(b.name));
                    regions.forEach(region => {
                        const option = document.createElement('option');
                        option.value = region.geonameId; // Usamos el geonameId como valor
                        option.textContent = region.name;
                        regionSelect.appendChild(option);
                    });
                } else {
                    console.warn("No se encontraron regiones para el país seleccionado.");
                }
            }
        });
    }
}

// Ejemplo de uso: llenar distintos selects para diferentes secciones de la aplicación
fetchCountries().then(data => {
    // Sección de datos personales con regiones
    getCountries(data, 'PaisDatoDominicial', 'PaisDatoDominicialRegion');

    // Sección de Información Laboral Actual (solo país)
    getCountries(data, 'PaisInformacionLaboral');

    // Sección de formación académica (solo país)
    getCountries(data, 'paisFormacion');

    // Sección de experiencia laboral (solo país)
    getCountries(data, 'paisEmpresa');

    // Sección de experiencia laboral - docente (solo país)
    getCountries(data, 'paisDocente');

    // Sección de experiencia laboral - par evaluador (solo país)
    getCountries(data, 'paisEvaluador');
}).catch(error => console.error('Error al obtener los países:', error));