<?php
require_once '../server/conectar.php';
header("Content-Type: application/json");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error en la conexión: " . $conexion->connect_error]);
    exit();
}

// Obtener la identificación desde POST
$identificacion = $_POST['identificacion'] ?? null;

if (!$identificacion) {
    echo json_encode(["error" => "No se proporcionó una identificación."]); 
    exit();
}

// Consulta corregida (usa $identificacion)
$sql = "SELECT identificacion, nombre, email, telefono FROM monitor WHERE identificacion = ?";
// ...
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $identificacion); //Teníamos un problema con Php, donde teníamos una letra literalmente, ya que en nuestra base de datos el dato era un varchar y lo tratamos de sacar como si fuera un int, solo cambiamos una “i” por una “s”

if (!$stmt->execute()) { 
    echo json_encode(["error" => "Error al ejecutar la consulta: " . $stmt->error]);
    exit();
}

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc();
    $datos = [
        "nombre" => $fila["nombre"],
        "identificacion" => $fila["identificacion"],
        "mail" => $fila["email"],
        "telefono" => $fila["telefono"],
    ];
    echo json_encode($datos);
} else {
    echo json_encode(["error" => "Monitor no encontrado"]); 
}

$stmt->close();
$conexion->close();
?>