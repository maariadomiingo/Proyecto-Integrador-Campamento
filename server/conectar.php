<?php
    // Establecemos la conexión con BD:
    $servidor = "localhost";
    $usuario = "root";
    $password = "";
    $db = "campamentos";

    $conexion = mysqli_connect($servidor, $usuario, $password);

    // Comprobamos que la BD exista.
    $sql = "SHOW DATABASES LIKE '$db'";
    $query = mysqli_query($conexion, $sql) or die("Error al crear base de datos");
    
    if (mysqli_fetch_array($query) <= 0) {
        // Creamos la base de datos si no existe
        $sql = "CREATE DATABASE $db";
        if (mysqli_query($conexion, $sql)){
            mysqli_select_db($conexion, $db);
            // require_once "../php/login.php";
            require_once "../php/tablas.php";
        } else {
            echo "Error al crear la base de datos: ". mysqli_error($conexion);
        }
    } else {
        mysqli_select_db($conexion, $db);
    }

  
        
        
    
