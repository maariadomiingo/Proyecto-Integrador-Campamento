<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

// Verificar la conexión
if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

// Obtener los datos del campista con POST
$identificacion = $_POST['identificacion'] ?? null; 

if ($identificacion === null) {
    echo json_encode(["error" => "No se proporcionó una identificacion. $identificacion"]);
    exit();
}

$sql = "SELECT identificacion, nombre, mail, telefono
        FROM monitor WHERE identificacion = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $identificacion);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc();
    
    // Formatear los datos en un array asociativo
    $datos = [
        "nombre" => $fila["nombre"],
        "identificacion" => $fila["identificacion"],
        "mail" => $fila["mail"],
        "telefono" => $fila["telefono"],
        
    ];

    echo json_encode($datos);
} else {
    echo json_encode(["error" => "monitor no encontrado"]);
}

$stmt->close();
$conexion->close();
?>
