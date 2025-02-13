<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

// Verificar la conexión
if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

// Obtener los datos enviados por POST en formato JSON
$datos = json_decode(file_get_contents("php://input"), true);

// Verificar si los datos contienen el ID del campista
if (empty($datos['idCampista'])) {
    echo json_encode(["error" => "No se proporcionó un ID de campista."]);
    exit();
}

// Asignar las variables con los datos recibidos
$idCampista = $datos['idCampista'];
$nombre = $datos['nombre'] ?? null;
$fechaNacimiento = $datos['fechaNacimiento'] ?? null;
$direccion = $datos['direccion'] ?? null;
$historialMedicoRelevante = $datos['historialMedicoRelevante'] ?? null;
$necesidadesEspeciales = $datos['necesidadesEspeciales'] ?? null;
$nombreEmergencia = $datos['nombreEmergencia'] ?? null;
$telefonoEmergencia = $datos['telefonoEmergencia'] ?? null;

$sql = "UPDATE campista SET 
            nombre = IFNULL(?, nombre),
            fechaNacimiento = IFNULL(?, fechaNacimiento),
            direccion = IFNULL(?, direccion),
            historialMedicoRelevante = IFNULL(?, historialMedicoRelevante),
            necesidadesEspeciales = IFNULL(?, necesidadesEspeciales),
            nombreEmergencia = IFNULL(?, nombreEmergencia),
            telefonoEmergencia = IFNULL(?, telefonoEmergencia)
        WHERE id_campista = ?";

$stmt = $conexion->prepare($sql);

// Vincular los parámetros en el SQL
$stmt->bind_param("sssssssi", 
    $nombre, $fechaNacimiento, $direccion, $historialMedicoRelevante, $necesidadesEspeciales, 
    $nombreEmergencia, $telefonoEmergencia, $idCampista
);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error al actualizar los datos: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>