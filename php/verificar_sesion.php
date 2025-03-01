<?php
session_start();
header('Content-Type: application/json');

// Incluir archivo de conexión
require_once '../server/conectar.php';

try {
    $identificacion = $_POST['identificacion'] ?? '';

    if (empty($identificacion)) {
        throw new Exception('Identificación no proporcionada');
    }

    // Escapar valores para evitar inyecciones SQL
    $identificacion = mysqli_real_escape_string($conexion, $identificacion);

    // Consulta para buscar el usuario por identificacion
    $query = "SELECT identificacion FROM usuario WHERE identificacion = '$identificacion'";
    $result = mysqli_query($conexion, $query);

    if (!$result) {
        throw new Exception("Error en la consulta: " . mysqli_error($conexion));
    }

    if (mysqli_num_rows($result) > 0) {
        echo json_encode(["status" => "success", "message" => "Sesión válida"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

mysqli_close($conexion);
?>