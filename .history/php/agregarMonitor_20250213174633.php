<?php
include '../server/conectar.php';

// Recibir datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

// Sanitizar datos
$nombre = mysqli_real_escape_string($conexion, $data['nombre']);
$apellido = mysqli_real_escape_string($conexion, $data['apellido']);
$mail = mysqli_real_escape_string($conexion, $data['mail']);
$telefono = mysqli_real_escape_string($conexion, $data['telefono']);
$identificacion = mysqli_real_escape_string($conexion, $data['identificacion']);

// Verificar si el correo ya existe
$consulta_correo = "SELECT email FROM Monitor WHERE email = '$mail'";
$resultado_correo = mysqli_query($conexion, $consulta_correo);

if (mysqli_num_rows($resultado_correo) > 0) {
    echo json_encode(['error' => 'El correo electrónico ya existe']);
    mysqli_close($conexion);
    die();
}

// Insertar datos en la tabla Monitor
$query = "INSERT INTO Monitor (nombre, identificacion, email, telefono) 
VALUES ('$nombre', '$identificacion', '$mail', '$telefono')";

if (mysqli_query($conexion, $query)) {
    echo json_encode(['exito' => 'Monitor agregado correctamente']);
} else {
    echo json_encode(['error' => 'Error al agregar monitor: ' . mysqli_error($conexion)]);
}

mysqli_close($conexion);
?>