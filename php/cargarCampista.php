<?php
include '../server/conectar.php';

// Obtener el ID del grupo seleccionado (si es necesario)
$grupoId = $_GET['grupoId'] ?? null;

if ($grupoId) {
    // Consulta para obtener campistas no asignados al grupo seleccionado
    $query = "SELECT c.id_campista, c.nombre, g.nombre AS grupo_nombre
              FROM Campista c
              LEFT JOIN GrupoCampistaRelacion gcr ON c.id_campista = gcr.id_campista
              LEFT JOIN GrupoCampistas g ON gcr.id_grupo = g.id_grupo
              WHERE gcr.id_grupo IS NULL OR gcr.id_grupo != ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $grupoId);
} else {
    // Si no se selecciona un grupo, mostrar todos los campistas con su grupo asignado
    $query = "SELECT c.id_campista, c.nombre, g.nombre AS grupo_nombre
              FROM Campista c
              LEFT JOIN GrupoCampistaRelacion gcr ON c.id_campista = gcr.id_campista
              LEFT JOIN GrupoCampistas g ON gcr.id_grupo = g.id_grupo";
    $stmt = $conexion->prepare($query);
}

$stmt->execute();
$result = $stmt->get_result();

$lista = '';
while ($row = $result->fetch_assoc()) {
    $grupoNombre = $row['grupo_nombre'] ? " -  " . $row['grupo_nombre'] : " - Sin grupo";
    $lista .= "<li><input type='checkbox' name='campista' value='{$row['id_campista']}'> {$row['nombre']} $grupoNombre</li>";
}

// Si la lista está vacía, mostrar mensaje
if (empty($lista)) {
    echo "<p>No hay campistas disponibles.</p>";
} else {
    echo $lista;
}
?>