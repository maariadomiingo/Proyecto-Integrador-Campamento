<?php
include '../server/conectar.php';

$grupoId = isset($_GET['grupoId']) ? intval($_GET['grupoId']) : null;

if ($grupoId) {
    // Consulta para obtener los campistas que YA están asignados al grupo seleccionado
    $query = "SELECT c.id_campista, c.nombre 
              FROM Campista c
              WHERE c.id_campista NOT IN (
                  SELECT gcr.id_campista FROM GrupoCampistaRelacion gcr WHERE gcr.id_grupo = ?
              )";
    
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $grupoId);
} else {
    // Si no se seleccionó grupo, mostrar todos los campistas
    $query = "SELECT id_campista, nombre FROM Campista";
    $stmt = $conexion->prepare($query);
}

$stmt->execute();
$result = $stmt->get_result();

$lista = '';
while ($row = $result->fetch_assoc()) {
    $lista .= "<li><input type='checkbox' name='campista' value='{$row['id_campista']}'> {$row['nombre']}</li>";
}

// Si la lista está vacía, mostrar mensaje
if (empty($lista)) {
    echo "<p>No hay campistas disponibles.</p>";
} else {
    echo $lista;
}
?>
