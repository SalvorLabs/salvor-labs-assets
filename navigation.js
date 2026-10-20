(() => {
  const header = document.querySelector('.masthead');
  const button = header?.querySelector('.nav-toggle');
  const navigation = header?.querySelector('#main-navigation');
  if (!button || !navigation) return;
  const compact = window.matchMedia('(max-width: 1100px)');
  const setOpen = (open, returnFocus = false) => {
    header.classList.toggle('nav-open', open);
    button.setAttribute('aria-expanded', String(open));
    if (returnFocus) button.focus();
  };
  button.hidden = false;
  header.classList.add('nav-ready');
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => {
    if (compact.matches && event.target.closest('a')) setOpen(false, true);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('nav-open')) setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  compact.addEventListener('change', () => {
    const focusWouldHide = compact.matches && navigation.contains(document.activeElement);
    setOpen(false, focusWouldHide);
  });
})();
