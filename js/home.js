// Seleccionar elementos de la galería
const perfil = document.querySelector('.perfil');
const reserva = document.querySelector('.reservar');
const masInformacion = document.querySelector('.informacion');
const verMas = document.querySelector('.verMas');

const btnCerrar = document.querySelector('#btn-cerrar');
const btnAdelantar = document.querySelector('#btn-adelantar');
const btnRetroceder = document.querySelector('#btn-retroceder');
const img = document.querySelectorAll('#galeria img'); 
const container = document.querySelector('#contenedor-galeria');
const imagenActiva = document.querySelector('#img-activa');
let indexImagen = 0;

// Función para abrir el contenedor de la galería
const abrirContenedor = (event) => {
    imagenActiva.src = event.target.src;
    container.style.display = 'block';
}

// Función para cerrar el contenedor de la galería
const cerrarContenedor = () => {
    container.style.display = 'none';
}

// Función para adelantar imagen
const adelantarImagen = () => {
    if (indexImagen < img.length - 1) {
        indexImagen++;
        imagenActiva.src = img[indexImagen].src;
    }
}

// Función para retroceder imagen
const retrocederImagen = () => {
    if (indexImagen > 0) {
        indexImagen--;
        imagenActiva.src = img[indexImagen].src;
    }
}

// Event listeners para la galería
img.forEach((image, index) => {
    image.addEventListener('click', () => {
        container.style.display = 'block';
        indexImagen = index;
        imagenActiva.src = image.src;
    });
});

btnCerrar.addEventListener('click', cerrarContenedor);
btnAdelantar.addEventListener('click', adelantarImagen);
btnRetroceder.addEventListener('click', retrocederImagen);

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