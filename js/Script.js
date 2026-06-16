/* ─────────────────────────────────────────
PATINHAS — Marketplace de Adoção de Pets
Script.js (com filtros, busca, adoção e favoritos)
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── Favoritar pet (coração animado) ───────
  window.toggleHeart = function(btn) {
    const isLiked = btn.textContent.trim() === '❤️';
    btn.textContent = isLiked ? '🤍' : '❤️';
    btn.classList.add('liked');
    setTimeout(() => btn.classList.remove('liked'), 400);
  };

  // ── Carregar adotantes para select global ─
  async function carregarAdotantesSelectGlobal() {
    try {
      const resposta = await fetch("api/listar_adotantes.php", { cache: "no-store" });
      const resultado = await resposta.json();
      const adotantes = resultado.dados || [];
      const select = document.getElementById("select-adotante");
      if (!select) return;
      select.innerHTML = "<option value=''>Selecione o adotante</option>";
      adotantes.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.textContent = `${a.nome_completo} - ${a.telefone}`;
        select.appendChild(opt);
      });
    } catch (err) {
      console.error("Erro ao carregar adotantes:", err);
    }
  }

  // ── Carregar pets para select global ──────
  async function carregarPetsSelectGlobal() {
    try {
      const resposta = await fetch("api/listar_pets.php", { cache: "no-store" });
      const resultado = await resposta.json();
      const pets = resultado.dados || [];
      const select = document.getElementById("select-pet");
      if (!select) return;
      select.innerHTML = "<option value=''>Selecione o pet</option>";
      pets.filter(p => p.status === "Disponível").forEach(pet => {
        const opt = document.createElement("option");
        opt.value = pet.id;
        opt.textContent = `${pet.nome_pet} (${pet.especie})`;
        select.appendChild(opt);
      });
    } catch (err) {
      console.error("Erro ao carregar pets:", err);
    }
  }

  // ── Função para abrir formulário de adoção ─
  function abrirFormularioAdocao(petId) {
    const formSection = document.getElementById("adocao-pet");
    const selectPet = document.getElementById("select-pet");
    if (formSection && selectPet) {
      formSection.scrollIntoView({ behavior: "smooth" });
      selectPet.value = petId;
    }
  }

  // ── Carregar pets dinamicamente ───────────
  async function carregarPets(filtro = "", busca = "") {
    try {
      const resposta = await fetch("api/listar_pets.php", { cache: "no-store" });
      const resultado = await resposta.json();
      const pets = resultado.dados || [];
      const disponiveisDiv = document.getElementById("pets-disponiveis");
      const adotadosDiv = document.getElementById("pets-adotados");
      disponiveisDiv.innerHTML = "";
      adotadosDiv.innerHTML = "";

      pets
        .filter(pet => {
          const especie = pet.especie.toLowerCase();
          const nome = pet.nome_pet.toLowerCase();
          const cidade = pet.cidade.toLowerCase();

          if (filtro && especie !== filtro) return false;
          if (busca && !(nome.includes(busca) || especie.includes(busca) || cidade.includes(busca))) return false;
          return true;
        })
        .forEach(pet => {
          const card = document.createElement("div");
          card.className = "pet-card";
          card.setAttribute("data-pet-id", pet.id);
          card.innerHTML = `
            <div class="pet-image">
              ${pet.foto ? `<img src="uploads/${pet.foto}" alt="${pet.nome_pet}">` : "🐾"}
              <button class="heart-btn" onclick="toggleHeart(this)">🤍</button>
            </div>
            <div class="pet-info">
              <div class="pet-header">
                <div>
                  <div class="pet-name">${pet.nome_pet}</div>
                  <div class="pet-breed">${pet.especie}</div>
                </div>
                <span class="pet-age">${pet.idade_aproximada || ""}</span>
              </div>
              ${pet.tags ? `<div class="pet-tags">${pet.tags.split(',').map(tag => `<span class="pet-tag">${tag.trim()}</span>`).join('')}</div>` : ""}
              <div class="pet-location">${pet.cidade || ""}</div>
              <p>${pet.sobre || ""}</p>
              ${pet.status === "Adotado" && pet.nome_adotante ? `<p class="pet-adotante"><strong>Adotante:</strong> ${pet.nome_adotante}</p>` : ""}
            </div>
            <div class="pet-footer">
              <div class="pet-abrigo"><strong>${pet.abrigo || "Abrigo"}</strong></div>
            </div>
          `;
          if (pet.status === "Disponível") {
            disponiveisDiv.appendChild(card);
          } else {
            adotadosDiv.appendChild(card);
          }
        });

      // evento de clique nos cards disponíveis
      document.querySelectorAll("#pets-disponiveis .pet-card").forEach(card => {
        card.addEventListener("click", () => abrirFormularioAdocao(card.getAttribute("data-pet-id")));
      });

    } catch (err) {
      console.error("Erro ao carregar pets:", err);
    }
  }

  // ── Conectar filtros de categoria ─────────
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      const alreadySelected = card.classList.contains("selected");
      document.querySelectorAll(".category-card").forEach(c => c.classList.remove("selected"));

      let filtro = "";
      if (!alreadySelected) {
        card.classList.add("selected");
        filtro = card.querySelector(".category-name").textContent.trim().toLowerCase();
        if (filtro === "gatos") filtro = "gato";
        if (filtro === "cachorros") filtro = "cachorro";
      }

      carregarPets(filtro);
    });
  });

  // ── Conectar barra de busca ───────────────
  const searchInput = document.querySelector(".search-bar input");
  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const busca = searchInput.value.trim().toLowerCase();
      carregarPets("", busca);
    });
  }

  // ── Cadastro de pet ───────────
  const formCadastrar = document.getElementById("form-cadastrar");
  if (formCadastrar) {
    formCadastrar.addEventListener("submit", async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      try {
        const resposta = await fetch("api/cadastrar_pet.php", {
          method: "POST",
          body: formData,
          cache: "no-store"
        });
        const resultado = await resposta.json();
        if (resultado.status === "ok") {
          alert("Pet cadastrado com sucesso!");
          carregarPets("", ""); // força reset de filtros e busca
          carregarPetsSelectGlobal();
          this.reset();
        } else {
          alert("Erro ao cadastrar pet: " + resultado.mensagem);
        }
      } catch (err) {
        console.error("Erro ao enviar formulário:", err);
        alert("Erro de conexão ao cadastrar pet.");
      }
    });
  }

  // ── Inicialização ─────────────────────────
  carregarPets();
  carregarPetsSelectGlobal();
  carregarAdotantesSelectGlobal();

});
