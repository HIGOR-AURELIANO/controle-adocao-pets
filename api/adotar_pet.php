<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../config/connection.php';

$pet_id      = $_POST['pet_id']      ?? null;
$adotante_id = $_POST['adotante_id'] ?? null;

if (!$pet_id || !$adotante_id) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Pet e Adotante são obrigatórios'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $check = $pdo->prepare("SELECT status FROM pets WHERE id = ?");
    $check->execute([$pet_id]);
    $pet = $check->fetch();

    if (!$pet) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Pet não encontrado'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($pet['status'] !== 'Disponível') {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Este pet já foi adotado'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE pets
        SET status = 'Adotado', adotante_id = ?
        WHERE id = ?
    ");
    $stmt->execute([$adotante_id, $pet_id]);

    echo json_encode([
        'status'   => 'ok',
        'mensagem' => 'Pet adotado com sucesso! 🐾'
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao adotar pet: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
