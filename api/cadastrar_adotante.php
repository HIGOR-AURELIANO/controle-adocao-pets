<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../config/connection.php';

$nome_completo = trim($_POST['nome_completo'] ?? '');
$telefone      = trim($_POST['telefone']      ?? '');
$endereco      = trim($_POST['endereco']      ?? '');

if (empty($nome_completo) || empty($telefone)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Nome e telefone são obrigatórios'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO adotante (nome_completo, telefone, endereco)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$nome_completo, $telefone, $endereco]);

    echo json_encode([
        'status'   => 'ok',
        'mensagem' => 'Adotante cadastrado com sucesso!',
        'id'       => $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
