// The bottom-right bar. Plain DOM for the same reason the badges are: it sits
// on every Neopets page, so it must not pull in Vue or Vuetify. Clicking it is
// what loads the panel.
import iconSvg from '../../icons/icon.svg?raw';

const CLASS = 'neosnipe-launcher';

// The app icon, as a data URI. A data-URI SVG is its own document, so its
// gradient ids cannot collide with anything Neopets has defined — inlining the
// markup into the page would risk exactly that.
//
// At this size the fine detail turns to mud, the same way it does at 16px, so
// the same `.detail` hook the icon build uses is switched off here too.
const ICON_URL = `data:image/svg+xml,${encodeURIComponent(
  iconSvg.replace('<defs>', '<style>.detail{display:none}</style><defs>'),
)}`;

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
.${CLASS}[data-open="1"] {
  background: #e8f0fe; border-color: #1f6feb; color: #14459c;
  box-shadow: 0 2px 10px rgba(31,111,235,.35);
}
.${CLASS}-icon {
  width: 20px; height: 20px; flex: 0 0 auto;
  background: url("${ICON_URL}") center / contain no-repeat;
  border-radius: 5px;
}
`;



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
  const icon = document.createElement('span');
  icon.className = `${CLASS}-icon`;
  const label = document.createElement('span');
  label.textContent = 'neo-snipe';
  button.append(icon, label);
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
