<?php
include '../server/conectar.php';

if ($conexion->connect_error) {
    die(json_encode(["exito" => false, "mensaje" => "Error de conexión a la base de datos"]));
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['action'])) {
    switch ($data['action']) {
        case 'get_actividades':
            $sql = "SELECT id_actividad, nombre, descripcion, recursos, hora_actividad, fecha FROM Actividad";
            $resultado = $conexion->query($sql);

            $actividades = [];
            while ($fila = $resultado->fetch_assoc()) {
                $actividades[] = $fila;
            }

            echo json_encode($actividades);
            break;

        case 'agregar_actividad':
            if (isset($data['nombre'], $data['fecha'], $data['hora'], $data['descripcion'])) {
                $nombre = $conexion->real_escape_string($data['nombre']);
                $fecha = $conexion->real_escape_string($data['fecha']);
                $hora = $conexion->real_escape_string($data['hora']);
                $descripcion = $conexion->real_escape_string($data['descripcion']);

                // Validación de formato de fecha y hora
                $fecha = date('Y-m-d', strtotime($fecha)); 
                $hora = date('H:i:s', strtotime($hora));   

                $query = "INSERT INTO Actividad (nombre, descripcion, hora_actividad, fecha) VALUES (?, ?, ?, ?)";
                $stmt = $conexion->prepare($query);
                if ($stmt) {
                    $stmt->bind_param("ssss", $nombre, $descripcion, $hora, $fecha);
                    if ($stmt->execute()) {
                        $id_actividad = $conexion->insert_id;
                        echo json_encode([
                            'exito' => true,
                            'mensaje' => 'Actividad agregada con éxito',
                            'id_actividad' => $id_actividad,
                            'nombre' => $nombre,
                            'fecha' => $fecha,
                            'hora' => $hora,
                            'descripcion' => $descripcion
                        ]);
                    } else {
                        echo json_encode(['exito' => false, 'error' => 'Error al insertar en la base de datos: ' . $stmt->error]);
                    }
                    $stmt->close();
                } else {
                    echo json_encode(['exito' => false, 'error' => 'Error en la preparación de la consulta']);
                }
            } else {
                echo json_encode(['exito' => false, 'error' => 'Datos incompletos para agregar actividad']);
            }
            break;

        case 'borrar_actividad':
            if (isset($data['id'])) {
                $stmt = $conexion->prepare("DELETE FROM Actividad WHERE id_actividad = ?");
                $stmt->bind_param("i", $data['id']);

                if ($stmt->execute()) {
                    echo json_encode(["exito" => true, "mensaje" => "Actividad eliminada con éxito"]);
                } else {
                    echo json_encode(["exito" => false, "mensaje" => "Error al eliminar actividad: " . $stmt->error]);
                }

                $stmt->close();
            } else {
                echo json_encode(["exito" => false, "mensaje" => "ID de actividad no proporcionado"]);
            }
            break;
    }
} else {
    echo json_encode(["exito" => false, "mensaje" => "No se recibió ninguna acción"]);
}

$conexion->close();
?>
