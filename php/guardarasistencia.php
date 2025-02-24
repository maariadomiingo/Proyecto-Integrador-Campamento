<?php
include '../server/conectar.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$ninos = $input['pasarlista'];

foreach ($ninos as $participante) {
    $id_campista = $participante['id_campista']; 
    $presente = $participante['presente'];

    // Comprobamos si ya está registrado para el día de hoy
    $sql = "SELECT * FROM PasarLista WHERE id_campista = ? AND fecha = CURDATE()";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_campista);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($presente === 'presente') {
        if ($result->num_rows == 0) { 
            $sql = "INSERT INTO PasarLista (id_campista, fecha, estado) VALUES (?, CURDATE(), 'presente')";
            $stmt_insert = $conexion->prepare($sql);
            $stmt_insert->bind_param("i", $id_campista);
            $stmt_insert->execute();
            $stmt_insert->close();
        }
    } else { 
        if ($result->num_rows > 0) {
            $sql = "DELETE FROM PasarLista WHERE id_campista = ? AND fecha = CURDATE()";
            $stmt_delete = $conexion->prepare($sql);
            $stmt_delete->bind_param("i", $id_campista);
            $stmt_delete->execute();
            $stmt_delete->close();
        }
    }
    $stmt->close();
}

$data = [
    'success' => true,
    'message' => 'Pasar lista registrada o actualizada correctamente'
];

echo json_encode($data);