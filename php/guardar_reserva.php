<?php
include '../server/conectar.php';

session_start(); // Asegúrate de iniciar sesión aquí para guardar los datos en la sesión.

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['dias']) && isset($data['precio_total'])) {
    $dias = implode(",", $data['dias']);
    $precioTotal = $data['precio_total'];

    $stmt = $conexion->prepare("INSERT INTO tarifas (dias, precio) VALUES (?, ?)");
    $stmt->bind_param("si", $dias, $precioTotal);

    if ($stmt->execute()) {
        // Obtener el id_tarifa generado
        $id_tarifa = $stmt->insert_id;
        
        // Guardar el id_tarifa en la sesión
        $_SESSION['id_tarifa'] = $id_tarifa;

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
