<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $identificacion = $_GET['identificacion'] ?? null;

    if (!$identificacion) {
        echo json_encode(["error" => "No se proporcionó una identificación."]); 
        exit();
    }

    try {
        // Consulta que obtiene las actividades SIN reportes
        $stmt = $conexion->prepare("
            SELECT g.nombre AS grupo, 
                   a.id_actividad,
                   a.nombre, 
                   a.descripcion, 
                   a.recursos, 
                   a.hora_actividad, 
                   a.fecha
            FROM grupocampistas g
            JOIN actividad a ON g.id_actividad = a.id_actividad
            WHERE g.identificacion_monitor = ? 
            AND a.id_actividad NOT IN (
                SELECT id_actividad 
                FROM reportes 
                WHERE identificacion_monitor = ?
            )
        ");
        
        $stmt->bind_param("ss", $identificacion, $identificacion);
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
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // La lógica para guardar el reporte permanece igual
    try {
        $actividad = $_POST['actividad'] ?? null;
        $descripcion = $_POST['descripcion'] ?? null;
        $identificacion = $_POST['identificacion'] ?? null;

        if (!$actividad || !$descripcion || !$identificacion) {
            echo json_encode(["error" => "Faltan datos necesarios"]);
            exit();
        }

        $stmt = $conexion->prepare("
            INSERT INTO reportes (
                id_actividad,
                identificacion_monitor,
                descripcion,
                fecha_reporte
            ) VALUES (
                ?,
                ?,
                ?,
                CURRENT_TIMESTAMP
            )
        ");

        $stmt->bind_param("sss", $actividad, $identificacion, $descripcion);
        $stmt->execute();

        if ($stmt->affected_rows === 1) {
            echo json_encode(["success" => true, "mensaje" => "Reporte guardado correctamente"]);
        } else {
            echo json_encode(["error" => "No se pudo guardar el reporte"]);
        }

    } catch (Exception $e) {
        echo json_encode(["error" => "Error al guardar el reporte: " . $e->getMessage()]);
    }
}
?>