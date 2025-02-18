<?php
include '../server/conectar.php';
header('Content-Type: application/json');

// Recibimos el array con las IDs de los campistas presentes
$input = json_decode(file_get_contents('php://input'), true);
$asistencias = $input['asistencias'];  // Asumimos que esto es un array de IDs de campistas

// Inicializamos la variable de respuesta
$response = [
    'success' => false,
    'message' => 'No se pudo guardar la asistencia.'
];

// Verificamos si hay datos en el array
if (!empty($asistencias)) {
    foreach ($asistencias as $id_campista) {
        // Verificamos que no se haya registrado la asistencia de este campista para el día de hoy y la actividad correspondiente
        $sql = "SELECT * FROM pasarlista WHERE id_campista = ? AND fecha = CURDATE()";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $id_campista);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            // Si no está registrado, lo registramos como presente
            $sql_insert = "INSERT INTO pasarlista (id_campista, fecha, estado) VALUES (?, CURDATE(), 'presente')";
            $stmt_insert = $conexion->prepare($sql_insert);
            $stmt_insert->bind_param("i", $id_campista);
            if ($stmt_insert->execute()) {
                $response['success'] = true;
                $response['message'] = 'Asistencia registrada correctamente.';
            } else {
                $response['message'] = 'Error al registrar la asistencia.';
            }
        } else {
            $response['message'] = 'Ya se había registrado la asistencia para este campista hoy.';
        }
    }
} else {
    $response['message'] = 'No se enviaron campistas para registrar.';
}

echo json_encode($response);
?>
