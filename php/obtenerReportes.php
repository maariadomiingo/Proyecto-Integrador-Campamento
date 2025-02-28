<?php
include '../server/conectar.php';

if (isset($_GET['id_actividad'])) {
    $idActividad = $_GET['id_actividad'];

    $query = "
        SELECT r.descripcion 
        FROM Reportes r
        WHERE r.id_actividad = ?
    ";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idActividad);
    $stmt->execute();
    $result = $stmt->get_result();

    $reportes = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $reportes[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($reportes);
} else {
    echo json_encode([]);
}
?>