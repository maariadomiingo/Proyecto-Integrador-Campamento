    <?php
    // Solo incluir una vez el archivo de conexión
    require_once '../server/conectar.php';
    
    if (isset($_POST['submit'])) {
        // Obtener datos del formulario
        $rol = $_POST['rol'];
        $user = $_POST['nombre'];  
        $password = $_POST['password'];

        // Verificar que los campos no estén vacíos
        if (!empty($rol) && !empty($user) && !empty($password)) {
            // Escapar valores para evitar inyecciones SQL
            $user = mysqli_real_escape_string($conexion, $user);
            $password = mysqli_real_escape_string($conexion, $password);

            // Consulta para buscar el usuario por nombre
            $query = "SELECT nombre, password, rol FROM usuario WHERE nombre = '$user'";
            $result = mysqli_query($conexion, $query);

            // Verificar si el usuario existe
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    // Verificar la contraseña
                    if (password_verify($password, $row['password'])) {
                        // Iniciar sesión
                        session_start();
                        $_SESSION['nombre'] = $row['nombre'];

                        // Redirigir según el rol
                        if ($row['rol'] == 'coordinador') {
                            header("Location: ../html/interfaz_coordinador.html");
                            exit();
                        } elseif ($row['rol'] == 'monitor') {
                            header("Location: ../html/interfaz_monitor.html");
                            exit();
                        }
                    } else {
                        echo "Contraseña incorrecta.";
                    }
                }
            } else {
                echo "Usuario no encontrado.";
            }
        } else {
            echo "Por favor, completa todos los campos.";
        }
    }
    ?>

