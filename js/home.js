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