// The bottom-right bar. Plain DOM for the same reason the badges are: it sits
// on every Neopets page, so it must not pull in Vue or Vuetify. Clicking it is
// what loads the panel.
const CLASS = 'neosnipe-launcher';

const CSS = `
.${CLASS} {
  position: fixed; right: 16px; bottom: 16px; z-index: 2147482000;
  display: flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 12px 0 10px; margin: 0;
  border: 1px solid rgba(0,0,0,.15); border-radius: 17px;
  background: #fff; color: #1f6feb; cursor: pointer;
  font: 600 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,.18);
  transition: box-shadow .12s ease, transform .12s ease;
}
.${CLASS}:hover, .${CLASS}:focus-visible {
  box-shadow: 0 4px 14px rgba(0,0,0,.24); transform: translateY(-1px);
}
.${CLASS}[data-open="1"] { background: #1f6feb; color: #fff; border-color: #1f6feb; }
.${CLASS} svg { width: 14px; height: 14px; fill: currentColor; }
`;

const ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3a6.5 6.5 0 0 1 5.25 10.33l5.46 5.46-1.42 1.42-5.46-5.46A6.5 6.5 0 1 1 9.5 3zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/></svg>`;

let button = null;

export function addLauncher(onActivate) {
  if (button || !document.body) return button;

  const style = document.createElement('style');
  style.dataset.neosnipe = 'launcher';
  style.textContent = CSS;
  document.head.appendChild(style);

  button = document.createElement('button');
  button.type = 'button';
  button.className = CLASS;
  button.innerHTML = `${ICON}<span>neo-snipe</span>`;
  button.title = 'neo-snipe — favourites and dailies';
  button.setAttribute('aria-label', button.title);

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onActivate(button);
  });

  document.body.appendChild(button);
  return button;
}

export function setLauncherOpen(open) {
  if (button) button.dataset.open = open ? '1' : '0';
}
