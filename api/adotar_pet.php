<?php
header('Content-Type: application/json; charset=utf-8');

include("../config/connection.php");

// Captura os dados enviados
$pet_id = $_POST["pet_id"] ?? null;
$adotante_id = $_POST["adotante_id"] ?? null;

if (!$pet_id || !$adotante_id) {
    echo json_encode([
        "status" => "erro",
        "mensagem" => "Pet e Adotante são obrigatórios"
    ]);
    exit;
}

try {
    // Atualiza o status do pet e vincula ao adotante
    $stmt = $pdo->prepare("
        UPDATE pets 
        SET status = 'Adotado', adotante_id = :adotante 
        WHERE id = :pet
    ");
    $ok = $stmt->execute([
        ':adotante' => $adotante_id,
        ':pet' => $pet_id
    ]);

    if ($ok) {
        echo json_encode([
            "status" => "ok",
            "mensagem" => "Pet adotado com sucesso!"
        ]);
    } else {
        echo json_encode([
            "status" => "erro",
            "mensagem" => "Falha ao atualizar pet"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "erro",
        "mensagem" => "Erro ao adotar pet: " . $e->getMessage()
    ]);
}
