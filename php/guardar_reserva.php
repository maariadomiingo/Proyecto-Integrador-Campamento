<?php
include '../server/conectar.php';

$data = json_decode(file_get_contents("php://input"), true);
var_dump($data);

if (!empty($data['dias']) && isset($data['precio_total'])) {
    $dias = implode(",", $data['dias']);
    $precioTotal = $data['precio_total'];

    $stmt = $conexion->prepare("INSERT INTO tarifas (dias, precio) VALUES (?, ?)");
    $stmt->bind_param("si", $dias, $precioTotal);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(["success" => false, "error" => "Datos inválidos"]);
}
?>