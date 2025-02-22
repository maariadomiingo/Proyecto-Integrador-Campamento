<?php
require_once '../server/conectar.php';

$query = "SELECT 
            a.nombre AS nombre_actividad, 
            m.nombre AS nombre_monitor, 
            g.nombre AS nombre_grupo 
          FROM AsignarActividad aa
          JOIN Actividad a ON aa.id_actividad = a.id_actividad
          JOIN Monitor m ON aa.identificacion_monitor = m.identificacion
          JOIN GrupoCampistas g ON aa.id_grupo = g.id_grupo";

$result = $conexion->query($query);

if ($result === false) {
    die(json_encode(['success' => false, 'message' => 'Error al obtener las actividades asignadas: ' . $conexion->error]));
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conexion->close();
?>