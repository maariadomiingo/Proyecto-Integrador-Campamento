<?php
include '../server/conectar.php';

$data = json_decode(file_get_contents("php://input"), true);
$grupoId = $data['grupoId'];
$campistas = $data['campistas'];

if (!empty($campistas) && $grupoId) {
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

    echo "Campistas asignados correctamente";
} else {
    echo "Error: No se recibieron datos válidos";
}
?>
