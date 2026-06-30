const $ = (key) => document.querySelector(`[data-ui="${key}"]`);

const money = (n) => '$' + Number(n || 0).toLocaleString('fr-FR');

const time = (s) => {
  const value = Math.max(0, Number(s || 0));
  return `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}`;
};

function setText(key, value) {
  const el = $(key);
  if (el) el.textContent = value;
}

function setWidth(key, value) {
  const el = $(key);
  if (el) el.style.width = `${Math.max(0, Math.min(100, Number(value || 0)))}%`;
}

function setWeaponIcon(name) {
  const el = $('weapon-icon');
  if (!el) return;

  const key = String(name || '')
    .toLowerCase()
    .replace('-', '')
    .replace(' ', '_');

  const map = {
    ak47: 'ak47',
    ak_47: 'ak47',
    awp: 'awp'
  };

  el.src = `./assets/weapons/${map[key] || 'default'}.svg`;
}

export function render(state) {
  setText('connection', state.connection || 'DEMO MODE');

  setText('player-name', state.player.name || 'Unknown');

  setText('hp', state.player.hp ?? 0);
  setWidth('hp-bar', state.player.hp ?? 0);

  const hpValue = Number(state.player.hp ?? 0);
  const hpBar = $('hp-bar');
  if (hpBar) hpBar.classList.toggle('is-low', hpValue <= 25);

  setText('armor', state.player.armor ?? 0);
  setWidth('armor-bar', state.player.armor ?? 0);

  const armorValue = Number(state.player.armor ?? 0);
  const armorBar = $('armor-bar');
  if (armorBar) armorBar.classList.toggle('is-low', armorValue <= 25);

  setText('money', money(state.player.money));

  const moneyEl = $('money');
  const moneyValue = Number(state.player.money ?? 0);
  if (moneyEl) {
    moneyEl.classList.toggle('is-rich', moneyValue >= 4750);
    moneyEl.classList.toggle('is-eco', moneyValue > 0 && moneyValue < 1500);
    moneyEl.classList.toggle('is-broke', moneyValue === 0);
  }

  setText('weapon', state.player.weapon || 'NO WEAPON');
  setWeaponIcon(state.player.weapon);

  const hasAmmo = Number(state.player.ammoClip) > 0 || Number(state.player.ammoReserve) > 0;
  setText('ammo', hasAmmo ? `${state.player.ammoClip ?? 0} / ${state.player.ammoReserve ?? 0}` : '—');

  const ammoEl = $('ammo');
  const clip = Number(state.player.ammoClip ?? 0);
  const clipMax = Number(state.player.ammoClipMax ?? 30);
  if (ammoEl) {
    ammoEl.classList.toggle('is-low', clip > 0 && clip <= Math.max(3, Math.floor(clipMax * 0.25)));
    ammoEl.classList.toggle('is-empty', clip === 0);
  }

  setText('score-ct', String(state.match.scoreCT ?? 0).padStart(2, '0'));
  setText('score-t', String(state.match.scoreT ?? 0).padStart(2, '0'));
  setText('round-phase', state.match.phase || 'UNKNOWN');
  setText('timer', time(state.match.timer));

  setText('map', state.match.map || 'Unknown');

  const planted = Boolean(state.bomb.planted);
  setText('bomb-state', planted ? 'PLANTED' : 'SAFE');
  setText('bomb-timer', planted && state.bomb.timer ? `${state.bomb.timer}s` : '--');

  const bombCard = $('bomb-card');
  if (bombCard) bombCard.classList.toggle('is-active', planted);

  setText('kd', state.stats.kd ?? '0/0');
  setText('adr', state.stats.adr ?? 0);
  setText('hs', state.stats.hs ?? '0%');
  setText('ping', state.stats.ping ?? '--');

  setText('flash', state.utility.flash ?? 0);
  setText('smoke', state.utility.smoke ?? 0);
  setText('he', state.utility.he ?? 0);
  setText('fire', state.utility.fire ?? 0);
  setText('kit', state.utility.kit ? 'YES' : 'NO');

  const effects = state.effects || {};
  const flashed = Number(effects.flashed ?? 0);
  const burning = Number(effects.burning ?? 0);
  const smoked = Number(effects.smoked ?? 0);

  const flashOpacity = flashed > 0 ? Math.min(0.75, Math.max(0.35, flashed / 255)) : 0;
  document.body.style.setProperty('--flash-opacity', flashOpacity.toString());
  document.body.classList.toggle('is-flashed', flashed > 5);
  document.body.classList.toggle('is-burning', burning > 0);
  document.body.classList.toggle('is-smoked', smoked > 0);
}