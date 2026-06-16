<?php
try {
    $pdo = new PDO("sqlite:" . __DIR__ . "/../database/database.sqlite");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die("Erro na conexão: " . $e->getMessage());
}
?>
