<?php
require '../server/conectar.php';

$query = "SELECT identificacion, nombre FROM Monitor";
$result = mysqli_query($conexion, $query);
$monitores = [];
while ($row = mysqli_fetch_assoc($result)) {
    $monitores[] = $row;
}
echo json_encode($monitores);
?>