<?php
include '../server/conectar.php';

// Configuración de CORS y headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit();
}

// Leer JSON desde la solicitud
<<<<<<< HEAD
$json = file_get_contents("php://input");

// DEBUG: Imprime el JSON recibido
file_put_contents("log.txt", "JSON recibido: " . $json . "\n", FILE_APPEND);

$data = json_decode($json, true);

// DEBUG: Verifica si el JSON es válido
if (json_last_error() !== JSON_ERROR_NONE) {
    file_put_contents("log.txt", "Error al decodificar JSON: " . json_last_error_msg() . "\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
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
        alergias, 
        necesidadesEspeciales, 
        nombreEmergencia, 
        telefonoEmergencia
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
    $alergias,
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
=======
$jsonInput = file_get_contents("php://input");
error_log("Datos recibidos: " . $jsonInput); // Para debug

$data = json_decode($jsonInput, true);

// Verificar JSON válido
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "success" => false, 
        "error" => "JSON inválido: " . json_last_error_msg()
    ]);
    exit();
}

try {
    // Limpiar y asignar variables
    $nombre = filter_var($data['nombre'] ?? "", FILTER_SANITIZE_STRING);
    $fechaNacimiento = filter_var($data['fechaNacimiento'] ?? "", FILTER_SANITIZE_STRING);
    $direccion = filter_var($data['direccion'] ?? "", FILTER_SANITIZE_STRING);
    $historialMedico = filter_var($data['historialMedico'] ?? "", FILTER_SANITIZE_STRING);
    $necesidades = filter_var($data['necesidades'] ?? "", FILTER_SANITIZE_STRING);
    $nombreEmergencia = filter_var($data['contactoEmergencia']['nombre'] ?? "", FILTER_SANITIZE_STRING);
    $telefonoEmergencia = filter_var($data['contactoEmergencia']['telefono'] ?? "", FILTER_SANITIZE_STRING);
>>>>>>> ce1e6445381c3f4075926fa6c8927439563496c8
    
    // Iniciar transacción
    $conexion->begin_transaction();

    // Insertar campista
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
        throw new Exception("Error al insertar campista: " . $stmt->error);
    }

    $id_campista = $stmt->insert_id;

    // Procesar medicamentos
    if (!empty($data['medicamentos'])) {
        $stmtMed = $conexion->prepare("
            INSERT INTO medicamentosAutorizados (id_campista, medicamento) 
            VALUES (?, ?)
        ");

        foreach ($data['medicamentos'] as $medicamento) {
            $med = filter_var($medicamento, FILTER_SANITIZE_STRING);
            $stmtMed->bind_param("is", $id_campista, $med);
            if (!$stmtMed->execute()) {
                throw new Exception("Error al insertar medicamento: " . $stmtMed->error);
            }
        }
    }

    // Confirmar transacción
    $conexion->commit();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    $conexion->rollback();
    error_log("Error en la base de datos: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} finally {
    $conexion->close();
}
?>