<?php
require_once '../server/conectar.php';

// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// Debug: Registrar valor recibido
file_put_contents('debug.log', "POST: " . print_r($_POST, true) . PHP_EOL, FILE_APPEND);

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conexion->connect_error]);
    exit();
}

$identificacion = $_POST['identificacion'] ?? null;

// Debug: Valor de identificación
file_put_contents('debug.log', "Identificación recibida: $identificacion" . PHP_EOL, FILE_APPEND);

if (empty($identificacion)) {
    echo json_encode(["error" => "Identificación no recibida"]);
    exit();
}

$sql = "SELECT nombre, email, identificacion, telefono FROM monitor WHERE identificacion = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "Error preparando consulta: " . $conexion->error]);
    exit();
}

$stmt->bind_param("s", $identificacion);

// Debug: Consulta SQL
file_put_contents('debug.log', "Consulta: $sql con ID: $identificacion" . PHP_EOL, FILE_APPEND);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Error ejecutando consulta: " . $stmt->error]);
    exit();
}

$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    // Debug: Consulta sin resultados
    file_put_contents('debug.log', "Consulta devolvió 0 filas para ID: $identificacion" . PHP_EOL, FILE_APPEND);
    echo json_encode(["error" => "Monitor no encontrado"]);
    exit();
}

$fila = $resultado->fetch_assoc();

echo json_encode([
    "nombre" => $fila["nombre"],
    "email" => $fila["email"],
    "identificacion" => $fila["identificacion"],
    "telefono" => $fila["telefono"]
]);

$stmt->close();
$conexion->close();
?>