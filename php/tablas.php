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

    "Reportes" => "CREATE TABLE IF NOT EXISTS Reportes (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    id_actividad INT NOT NULL,
    identificacion_monitor VARCHAR(9) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE,
    FOREIGN KEY (identificacion_monitor) REFERENCES Monitor(identificacion) ON DELETE CASCADE
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

// Preparar la consulta para insertar en la tabla Monitor
$query_monitor = "INSERT IGNORE INTO Monitor (nombre, identificacion, email, telefono) VALUES (?, ?, ?, ?)";
$stmt_monitor = $conexion->prepare($query_monitor);
if (!$stmt_monitor) die("Error en consulta de Monitor: " . $conexion->error);

// Datos del primer monitor
$nombre = 'Juan Pérez';
$identificacion = 'qwertyuio';
$email = 'juan.perez@example.com';
$telefono = '123456789';

// Ejecutar inserción del primer monitor
executeStatement($stmt_monitor, [$nombre, $identificacion, $email, $telefono]);

// Insertar dos monitores adicionales
$monitores_adicionales = [
    ['Carlos López', 'asdfghjkl', 'carlos.lopez@example.com', 987654321],
    ['Ana Martínez', 'zxcvbnmñ', 'ana.martinez@example.com', 123789456]
];

foreach ($monitores_adicionales as $monitor) {
    list($nombre, $identificacion, $email, $telefono) = $monitor;
    // Preparar la declaración nuevamente para cada iteración
    $stmt_monitor = $conexion->prepare($query_monitor);
    if (!$stmt_monitor) die("Error en consulta de Monitor: " . $conexion->error);
    executeStatement($stmt_monitor, [$nombre, $identificacion, $email, $telefono]);
    $stmt_monitor->close(); // Cerrar la declaración después de usarla
}

// Insertar usuarios para los monitores adicionales
$usuarios_monitores = [
    ['carlos.lopez', password_hash('12345678', PASSWORD_DEFAULT), 'monitor', 'asdfghjkl'],
    ['ana.martinez', password_hash('12345678', PASSWORD_DEFAULT), 'monitor', 'zxcvbnmñ']
];

foreach ($usuarios_monitores as $usuario) {
    list($nombre_usuario, $hash_password, $rol, $identificacion) = $usuario;
    $query_usuario = "INSERT INTO Usuario (nombre, password, rol, identificacion) VALUES (?, ?, ?, ?)";
    $stmt_usuario = $conexion->prepare($query_usuario);
    if (!$stmt_usuario) die("Error en consulta de Usuario: " . $conexion->error);
    executeStatement($stmt_usuario, [$nombre_usuario, $hash_password, $rol, $identificacion]);
    $stmt_usuario->close(); // Cerrar la declaración después de usarla
}
// Insertar en Actividad con bind_param()
$query_actividad = "INSERT IGNORE INTO Actividad (nombre, descripcion, recursos, hora_actividad, fecha) VALUES (?, ?, ?, ?, ?)";
$stmt_actividad = $conexion->prepare($query_actividad);
if (!$stmt_actividad) die("Error en consulta de Actividad: " . $conexion->error);

// Insertar 5 actividades
$actividades = [
    ['Pintura', 'Pintar cuadros', 'Pinturas - Lienzos', '10:00:00', '2025-03-08'],
    ['Manualidades', 'Crear objetos con reciclaje', 'Tijeras - Pegamento - Papel', '12:00:00', '2025-03-18'],
    ['Deportes', 'Partido de fútbol', 'Pelotas - Conos', '14:00:00', '2025-03-13'],
    ['Teatro', 'Representación de obras teatrales', 'Disfraces - Guiones', '16:00:00', '2025-03-20'],
    ['Cocina', 'Preparar postres', 'Harina - Azúcar - Horno', '18:00:00', '2025-03-21']
];

foreach ($actividades as $actividad) {
    executeStatement($stmt_actividad, $actividad);
}
$stmt_actividad->close();

// Insertar tarifas
$query_tarifa = "INSERT IGNORE INTO Tarifas (dias, precio) VALUES (?, ?)";
$stmt_tarifa = $conexion->prepare($query_tarifa);
if (!$stmt_tarifa) die("Error en consulta de Tarifas: " . $conexion->error);

// Insertar 5 tarifas
$tarifas = [
    ['7 días', 100.00],
    ['10 días', 150.00],
    ['14 días', 200.00],
    ['5 días', 80.00],
    ['15 días', 220.00]
];

foreach ($tarifas as $tarifa) {
    executeStatement($stmt_tarifa, $tarifa);
}
$stmt_tarifa->close();

// Insertar 5 campistas
$query_campista = "INSERT IGNORE INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, alergias, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia, id_tarifa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt_campista = $conexion->prepare($query_campista);
if (!$stmt_campista) die("Error en consulta de Campista: " . $conexion->error);

// Insertar 5 campistas
$campistas = [
    ['Ana Pérez', '2010-05-12', 'Calle Ficticia 123', 'Sin historial relevante', 'Ninguna', 'Ninguna', 'Carlos Pérez', '654321987', 1],
    ['Luis Gómez', '2010-06-15', 'Avenida Real 456', 'Alergia al polen', 'Ninguna', 'No tiene necesidades especiales', 'María Gómez', '654987123', 2],
    ['Laura Fernández', '2010-07-22', 'Calle Ejemplo 789', 'Asma', 'Alergia a los frutos secos', 'Usa gafas', 'José Fernández', '654321654', 3],
    ['Carlos Martínez', '2010-08-30', 'Plaza Mayor 101', 'Sin historial relevante', 'No tiene alergias', 'No tiene necesidades especiales', 'Laura Martínez', '654789456', 4],
    ['Elena Ruiz', '2010-09-05', 'Calle Sol 202', 'Alergia a los gatos', 'Alergia al polen', 'Usa audífono', 'Juan Ruiz', '654123789', 5]
];

foreach ($campistas as $campista) {
    executeStatement($stmt_campista, $campista);
}
$stmt_campista->close();

// Insertar 5 padres
$query_padre = "INSERT IGNORE INTO Padre (nombre, relacion, telefono, email, direccion, id_campista) VALUES (?, ?, ?, ?, ?, ?)";
$stmt_padre = $conexion->prepare($query_padre);
if (!$stmt_padre) die("Error en consulta de Padre: " . $conexion->error);

// Insertar padres para los campistas
$padres = [
    ['Carlos Pérez', 'Padre', '654321987', 'carlos.perez@example.com', 'Calle Ficticia 123', 1],
    ['María Gómez', 'Madre', '654987123', 'maria.gomez@example.com', 'Avenida Real 456', 2],
    ['José Fernández', 'Padre', '654321654', 'jose.fernandez@example.com', 'Calle Ejemplo 789', 3],
    ['Laura Martínez', 'Madre', '654789456', 'laura.martinez@example.com', 'Plaza Mayor 101', 4],
    ['Juan Ruiz', 'Padre', '654123789', 'juan.ruiz@example.com', 'Calle Sol 202', 5]
];

foreach ($padres as $padre) {
    executeStatement($stmt_padre, $padre);
}
$stmt_padre->close();

// Insertar 5 grupos
$query_grupo = "INSERT IGNORE INTO GrupoCampistas (id_grupo, nombre, identificacion_monitor, id_actividad) VALUES (?, ?, ?, ?)";
$stmt_grupo = $conexion->prepare($query_grupo);
if (!$stmt_grupo) die("Error en consulta de GrupoCampistas: " . $conexion->error);

// Insertar 5 grupos
$grupos = [
    [1, 'Grupo A', 'qwertyuio', 1],
    [2, 'Grupo B', 'qwertyuio', 2],
    [3, 'Grupo C', 'qwertyuio', 3],
    [4, 'Grupo D', 'qwertyuio', 4],
    [5, 'Grupo E', 'qwertyuio', 5]
];

foreach ($grupos as $grupo) {
    list($id_grupo, $nombre, $identificacion_monitor, $id_actividad) = $grupo;
    executeStatement($stmt_grupo, [$id_grupo, $nombre, $identificacion_monitor, $id_actividad]);
}

$stmt_grupo->close();

// Insertar reportes
$query_reportes = "INSERT INTO Reportes (id_actividad, identificacion_monitor, descripcion, fecha_reporte) VALUES (?, ?, ?, ?)";
$stmt_reportes = $conexion->prepare($query_reportes);
if (!$stmt_reportes) die("Error en consulta de Reportes: " . $conexion->error);

// Reportes para algunas actividades
$reportes = [
    [1, 'qwertyuio', 'Los campistas mostraron gran creatividad en la actividad de pintura. Utilizaron diferentes técnicas y colores para crear hermosas obras.', '2023-01-01'],
    [3, 'qwertyuio', 'El partido de fútbol fue muy intenso. Los campistas mostraron buen equipo y espíritu deportivo.', '2023-03-01'],
    [5, 'qwertyuio', 'La actividad de cocina resultó deliciosa. Los campistas prepararon postres ricos y decorativos.', '2023-03-03']
];

foreach ($reportes as $reporte) {
    executeStatement($stmt_reportes, $reporte);
}
$stmt_reportes->close();

// Insertar en AsignarActividad
$query_asignar_actividad = "INSERT IGNORE INTO AsignarActividad (id_actividad, identificacion_monitor, id_grupo) VALUES (?, ?, ?)";
$stmt_asignar_actividad = $conexion->prepare($query_asignar_actividad);
if (!$stmt_asignar_actividad) die("Error en consulta de AsignarActividad: " . $conexion->error);

// Ejemplo de inserción de actividades asignadas al monitor 'qwertyuio'
$asignaciones = [
    [1, 'qwertyuio', 1],  // Actividad 1 - Grupo 1
    [2, 'qwertyuio', 2],  // Actividad 2 - Grupo 2
    [3, 'qwertyuio', 3],  // Actividad 3 - Grupo 3
    [4, 'qwertyuio', 4],  // Actividad 4 - Grupo 4
    [5, 'qwertyuio', 5],  // Actividad 5 - Grupo 5
];

foreach ($asignaciones as $asignacion) {
    executeStatement($stmt_asignar_actividad, $asignacion);
}
$stmt_asignar_actividad->close();

// Cerrar conexión
mysqli_close($conexion);
?>