// firmaDigital.js
function initializeSignatureCanvas() {
    const canvas = document.getElementById("firmaCanvas");
    const ctx = canvas.getContext("2d");
    const limpiador = document.getElementById("limpiarFirma");
    const inputFirma = document.getElementById("firmaInput");

    // Ajustar tamaño del canvas
    function ajustarCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.lineWidth = 2; // Grosor de la línea
        ctx.strokeStyle = "#000"; // Color de la firma
    }

    // Inicializar el canvas
    ajustarCanvas();
    window.addEventListener("resize", ajustarCanvas);

    let dibujando = false;

    // Función para iniciar el dibujo
    function iniciarDibujo(event) {
        dibujando = true;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }

    // Función para dibujar
    function dibujar(event) {
        if (!dibujando) return;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }

    // Función para finalizar el dibujo
    function finalizarDibujo() {
        dibujando = false;
        guardarFirma();
    }

    // Función para guardar la firma en el input
    function guardarFirma() {
        inputFirma.value = canvas.toDataURL("image/png"); // Convierte la firma en base64
    }

    // Limpiar la firma
    limpiador.addEventListener("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        inputFirma.value = "";
    });

    // Eventos del canvas
    canvas.addEventListener("mousedown", iniciarDibujo);
    canvas.addEventListener("mousemove", dibujar);
    canvas.addEventListener("mouseup", finalizarDibujo);
    canvas.addEventListener("mouseleave", finalizarDibujo);
}

// Observar cambios en el DOM para inicializar el canvas cuando esté visible
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // Verificar si el canvas está visible
        const canvas = document.getElementById("firmaCanvas");
        if (canvas && canvas.style.display !== "none") {
            // Inicializar el canvas de la firma
            initializeSignatureCanvas();
            // Dejar de observar después de inicializar (opcional)
            observer.disconnect();
        }
    });
});

// Configurar el observer para observar cambios en el DOM
observer.observe(document.body, {
    childList: true, // Observar cambios en los hijos del nodo
    subtree: true, // Observar en todo el subárbol del nodo
    attributes: true, // Observar cambios en atributos (como style)
});