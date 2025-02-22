<?php
require_once '../server/conectar.php';

// Obtener los datos enviados desde JavaScript
$data = json_decode(file_get_contents('php://input'), true);

$actividadId = $data['idActividad'] ?? null;
$monitorId = $data['idMonitor'] ?? null;
$grupoId = $data['idGrupo'] ?? null;

// Validar que los datos no estén vacíos
if (!$actividadId || !$monitorId || !$grupoId) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}
// Insertar los datos en la base de datos
$query = "INSERT INTO AsignarActividad (id_actividad, identificacion_monitor, id_grupo) VALUES (?, ?, ?)";
$stmt = $conexion->prepare($query);

if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conexion->error]);
    exit;
}

// Corregir el orden y los tipos de los parámetros
$stmt->bind_param("isi", $actividadId, $monitorId, $grupoId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Actividad asignada correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al asignar la actividad: ' . $stmt->error]);
}

$stmt->close();
$conexion->close(); 
?>