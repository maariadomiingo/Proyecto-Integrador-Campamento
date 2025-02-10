<?php
// Solo incluir una vez el archivo de conexión
require_once '../server/conectar.php';
// Establecer la cabecera para JSON
header('Content-Type: application/json');

// Obtener datos del cuerpo de la solicitud JSON

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$select_actividad = $data['select-actividad'] ?? '';
$select_monitor = $data['select-monitor'] ?? '';
$select_group = $data['select-group'] ?? '';

// Verificar que los campos no estén vacíos
if (!empty($select_actividad) && !empty($select_monitor) && !empty($select_group)) {

}