/* shared.js — One Hundred and One */

// ── Browser detection ────────────────────
const ua = navigator.userAgent;
const browser = {
  isIOS:    /iphone|ipad|ipod/i.test(ua),
  isAndroid:/android/i.test(ua),
  isSafari: /safari/i.test(ua) && !/chrome|crios|fxios|opios|mercury/i.test(ua),
  isMobile: /iphone|ipad|ipod|android/i.test(ua),
};
browser.isIOSNonSafari = browser.isIOS && !browser.isSafari;

function showBrowserWarning({ message, type = 'soft' }) {
  const id = 'bw-banner';
  if (document.getElementById(id)) return;
  const b = document.createElement('div');
  b.id = id; b.className = 'browser-warning ' + type;
  b.innerHTML = `<div class="bw-icon">⚠</div><div class="bw-msg">${message}</div>`;
  const main = document.querySelector('main');
  if (main) main.prepend(b); else document.body.prepend(b);
}

// ── Puzzle engine ────────────────────────
const HINT_THRESHOLD = 2;

function setupPuzzle({ answer, hint, onSuccess }) {
  const input   = document.querySelector('.puz-input');
  const fb      = document.querySelector('.fb');
  const attEl   = document.querySelector('.attempts');
  let attempts  = 0;
  let hintShown = false;

  function revealHint() {
    if (hintShown) return;
    hintShown = true;
    const h = document.createElement('div');
    h.className = 'fb hint hint-live';
    h.textContent = hint;
    fb.insertAdjacentElement('afterend', h);
  }

  function check() {
    const val = input.value.trim().toLowerCase();
    attempts++;
    if (attEl) attEl.textContent = 'attempts: ' + attempts;
    const answers = Array.isArray(answer) ? answer : [answer];
    if (answers.includes(val)) {
      fb.textContent = '✓ correct';
      fb.className = 'fb ok';
      input.disabled = true;
      const h = document.querySelector('.hint-live');
      if (h) h.remove();
      setTimeout(onSuccess, 700);
    } else {
      fb.textContent = 'not quite — try again';
      fb.className = 'fb err';
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 320);
      if (attempts >= HINT_THRESHOLD) revealHint();
    }
  }

  document.querySelector('.submit').addEventListener('click', check);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
}
