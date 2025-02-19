<?php
include '../server/conectar.php';

// Crear tabla Monitor
$sql_monitor = "CREATE TABLE IF NOT EXISTS Monitor (
    nombre VARCHAR(50) NOT NULL,
    identificacion VARCHAR(9) NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono INT NOT NULL
);";
mysqli_query($conexion, $sql_monitor);

// Crear tabla Coordinador
$sql_coordinador = "CREATE TABLE IF NOT EXISTS Coordinador (
    nombre VARCHAR(50) NOT NULL,
    identificacion VARCHAR(9) NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    telefono INT NOT NULL
);";
mysqli_query($conexion, $sql_coordinador);

// Crear tabla Usuario con clave foránea a Monitor
$sql_usuario = "CREATE TABLE IF NOT EXISTS Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('coordinador', 'monitor') NOT NULL,
    identificacion VARCHAR(9) NOT NULL,
    FOREIGN KEY (identificacion) REFERENCES Monitor(identificacion) ON DELETE CASCADE
);";
mysqli_query($conexion, $sql_usuario);

// Hash de la contraseña
$hash_coordinador = password_hash('12345678', PASSWORD_DEFAULT);
$hash_monitor = password_hash('12345678', PASSWORD_DEFAULT);

// Insertamos primero datos en Monitor (usando INSERT IGNORE para evitar duplicados)
$query_monitor = "INSERT IGNORE INTO Monitor (nombre, identificacion, email, telefono) VALUES ('Juan Pérez', '123456789', 'juan.perez@example.com', 123456789)";
mysqli_query($conexion, $query_monitor);

// Insertamos datos en Coordinador (usando INSERT IGNORE para evitar duplicados)
$query_coordinador = "INSERT IGNORE INTO Coordinador (nombre, identificacion, email, telefono) VALUES ('Maria García', '987654321', 'maria.garcia@example.com', 987654321)";
mysqli_query($conexion, $query_coordinador);

// Insertamos datos en Usuario usando identificaciones existentes en Monitor
$query_usuario = "INSERT INTO Usuario (nombre, password, rol, identificacion) VALUES ('monitor', '$hash_monitor', 'monitor', '123456789')";
mysqli_query($conexion, $query_usuario);

// Crear las tablas en el orden correcto
$tables = [
    "Campista" => "CREATE TABLE IF NOT EXISTS Campista (
        id_campista INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50),
        fechaNacimiento DATE,
        direccion TEXT,
        historialMedicoRelevante TEXT,
        alergias TEXT,
        necesidadesEspeciales TEXT,
        nombreEmergencia VARCHAR(50),
        telefonoEmergencia VARCHAR(15)
    );",
    
    "Horario" => "CREATE TABLE IF NOT EXISTS Horario (
        id_horario INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        nombre_actividad VARCHAR(100) NOT NULL,
        hora TIME NOT NULL,
        UNIQUE KEY (fecha, hora)
    );",

    "Actividad" => "CREATE TABLE IF NOT EXISTS Actividad (
        id_actividad INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        recursos TEXT,
        identificacion_monitor VARCHAR(9) NOT NULL,
        id_horario INT NOT NULL,
        FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE,
        FOREIGN KEY (id_horario) REFERENCES Horario(id_horario) ON DELETE CASCADE
    );",

    "PasarLista" => "CREATE TABLE IF NOT EXISTS PasarLista (
        id_campista INT NOT NULL,
        fecha DATE NOT NULL,
        estado ENUM('presente', 'ausente') NOT NULL,
        id_actividad INT NOT NULL,
        PRIMARY KEY (id_campista, id_actividad, fecha),
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE,
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE
    );",

    "GrupoCampistas" => "CREATE TABLE IF NOT EXISTS GrupoCampistas (
        id_campista INT NOT NULL,
        id_actividad INT NOT NULL,
        PRIMARY KEY (id_campista, id_actividad),
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE,
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE
    );",

    "Padre" => "CREATE TABLE IF NOT EXISTS Padre (
        id_padre INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        relacion VARCHAR(50) NOT NULL,
        telefono VARCHAR(15) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        direccion VARCHAR(50) 
    );",

    "Reserva" => "CREATE TABLE IF NOT EXISTS Reserva (
        id_reserva INT AUTO_INCREMENT PRIMARY KEY,
        fechaReserva DATE NOT NULL,
        precioTotal DECIMAL(10,2) NOT NULL,
        estado ENUM('pendiente', 'pagado', 'cancelado') NOT NULL,
        id_campista INT NOT NULL,
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );",
    
    "MedicamentosAutorizados" => "CREATE TABLE IF NOT EXISTS medicamentosAutorizados (
        id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
        id_campista INT NOT NULL,
        medicamento VARCHAR(100) NOT NULL,
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );"
];

// Ejecutar la creación de tablas
foreach ($tables as $name => $sql) {
    if (mysqli_query($conexion, $sql)) {
        echo "Tabla $name creada exitosamente<br>";
    } else {
        echo "Error creando tabla $name: " . mysqli_error($conexion) . "<br>";
    }
}

// Función para ejecutar consultas preparadas de manera segura
function executeStatement($stmt, $params) {
    $types = str_repeat('s', count($params)); // Tipos de parámetros (todos como string por defecto)
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute()) {
        die("Error al ejecutar la consulta: " . $stmt->error);
    }
}

// Función para obtener o insertar un horario
function getHorarioId($fecha, $nombre_actividad, $hora) {
    global $conexion;
    
    // Consulta para verificar si el horario existe
    $query = "SELECT id_horario FROM horario WHERE fecha = ? AND hora = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("ss", $fecha, $hora);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['id_horario'];
    } else {
        // Insertar nuevo horario
        $insertQuery = "INSERT INTO horario (fecha, nombre_actividad, hora) VALUES (?, ?, ?)";
        $insertStmt = $conexion->prepare($insertQuery);
        $insertStmt->bind_param("sss", $fecha, $nombre_actividad, $hora);
        $insertStmt->execute();
        $id_horario = $conexion->insert_id;
        $insertStmt->close();
        return $id_horario;
    }
}

// Obtener los id_horario para las actividades
$id_horario1 = getHorarioId('2023-10-01', 'Pintura', '10:00:00');
$id_horario2 = getHorarioId('2023-10-02', 'Manualidades', '11:00:00');

// Insertar en Actividad con bind_param()
$query_actividad = "INSERT INTO actividad (nombre, descripcion, recursos, identificacion_monitor, id_horario) VALUES (?, ?, ?, ?, ?)";
$stmt_actividad = $conexion->prepare($query_actividad);

if (!$stmt_actividad) {
    die("Error al preparar la consulta de Actividad: " . $conexion->error);
}

// Primera actividad
$nombre = 'Pintura';
$descripcion = 'Pintar cuadros';
$recursos = 'Pinturas - Lienzos';
$identificacion_monitor = '123456789';
$id_horario = $id_horario1;
executeStatement($stmt_actividad, [$nombre, $descripcion, $recursos, $identificacion_monitor, $id_horario]);

// Segunda actividad
$nombre = 'Manualidades';
$descripcion = 'Crear objetos con materiales reciclados';
$recursos = 'Tijeras - Pegamento - Papel';
$identificacion_monitor = '123456789';
$id_horario = $id_horario2;
executeStatement($stmt_actividad, [$nombre, $descripcion, $recursos, $identificacion_monitor, $id_horario]);

echo "Datos insertados correctamente en la tabla Actividad.<br>";

$stmt_actividad->close();

// Cerrar conexión
$conexion->close();
?>