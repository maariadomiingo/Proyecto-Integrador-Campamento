// Seleccionar elementos de la galería
const perfil = document.querySelector('.perfil');

const btnCerrar = document.querySelector('#btn-cerrar');
const btnAdelantar = document.querySelector('#btn-adelantar');
const btnRetroceder = document.querySelector('#btn-retroceder');
const img = document.querySelectorAll('#galeria img'); // CORREGIDO
const container = document.querySelector('#contenedor-galeria');
const imagenActiva = document.querySelector('#img-activa');
let indexImagen = 0;

// Función para abrir el contenedor de la galería
const abrirContenedor = (event) => {
    imagenActiva.src = event.target.src; // CORREGIDO
    container.style.display = 'flex';
    indexImagen = Array.from(img).indexOf(event.target);
};

// Agregar evento de clic a todas las imágenes
img.forEach((imagen) => {
    imagen.addEventListener('click', abrirContenedor);
});

// Función para cerrar el contenedor
btnCerrar.addEventListener('click', () => {
    container.style.display = 'none';
});

// Función para adelantar imagen
const adelantaImagen = () => {
    if (indexImagen >= img.length - 1) {
        indexImagen = 0;
    } else {
        indexImagen++;
    }
    imagenActiva.src = img[indexImagen].src;
};

// Función para retroceder imagen
const retrocedeImagen = () => {
    if (indexImagen <= 0) {
        indexImagen = img.length - 1;
    } else {
        indexImagen--;
    }
    imagenActiva.src = img[indexImagen].src;
};

// Agregar eventos a los botones
btnAdelantar.addEventListener('click', adelantaImagen);
btnRetroceder.addEventListener('click', retrocedeImagen);

function mostrarInfo() {
    var extraInfo = document.getElementById("extraInfo");
    var btn = document.querySelector(".verMas");

    if (extraInfo.style.display === "none" || extraInfo.style.display === "") {
        extraInfo.style.display = "block";
        btn.textContent = "Ver Menos";
    } else {
        extraInfo.style.display = "none";
        btn.textContent = "Ver Más";
    }
}

if (perfil) {
    perfil.addEventListener('click', function() {
        window.location.href = '../html/login.html';
    });
}
