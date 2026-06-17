<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../config/connection.php';

try {
    $stmt = $pdo->query("
        SELECT
            p.id,
            p.nome_pet,
            LOWER(p.especie)     AS especie,
            p.idade_aproximada,
            p.cidade,
            p.sobre,
            p.tags,
            p.foto,
            p.abrigo,
            p.status,
            p.adotante_id,
            a.nome_completo      AS nome_adotante
        FROM pets p
        LEFT JOIN adotante a ON p.adotante_id = a.id
        ORDER BY p.id DESC
    ");

    echo json_encode([
        "status"   => "ok",
        "mensagem" => "Lista de pets carregada",
        "dados"    => $stmt->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status"   => "erro",
        "mensagem" => "Erro ao listar pets: " . $e->getMessage(),
        "dados"    => []
    ], JSON_UNESCAPED_UNICODE);
}
