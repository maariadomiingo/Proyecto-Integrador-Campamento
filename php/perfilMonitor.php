<?php
header('Content-Type: application/json');
session_start();
include '../server/conectar.php';

try {
    // Verificar si hay una sesión iniciada
    if (!isset($_SESSION['identificacion'])) {
        throw new Exception("No hay sesión iniciada");
    }

    // Obtener los datos del usuario de la sesión
    $identificacion = $_SESSION['identificacion'];
    $nombre = $_SESSION['nombre'];

    // Puedes agregar más datos aquí si los necesitas
    $datosSesion = [
        "identificacion" => $identificacion,
        "nombre" => $nombre
    ];

    // Si estás verificando la sesión, devuelve los datos
    if ($_SERVER['REQUEST_URI'] == '/get_session.php') {
        echo json_encode($datosSesion);
        exit();
    }

    // Si no, continúa con el proceso normal de autenticación
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
    $query = "SELECT nombre, password, rol FROM usuario WHERE identificacion = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $identificacion);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $row = $resultado->fetch_assoc();

        if (password_verify($password, $row['password'])) {
            $_SESSION['identificacion'] = $identificacion;
            $_SESSION['nombre'] = $row['nombre'];

            echo json_encode([
                "status" => "success", 
                "rol" => $row['rol']
            ]);
            exit();
        } else {
            echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
            exit();
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
        exit();
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error', 
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString() // Solo para desarrollo
    ]);
} finally {
    $conexion->close();
}
?>