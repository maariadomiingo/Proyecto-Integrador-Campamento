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
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("siiii", $idMonitor, $idGrupo, $idActividad, $idMonitor, $idGrupo);

    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
}
?>
