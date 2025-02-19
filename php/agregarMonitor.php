<?php
header('Content-Type: application/json; charset=UTF-8');
include '../server/conectar.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    // Sanitizar los datos
    $nombre = mysqli_real_escape_string($conexion, $data['nombre']);
    $mail = mysqli_real_escape_string($conexion, $data['mail']);
    $telefono = mysqli_real_escape_string($conexion, $data['telefono']);
    $identificacion = mysqli_real_escape_string($conexion, $data['identificacion']);

    // Verificar si el correo electrónico ya existe
    $query_correo = "SELECT email FROM Monitor WHERE email = '$mail'";
    $resultado_correo = mysqli_query($conexion, $query_correo);

    if (mysqli_num_rows($resultado_correo) > 0) {
        echo json_encode(['error' => 'El correo electrónico ya existe']);
        mysqli_close($conexion);
        exit();
    }

    // Verificar si la identificación ya existe en Usuarios
    $query_identificacion = "SELECT identificacion FROM Usuario WHERE identificacion = '$identificacion'";
    $resultado_identificacion = mysqli_query($conexion, $query_identificacion);

    if (mysqli_num_rows($resultado_identificacion) > 0) {
        echo json_encode(['error' => 'La identificación ya existe en los usuarios']);
        mysqli_close($conexion);
        exit();
    }

    // Iniciar una transacción
    mysqli_begin_transaction($conexion);

    try {
        // Insertar en Monitor
        $query_monitor = "INSERT INTO Monitor (nombre, identificacion, email, telefono) VALUES (?, ?, ?, ?)";
        $stmt_monitor = $conexion->prepare($query_monitor);
        $stmt_monitor->bind_param("ssss", $nombre, $identificacion, $mail, $telefono);
        $stmt_monitor->execute();
        $stmt_monitor->close();

        // Insertar en Usuario
        $password_hash = password_hash('12345678', PASSWORD_DEFAULT);
        $query_usuario = "INSERT INTO Usuario (nombre, identificacion, password, rol) VALUES (?, ?, ?, 'Monitor')";
        $stmt_usuario = $conexion->prepare($query_usuario);
        $stmt_usuario->bind_param("sss", $nombre, $identificacion, $password_hash);
        $stmt_usuario->execute();
        $stmt_usuario->close();

        // Confirmar la transacción
        mysqli_commit($conexion);
        echo json_encode(['exito' => 'Monitor y usuario agregados correctamente']);
    } catch (mysqli_sql_exception $e) {
        // Revertir la transacción si ocurre un error
        mysqli_rollback($conexion);
        throw $e;
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al agregar monitor y usuario: ' . $e->getMessage()]);
} finally {
    mysqli_close($conexion);
}
?>