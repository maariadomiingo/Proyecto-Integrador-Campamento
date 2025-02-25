<?php
session_start();
header('Content-Type: application/json');

try {
    if (!isset($_SESSION)) {
        throw new Exception("Sesión no iniciada");
    }

    if (!isset($_GET['identificacion'])) {
        throw new Exception("Identificación no proporcionada");
    }

    $identificacion = $_GET['identificacion'];

    if (empty($identificacion)) {
        throw new Exception("Identificación vacía");
    }

    require_once '../server/conectar.php';

    $query = "SELECT nombre, rol FROM usuario WHERE identificacion = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $identificacion);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 0) {
        throw new Exception("Usuario no encontrado");
    }

    $usuario = $resultado->fetch_assoc();

    if ($usuario['rol'] !== 'monitor') {
        throw new Exception("No tiene permisos para acceder");
    }

    echo json_encode($usuario);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}
?>