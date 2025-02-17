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