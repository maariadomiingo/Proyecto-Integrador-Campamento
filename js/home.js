// Seleccionar elementos de la galería
const btnCerrar = document.querySelector('#btn-cerrar');
const btnAdelantar = document.querySelector('#btn-adelantar');
const btnRetroceder = document.querySelector('#btn-retroceder');
const img = document.querySelectorAll('#galeria img');
const container = document.querySelector('#contenedor-galeria');
const imagenActiva = document.querySelector('#img-activa');
let indexImagen = 0;
const navbarLinks = document.querySelectorAll("nav a");
const reservarButtons = document.querySelectorAll('.reservar-btn, .reservar-btn1, .reservar-btn2, .reservar-btn3');

// Scroll suave en la navegación
navbarLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute("href"));
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Función para abrir la galería
const abrirContenedor = (event) => {
    imagenActiva.src = event.target.src;
    container.style.display = 'flex';
}

// Función para cerrar la galería
const cerrarContenedor = () => {
    container.style.display = 'none';
}

// Función para cambiar imágenes
const adelantarImagen = () => {
    if (indexImagen < img.length - 1) {
        indexImagen++;
        imagenActiva.src = img[indexImagen].src;
    }
}

const retrocederImagen = () => {
    if (indexImagen > 0) {
        indexImagen--;
        imagenActiva.src = img[indexImagen].src;
    }
}

// Event listeners para abrir la galería
img.forEach((image, index) => {
    image.addEventListener('click', () => {
        container.style.display = 'flex';
        indexImagen = index;
        imagenActiva.src = image.src;
    });
});

// Event listeners de la galería
if (btnCerrar) btnCerrar.addEventListener('click', cerrarContenedor);
if (btnAdelantar) btnAdelantar.addEventListener('click', adelantarImagen);
if (btnRetroceder) btnRetroceder.addEventListener('click', retrocederImagen);

// Función para redirigir a la página de reserva
const redirigirAReserva = () => {
    window.location.href = '../html/jornada.html';
}

// Asignar evento a los botones de reserva (sin duplicaciones)
if (reservarButtons.length > 0) {
    reservarButtons.forEach(button => {
        button.addEventListener('click', redirigirAReserva);
    });
} else {
    console.error("No se encontraron botones de reserva");
}
// Función para mostrar información extra
function mostrarInfo() {
    const infoExtra = document.getElementById('extraInfo');
    infoExtra.classList.toggle('hidden');
}

// Función para redirigir a contacto
function masInformacion() {
    window.location.href = 'contacto.html';
}

// Función para redirigir a la página de reserva
function reservar() {
    window.location.href = 'reserva.html';
}

// Función para redirigir a la página de perfil
function perfil() {
    window.location.href = 'perfil.html';
}

// Event listeners para los botones
if (masInformacion) {
    masInformacion.addEventListener('click', function() {
        masInformacion();
    });
}

if (reserva) {
    reserva.addEventListener('click', function() {
        reservar();
    });
}

if (perfil) {
    perfil.addEventListener('click', function() {
        perfil();
    });
}

if (verMas) {
    verMas.addEventListener('click', function() {
        mostrarInfo();
    });
}
const hablemosButton = document.getElementById('hablemosButton');

hablemosButton.addEventListener('click', function () {
    window.location.href = '../html/contactanos.html';
});