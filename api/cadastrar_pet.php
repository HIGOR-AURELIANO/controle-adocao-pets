<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../config/connection.php';

$nome_pet         = trim($_POST['nome_pet']         ?? '');
$especie          = strtolower(trim($_POST['especie']          ?? ''));
$idade_aproximada = trim($_POST['idade_aproximada'] ?? '');
$cidade           = trim($_POST['cidade']           ?? '');
$sobre            = trim($_POST['sobre']            ?? '');
$tags             = trim($_POST['tags']             ?? '');
$abrigo           = trim($_POST['abrigo']           ?? '');

if (empty($nome_pet) || empty($especie)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Nome e espécie são obrigatórios'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // ── Upload de foto (opcional) ───────────────────────────────────────
    $foto_nome = null;

    if (
        !empty($_FILES['foto']['name']) &&
        isset($_FILES['foto']['error']) &&
        $_FILES['foto']['error'] === UPLOAD_ERR_OK
    ) {
        $ext_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $ext            = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, $ext_permitidas)) {
            echo json_encode(['status' => 'erro', 'mensagem' => 'Formato inválido. Use JPG, PNG, GIF ou WEBP.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $foto_nome = uniqid('pet_', true) . '.' . $ext;
        $destino   = __DIR__ . '/../uploads/' . $foto_nome;

        if (!move_uploaded_file($_FILES['foto']['tmp_name'], $destino)) {
            // Falha no upload não deve impedir o cadastro — só ignora a foto
            error_log("Patinhas: falha ao mover foto para $destino");
            $foto_nome = null;
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO pets (nome_pet, especie, idade_aproximada, cidade, sobre, tags, foto, abrigo, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Disponível')
    ");
    $stmt->execute([$nome_pet, $especie, $idade_aproximada, $cidade, $sobre, $tags, $foto_nome, $abrigo]);

    echo json_encode([
        'status'   => 'ok',
        'mensagem' => 'Pet cadastrado com sucesso!',
        'id'       => $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
