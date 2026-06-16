<?php
header('Content-Type: application/json; charset=utf-8');

include("../config/connection.php");

try {
    // Consulta todos os adotantes
    $stmt = $pdo->query("
        SELECT id, 
               nome_completo, 
               telefone, 
               endereco
        FROM adotante
        ORDER BY id DESC
    ");

    $adotantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "ok",
        "mensagem" => "Lista de adotantes carregada",
        "dados" => $adotantes
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "erro",
        "mensagem" => "Erro ao listar adotantes: " . $e->getMessage(),
        "dados" => []
    ]);
}
