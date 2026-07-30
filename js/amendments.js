const filterButtons = document.querySelectorAll('[data-filter]');
const amendmentCards = document.querySelectorAll('.amendment-card');
const emptyState = document.querySelector('#empty-state');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    amendmentCards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.category === selected;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    emptyState?.classList.toggle('show', visibleCount === 0);
  });
});