<?php
include '../server/conectar.php';

// Crear tabla usuario
$sql = "CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nombre VARCHAR(20) NOT NULL,  
    password VARCHAR(255) NOT NULL,
    rol ENUM('coordinador', 'monitor') NOT NULL
);";
mysqli_query($conexion, $sql);

// Hash de la contraseña
$hash_coordinador = password_hash('12345678', PASSWORD_DEFAULT);
$hash_monitor = password_hash('abcdefgh', PASSWORD_DEFAULT);

// Inserción en la base de datos
$query = "INSERT INTO usuario (nombre, password, rol) VALUES ('coordinador', '$hash_coordinador', 'coordinador')";
mysqli_query($conexion, $query);

$query1 = "INSERT INTO usuario (nombre, password, rol) VALUES ('monitor', '$hash_monitor', 'monitor')";
mysqli_query($conexion, $query1);

$tables = [
    "Monitor" => "CREATE TABLE IF NOT EXISTS Monitor (
        nombre VARCHAR(50) NOT NULL,
        identificacion VARCHAR(9) NOT NULL PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(15) NOT NULL
    );",

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

    "Actividad" => "CREATE TABLE IF NOT EXISTS Actividad (
        id_actividad INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        recursos TEXT,
        identificacion_monitor VARCHAR(9) NOT NULL,
        hora_actividad TIME NOT NULL,
        FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE
    );",

    "GrupoCampistas" => "CREATE TABLE IF NOT EXISTS GrupoCampistas (
        id_grupo INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        identificacion_monitor VARCHAR(9),
        id_actividad INT,
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE,
        FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE
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

    "AsignarActividad" => "CREATE TABLE IF NOT EXISTS AsignarActividad (
        id_actividad INT NOT NULL,
        nombre_actividad VARCHAR(100) NOT NULL,
        identificacion_monitor VARCHAR(9) NOT NULL,
        id_grupo INT NOT NULL,
        PRIMARY KEY (id_actividad, identificacion_monitor, id_grupo),
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE,
        FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE,
        FOREIGN KEY (id_grupo) REFERENCES GrupoCampistas(id_grupo) ON DELETE CASCADE
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

    "MedicamentosAutorizados" => "CREATE TABLE IF NOT EXISTS MedicamentosAutorizados (
        id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
        id_campista INT NOT NULL,
        medicamento VARCHAR(100) NOT NULL,
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );"
];

// Ejecutar la creación de tablas
foreach ($tables as $name => $sql) {
    mysqli_query($conexion, $sql);
}

// Función para ejecutar consultas preparadas de manera segura
function executeStatement($stmt, $params) {
    $types = str_repeat('s', count($params)); // Tipos de parámetros (todos como string por defecto)
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute()) {
        die("Error al ejecutar la consulta: " . $stmt->error);
    }
}

// Insertar datos en Monitor con bind_param()
$query_monitor = "INSERT INTO Monitor (nombre, identificacion, email, telefono) VALUES (?, ?, ?, ?)";
$stmt_monitor = $conexion->prepare($query_monitor);

if (!$stmt_monitor) {
    die("Error al preparar la consulta de Monitor: " . $conexion->error);
}

// Datos del monitor
$nombre = 'Juan Pérez';
$identificacion = '123456789';
$email = 'juan.perez@example.com';
$telefono = 123456789;

// Ejecutar la inserción en Monitor
executeStatement($stmt_monitor, [$nombre, $identificacion, $email, $telefono]);

echo "Datos insertados correctamente en la tabla Monitor.<br>";

$stmt_monitor->close();

// Insertar en Actividad con bind_param()
$query_actividad = "INSERT INTO Actividad (nombre, descripcion, recursos, identificacion_monitor, hora_actividad) VALUES (?, ?, ?, ?, ?)";
$stmt_actividad = $conexion->prepare($query_actividad);

if (!$stmt_actividad) {
    die("Error al preparar la consulta de Actividad: " . $conexion->error);
}

// Primera actividad
$nombre = 'Pintura';
$descripcion = 'Pintar cuadros';
$recursos = 'Pinturas - Lienzos';
$identificacion_monitor = '123456789';  // Usamos la identificacion del monitor insertado anteriormente
$hora_actividad = '10:00:00';  // Hora de la actividad
executeStatement($stmt_actividad, [$nombre, $descripcion, $recursos, $identificacion_monitor, $hora_actividad]);

// Segunda actividad
$nombre = 'Manualidades';
$descripcion = 'Crear objetos con materiales reciclados';
$recursos = 'Tijeras - Pegamento - Papel';
$identificacion_monitor = '123456789';  // Usamos la misma identificacion del monitor
$hora_actividad = '12:00:00';  // Hora de la actividad
executeStatement($stmt_actividad, [$nombre, $descripcion, $recursos, $identificacion_monitor, $hora_actividad]);

echo "Datos insertados correctamente en la tabla Actividad.<br>";

$stmt_actividad->close();

?>
