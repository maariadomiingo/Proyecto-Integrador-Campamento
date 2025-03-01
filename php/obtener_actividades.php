<?php
include '../server/conectar.php';

$query = "SELECT id_actividad, nombre FROM Actividad";
$result = mysqli_query($conexion, $query);

$actividades = [];
while ($row = mysqli_fetch_assoc($result)) {
    $actividades[] = $row;
}

header('Content-Type: application/json');
echo json_encode($actividades);
?>