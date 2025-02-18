// Función para obtener la lista de países
async function fetchData(url = 'https://countriesnow.space/api/v0.1/countries/') {
    try { 
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta.');
        }
        const json = await response.json();
        return json.data; // La API retorna un objeto con la propiedad "data" que contiene el arreglo de países
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return null;
    }
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

// Función para obtener las regiones de un país
async function loadRegions(countryName) {
    try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: countryName })
        });
        if (!response.ok) throw new Error("Error al obtener regiones.");
        const result = await response.json();
        return result.data.states; // La respuesta tiene la forma: { data: { states: [ { name: 'Región1' }, ... ] } }
    } catch (error) {
        console.error("Error al obtener regiones:", error);
        return [];
    }
}

// Función para obtener las provincias de una región
async function loadProvinces(countryName, regionName) {
    try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: countryName, state: regionName })
        });
        if (!response.ok) throw new Error("Error al obtener provincias.");
        const result = await response.json();
        return result.data || []; // Retorna un arreglo de provincias (o municipios) si existe
    } catch (error) {
        console.error("Error al obtener provincias:", error);
        return [];
    }
}

// Función principal para llenar el <select> de países, regiones y provincias
function getCountries(data, countrySelectId, regionSelectId = null, provinceSelectId = null) {
    if (!data || !countrySelectId) return;

    const countrySelect = document.getElementById(countrySelectId);
    if (!countrySelect) return;
    clearAndSetDefault(countrySelect, 'Seleccionar País');

    // Ordenar y llenar el select de países
    data.sort((a, b) => a.country.localeCompare(b.country));
    data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.country;
        option.textContent = country.country;
        countrySelect.appendChild(option);
    });

    // Si se proporcionó un select para regiones, configurar el evento change
    if (regionSelectId) {
        const regionSelect = document.getElementById(regionSelectId);
        if (!regionSelect) return;
        clearAndSetDefault(regionSelect, 'Seleccionar Región / Estado');

        countrySelect.addEventListener('change', async function() {
            const selectedCountry = this.value;
            clearAndSetDefault(regionSelect, 'Seleccionar Región / Estado');
            if (provinceSelectId) {
                const provinceSelect = document.getElementById(provinceSelectId);
                if (provinceSelect) clearAndSetDefault(provinceSelect, 'Seleccionar Provincia / Municipio');
            }
            if (selectedCountry) {
                const regions = await loadRegions(selectedCountry);
                if (regions && regions.length) {
                    regions.sort((a, b) => a.name.localeCompare(b.name));
                    regions.forEach(region => {
                        const option = document.createElement('option');
                        option.value = region.name;
                        option.textContent = region.name;
                        regionSelect.appendChild(option);
                    });
                }
            }
        });

        // Si se proporcionó un select para provincias, configurar el evento change en el select de regiones
        if (provinceSelectId) {
            const provinceSelect = document.getElementById(provinceSelectId);
            if (!provinceSelect) return;
            clearAndSetDefault(provinceSelect, 'Seleccionar Provincia / Municipio');

            regionSelect.addEventListener('change', async function() {
                const selectedRegion = this.value;
                clearAndSetDefault(provinceSelect, 'Seleccionar Provincia / Municipio');
                const selectedCountry = countrySelect.value;
                if (selectedCountry && selectedRegion) {
                    const provinces = await loadProvinces(selectedCountry, selectedRegion);
                    if (provinces && provinces.length) {
                        provinces.sort((a, b) => a.localeCompare(b));
                        provinces.forEach(province => {
                            const option = document.createElement('option');
                            option.value = province;
                            option.textContent = province;
                            provinceSelect.appendChild(option);
                        });
                    }
                }
            });
        }
    }
}

// Ejemplo de uso: llenar distintos selects para diferentes secciones de la aplicación
fetchData().then(data => {
    // Sección de datos personales con regiones y provincias
    getCountries(data, 'PaisDatoDominicial', 'PaisDatoDominicialRegion', 'PaisDatoDominicialProvincia');

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