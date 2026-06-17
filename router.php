<?php
/**
 * router.php — PHP built-in server router
 * Garante que: index.html → index.php, arquivos estáticos são servidos diretamente,
 * e as rotas /api/ e /uploads/ funcionam corretamente.
 */

$uri = $_SERVER['REQUEST_URI'];

// Remove query string da URI
$path = parse_url($uri, PHP_URL_PATH);

// Caminho real no sistema de arquivos
$file = __DIR__ . $path;

// Se for um arquivo estático existente (css, js, img, uploads), serve diretamente
if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // PHP built-in server serve o arquivo
}

// Se for a raiz, inicializa o banco e serve o HTML
if ($path === '/' || $path === '/index.html' || $path === '/index.php') {
    // Garante que as pastas existem
    $db_dir      = __DIR__ . '/database';
    $uploads_dir = __DIR__ . '/uploads';
    if (!is_dir($db_dir))      mkdir($db_dir,      0777, true);
    if (!is_dir($uploads_dir)) mkdir($uploads_dir, 0777, true);

    // Inicializa o banco se necessário
    $db_path = $db_dir . '/patinhas.sqlite';
    if (!file_exists($db_path)) {
        require_once __DIR__ . '/database/init_db.php';
    }

    readfile(__DIR__ . '/index.html');
    return true;
}

// Qualquer outra rota (incluindo /api/) — deixa o PHP resolver
return false;
