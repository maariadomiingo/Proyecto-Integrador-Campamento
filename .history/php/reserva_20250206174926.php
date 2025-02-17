<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
<?php
include '../server/conectar.php';

// Recoger los datos del formulario
$nombre = $_POST['nombre'];
$fechaNacimiento = $_POST['fecha-nacimiento'];
$direccion = $_POST['direccion'];
$historialMedico = $_POST['historial-medico'];
$restricciones = $_POST['restricciones'];
$necesidades = $_POST['necesidades'];
$nombreEmergencia = $_POST['nombre-emergencia'];
$telefonoEmergencia = $_POST['contacto-emergencia'];
$medicamentos = $_POST['medicamentos']; // Esto será un array si hay múltiples selecciones

// Insertar los datos en la tabla Campista
$sql = "INSERT INTO Campista (nombre, fechaNacimiento, direccion, historialMedicoRelevante, necesidadesEspeciales, nombreEmergencia, telefonoEmergencia) 
        VALUES ('$nombre', '$fechaNacimiento', '$direccion', '$historialMedico', '$necesidades', '$nombreEmergencia', '$telefonoEmergencia')";

if (mysqli_query($conexion, $sql)) {
    $id_campista = mysqli_insert_id($conexion); // Obtener el ID del campista recién insertado

    // Insertar los medicamentos autorizados en la tabla medicamentosAutorizados
    if (!empty($medicamentos)) {
        foreach ($medicamentos as $medicamento) {
            $sql_medicamentos = "INSERT INTO medicamentosAutorizados (id_campista, nombreCampista, paracetamol, ibuprofeno, otros) 
                                 VALUES ('$id_campista', '$nombre', 
                                         " . (in_array('Paracetamol', $medicamentos) ? "'Paracetamol'" : "NULL") . ", 
                                         " . (in_array('Ibuprofeno', $medicamentos) ? "'Ibuprofeno'" : "NULL") . ", 
                                         " . (in_array('Otros', $medicamentos) ? "'Otros'" : "NULL") . ")";
            mysqli_query($conexion, $sql_medicamentos);
        }
    }

    echo "Reserva realizada con éxito!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
}

mysqli_close($conexion);
?>