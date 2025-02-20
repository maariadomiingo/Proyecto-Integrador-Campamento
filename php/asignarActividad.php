<?php
require_once '../server/conectar.php';

// Obtener los datos enviados desde JavaScript
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['idActividad'], $data['idMonitor'], $data['idGrupo'])) {
    $idActividad = $data['idActividad'];
    $idMonitor = $data['idMonitor'];
    $idGrupo = $data['idGrupo'];

    // Verificar si la actividad ya tiene una asignación para actualizar
    $sql = "UPDATE AsignarActividad 
            SET identificacion_monitor = ?, id_grupo = ? 
            WHERE id_actividad = ? AND identificacion_monitor = ? AND id_grupo = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["success" => false, "error" => "Error en la preparación de la consulta: " . $conn->error]);
        exit;
    }

    // Asociar los parámetros
    $stmt->bind_param("sissi", $idMonitor, $idGrupo, $idActividad, $idMonitor, $idGrupo);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al ejecutar la consulta: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
}
?>
