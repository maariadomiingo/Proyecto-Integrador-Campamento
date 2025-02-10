<?php
require_once '../server/conectar.php';

// Establecer la cabecera para JSON
header('Content-Type: application/json');

// Obtener datos del cuerpo de la solicitud JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);
echo json_encode($data);

// Validar si los datos llegaron correctamente
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos']);
    exit;
}

$nombre = $data['nombre'] ?? '';
$relacion = $data['relacion'] ?? '';
$telefono = $data['telefono'] ?? '';
$email = $data['email'] ?? '';
$direccion = $data['direccion'] ?? '';

// Verificar que los campos obligatorios no estén vacíos
if (empty($nombre) || empty($relacion) || empty($telefono) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit;
}

// Preparar la consulta para insertar los datos en la base de datos
$stmt = $conn->prepare("INSERT INTO Padre (nombre, relacion, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nombre, $relacion, $telefono, $email, $direccion);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Datos insertados correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al insertar los datos']);
}
?>
