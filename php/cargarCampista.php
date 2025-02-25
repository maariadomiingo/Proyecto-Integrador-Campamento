<?php
include '../server/conectar.php';

// Obtener el ID del grupo seleccionado (si es necesario)
$grupoId = $_GET['grupoId'] ?? null;

// Consulta para obtener campistas no asignados a un grupo
$query = "SELECT c.id_campista, c.nombre 
          FROM Campista c
          LEFT JOIN GrupoCampistaRelacion gcr ON c.id_campista = gcr.id_campista AND gcr.id_grupo = ?
          WHERE gcr.id_campista IS NULL";
$stmt = $conexion->prepare($query);
$stmt->bind_param('i', $grupoId);
$stmt->execute();
$result = $stmt->get_result();

$lista = '';
while ($row = $result->fetch_assoc()) {
    $lista .= "<li><input type='checkbox' name='campista' value='{$row['id_campista']}'>{$row['nombre']}</li>";
}

echo $lista;
?>