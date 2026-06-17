# 🐾 Patinhas — Sistema de Adoção de Pets

Sistema web de adoção de pets com PHP + SQLite, pronto para rodar no Replit.

## 🚀 Como rodar no Replit

### 1. Crie o Repl
- Acesse [replit.com](https://replit.com) e crie um novo Repl
- Escolha o template **PHP Web Server**
- Faça upload de todos os arquivos desta pasta (ou importe pelo GitHub)

### 2. Rode direto
Clique em **Run** — o banco SQLite é criado automaticamente na primeira execução.

O arquivo `.replit` já configura tudo:
```
php -S 0.0.0.0:8080 -t .
```

### 3. Estrutura do projeto
```
patinhas/
├── .replit                  ← config do Replit
├── index.html               ← frontend principal
├── config/
│   └── connection.php       ← conexão PDO (auto-init do banco)
├── database/
│   ├── init_db.php          ← cria tabelas e dados iniciais
│   └── patinhas.sqlite      ← banco gerado automaticamente
├── api/
│   ├── listar_pets.php      ← GET lista de pets
│   ├── cadastrar_pet.php    ← POST novo pet (c/ upload de foto)
│   ├── listar_adotantes.php ← GET lista de adotantes
│   ├── cadastrar_adotante.php ← POST novo adotante
│   └── adotar_pet.php       ← POST vincular pet ao adotante
├── css/
│   └── style.css
├── js/
│   └── Script.js
└── uploads/                 ← fotos dos pets (criado automaticamente)
```

## 🗄️ Banco de Dados

O projeto usa **SQLite** (sem instalação extra). O banco é criado automaticamente
em `database/patinhas.sqlite` quando a aplicação é iniciada pela primeira vez.

### Tabelas
| Tabela     | Descrição                              |
|------------|----------------------------------------|
| `pets`     | Pets disponíveis e adotados            |
| `adotante` | Pessoas cadastradas para adoção        |

### Fluxo
1. Abrigo **cadastra o pet** (formulário + foto)
2. Pessoa **se cadastra como adotante**
3. Sistema **vincula pet ao adotante** e atualiza status para "Adotado"

## 🔌 Endpoints da API

| Método | Endpoint                     | Ação                        |
|--------|------------------------------|-----------------------------|
| GET    | `api/listar_pets.php`        | Lista todos os pets         |
| POST   | `api/cadastrar_pet.php`      | Cadastra novo pet + foto    |
| GET    | `api/listar_adotantes.php`   | Lista adotantes             |
| POST   | `api/cadastrar_adotante.php` | Cadastra novo adotante      |
| POST   | `api/adotar_pet.php`         | Processa adoção             |

## ⚠️ Diferença do projeto original

O projeto original usava nomes de tabelas inconsistentes (`animals`/`users` no
schema.sql vs `pets`/`adotante` nas queries PHP). Este projeto padronizou tudo
nas tabelas `pets` e `adotante`, que é o que o frontend já esperava.
