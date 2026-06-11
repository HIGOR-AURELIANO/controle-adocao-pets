/* ─────────────────────────────────────────
   PATINHAS — Marketplace de Adoção de Pets
   Script.js
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── Filtros de busca ──────────────────────
  const filterChips = document.querySelectorAll('.filter-chip');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // ── Categorias ────────────────────────────
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // ── Botão "Ver mais pets" ─────────────────
  const btnLoadMore = document.querySelector('.btn-load-more');

  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      // Aqui você pode implementar uma chamada à API ou renderizar mais cards
      btnLoadMore.textContent = 'Carregando...';
      btnLoadMore.disabled = true;

      setTimeout(() => {
        btnLoadMore.textContent = 'Ver mais pets →';
        btnLoadMore.disabled = false;
        // Placeholder: em produção, buscar e injetar novos pet cards no DOM
        alert('Aqui você carregaria mais pets da API! 🐾');
      }, 1000);
    });
  }

});

// ── Favoritar pet (coração animado) ────────
// Declarada no escopo global para ser chamada via onclick no HTML
function toggleHeart(btn) {
  const isLiked = btn.textContent.trim() === '❤️';
  btn.textContent = isLiked ? '🤍' : '❤️';
  btn.classList.add('liked');
  setTimeout(() => btn.classList.remove('liked'), 400);
}
