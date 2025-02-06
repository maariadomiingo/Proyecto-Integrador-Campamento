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

// Crear las tablas en el orden correcto
$tables = [
    "Campista" => "CREATE TABLE IF NOT EXISTS Campista (
        id_campista INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50),
        fechaNacimiento DATE,
        alergias TEXT,
        direccion VARCHAR (50),
        historialMedicoRelevante VARCHAR (300),
        alergias VARCHAR (200),
        necesidadesEspeciales VARCHAR (300),
        nombreEmergencia VARCHAR (50) NOT NULL,
        telefonoEmergencia INT NOT NULL,
        FOREIGN KEY (id_monitor) REFERENCES usuario(id) ON DELETE CASCADE,
/*         medicamentos autorizados del campista en una tabla a parte*/
    );",
    
    "Horario" => "CREATE TABLE IF NOT EXISTS Horario (
        id_horario INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        nombre_actividad VARCHAR(100) NOT NULL,
        hora TIME NOT NULL,
        UNIQUE KEY (fecha, hora) -- Índice compuesto para evitar problemas en claves foráneas
    );",

    "Actividad" => "CREATE TABLE IF NOT EXISTS Actividad (
        id_actividad INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        recursos TEXT,
        id_monitor INT NOT NULL,
        id_horario INT NOT NULL,
        FOREIGN KEY (id_monitor) REFERENCES usuario(id) ON DELETE CASCADE,
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
        direccion VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(15) NOT NULL,
        relacionParticipante VARCHAR(50) NOT NULL
    );",

    "Reserva" => "CREATE TABLE IF NOT EXISTS Reserva (
        id_reserva INT AUTO_INCREMENT PRIMARY KEY,
        fechaReserva DATE NOT NULL,
        precioTotal DECIMAL(10,2) NOT NULL,
        estado ENUM('pendiente', 'pagado', 'cancelado') NOT NULL,
        id_campista INT NOT NULL,
        id_padre 
        FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE
    );",

    "medicamentosAutorizados" => "CREATE TABLE IF NOT EXISTS medicamentosAutorizados (
    id_campista INT NOT NULL,
    nombreCampista VARCHAR(255) NOT NULL,
    paracetamol VARCHAR(100) NULL,
    ibuprofeno VARCHAR(100) NULL,
    otros VARCHAR (100)  NULL,
    FOREIGN KEY (id_campista) REFERENCES Campista(id_campista) ON DELETE CASCADE,
    FOREIGN KEY (nombre) REFERENCES Campista(nombre) ON DELETE CASCADE


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

mysqli_close($conexion);
?>
