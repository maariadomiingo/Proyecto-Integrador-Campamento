<?php
header("Content-Type: application/json");
include '../server/conectar.php';

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "No se recibieron datos válidos"]);
    exit;
}

$nombre = $data['nombre-padre'] ?? '';
$email = $data['email'] ?? '';
$telefono = $data['telefono'] ?? '';
$direccion = $data['direccion-padre']?? '';
$relacionParticipante = $data['relacion']?? '';

// Validar datos
if (empty($nombre) || empty($email) || empty($telefono) || empty($relacionParticipante) || empty($direccion)) {
    echo json_encode(["success" => false, "error" => "Todos los campos son obligatorios"]);
    exit;
}

// Preparar la consulta SQL
$stmt = $conexion->prepare("INSERT INTO padre (nombre, relacionParticipante, direccion, email, telefono) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $relacionParticipante, $direccion, $email, $telefono);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Datos guardados correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => "Error al insertar datos: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
