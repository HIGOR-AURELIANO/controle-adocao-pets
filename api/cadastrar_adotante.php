<?php
header('Content-Type: application/json');

// incluir a conexão
include("../config/connection.php");

// Captura os dados do formulário de ADOTANTE
$nome_completo = $_POST["nome_completo"] ?? "";
$telefone      = $_POST["telefone"] ?? "";
$endereco      = $_POST["endereco"] ?? "";

// Validação básica
if (empty($nome_completo) || empty($telefone)) {
    echo json_encode(["status" => "erro", "mensagem" => "Nome e telefone são obrigatórios"]);
    exit;
}

try {
    // Inserir no banco
    $stmt = $pdo->prepare("INSERT INTO adotante (nome_completo, telefone, endereco) VALUES (?, ?, ?)");
    $ok = $stmt->execute([$nome_completo, $telefone, $endereco]);

    if ($ok) {
        echo json_encode(["status" => "ok", "mensagem" => "Adotante cadastrado com sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "Falha ao cadastrar adotante"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "erro", "mensagem" => $e->getMessage()]);
}
?>
