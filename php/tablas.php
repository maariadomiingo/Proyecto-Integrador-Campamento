<?php
include '../server/conectar.php';
$sql = "CREATE TABLE IF NOT EXISTS usuario(
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
?>
