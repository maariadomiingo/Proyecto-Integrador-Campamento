<?php
require_once '../server/conectar.php';

// Recibir datos en formato JSON
$data = json_decode(file_get_contents("php://input"), true);
file_put_contents("debug_log.txt", print_r($data, true));

// Verificar que los datos existen
if (!isset($data['actividadId'], $data['monitorId'], $data['grupoId'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$idActividad = $data['actividadId'];
$idMonitor = $data['monitorId'];
$idGrupo = $data['grupoId'];

// Verificar si la actividad existe antes de actualizar
$checkQuery = "SELECT * FROM AsignarActividad WHERE id_actividad = ?";
$checkStmt = $conexion->prepare($checkQuery);
$checkStmt->bind_param("i", $idActividad);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "La actividad no existe."]);
    exit;
}

// Actualizar la actividad con el nuevo monitor y grupo
$sql = "UPDATE AsignarActividad SET identificacion_monitor = ?, id_grupo = ? WHERE id_actividad = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sii", $idMonitor, $idGrupo, $idActividad);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
