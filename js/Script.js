/* ─────────────────────────────────────────
   PATINHAS — Marketplace de Adoção de Pets
   Script.js
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── Favoritar pet (coração animado) ───────
  window.toggleHeart = function(btn) {
    const isLiked = btn.textContent.trim() === '❤️';
    btn.textContent = isLiked ? '🤍' : '❤️';
    btn.classList.add('liked');
    setTimeout(() => btn.classList.remove('liked'), 400);
  };

  // ── Carregar adotantes para o <select> ────
  async function carregarAdotantesSelectGlobal() {
    try {
      const res      = await fetch('api/listar_adotantes.php', { cache: 'no-store' });
      const resultado = await res.json();
      const select   = document.getElementById('select-adotante');
      if (!select) return;

      select.innerHTML = "<option value=''>Selecione o adotante</option>";
      (resultado.dados || []).forEach(a => {
        const opt = document.createElement('option');
        opt.value       = a.id;
        opt.textContent = `${a.nome_completo} — ${a.telefone}`;
        select.appendChild(opt);
      });
    } catch (err) {
      console.error('Erro ao carregar adotantes:', err);
    }
  }

  // ── Carregar pets disponíveis para o <select> ──
  async function carregarPetsSelectGlobal() {
    try {
      const res      = await fetch('api/listar_pets.php', { cache: 'no-store' });
      const resultado = await res.json();
      const select   = document.getElementById('select-pet');
      if (!select) return;

      select.innerHTML = "<option value=''>Selecione o pet</option>";
      (resultado.dados || [])
        .filter(p => p.status === 'Disponível')
        .forEach(pet => {
          const opt = document.createElement('option');
          opt.value       = pet.id;
          opt.textContent = `${pet.nome_pet} (${pet.especie})`;
          select.appendChild(opt);
        });
    } catch (err) {
      console.error('Erro ao carregar pets no select:', err);
    }
  }

  // ── Abre formulário de adoção pré-selecionando o pet ──
  function abrirFormularioAdocao(petId) {
    const formSection = document.getElementById('adocao-pet');
    const selectPet   = document.getElementById('select-pet');
    if (formSection && selectPet) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      selectPet.value = petId;
    }
  }

  // ── Renderiza os cards de pets ─────────────
  async function carregarPets(filtro = '', busca = '') {
    try {
      const res      = await fetch('api/listar_pets.php', { cache: 'no-store' });
      const resultado = await res.json();
      const pets     = resultado.dados || [];

      const disponiveisDiv = document.getElementById('pets-disponiveis');
      const adotadosDiv    = document.getElementById('pets-adotados');
      if (!disponiveisDiv || !adotadosDiv) return;

      disponiveisDiv.innerHTML = '';
      adotadosDiv.innerHTML    = '';

      const petsFiltrados = pets.filter(pet => {
        const especie = (pet.especie || '').toLowerCase();
        const nome    = (pet.nome_pet || '').toLowerCase();
        const cidade  = (pet.cidade   || '').toLowerCase();

        if (filtro && especie !== filtro) return false;
        if (busca  && !(nome.includes(busca) || especie.includes(busca) || cidade.includes(busca))) return false;
        return true;
      });

      if (petsFiltrados.length === 0) {
        disponiveisDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888">Nenhum pet encontrado 🐾</p>';
        return;
      }

      petsFiltrados.forEach(pet => {
        const card = document.createElement('div');
        card.className = 'pet-card';
        card.setAttribute('data-pet-id', pet.id);

        const fotoHTML = pet.foto
          ? `<img src="uploads/${pet.foto}" alt="${pet.nome_pet}">`
          : `<div style="font-size:3rem;text-align:center;padding:1rem">🐾</div>`;

        const tagsHTML = pet.tags
          ? pet.tags.split(',').map(t => `<span class="pet-tag">${t.trim()}</span>`).join('')
          : '';

        const adotanteHTML = (pet.status === 'Adotado' && pet.nome_adotante)
          ? `<p class="pet-adotante"><strong>Adotante:</strong> ${pet.nome_adotante}</p>`
          : '';

        const badgeHTML = pet.status === 'Adotado'
          ? `<span class="badge-adotado">Adotado ✓</span>`
          : '';

        card.innerHTML = `
          <div class="pet-image">
            ${fotoHTML}
            <button class="heart-btn" onclick="toggleHeart(this)">🤍</button>
            ${badgeHTML}
          </div>
          <div class="pet-info">
            <div class="pet-header">
              <div>
                <div class="pet-name">${pet.nome_pet}</div>
                <div class="pet-breed">${pet.especie}</div>
              </div>
              <span class="pet-age">${pet.idade_aproximada || ''}</span>
            </div>
            ${tagsHTML ? `<div class="pet-tags">${tagsHTML}</div>` : ''}
            <div class="pet-location">📍 ${pet.cidade || ''}</div>
            <p>${pet.sobre || ''}</p>
            ${adotanteHTML}
          </div>
          <div class="pet-footer">
            <div class="pet-abrigo"><strong>${pet.abrigo || 'Abrigo'}</strong></div>
          </div>
        `;

        if (pet.status === 'Disponível') {
          card.addEventListener('click', () => abrirFormularioAdocao(pet.id));
          disponiveisDiv.appendChild(card);
        } else {
          adotadosDiv.appendChild(card);
        }
      });

    } catch (err) {
      console.error('Erro ao carregar pets:', err);
    }
  }

  // ── Filtros de categoria (Cachorros / Gatos) ──
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const jaSelecionado = card.classList.contains('selected');
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));

      let filtro = '';
      if (!jaSelecionado) {
        card.classList.add('selected');
        filtro = (card.querySelector('.category-name').textContent.trim().toLowerCase());
        if (filtro === 'gatos')     filtro = 'gato';
        if (filtro === 'cachorros') filtro = 'cachorro';
      }

      carregarPets(filtro);
    });
  });

  // ── Barra de busca ────────────────────────
  const searchInput = document.querySelector('.search-bar input');
  const searchBtn   = document.querySelector('.search-btn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      carregarPets('', searchInput.value.trim().toLowerCase());
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // ── Formulário: Cadastro de pet ───────────
  const formCadastrar = document.getElementById('form-cadastrar');
  if (formCadastrar) {
    formCadastrar.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.disabled     = true;
      btn.textContent  = 'Cadastrando...';

      try {
        const res      = await fetch('api/cadastrar_pet.php', {
          method: 'POST',
          body: new FormData(this),
          cache: 'no-store'
        });
        const resultado = await res.json();

        if (resultado.status === 'ok') {
          alert('✅ ' + resultado.mensagem);
          this.reset();
          await carregarPets();
          await carregarPetsSelectGlobal();
        } else {
          alert('❌ Erro: ' + resultado.mensagem);
        }
      } catch (err) {
        alert('❌ Erro de conexão ao cadastrar pet.');
        console.error(err);
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Cadastrar Pet';
      }
    });
  }

  // ── Formulário: Cadastro de adotante ──────
  const formAdotante = document.getElementById('form-adotante');
  if (formAdotante) {
    formAdotante.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.disabled    = true;
      btn.textContent = 'Cadastrando...';

      try {
        const res      = await fetch('api/cadastrar_adotante.php', {
          method: 'POST',
          body: new FormData(this),
          cache: 'no-store'
        });
        const resultado = await res.json();

        if (resultado.status === 'ok') {
          alert('✅ ' + resultado.mensagem);
          this.reset();
          await carregarAdotantesSelectGlobal();
        } else {
          alert('❌ Erro: ' + resultado.mensagem);
        }
      } catch (err) {
        alert('❌ Erro de conexão ao cadastrar adotante.');
        console.error(err);
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Cadastrar Adotante';
      }
    });
  }

  // ── Formulário: Adoção ────────────────────
  const formAdocao = document.getElementById('form-adocao');
  if (formAdocao) {
    formAdocao.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.disabled    = true;
      btn.textContent = 'Processando...';

      try {
        const res      = await fetch('api/adotar_pet.php', {
          method: 'POST',
          body: new FormData(this),
          cache: 'no-store'
        });
        const resultado = await res.json();

        if (resultado.status === 'ok') {
          alert('🐾 ' + resultado.mensagem);
          this.reset();
          await carregarPets();
          await carregarPetsSelectGlobal();
        } else {
          alert('❌ Erro: ' + resultado.mensagem);
        }
      } catch (err) {
        alert('❌ Erro de conexão ao processar adoção.');
        console.error(err);
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Confirmar Adoção';
      }
    });
  }

  // ── Inicialização ─────────────────────────
  carregarPets();
  carregarPetsSelectGlobal();
  carregarAdotantesSelectGlobal();
});
