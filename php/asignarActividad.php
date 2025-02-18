<?php
require '../server/conectar.php';

$data = json_decode(file_get_contents("php://input"), true);
$actividadId = $data['actividadId'];
$monitorId = $data['monitorId'];
$grupoId = $data['grupoId'];

$query = "INSERT INTO AsignarActividad (id_actividad, identificacion_monitor, id_grupo) VALUES (?, ?, ?)";
$stmt = $conexion->prepare($query);
$stmt->bind_param("isi", $actividadId, $monitorId, $grupoId);
if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>

