<?php
include '../../server/conectar.php';

if ($conexion->connect_error) {
    die(json_encode(["exito" => false, "mensaje" => "Error de conexión"]));
}

$requestData = json_decode(file_get_contents('php://input'), true);

// Comprobar la acción que se está solicitando
if (isset($requestData['action'])) {
    $action = $requestData['action'];

    switch ($action) {
        case 'get_actividades':
            $stmt = $pdo->query("SELECT * FROM actividades ORDER BY fecha, hora");
            $actividades = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($actividades);
            break;

        case 'agregar_actividad':
            $stmt = $pdo->prepare("INSERT INTO actividades (fecha, hora, descripcion) VALUES (?, ?, ?)");
            $stmt->execute([$requestData['fecha'], $requestData['hora'], $requestData['descripcion']]);
            echo json_encode(['success' => true]);
            break;

        case 'editar_actividad':
            $stmt = $pdo->prepare("UPDATE actividades SET fecha = ?, hora = ?, descripcion = ? WHERE id = ?");
            $stmt->execute([$requestData['fecha'], $requestData['hora'], $requestData['descripcion'], $requestData['id']]);
            echo json_encode(['success' => true]);
            break;

        case 'borrar_actividad':
            $stmt = $pdo->prepare("DELETE FROM actividades WHERE id = ?");
            $stmt->execute([$requestData['id']]);
            echo json_encode(['success' => true]);
            break;

        case 'get_actividad':
            $stmt = $pdo->prepare("SELECT * FROM actividades WHERE id = ?");
            $stmt->execute([$requestData['id']]);
            $actividad = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($actividad);
            break;
    }
} else {
    echo json_encode(['error' => 'Acción no válida']);
}
?>