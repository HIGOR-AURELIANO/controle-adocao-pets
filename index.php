
<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * index.php — Entry point do Patinhas no Replit
 * Inicializa o banco e serve o index.html
 */

// Garante que a pasta database existe e tem permissão de escrita
$db_dir = __DIR__ . '/database';
if (!is_dir($db_dir)) {
    mkdir($db_dir, 0777, true);
}

// Garante que a pasta uploads existe
$uploads_dir = __DIR__ . '/uploads';
if (!is_dir($uploads_dir)) {
    mkdir($uploads_dir, 0777, true);
}

// Inicializa o banco se ainda não existir
$db_path = $db_dir . '/patinhas.sqlite';
if (!file_exists($db_path)) {
    require_once __DIR__ . '/database/init_db.php';
}

// Serve o HTML
readfile(__DIR__ . '/index.html');
