<?php
/**
 * config/connection.php
 * Conexão PDO com SQLite — cria diretórios e inicializa o banco automaticamente.
 */

// Garante que as pastas existem com permissão de escrita
$db_dir      = __DIR__ . '/../database';
$uploads_dir = __DIR__ . '/../uploads';

if (!is_dir($db_dir))      mkdir($db_dir,      0777, true);
if (!is_dir($uploads_dir)) mkdir($uploads_dir, 0777, true);

$db_path = $db_dir . '/patinhas.sqlite';

// Se o banco não existe ainda, roda a inicialização
if (!file_exists($db_path)) {
    require_once __DIR__ . '/../database/init_db.php';
}

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("PRAGMA journal_mode=WAL;");
    $pdo->exec("PRAGMA foreign_keys=ON;");
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    die(json_encode([
        "status"   => "erro",
        "mensagem" => "Falha na conexão com o banco: " . $e->getMessage()
    ]));
}
