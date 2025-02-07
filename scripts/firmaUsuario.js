document.addEventListener("DOMContentLoaded", function () {
    let canvas = document.getElementById("firmaCanvas");
    let ctx = canvas.getContext("2d");
    let limpiador = document.getElementById("limpiarFirma");
    let inputFirma = document.getElementById("firmaInput");

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

    // Reconfigurar el canvas cuando se muestra u oculta
    function reconfigurarCanvas() {
        ajustarCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        inputFirma.value = ""; // Limpiar el input
    }

    // Observar cambios en la visibilidad del canvas
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "style") {
                reconfigurarCanvas();
            }
        });
    });

    observer.observe(canvas, {
        attributes: true, // Observar cambios en los atributos
    });
});