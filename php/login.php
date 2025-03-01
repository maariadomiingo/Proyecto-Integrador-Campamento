<?php
// Solo incluir una vez el archivo de conexión
require_once '../server/conectar.php';

// Establecer la cabecera para JSON
header('Content-Type: application/json');

// Obtener datos del cuerpo de la solicitud JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$rol = $data['rol'] ?? '';
$user = $data['identificacion'] ?? '';
$password = $data['password'] ?? '';

// Verificar que los campos no estén vacíos
if (!empty($rol) && !empty($user) && !empty($password)) {
    // Escapar valores para evitar inyecciones SQL
    $user = mysqli_real_escape_string($conexion, $user);

    // Consulta para buscar el usuario por identificacion
    $query = "SELECT identificacion, password, rol FROM usuario WHERE identificacion = '$user'";
    $result = mysqli_query($conexion, $query);

    // Verificar si el usuario existe
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);

        // Verificar la contraseña
        if (password_verify($password, $row['password'])) {
            session_start();
            $_SESSION['identificacion'] = $row['identificacion'];

            // Enviar respuesta JSON con el rol del usuario
            echo json_encode(["status" => "success", "rol" => $row['rol'], 'identificacion' => $row['identificacion']]);
            exit();
        } else {
            echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
            exit();
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
        exit();
    }
} else {
    echo json_encode(["status" => "error", "message" => "Por favor, completa todos los campos"]);
    exit();
}
?>