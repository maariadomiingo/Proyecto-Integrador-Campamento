<?php
include '../server/conectar.php';

// Leer el cuerpo de la solicitud como JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

session_start();

// Verificar si existe el id_campista en la sesión
$id_campista = $_SESSION['id_campista'] ?? null;
if (is_null($id_campista)) {
    echo json_encode(['success' => false, 'message' => 'Falta el id_campista']);
    exit;
}

// Verificar si existe una función en la solicitud
if (isset($data['funcion'])) {
    $funcion = $data['funcion'];

    switch ($funcion) {
        case 'datosPadre':
            // Capturar datos del JSON
            $nombre = $data['nombre'] ?? '';
            $relacion = $data['relacion'] ?? '';
            $telefono = $data['telefono'] ?? '';
            $email = $data['email'] ?? '';
            $direccion = $data['direccion'] ?? '';

            // Establecer la cabecera JSON al inicio
            header('Content-Type: application/json');

            // Validar que los campos obligatorios no estén vacíos
            if (empty($nombre) || empty($relacion) || empty($telefono) || empty($email)) {
                echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
                exit;
            }

            // Preparar la consulta para insertar datos
            if ($stmt = $conexion->prepare("INSERT INTO Padre (nombre, relacion, telefono, email, direccion,id_campista) VALUES (?, ?, ?, ?, ?, ?)")) {
                $stmt->bind_param("ssssss", $nombre, $relacion, $telefono, $email, $direccion, $id_campista);
                
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Datos insertados correctamente']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error al insertar los datos']);
                }

                $stmt->close();
            } else {
                echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta']);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Función no válida']);
            exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No se recibió ninguna función.']);
}

if (isset($conexion)) {
    $conexion->close();
}
?>
