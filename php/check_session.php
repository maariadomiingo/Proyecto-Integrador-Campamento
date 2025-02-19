<?php
require_once '../server/conectar.php';
session_start();
header('Content-Type: application/json');

try {
    $identificacion = $_GET['identificacion'] ?? null;
    
    if (!$identificacion || $identificacion !== $_SESSION['identificacion']) {
        throw new Exception("Identificación inválida");
    }

    // Consulta para obtener datos del usuario
    $query = "SELECT nombre, rol FROM usuario WHERE identificacion = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $identificacion);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows === 0) throw new Exception("Usuario no existe");
    
    echo json_encode($resultado->fetch_assoc());

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>