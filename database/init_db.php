<?php
/**
 * init_db.php — Cria o banco SQLite e popula com dados iniciais
 */

$db_dir  = __DIR__;
$db_path = $db_dir . '/patinhas.sqlite';

// Garante permissão de escrita na pasta
if (!is_writable($db_dir)) {
    chmod($db_dir, 0777);
}

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("PRAGMA journal_mode=WAL;");
    $pdo->exec("PRAGMA foreign_keys=ON;");

    // ── Tabela de adotantes (deve ser criada antes de pets por causa da FK) ──
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS adotante (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo   TEXT    NOT NULL,
            telefone        TEXT    NOT NULL,
            endereco        TEXT,
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // ── Tabela de pets ─────────────────────────────────────────────────────
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS pets (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_pet         TEXT    NOT NULL,
            especie          TEXT    NOT NULL,
            idade_aproximada TEXT,
            cidade           TEXT,
            sobre            TEXT,
            tags             TEXT,
            foto             TEXT,
            abrigo           TEXT,
            status           TEXT    NOT NULL DEFAULT 'Disponível',
            adotante_id      INTEGER REFERENCES adotante(id),
            created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // ── Dados de exemplo (só insere se o banco estiver vazio) ──────────────
    $count = $pdo->query("SELECT COUNT(*) FROM pets")->fetchColumn();
    if ($count == 0) {
        $pdo->exec("
            INSERT INTO pets (nome_pet, especie, idade_aproximada, cidade, sobre, tags, abrigo, status) VALUES
            ('Thor',    'cachorro', '2 anos',   'Belo Horizonte', 'Muito brincalhão e ama crianças!',     'vacinado,vermifugado,dócil',          'Abrigo Esperança',  'Disponível'),
            ('Mel',     'gato',     '1 ano',    'Belo Horizonte', 'Calma, adora colo e janela.',           'castrada,vacinada,indoor',            'Lar Temporário BH', 'Disponível'),
            ('Luna',    'cachorro', '3 anos',   'Contagem',       'Golden mix, super carinhosa.',          'vacinada,grande porte,sociável',      'ONG Patinhas',      'Disponível'),
            ('Bolinha', 'cachorro', '5 meses',  'Belo Horizonte', 'Filhote energético, ama brincar.',     'filhote,vacinado,urgente',            'Abrigo Esperança',  'Disponível'),
            ('Nina',    'gato',     '4 anos',   'Belo Horizonte', 'Independente, mas muito carinhosa.',   'adulta,castrada,calma',               'Lar Temporário BH', 'Disponível')
        ");

        $pdo->exec("
            INSERT INTO adotante (nome_completo, telefone, endereco) VALUES
            ('Ana Silva',     '31999991111', 'Rua das Flores, 10 - BH'),
            ('Arthur Santos', '31999992222', 'Av. Brasil, 200 - Contagem')
        ");
    }

} catch (Exception $e) {
    // Não interrompe o carregamento da página — só loga
    error_log("Patinhas init_db error: " . $e->getMessage());
}
