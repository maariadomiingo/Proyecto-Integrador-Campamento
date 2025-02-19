<?php
require '../server/conectar.php';

$query = "SELECT id_grupo, nombre FROM GrupoCampistas";
$result = mysqli_query($conexion, $query);
$grupos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $grupos[] = $row;
}
echo json_encode($grupos);
?>