<?php
require '../server/conectar.php';

$query = "SELECT id_actividad, nombre FROM Actividad";
$result = mysqli_query($conexion, $query);
$actividades = [];
while ($row = mysqli_fetch_assoc($result)) {
    $actividades[] = $row;
}
echo json_encode($actividades);
?>