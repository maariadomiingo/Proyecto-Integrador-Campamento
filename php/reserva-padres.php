<?php
include '../server/conectar.php';
// Obtener los datos JSON de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si los datos están presentes
if (isset($data['nombre'], $data['relacion'], $data['telefono'], $data['email'])) {
    $nombre = $data['nombre'];
    $relacion = $data['relacion'];
    $telefono = $data['telefono'];
    $email = $data['email'];
    $direccion = isset($data['direccion']) && !empty($data['direccion']) ? $data['direccion'] : NULL; 

    // Preparar la consulta para insertar los datos en la base de datos
    $stmt = $conn->prepare("INSERT INTO Padre (nombre, relacion, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nombre, $relacion, $telefono, $email, $direccion);

    if ($direccion === NULL) {
        $stmt->bind_param("ssss", $nombre, $relacion, $telefono, $email);  // No vinculamos la dirección
    } else {
        $stmt->bind_param("sssss", $nombre, $relacion, $telefono, $email, $direccion);  // Vinculamos la dirección como parámetro
    }
    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Datos insertados correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al insertar los datos']);
    }

    // Cerrar la declaración
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
}

// Cerrar la conexión
$conn->close();
?>
