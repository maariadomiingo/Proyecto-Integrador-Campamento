<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

// Obtener la identificación desde la URL
$identificacion = $_GET['identificacion'] ?? null;

if (!$identificacion) {
    echo json_encode(["error" => "No se proporcionó una identificación."]); 
    exit();
}

try {
    // Consulta con JOIN para obtener nombre del grupo y datos de la actividad en una sola consulta
    $stmt = $conexion->prepare("
        SELECT g.nombre AS grupo, 
               a.nombre AS actividad_nombre, 
               a.descripcion, 
               a.recursos, 
               a.hora_actividad, 
               a.fecha
        FROM grupocampistas g
        JOIN actividad a ON g.id_actividad = a.id_actividad
        WHERE g.identificacion_monitor = ?
    ");
    
    $stmt->bind_param("s", $identificacion);
    $stmt->execute();
    
    $resultado = $stmt->get_result()->fetch_assoc();

    if (!$resultado) {
        echo json_encode(["error" => "No se encontraron datos para esta identificación"]);
        exit;
    }

    // Formateamos la respuesta
    $respuesta = [
        "grupo" => $resultado["grupo"],
        "actividad" => [
            "nombre" => $resultado["actividad_nombre"],
            "descripcion" => $resultado["descripcion"],
            "recursos" => $resultado["recursos"],
            "hora" => $resultado["hora_actividad"],
            "fecha" => $resultado["fecha"]
        ]
    ];

    echo json_encode($respuesta);

} catch (Exception $e) {
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}
?>
