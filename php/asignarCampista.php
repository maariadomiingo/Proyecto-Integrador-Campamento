<?php
include '../server/conectar.php';

$data = json_decode(file_get_contents("php://input"), true);
$grupoId = $data['grupoId'];
$campistas = $data['campistas'];

if (!empty($campistas) && is_array($campistas) && is_numeric($grupoId)) {
    try {
        // Iniciar transacción
        $conexion->begin_transaction();

        // 1️⃣ Eliminar la asignación anterior del campista (si existía)
        $queryDelete = "DELETE FROM GrupoCampistaRelacion WHERE id_campista = ?";
        $stmtDelete = $conexion->prepare($queryDelete);

        // 2️⃣ Insertar la nueva asignación en el grupo seleccionado
        $queryInsert = "INSERT INTO GrupoCampistaRelacion (id_grupo, id_campista) VALUES (?, ?)";
        $stmtInsert = $conexion->prepare($queryInsert);

        foreach ($campistas as $idCampista) {
            // Eliminar asignaciones anteriores
            $stmtDelete->bind_param('i', $idCampista);
            $stmtDelete->execute();

            // Insertar la nueva asignación
            $stmtInsert->bind_param('ii', $grupoId, $idCampista);
            $stmtInsert->execute();
        }

        // Confirmar transacción
        $conexion->commit();
        echo json_encode(["success" => true, "message" => "Campistas asignados correctamente."]);
    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $conexion->rollback();
        echo json_encode(["success" => false, "message" => "Error al asignar campistas: " . $e->getMessage()]);
    } finally {
        // Cerrar conexiones y liberar recursos
        $stmtDelete->close();
        $stmtInsert->close();
        $conexion->close();
    }
} else {
    echo json_encode(["success" => false, "message" => "Error: No se recibieron datos válidos."]);
}
?>