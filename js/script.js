/* ─────────────────────────────────────────
   MEU4PATAS — Script Principal Frontend
───────────────────────────────────────── */

const DB_USUARIOS = 'meu4patas_usuario';
const DB_PETS = 'meu4patas_pets';
const DB_INTERESSES = 'meu4patas_interesses';
const DB_RECUSAS = 'meu4patas_recusas';

// ── Funções Utilitárias ─────────────────────────────────────────

function limparCPF(cpf) {
  return String(cpf || "").replace(/\D/g, "");
}

function aplicarMascaraCPF(cpf) {
  const numeros = limparCPF(cpf).slice(0, 11);
  return numeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function validarCPF(cpf) {
  const numeros = limparCPF(cpf);

  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i), 10) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i), 10) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(numeros.charAt(10), 10);
}

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toast.hidden = false;

  setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

// ── Estado da Aplicação ─────────────────────────────────────────

let state = {
  usuario: null,
  pets: [],
  interesses: [],
  recusas: [],
  filtroAtual: 'todos',
  buscaAtual: '',
  petAtualExplore: 0
};

// ── Inicialização ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  carregarDados();
  configurarEventosGerais();

  const path = window.location.pathname;
  if (path.includes('cadastro.html')) initCadastro();
  else if (path.includes('cadastrar-pet.html')) initCadastroPet();
  else if (path.includes('perfil.html')) initPerfil();
  else initIndex();

  atualizarInterfaceUsuario();
}

function carregarDados() {
  state.usuario = JSON.parse(localStorage.getItem(DB_USUARIOS));
  state.pets = JSON.parse(localStorage.getItem(DB_PETS)) || [
    { id: 1, nome: "Thor", especie: "Cão", raca: "SRD", idade: "2 anos", cidade: "São Paulo", uf: "SP", status: "Disponível", imagem: "assets/pet-thor.jpg", descricao: "Muito brincalhão.", larIdeal: "Casa com quintal" },
    { id: 2, nome: "Rex", especie: "Cão", raca: "Pastor Alemão", idade: "1 ano", cidade: "Rio de Janeiro", uf: "RJ", status: "Disponível", imagem: "assets/pet-rex.jpg", descricao: "Protetor e leal.", larIdeal: "Espaço amplo" }
  ];
  state.interesses = JSON.parse(localStorage.getItem(DB_INTERESSES)) || [];
  state.recusas = JSON.parse(localStorage.getItem(DB_RECUSAS)) || [];
}

function salvarDados() {
  localStorage.setItem(DB_USUARIOS, JSON.stringify(state.usuario));
  localStorage.setItem(DB_PETS, JSON.stringify(state.pets));
  localStorage.setItem(DB_INTERESSES, JSON.stringify(state.interesses));
  localStorage.setItem(DB_RECUSAS, JSON.stringify(state.recusas));
}

// ── Interface e Eventos ────────────────────────────────────────

function atualizarInterfaceUsuario() {
  const btnAuth = document.getElementById('btnAuth');
  const userMenu = document.getElementById('userMenu');
  const navUserName = document.getElementById('navUserName');

  if (state.usuario) {
    if (btnAuth) btnAuth.hidden = true;
    if (userMenu) userMenu.hidden = false;
    if (navUserName) navUserName.textContent = state.usuario.nomeCompleto.split(' ')[0];
  } else {
    if (btnAuth) btnAuth.hidden = false;
    if (userMenu) userMenu.hidden = true;
  }
}

function configurarEventosGerais() {
  // Menu Mobile
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });
  }

  // User Dropdown
  const userChipBtn = document.getElementById('userChipBtn');
  const userDropdown = document.getElementById('userDropdown');
  if (userChipBtn && userDropdown) {
    userChipBtn.addEventListener('click', () => {
      const isExpanded = userChipBtn.getAttribute('aria-expanded') === 'true';
      userChipBtn.setAttribute('aria-expanded', !isExpanded);
      userDropdown.hidden = isExpanded;
    });

    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        state.usuario = null;
        salvarDados();
        window.location.href = 'index.html';
      });
    }
  }
}

// ── Index / Home ────────────────────────────────────────────────

function initIndex() {
  renderPetLists();
  renderCounters();

  // Explorar
  renderCurrentPet();

  const btnRefuse = document.getElementById('btnRefuse');
  const btnInterest = document.getElementById('btnInterest');
  const btnDetails = document.getElementById('btnDetails');

  if (btnRefuse) btnRefuse.addEventListener('click', () => registerRefusal(state.pets[state.petAtualExplore]));
  if (btnInterest) btnInterest.addEventListener('click', () => registerInterest(state.pets[state.petAtualExplore]));
  if (btnDetails) btnDetails.addEventListener('click', () => showPetDetails(state.pets[state.petAtualExplore]));

  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closePetDetails);

  // Filtros e Busca
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      setActiveFilter(e.target.dataset.filter);
    });
  });

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = searchForm.querySelector('input');
      if (searchInput) {
        state.buscaAtual = normalizarTexto(searchInput.value);
        renderPetLists();
      }
    });
  }
}

function renderCounters() {
  const disp = state.pets.filter(p => p.status === 'Disponível').length;
  const adot = state.pets.filter(p => p.status === 'Adotado').length;

  const statDisp = document.getElementById('statDisponiveis');
  const statAdot = document.getElementById('statAdotados');

  if (statDisp) statDisp.textContent = disp;
  if (statAdot) statAdot.textContent = adot;
}

function setActiveFilter(filter) {
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(c => c.classList.remove('active'));

  const chip = document.querySelector(`.filter-chip[data-filter="${filter}"]`);
  if (chip) chip.classList.add('active');

  state.filtroAtual = filter;
  renderPetLists();
}

function filterPets() {
  let filtered = state.pets;

  // Filtro de Busca
  if (state.buscaAtual) {
    filtered = filtered.filter(p =>
      normalizarTexto(p.nome).includes(state.buscaAtual) ||
      normalizarTexto(p.raca).includes(state.buscaAtual) ||
      normalizarTexto(p.especie).includes(state.buscaAtual) ||
      normalizarTexto(p.cidade).includes(state.buscaAtual) ||
      normalizarTexto(p.status).includes(state.buscaAtual)
    );
  }

  // Filtro Categoria
  switch(state.filtroAtual) {
    case 'caes': filtered = filtered.filter(p => normalizarTexto(p.especie).includes('cao') || normalizarTexto(p.especie).includes('cachorro')); break;
    case 'gatos': filtered = filtered.filter(p => normalizarTexto(p.especie).includes('gato')); break;
    case 'disponiveis': filtered = filtered.filter(p => p.status === 'Disponível'); break;
    case 'indisponiveis': filtered = filtered.filter(p => p.status === 'Indisponível'); break;
    case 'adotados': filtered = filtered.filter(p => p.status === 'Adotado'); break;
    // Perto de você simplificado
    case 'perto':
      if(state.usuario && state.usuario.cidade) {
        filtered = filtered.filter(p => normalizarTexto(p.cidade) === normalizarTexto(state.usuario.cidade));
      } else {
        alert("Cadastre sua cidade para encontrar pets perto de você.");
      }
      break;
  }

  return filtered;
}

function renderPetLists() {
  const filtered = filterPets();

  const disponiveis = filtered.filter(p => p.status === 'Disponível');
  const indisponiveis = filtered.filter(p => p.status === 'Indisponível');
  const adotados = filtered.filter(p => p.status === 'Adotado');

  const listDisp = document.getElementById('listDisponiveis');
  const listIndisp = document.getElementById('listIndisponiveis');
  const listAdot = document.getElementById('listAdotados');

  if (listDisp) listDisp.innerHTML = disponiveis.map(createPetCard).join('');
  if (listIndisp) listIndisp.innerHTML = indisponiveis.map(createPetCard).join('');
  if (listAdot) listAdot.innerHTML = adotados.map(createPetCard).join('');
}

function createPetCard(pet) {
  return `
    <div class="pet-card">
      <img src="${pet.imagem || 'assets/logo-meu4patas.png'}" alt="${pet.nome}" style="width:100%; height:200px; object-fit:cover;">
      <div class="pet-info">
        <h3>${pet.nome}</h3>
        <p>${pet.raca} · ${pet.idade}</p>
        <p>📍 ${pet.cidade} - ${pet.uf}</p>
        <button onclick="showPetDetails(${pet.id})" class="btn-ghost">Ver Detalhes</button>
      </div>
    </div>
  `;
}

// Explorar
function renderCurrentPet() {
  const stage = document.getElementById('exploreStage');
  if (!stage) return;

  const disponiveis = state.pets.filter(p => p.status === 'Disponível' && !state.recusas.includes(p.id) && !state.interesses.includes(p.id));

  if (disponiveis.length === 0) {
    stage.innerHTML = '<p>Você já viu todos os pets disponíveis no momento!</p>';
    const actions = document.getElementById('exploreActions');
    if (actions) actions.hidden = true;
    return;
  }

  if (state.petAtualExplore >= disponiveis.length) {
    state.petAtualExplore = 0;
  }

  const pet = disponiveis[state.petAtualExplore];

  stage.innerHTML = `
    <div class="explore-card">
      <img src="${pet.imagem || 'assets/logo-meu4patas.png'}" alt="${pet.nome}" style="width:100%; height:300px; object-fit:cover; border-radius:16px;">
      <h3>${pet.nome}</h3>
      <p>${pet.raca} · ${pet.idade}</p>
      <p>📍 ${pet.cidade} - ${pet.uf}</p>
    </div>
  `;
}

function registerRefusal(pet) {
  if (!pet) return;
  if (!state.recusas.includes(pet.id)) {
    state.recusas.push(pet.id);
    salvarDados();
  }
  state.petAtualExplore++;
  renderCurrentPet();
}

function registerInterest(pet) {
  if (!pet) return;
  if (!state.usuario) {
    showToast('Para demonstrar interesse, faça seu cadastro primeiro.', 'error');
    setTimeout(() => window.location.href = 'cadastro.html', 2000);
    return;
  }

  if (!state.usuario.maior21) {
    showToast('Você precisa ter 21 anos ou mais para demonstrar interesse.', 'error');
    return;
  }

  if (!state.interesses.includes(pet.id)) {
    state.interesses.push(pet.id);
    salvarDados();
    showToast('Interesse registrado com sucesso! O responsável entrará em contato.', 'success');
  } else {
    showToast('Você já demonstrou interesse neste pet.', 'info');
  }

  state.petAtualExplore++;
  renderCurrentPet();
}

function showPetDetails(petId) {
  const pet = typeof petId === 'object' ? petId : state.pets.find(p => p.id === petId);
  if (!pet) return;

  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  if (!overlay || !content) return;

  content.innerHTML = `
    <h2>${pet.nome}</h2>
    <img src="${pet.imagem || 'assets/logo-meu4patas.png'}" style="width:100%; max-height:300px; object-fit:contain; margin-bottom:1rem;">
    <p><strong>Espécie:</strong> ${pet.especie}</p>
    <p><strong>Raça:</strong> ${pet.raca}</p>
    <p><strong>Idade:</strong> ${pet.idade}</p>
    <p><strong>Local:</strong> ${pet.cidade} - ${pet.uf}</p>
    <p><strong>Status:</strong> ${pet.status}</p>
    <p><strong>Descrição:</strong> ${pet.descricao}</p>
    <p><strong>Lar Ideal:</strong> ${pet.larIdeal}</p>
    <p class="modal-disclaimer"><em>Enviar interesse não garante a adoção. A continuidade do processo depende da avaliação da ONG ou responsável pelo animal.</em></p>
    <div style="margin-top:1rem;">
      <button onclick='window.interesseGlobal(${JSON.stringify(pet)})' class="btn-primary">Tenho Interesse 💛</button>
    </div>
  `;

  overlay.hidden = false;
}

window.interesseGlobal = function(pet) {
  registerInterest(pet);
  closePetDetails();
}

function closePetDetails() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.hidden = true;
}


// ── Cadastro de Usuário ─────────────────────────────────────────

function initCadastro() {
  const form = document.querySelector('form');
  if (!form) return;

  const cpfInput = form.querySelector('input[name="cpf"]');
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      e.target.value = aplicarMascaraCPF(e.target.value);
    });
  }

  form.addEventListener('submit', validateUserForm);
}

function validateUserForm(e) {
  e.preventDefault();
  const form = e.target;

  const cpf = form.querySelector('input[name="cpf"]')?.value;
  if (!validarCPF(cpf)) {
    showToast('CPF inválido!', 'error');
    return;
  }

  const dataNascimento = form.querySelector('input[name="data_nascimento"]')?.value;
  const idade = calcularIdade(dataNascimento);

  const usuario = {
    nomeCompleto: form.querySelector('input[name="nome"]')?.value || form.querySelector('input[name="nomeCompleto"]')?.value || 'Usuário',
    cpf: cpf,
    cpfLimpo: limparCPF(cpf),
    dataNascimento: dataNascimento,
    idade: idade,
    maior21: idade >= 21,
    cidade: form.querySelector('input[name="cidade"]')?.value || '',
    uf: form.querySelector('input[name="uf"]')?.value || '',
    aceitaTermos: form.querySelector('input[name="termos"]')?.checked || true,
    cadastradoEm: new Date().toISOString()
  };

  state.usuario = usuario;
  salvarDados();

  showToast('Cadastro realizado com sucesso!', 'success');
  setTimeout(() => window.location.href = 'index.html', 1500);
}

// ── Cadastro de Pet ─────────────────────────────────────────────

function initCadastroPet() {
  if (!state.usuario) {
    alert('Para cadastrar um pet para doação, faça seu cadastro primeiro.');
    window.location.href = 'cadastro.html';
    return;
  }

  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', validatePetForm);
}

function validatePetForm(e) {
  e.preventDefault();
  const form = e.target;

  const novoPet = {
    id: Date.now(),
    nome: form.querySelector('input[name="nome"]')?.value || 'Sem Nome',
    especie: form.querySelector('select[name="especie"]')?.value || 'Outro',
    raca: form.querySelector('input[name="raca"]')?.value || 'SRD',
    idade: form.querySelector('input[name="idade"]')?.value || 'Desconhecida',
    cidade: form.querySelector('input[name="cidade"]')?.value || state.usuario.cidade || '',
    uf: form.querySelector('input[name="uf"]')?.value || state.usuario.uf || '',
    status: form.querySelector('select[name="status"]')?.value || 'Disponível',
    descricao: form.querySelector('textarea[name="descricao"]')?.value || '',
    imagem: 'assets/logo-meu4patas.png', // Fallback
    larIdeal: form.querySelector('input[name="lar_ideal"]')?.value || ''
  };

  state.pets.push(novoPet);
  salvarDados();

  showToast('Pet cadastrado com sucesso!', 'success');
  setTimeout(() => window.location.href = 'perfil.html', 1500);
}

// ── Perfil / Minha Conta ────────────────────────────────────────

function initPerfil() {
  if (!state.usuario) {
    window.location.href = 'cadastro.html';
    return;
  }

  renderizarDadosUsuario();
}

function renderizarDadosUsuario() {
  const container = document.getElementById('profileRoot');
  if (!container) return;

  const u = state.usuario;

  container.innerHTML = `
    <div class="account-card">
      <h2>${u.nomeCompleto}</h2>
      <p>CPF: ${u.cpf}</p>
      <p>Idade: ${u.idade} anos</p>
      <p>Cidade: ${u.cidade} - ${u.uf}</p>
      <p class="status-${u.maior21 ? 'enabled' : 'disabled'}">
        Status: ${u.maior21 ? 'Habilitado para demonstrar interesse (21+)' : 'Não habilitado para demonstrar interesse (menor de 21)'}
      </p>
      <button class="btn-outline" onclick="abrirEdicaoDados()">Editar Dados</button>
    </div>

    <div style="margin-top:2rem;">
      <h3>Meus Interesses</h3>
      <ul>
        ${state.interesses.map(id => {
          const p = state.pets.find(pet => pet.id === id);
          return p ? `<li>${p.nome} (${p.cidade})</li>` : '';
        }).join('') || '<li>Nenhum interesse registrado.</li>'}
      </ul>
    </div>
  `;
}

window.abrirEdicaoDados = function() {
  showToast('Função de edição em desenvolvimento.', 'info');
}

// Fallback para mapa
if (typeof L === 'undefined') {
  const mapContainer = document.getElementById('petsMap');
  if (mapContainer) {
    mapContainer.innerHTML = '<p style="padding: 2rem; text-align: center; background: #eee;">Mapa indisponível no momento.</p>';
  }
}

window.salvarEdicaoDados = function() {
  const form = document.getElementById('editProfileForm');
  if (!form) return;

  const cpf = form.querySelector('input[name="cpf"]')?.value;
  if (!validarCPF(cpf)) {
    showToast('CPF inválido!', 'error');
    return;
  }

  const dataNascimento = form.querySelector('input[name="data_nascimento"]')?.value;
  const idade = calcularIdade(dataNascimento);

  state.usuario.nomeCompleto = form.querySelector('input[name="nome"]')?.value || state.usuario.nomeCompleto;
  state.usuario.cpf = cpf;
  state.usuario.cpfLimpo = limparCPF(cpf);
  state.usuario.dataNascimento = dataNascimento;
  state.usuario.idade = idade;
  state.usuario.maior21 = idade >= 21;
  state.usuario.cidade = form.querySelector('input[name="cidade"]')?.value || state.usuario.cidade;
  state.usuario.uf = form.querySelector('input[name="uf"]')?.value || state.usuario.uf;

  salvarDados();
  renderizarDadosUsuario();
  showToast('Dados atualizados com sucesso!', 'success');

  const overlay = document.getElementById('editProfileOverlay');
  if (overlay) overlay.hidden = true;
}


window.abrirEdicaoDados = function() {
  const container = document.getElementById('profileRoot');
  if (!container) return;

  const u = state.usuario;

  container.innerHTML = `
    <div class="account-card">
      <h2>Editar Dados</h2>
      <form id="editProfileForm" onsubmit="event.preventDefault(); salvarEdicaoDados();">
        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" name="nome" value="${u.nomeCompleto}" required>
        </div>
        <div class="form-group">
          <label>CPF</label>
          <input type="text" name="cpf" value="${u.cpf}" oninput="this.value = aplicarMascaraCPF(this.value)" required>
        </div>
        <div class="form-group">
          <label>Data de Nascimento</label>
          <input type="date" name="data_nascimento" value="${u.dataNascimento}" required>
        </div>
        <div class="form-group">
          <label>Cidade</label>
          <input type="text" name="cidade" value="${u.cidade}" required>
        </div>
        <div class="form-group">
          <label>UF</label>
          <input type="text" name="uf" value="${u.uf}" required>
        </div>
        <button type="submit" class="btn-primary">Salvar Alterações</button>
        <button type="button" class="btn-ghost" onclick="renderizarDadosUsuario()">Cancelar</button>
      </form>
    </div>
  `;
}

// Dynamic Breed Selection and Image Preview
document.addEventListener('DOMContentLoaded', () => {
  const especieSelect = document.querySelector('select[name="especie"]');
  const racaInput = document.querySelector('input[name="raca"]');
  const fotoInput = document.getElementById('foto');
  const previewDiv = document.getElementById('imagePreview');

  if (especieSelect && racaInput) {
    especieSelect.addEventListener('change', (e) => {
      const especie = e.target.value.toLowerCase();
      if (especie === 'cão' || especie === 'cachorro') {
        racaInput.placeholder = "Ex: SRD, Poodle, Labrador...";
        racaInput.value = "";
      } else if (especie === 'gato') {
        racaInput.placeholder = "Ex: SRD, Siamês, Persa...";
        racaInput.value = "";
      } else {
        racaInput.placeholder = "Raça";
        racaInput.value = "SRD";
      }
    });
  }

  if (fotoInput && previewDiv) {
    fotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          previewDiv.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
      } else {
        previewDiv.innerHTML = '<span class="image-preview-icon">📷</span><span class="image-preview-text">Preview da imagem</span>';
      }
    });
  }
});
