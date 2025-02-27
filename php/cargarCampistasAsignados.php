<?php
include '../server/conectar.php';

// Obtener el ID del grupo seleccionado
$grupoId = $_GET['grupoId'] ?? null;

if ($grupoId) {
    // Consulta para obtener campistas asignados al grupo seleccionado
    $query = "SELECT c.nombre 
              FROM Campista c
              JOIN GrupoCampistaRelacion gcr ON c.id_campista = gcr.id_campista
              WHERE gcr.id_grupo = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $grupoId);
    $stmt->execute();
    $result = $stmt->get_result();

    $lista = '<h3>Campistas asignados al grupo:</h3><ul>';
    while ($row = $result->fetch_assoc()) {
        $lista .= "<li>{$row['nombre']}</li>";
    }
    $lista .= '</ul>';
} else {
    $lista = '<p>Selecciona un grupo para ver los campistas asignados.</p>';
}

echo $lista;
?>