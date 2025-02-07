<?php
include '../server/conectar.php';

// Forzar respuesta JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Accept");

// Leer JSON desde la solicitud
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Si no se recibió JSON válido
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "error" => "No se recibieron datos o JSON inválido"]);
    exit;
}

// Limpiar y asignar variables
$nombre = isset($data['nombre']) ? $data['nombre'] : "";
$fechaNacimiento = isset($data['fechaNacimiento']) ? $data['fechaNacimiento'] : "";
$direccion = isset($data['direccion']) ? $data['direccion'] : "";
$historialMedico = isset($data['historialMedico']) ? $data['historialMedico'] : "";
$restricciones = isset($data['restricciones']) ? $data['restricciones'] : "No";
$necesidades = isset($data['necesidades']) ? $data['necesidades'] : "";
$nombreEmergencia = isset($data['contactoEmergencia']['nombre']) ? $data['contactoEmergencia']['nombre'] : "";
$telefonoEmergencia = isset($data['contactoEmergencia']['telefono']) ? $data['contactoEmergencia']['telefono'] : "";
$medicamentos = isset($data['medicamentos']) ? $data['medicamentos'] : [];
$otrosMedicamentos = isset($data['otrosMedicamentos']) ? $data['otrosMedicamentos'] : "";

// Preparar consulta
$stmt = $conexion->prepare("
    INSERT INTO Campista (
        nombre, 
        fechaNacimiento, 
        direccion, 
        historialMedicoRelevante, 
        necesidadesEspeciales, 
        nombreEmergencia, 
        telefonoEmergencia
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta"]);
    exit;
}

$stmt->bind_param(
    "sssssss",
    $nombre,
    $fechaNacimiento,
    $direccion,
    $historialMedico,
    $necesidades,
    $nombreEmergencia,
    $telefonoEmergencia
);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "error" => $stmt->error]);
    exit;
}

$id_campista = $stmt->insert_id;

// Insertar medicamentos
if (!empty($medicamentos)) {
    $stmtMedicamentos = $conexion->prepare("
        INSERT INTO medicamentosAutorizados (id_campista, medicamento) 
        VALUES (?, ?)
    ");
    
    foreach ($medicamentos as $medicamento) {
        $stmtMedicamentos->bind_param("is", $id_campista, $medicamento);
        if (!$stmtMedicamentos->execute()) {
            echo json_encode(["success" => false, "error" => $stmtMedicamentos->error]);
            exit;
        }
    }
}

// Insertar otros medicamentos
if (!empty($otrosMedicamentos)) {
    $stmtOtros = $conexion->prepare("
        INSERT INTO medicamentosAutorizados (id_campista, medicamento) 
        VALUES (?, ?)
    ");
    $stmtOtros->bind_param("is", $id_campista, $otrosMedicamentos);
    if (!$stmtOtros->execute()) {
        echo json_encode(["success" => false, "error" => $stmtOtros->error]);
        exit;
    }
}

echo json_encode(["success" => true]);
$conexion->close();
?><?php
include '../server/conectar.php';

// Forzar respuesta JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Accept");

// Leer JSON desde la solicitud
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Si no se recibió JSON válido
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "error" => "No se recibieron datos o JSON inválido"]);
    exit;
}

// Limpiar y asignar variables
$nombre = isset($data['nombre']) ? $data['nombre'] : "";
$fechaNacimiento = isset($data['fechaNacimiento']) ? $data['fechaNacimiento'] : "";
$direccion = isset($data['direccion']) ? $data['direccion'] : "";
$historialMedico = isset($data['historialMedico']) ? $data['historialMedico'] : "";
$restricciones = isset($data['restricciones']) ? $data['restricciones'] : "No";
$necesidades = isset($data['necesidades']) ? $data['necesidades'] : "";
$nombreEmergencia = isset($data['contactoEmergencia']['nombre']) ? $data['contactoEmergencia']['nombre'] : "";
$telefonoEmergencia = isset($data['contactoEmergencia']['telefono']) ? $data['contactoEmergencia']['telefono'] : "";
$medicamentos = isset($data['medicamentos']) ? $data['medicamentos'] : [];
$otrosMedicamentos = isset($data['otrosMedicamentos']) ? $data['otrosMedicamentos'] : "";

// Preparar consulta
$stmt = $conexion->prepare("
    INSERT INTO Campista (
        nombre, 
        fechaNacimiento, 
        direccion, 
        historialMedicoRelevante, 
        necesidadesEspeciales, 
        nombreEmergencia, 
        telefonoEmergencia
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta"]);
    exit;
}

$stmt->bind_param(
    "sssssss",
    $nombre,
    $fechaNacimiento,
    $direccion,
    $historialMedico,
    $necesidades,
    $nombreEmergencia,
    $telefonoEmergencia
);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "error" => $stmt->error]);
    exit;
}

$id_campista = $stmt->insert_id;

// Insertar medicamentos
if (!empty($medicamentos)) {
    $stmtMedicamentos = $conexion->prepare("
        INSERT INTO medicamentosAutorizados (id_campista, medicamento) 
        VALUES (?, ?)
    ");
    
    foreach ($medicamentos as $medicamento) {
        $stmtMedicamentos->bind_param("is", $id_campista, $medicamento);
        if (!$stmtMedicamentos->execute()) {
            echo json_encode(["success" => false, "error" => $stmtMedicamentos->error]);
            exit;
        }
    }
}

// Insertar otros medicamentos
if (!empty($otrosMedicamentos)) {
    $stmtOtros = $conexion->prepare("
        INSERT INTO medicamentosAutorizados (id_campista, medicamento) 
        VALUES (?, ?)
    ");
    $stmtOtros->bind_param("is", $id_campista, $otrosMedicamentos);
    if (!$stmtOtros->execute()) {
        echo json_encode(["success" => false, "error" => $stmtOtros->error]);
        exit;
    }
}

echo json_encode(["success" => true]);
$conexion->close();
?>