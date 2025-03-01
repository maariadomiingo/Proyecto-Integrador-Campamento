<?php
include '../server/conectar.php';

header('Content-Type: application/json');

$sql = "SELECT c.id_campista, c.nombre, 
            CASE 
                WHEN p.id_campista IS NOT NULL THEN 'presente' 
                ELSE 'ausente' 
            END AS estado
        FROM Campista c
        LEFT JOIN PasarLista p ON c.id_campista = p.id_campista AND p.fecha = CURDATE()";

$resultado = mysqli_query($conexion, $sql);

$campistas = [];

while ($fila = mysqli_fetch_assoc($resultado)) {
    $campistas[] = [
        'id' => $fila['id_campista'],
        'nombre' => $fila['nombre'],
        'estado' => $fila['estado']
    ];
}

echo json_encode($campistas);
?>
