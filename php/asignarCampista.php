<?php
include '../server/conectar.php';

// Obtener el contenido del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

$grupoId = $data['grupoId'];
$campistas = $data['campistas'];

foreach ($campistas as $campistaId) {
    $query = "INSERT INTO GrupoCampistaRelacion (id_grupo, id_campista) VALUES (?, ?)";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('ii', $grupoId, $campistaId);
    $stmt->execute();
}

echo 'Campistas asignados correctamente';
?>