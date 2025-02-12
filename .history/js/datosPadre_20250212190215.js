document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitButton = form.querySelector(".btn-submit");

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        let isFormValid = true;

        const camposObligatorios = [
            document.getElementById("nombre-padre"),
            document.getElementById("relacion"),
            document.getElementById("telefono"),
            document.getElementById("email"),
            document.getElementById("direccion-padre")
        ];

        camposObligatorios.forEach((input) => {
            if (input.value.trim() === "") {
                isFormValid = false;
                input.classList.add("error");
            } else {
                input.classList.remove("error");
            }
        });

        if (!isFormValid) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        const formData = {
            nombrePadre: document.getElementById("nombre-padre").value,
            relacion: document.getElementById("relacion").value,
            telefono: document.getElementById("telefono").value,
            email: document.getElementById("email").value,
            direccionPadre: document.getElementById("direccion-padre").value
        };

        try {
            const response = await fetch("../php/reserva.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            if (data.success) {
                alert("Reserva enviada con éxito");
                form.reset();
            } else {
                alert("Error al enviar la reserva: " + (data.error || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error al enviar el formulario");
        }
    });
});
