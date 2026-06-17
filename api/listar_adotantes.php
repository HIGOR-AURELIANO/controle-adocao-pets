<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../config/connection.php';

try {
    $stmt = $pdo->query("
        SELECT id, nome_completo, telefone, endereco
        FROM adotante
        ORDER BY id DESC
    ");

    echo json_encode([
        'status'   => 'ok',
        'mensagem' => 'Lista de adotantes carregada',
        'dados'    => $stmt->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status'   => 'erro',
        'mensagem' => 'Erro ao listar adotantes: ' . $e->getMessage(),
        'dados'    => []
    ], JSON_UNESCAPED_UNICODE);
}
