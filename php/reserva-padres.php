<?php
include '../server/conectar.php';

// Leer el cuerpo de la solicitud como JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verificar si existe una función en la solicitud
if (isset($_POST['funcion'])) {
    $funcion = $_POST['funcion'];

    switch ($funcion) {
        case 'datosPadre':
            // Capturar datos del formulario
            $nombre = $_POST['nombre'] ?? '';
            $relacion = $_POST['relacion'] ?? '';
            $telefono = $_POST['telefono'] ?? '';
            $email = $_POST['email'] ?? '';
            $direccion = $_POST['direccion'] ?? '';

            // Establecer la cabecera JSON al inicio
            header('Content-Type: application/json');

            // Validar que los campos obligatorios no estén vacíos
            if (empty($nombre) || empty($relacion) || empty($telefono) || empty($email)) {
                echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
                exit;
            }

            // Preparar la consulta para insertar datos
            if ($stmt = $conexion->prepare("INSERT INTO Padre (nombre, relacion, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)")) {
                $stmt->bind_param("sssss", $nombre, $relacion, $telefono, $email, $direccion);
                
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

