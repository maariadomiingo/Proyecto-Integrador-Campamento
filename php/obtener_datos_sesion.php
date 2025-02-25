<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['identificacion']) || !isset($_SESSION['rol'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Sesión no iniciada"]);
    exit();
}

$identificacion = $_SESSION['identificacion'];
$rol = $_SESSION['rol'];

// Puedes obtener más datos del usuario desde la base de datos si es necesario
$query = "SELECT nombre FROM usuario WHERE identificacion = '$identificacion'";
$resultado = mysqli_query($conexion, $query);
$row = mysqli_fetch_assoc($resultado);

echo json_encode([
    "status" => "success",
    "identificacion" => $identificacion,
    "rol" => $rol,
    "nombre" => $row['nombre']
]);
?>