<?php
include '../server/conectar.php';

header('Content-Type: application/json');

// Verificar conexión
if (!$conexion) {
    echo json_encode(["error" => "Error de conexión con la base de datos"]);
    exit();
}

$query = "SELECT a.nombre AS nombre_actividad, m.nombre AS nombre_monitor, g.nombre AS nombre_grupo
          FROM AsignarActividad amg
          JOIN Actividad a ON amg.id_actividad = a.id_actividad
          JOIN Monitor m ON amg.identificacion_monitor = m.identificacion
          JOIN GrupoCampistas g ON amg.id_grupo = g.id_grupo";

$result = mysqli_query($conexion, $query);

if (!$result) {
    echo json_encode(["error" => "Error en la consulta: " . mysqli_error($conexion)]);
    exit();
}

$actividadesAsignadas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $actividadesAsignadas[] = $row;
}

echo json_encode($actividadesAsignadas);
?>
