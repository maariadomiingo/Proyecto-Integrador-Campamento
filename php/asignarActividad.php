<?php
include '../server/conectar.php';
header('Content-Type: application/json');

// Obtener datos de la solicitud
$datos = json_decode(file_get_contents("php://input"), true);

$actividadId = $datos["actividadId"] ?? null;
$monitorId = $datos["monitorId"] ?? null;
$grupoId = $datos["grupoId"] ?? null;

if (!$actividadId || !$monitorId || !$grupoId) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

// Verificar si el monitor ya tiene una actividad asignada
$sql = "SELECT * FROM AsignarActividad WHERE identificacion_monitor = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $monitorId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El monitor ya tiene una actividad asociada"]);
    exit();
}

// Insertar en la base de datos
$sql1 = "INSERT INTO AsignarActividad (id_actividad, identificacion_monitor, id_grupo) 
    VALUES (?, ?, ?)";
$stmt = $conexion->prepare($sql1);
$stmt->bind_param("iss", $actividadId, $monitorId, $grupoId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>