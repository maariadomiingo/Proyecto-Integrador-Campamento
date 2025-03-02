<?php
require_once '../server/conectar.php';

$query = "
    SELECT 
        a.id_actividad,
        a.nombre AS nombre_actividad,
        m.identificacion AS id_monitor,
        m.nombre AS nombre_monitor,
        g.id_grupo,
        g.nombre AS nombre_grupo
    FROM 
        AsignarActividad aa
    JOIN 
        Actividad a ON aa.id_actividad = a.id_actividad
    JOIN 
        Monitor m ON aa.identificacion_monitor = m.identificacion
    JOIN 
        GrupoCampistas g ON aa.id_grupo = g.id_grupo
";

$result = $conexion->query($query);

if (!$result) {
    die("Error en la consulta: " . $conexion->error);
}

$actividades = [];
while ($row = $result->fetch_assoc()) {
    $actividades[] = $row;
}

echo json_encode($actividades);
?>