       console.log(mostrarDatosSesiones);
       // Enviar los datos en formato JSON
        fetch('../php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rol: 'monitor', 
                identificacion: identificacionURL,
                password: '12345678' 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                mostrarDatosSesion(data);
            } else {
               // window.location.href = '../html/login.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
           // window.location.href = '../html/login.html';
        });
    

    function mostrarDatosSesion(datos) {
        const identificacionElement = document.getElementById('identificacion');
        identificacionElement.textContent = datos.identificacion || 'No disponible'; 
    }


    
