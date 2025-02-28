<?php
include '../server/conectar.php';

if (isset($_GET['id_actividad'])) {
    $idActividad = $_GET['id_actividad'];

    $query = "SELECT descripcion FROM Actividad WHERE id_actividad = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idActividad);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = mysqli_fetch_assoc($result)) {
        header('Content-Type: application/json');
        echo json_encode($row);
    } else {
        echo json_encode(["descripcion" => "No se encontró la actividad"]);
    }
} else {
    echo json_encode(["descripcion" => "ID de actividad no proporcionado"]);
}
?>