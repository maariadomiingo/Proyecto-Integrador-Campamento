<?php
include '../server/conectar.php';

header('Content-Type: application/json');

$sql = "SELECT id_campista, nombre FROM Campista";
$resultado = mysqli_query($conexion, $sql);

$campistas = [];

while ($fila = mysqli_fetch_assoc($resultado)) {
    $campistas[] = [
        'id' => $fila['id_campista'],
        'nombre' => $fila['nombre']
    ];
}

echo json_encode($campistas);
?>