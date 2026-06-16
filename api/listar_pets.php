<?php
header('Content-Type: application/json; charset=utf-8');

include("../config/connection.php");

try {
    // Faz o JOIN para trazer o nome do adotante junto
    $stmt = $pdo->query("
        SELECT p.id, 
               p.nome_pet, 
               LOWER(p.especie) AS especie,  -- normaliza para minúsculo
               p.idade_aproximada, 
               p.cidade, 
               p.sobre, 
               p.tags, 
               p.foto, 
               p.abrigo, 
               p.status, 
               p.adotante_id,
               a.nome_completo AS nome_adotante
        FROM pets p
        LEFT JOIN adotante a ON p.adotante_id = a.id
        ORDER BY p.id DESC
    ");

    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "ok",
        "mensagem" => "Lista de pets carregada",
        "dados" => $pets
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "erro",
        "mensagem" => "Erro ao listar pets: " . $e->getMessage(),
        "dados" => []
    ]);
}
