<?php
header('Content-Type: application/json');
require_once '../server/conectar.php';

file_put_contents('debug.log', "Datos recibidos: " . file_get_contents('php://input') . PHP_EOL, FILE_APPEND);

try {
    $datos = json_decode(file_get_contents('php://input'), true);

    if (empty($datos['identificacion'])) {
        throw new Exception("Identificación no proporcionada");
    }

    // Obtener datos
    $identificacion = $datos['identificacion'];
    $nombre = $datos['nombre'] ?? '';
    $mail = $datos['email'] ?? '';
    $telefono = $datos['telefono'] ?? '';

    // Validar campos
    if (empty($nombre) || empty($mail) || empty($telefono)) {
        throw new Exception("Todos los campos son obligatorios");
    }

    // Consulta SQL
    $query = "UPDATE monitor SET 
                nombre = ?, 
                email = ?, 
                telefono = ?
              WHERE identificacion = ?";

    $stmt = $conexion->prepare($query);

    if (!$stmt) {
        throw new Exception("Error en la consulta: " . $conexion->error);
    }

    // Ajustar "s" o "i" según el tipo de identificacion
    $stmt->bind_param("ssss", $nombre, $mail, $telefono, $identificacion); // Si identificacion es INT

    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar: " . $stmt->error);
    }

    // Éxito
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    file_put_contents('debug.log', "Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}

$conexion->close();
?>