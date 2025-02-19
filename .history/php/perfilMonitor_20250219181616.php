<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

// Verificar la conexión
if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

// Obtener los datos del campista con POST
$id_campista = $_POST['identificacion'] ?? null; 

if ($id_campista === null) {
    echo json_encode(["error" => "No se proporcionó un ID de campista. $id_campista"]);
    exit();
}

$sql = "SELECT id_campista, nombre, fechaNacimiento, direccion, historialMedicoRelevante,
                necesidadesEspeciales, nombreEmergencia, telefonoEmergencia 
        FROM campista WHERE id_campista = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_campista);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc();
    
    // Formatear los datos en un array asociativo
    $datos = [
        "nombre" => $fila["nombre"],
        "fechaNacimiento" => $fila["fechaNacimiento"],
        "direccion" => $fila["direccion"],
        "historialMedicoRelevante" => $fila["historialMedicoRelevante"],
        "necesidadesEspeciales" => $fila["necesidadesEspeciales"],
        "nombreEmergencia" => $fila["nombreEmergencia"],
        "telefonoEmergencia" => $fila["telefonoEmergencia"]
    ];

    echo json_encode($datos);
} else {
    echo json_encode(["error" => "Campista no encontrado"]);
}

$stmt->close();
$conexion->close();
?>
