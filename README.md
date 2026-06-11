# 🐾 Controle de Adoção de Pets (ONG)

> Trabalho acadêmico desenvolvido para a **Faculdade Estácio de Sá** pelo **Grupo 6**.

O projeto consiste em um sistema para uma ONG de proteção animal gerenciar os pets disponíveis para adoção e registrar as informações dos adotantes interessados, permitindo o vínculo direto entre eles.

---

## 🛠️ Ecossistema Tecnológico

Para garantir que o sistema funcione perfeitamente no ambiente online, utilizamos a seguinte pilha tecnológica integrada:

| Camada | Tecnologia | Papel no Sistema |
| :--- | :--- | :--- |
| **Apresentação (Interface)** | HTML5 & CSS3 | Estruturação semântica das páginas e estilização responsiva (layouts fluidos e amigáveis). |
| **Interação (Cliente)** | JavaScript (DOM & Fetch) | Captura de eventos, validação de formulários no cliente e requisições assíncronas (AJAX) para o servidor. |
| **Negócio (Servidor)** | PHP 8 | Processamento das requisições HTTP, lógica de negócios, geração de respostas JSON e comunicação com o banco de dados. |
| **Persistência (Dados)** | SQLite | Banco de dados relacional leve baseado em arquivo local (sem necessidade de configurar servidores externos). |

---

## 🗄️ Estrutura do Banco de Dados (Mínima)

O sistema utiliza o banco de dados relacional **SQLite** com a seguinte modelagem:

### Tabela: `ADOTANTE`
* `id` (INTEGER, PK, AI)
* `nome_completo` (VARCHAR)
* `telefone` (VARCHAR)
* `endereco` (TEXT)

### Tabela: `PET`
* `id` (INTEGER, PK, AI)
* `nome_pet` (VARCHAR)
* `especie` (VARCHAR) - *Valores aceitos: Cão/Gato*
* `idade_aproximada` (INTEGER)
* `status` (VARCHAR) - *Valores aceitos: Disponível/Adotado*
* `adotante_id` (INTEGER, FK apontando para `ADOTANTE(id)`, aceita `NULL`)

---

## 🎯 Funcionalidades da Interface

- [ ] **Cadastro de Adotantes:** Cadastro de pessoas interessadas em adotar.
- [ ] **Cadastro de Pets:** Cadastro de pets resgatados (inicialmente com status "Disponível" e `adotante_id` nulo).
- [ ] **Painel de Adoção:** Interface para selecionar um pet e vinculá-lo a um adotante cadastrado, alterando automaticamente seu status para "Adotado".
- [ ] **Listagem Dinâmica:** Separação visual entre pets "Disponíveis" e "Adotados", exibindo o nome do adotante quando aplicável.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* PHP 8.0 ou superior instalado na máquina.
* Extensão do SQLite ativa no seu PHP.

### Passo a Passo
1. Clone este repositório:
   ```bash
   git clone [https://github.com/Anbuyyy9/controle-adocao-pets.git]
   
Sistema de controle de adoção de pets para ONG. Trabalho acadêmico desenvolvido para a Estácio de Sá - Grupo 6

## 👥 Integrantes (Grupo 6)

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Anbuyyy9">
        <img src="https://github.com/Anbuyyy9.png" width="100px;" alt="Foto do Gabriel Anthony"/><br />
        <sub><b>Gabriel Anthony</b></sub>
      </a><br />
      <a href="https://www.linkedin.com/in/gabriel-anthony-ab92211b5/" target="_blank">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
      </a>
    </td>
  </tr>
</table>


