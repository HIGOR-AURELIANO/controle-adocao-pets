<?php
header('Content-Type: application/json');

// incluir a conexão
include("../config/connection.php");

// Captura e normaliza os dados do formulário de PET
$nome_pet         = trim($_POST["nome_pet"] ?? "");
$especie          = strtolower(trim($_POST["especie"] ?? "")); // normaliza para minúsculo
$idade_aproximada = trim($_POST["idade_aproximada"] ?? "");
$cidade           = trim($_POST["cidade"] ?? "");
$sobre            = trim($_POST["sobre"] ?? "");
$tags             = trim($_POST["tags"] ?? "");
$abrigo           = trim($_POST["abrigo"] ?? "");
$foto_nome        = null;

// Validação básica
if (empty($nome_pet) || empty($especie)) {
    echo json_encode(["status" => "erro", "mensagem" => "Nome e espécie são obrigatórios"]);
    exit;
}

try {
    // Se houver foto, mover para pasta uploads com nome único
    if (!empty($_FILES["foto"]["name"])) {
        $extensao = pathinfo($_FILES["foto"]["name"], PATHINFO_EXTENSION);
        $foto_nome = uniqid("pet_", true) . "." . $extensao;
        $destino = "../uploads/" . $foto_nome;
        move_uploaded_file($_FILES["foto"]["tmp_name"], $destino);
    }

    // Inserir no banco
    $stmt = $pdo->prepare("INSERT INTO pets 
        (nome_pet, especie, idade_aproximada, cidade, sobre, tags, foto, abrigo, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Disponível')");
    
    $ok = $stmt->execute([
        $nome_pet, $especie, $idade_aproximada, $cidade, $sobre, $tags, $foto_nome, $abrigo
    ]);

    if ($ok) {
        echo json_encode(["status" => "ok", "mensagem" => "Pet cadastrado com sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "Falha ao cadastrar pet"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "erro", "mensagem" => $e->getMessage()]);
}
