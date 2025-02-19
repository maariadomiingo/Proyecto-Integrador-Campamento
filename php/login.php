<?php
require_once '../server/conectar.php';
header('Content-Type: application/json');

try {
    // Verificar si se están enviando datos en formato JSON
    if (!isset($_SERVER['CONTENT_TYPE']) || $_SERVER['CONTENT_TYPE'] !== 'application/json') {
        throw new Exception("Se esperaban datos en formato JSON");
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Verificar si el JSON es válido
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error en el formato de los datos");
    }

    // Campos recibidos
    $rol = $data['rol'] ?? '';
    $identificacion = $data['identificacion'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($rol) || empty($identificacion) || empty($password)) {
        throw new Exception("Todos los campos son obligatorios");
    }

    // Consulta preparada
    $query = "SELECT identificacion, password, rol FROM usuario WHERE identificacion = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $identificacion);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $row = $resultado->fetch_assoc();

        if (password_verify($password, $row['password'])) {
            session_start();
            $_SESSION['identificacion'] = $identificacion;
            $_SESSION['rol'] = $row['rol'];

            echo json_encode([
                "status" => "success",
                "rol" => $row['rol'],
                "identificacion" => $identificacion
            ]);
            exit();
        } else {
            throw new Exception("Contraseña incorrecta");
        }
    } else {
        throw new Exception("Usuario no encontrado");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    exit();
} finally {
    $conexion->close();
}
?>