<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

$identificacion = $_GET['identificacion'] ?? null;

if (!$identificacion) {
    echo json_encode(["error" => "No se proporcionó una identificación."]); 
    exit();
}

try {
    $stmt = $conexion->prepare("
        SELECT g.nombre AS grupo, 
               a.id_actividad,
               a.nombre AS actividad_nombre, 
               a.descripcion, 
               a.hora_actividad, 
               a.fecha
        FROM grupocampistas g
        JOIN actividad a ON g.id_actividad = a.id_actividad
        WHERE g.identificacion_monitor = ?
    ");
    
    $stmt->bind_param("s", $identificacion);
    $stmt->execute();
    
    $resultado = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if (!$resultado) {
        echo json_encode(["error" => "No se encontraron datos para esta identificación"]);
        exit;
    }

    // Formateamos la respuesta
    $respuesta = [
        "grupo" => $resultado[0]["grupo"],
        "actividades" => $resultado
    ];

    echo json_encode($respuesta);

} catch (Exception $e) {
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}
?>