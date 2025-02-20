<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

// Verificar la conexión
if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

// Obtener los datos del monitor con POST
$identificacion = $_POST['identificacion'] ?? null;

if ($identificacion === null) {
    echo json_encode(["error" => "No se proporcionó un ID de monitor."]);
    exit();
}

$sql = "SELECT a.nombre AS actividad, a.hora_actividad, a.fecha 
        FROM Actividad a 
        JOIN AsignarActividad aa ON a.id_actividad = aa.id_actividad 
        WHERE aa.identificacion_monitor = ? 
        ORDER BY a.fecha, a.hora_actividad";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $identificacion);
$stmt->execute();
$resultado = $stmt->get_result();

$actividades = [];

while ($row = $resultado->fetch_assoc()) {
    $actividades[] = [
        'nombre' => $row['actividad'],
        'hora' => $row['hora_actividad'],
        'fecha' => $row['fecha']
    ];
}

$stmt->close();
$conexion->close();

echo json_encode(['actividades' => $actividades]);
?>
