<?php
// Solo incluir una vez el archivo de conexión
require_once '../server/conectar.php';

// Establecer la cabecera para JSON
header('Content-Type: application/json');

// Obtener datos del cuerpo de la solicitud JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);