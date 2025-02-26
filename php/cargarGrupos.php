<?php
include '../server/conectar.php';

$query = "SELECT id_grupo, nombre FROM GrupoCampistas";
$result = mysqli_query($conexion, $query);

$options = '';
while ($row = mysqli_fetch_assoc($result)) {
    $options .= "<option value='{$row['id_grupo']}'>{$row['nombre']}</option>";
}

echo $options;
?>