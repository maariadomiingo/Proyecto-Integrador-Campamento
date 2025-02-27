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
    identificacion VARCHAR(9) NOT NULL
);";
mysqli_query($conexion, $sql_usuario);

// Hash de la contraseña
$hash_coordinador = password_hash('12345678', PASSWORD_DEFAULT);
$hash_monitor = password_hash('12345678', PASSWORD_DEFAULT);

// Insertamos datos en Monitor
$query_monitor = "INSERT IGNORE INTO Monitor (nombre, identificacion, email, telefono) VALUES ('Juan Pérez', 'qwertyuio', 'juan.perez@example.com', 123456789)";
mysqli_query($conexion, $query_monitor);

// Insertamos datos en Coordinador
$query_coordinador = "INSERT IGNORE INTO Coordinador (nombre, identificacion, email, telefono) VALUES ('Maria García', '123456789', 'maria.garcia@example.com', 987654321)";
mysqli_query($conexion, $query_coordinador);

// Inserción en la tabla Usuario
$query = "INSERT INTO Usuario (nombre, password, rol, identificacion) VALUES 
    ('coordinador', '$hash_coordinador', 'coordinador', '123456789'), 
    ('monitor', '$hash_monitor', 'monitor', 'qwertyuio')";
mysqli_query($conexion, $query);

// CREACIÓN DE TABLAS 
$tables = [
    "Actividad" => "CREATE TABLE IF NOT EXISTS Actividad (
        id_actividad INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        recursos TEXT,
        hora_actividad TIME NOT NULL,
        fecha DATE NOT NULL
    );",
    "Tarifas" => "CREATE TABLE IF NOT EXISTS Tarifas (
        id_tarifa INT AUTO_INCREMENT PRIMARY KEY,
        dias TEXT NOT NULL,
        precio DECIMAL(10,2) NOT NULL
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
        telefonoEmergencia VARCHAR(15),
        id_tarifa INT,
        FOREIGN KEY (id_tarifa) REFERENCES Tarifas(id_tarifa) ON DELETE CASCADE
    );",
    "Padre" => "CREATE TABLE IF NOT EXISTS Padre (
        id_padre INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        relacion VARCHAR(50) NOT NULL,
        telefono VARCHAR(15) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        direccion VARCHAR(50),
        id_campista INT,
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );",
    "GrupoCampistas" => "CREATE TABLE IF NOT EXISTS GrupoCampistas (
        id_grupo INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        identificacion_monitor VARCHAR(9),
        id_actividad INT,
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE,
        FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE
    );",
    "GrupoCampistaRelacion" => "CREATE TABLE IF NOT EXISTS GrupoCampistaRelacion (
        id_grupo INT NOT NULL,
        id_campista INT NOT NULL,
        PRIMARY KEY (id_grupo, id_campista),
        FOREIGN KEY (id_grupo) REFERENCES GrupoCampistas(id_grupo) ON DELETE CASCADE,
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );",
    "PasarLista" => "CREATE TABLE IF NOT EXISTS PasarLista (
        id_campista INT NOT NULL,
        fecha DATE NOT NULL,
        estado ENUM('presente', 'ausente') NOT NULL,
        PRIMARY KEY (id_campista, fecha),
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );",
    "AsignarActividad" => "CREATE TABLE IF NOT EXISTS AsignarActividad (
        id_actividad INT NOT NULL,
        identificacion_monitor VARCHAR(9) NOT NULL,
        id_grupo INT NOT NULL,
        PRIMARY KEY (id_actividad, identificacion_monitor, id_grupo),
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE,
        FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE,
        FOREIGN KEY (id_grupo) REFERENCES GrupoCampistas(id_grupo) ON DELETE CASCADE
    );",

    /* "Reportes" => "CREATE TABLE IF NOT EXISTS Reportes (
        INT AUTO_INCREMENT PRIMARY KEY,
        nombreActividad VARCHAR (100) NOT NULL,
        identificacion_monitor VARCHAR (9) NOT NULL,
        id_actividad INT NOT NULL,
        descripcion VARCHAR (500) NOT NULL,
        hora_actividad TIME NOT NULL,
        fecha DATE NOT NULL,
        FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE,
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE,
        FOREIGN KEY (nombreActividad) REFERENCES Actividad(nombre) ON DELETE CASCADE,
        FOREIGN KEY (hora_actividad) REFERENCES Actividad(hora_actividad) ON DELETE CASCADE,
        FOREIGN KEY (fecha) REFERENCES Actividad(fecha) ON DELETE CASCADE,
        FOREIGN KEY (descripcion) REFERENCES Actividad(descripcion) ON DELETE CASCADE
        );",
 */
    "MedicamentosAutorizados" => "CREATE TABLE IF NOT EXISTS MedicamentosAutorizados (
        id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
        id_campista INT NOT NULL,
        medicamento VARCHAR(100) NOT NULL,
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );"
];

// Ejecutar la creación de tablas
foreach ($tables as $name => $sql) {
    if (!mysqli_query($conexion, $sql)) {
        die("Error al crear la tabla $name: " . mysqli_error($conexion));
    }
}

// FUNCIÓN SEGURA PARA INSERTAR DATOS
function executeStatement($stmt, $params)
{
    $types = str_repeat('s', count($params));
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute()) {
        die("Error al ejecutar la consulta: " . $stmt->error);
    }
}

// Insertar datos en Monitor con bind_param()
$query_monitor = "INSERT IGNORE INTO Monitor (nombre, identificacion, email, telefono) VALUES (?, ?, ?, ?)";
$stmt_monitor = $conexion->prepare($query_monitor);
if (!$stmt_monitor) die("Error en consulta de Monitor: " . $conexion->error);

// Datos del monitor
$nombre = 'Juan Pérez';
$identificacion = '123456789';
$email = 'juan.perez@example.com';
$telefono = '123456789';

// Ejecutar inserción en Monitor
executeStatement($stmt_monitor, [$nombre, $identificacion, $email, $telefono]);
$stmt_monitor->close();

// Insertar en Actividad con bind_param()
$query_actividad = "INSERT IGNORE INTO Actividad (nombre, descripcion, recursos, hora_actividad, fecha) VALUES (?, ?, ?, ?, ?)";
$stmt_actividad = $conexion->prepare($query_actividad);
if (!$stmt_actividad) die("Error en consulta de Actividad: " . $conexion->error);

// Insertar actividades
$actividades = [
    ['Pintura', 'Pintar cuadros', 'Pinturas - Lienzos', '10:00:00', '2025-02-25'],
    ['Manualidades', 'Crear objetos con reciclaje', 'Tijeras - Pegamento - Papel', '12:00:00', '2025-02-27']
];

foreach ($actividades as $actividad) {
    executeStatement($stmt_actividad, $actividad);
}
$stmt_actividad->close();
// echo "Datos insertados en la tabla Actividad.<br>";

/* INSERT INTO grupoCampistas (id_grupo, nombre, identificacion_monitor, id_actividad) 
VALUES 
(1, 'Grupo A', 'qwertyuio', 1), 
(2, 'Grupo B', 'qwertyuio', 1), 
(3, 'Grupo C', 'qwertyuio', 2), 
(4, 'Grupo D', 'qwertyuio', 2);
 */

// Insertar en GrupoCampistas con bind_param()
$query_grupo = "INSERT IGNORE INTO GrupoCampistas (id_grupo, nombre, identificacion_monitor, id_actividad) VALUES (?, ?, ?, ?)";
$stmt_grupo = $conexion->prepare($query_grupo);
if (!$stmt_grupo) die("Error en consulta de GrupoCampistas: " . $conexion->error);

// Datos para insertar
$grupos = [
    [1, 'Grupo A', 'qwertyuio', 1],
    [2, 'Grupo B', 'qwertyuio', 1],
    [3, 'Grupo C', 'qwertyuio', 2],
    [4, 'Grupo D', 'qwertyuio', 2]
];

foreach ($grupos as $grupo) {
    list($id_grupo, $nombre, $identificacion_monitor, $id_actividad) = $grupo;
    executeStatement($stmt_grupo, [$id_grupo, $nombre, $identificacion_monitor, $id_actividad]);
}

$stmt_grupo->close();
// echo "Datos insertados en la tabla GrupoCampistas.<br>";
?>