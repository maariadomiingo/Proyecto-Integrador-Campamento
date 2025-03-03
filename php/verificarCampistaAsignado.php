<?php
include '../server/conectar.php';

$campistaId = $_GET['campistaId'] ?? null;

if ($campistaId) {
    // Consulta para verificar si el campista ya está en un grupo
    $query = "SELECT g.nombre 
              FROM GrupoCampistaRelacion gcr
              JOIN GrupoCampistas g ON gcr.id_grupo = g.id_grupo
              WHERE gcr.id_campista = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $campistaId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["asignado" => true, "grupoNombre" => $row['nombre']]);
    } else {
        echo json_encode(["asignado" => false]);
    }
} else {
    echo json_encode(["asignado" => false]);
}
?>