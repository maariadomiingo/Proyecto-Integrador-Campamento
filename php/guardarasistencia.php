<?php
include '../server/conectar.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$ninos = $input['asistencias']; 

if (!is_array($ninos)) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

// Insertamos o eliminamos registros en la base de datos
foreach ($ninos as $id_campista) {
    if (!is_numeric($id_campista)) {
        continue;
    }

    // Comprobar si ya está registrado para el día de hoy
    $sql = "SELECT * FROM PasarLista WHERE id_campista = ? AND fecha = CURDATE()";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_campista);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) { 
        // Insertamos solo si no existe ya
        $sql = "INSERT INTO PasarLista (id_campista, fecha, estado) VALUES (?, CURDATE(), 'presente')";
        $stmt_insert = $conexion->prepare($sql);
        $stmt_insert->bind_param("i", $id_campista);
        $stmt_insert->execute();
        $stmt_insert->close();
    }

    $stmt->close();
}

// Eliminamos a los ausentes
$sql = "DELETE FROM PasarLista WHERE fecha = CURDATE() AND id_campista NOT IN (" . implode(",", array_map('intval', $ninos)) . ")";
$conexion->query($sql);

echo json_encode([
    'success' => true,
    'message' => 'Asistencia registrada correctamente'
]);

$conexion->close();
