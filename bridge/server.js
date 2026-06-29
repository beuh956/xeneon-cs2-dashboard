const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT || 31982);
const ROOT = path.join(__dirname, '..', 'dashboard');

let lastGsi = null;
let lastUpdate = 0;

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Frame-Options': 'ALLOWALL',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp'
  }[ext] || 'application/octet-stream';
}

function demoState() {
  const t = Date.now() / 1000;
  const hp = 55 + Math.round(Math.sin(t / 4) * 35);
  const armor = 90 + Math.round(Math.sin(t / 8) * 10);
  const ammo = 18 + Math.round(Math.sin(t / 3) * 10);
  const roundTime = 115 - (Math.floor(t) % 115);
  return {
    ready: false,
    demo: true,
    updated_at: Date.now(),
    map: { name: 'de_mirage', mode: 'competitive', phase: 'live', round: 14, team_ct: { score: 8 }, team_t: { score: 5 } },
    round: { phase: 'live', bomb: 'safe', win_team: null },
    bomb: { state: 'carried', countdown: null },
    player: {
      name: 'beuh95', team: 'CT', activity: 'playing',
      state: { health: hp, armor, helmet: true, money: 4200, round_kills: 1, round_killhs: 1, flashed: 0, smoked: 0, burning: 0 },
      match_stats: { kills: 12, assists: 3, deaths: 5, mvps: 2, score: 32 },
      weapons: {
        weapon_0: { name: 'weapon_knife', type: 'Knife', state: 'holstered' },
        weapon_1: { name: 'weapon_ak47', type: 'Rifle', state: 'active', ammo_clip: ammo, ammo_clip_max: 30, ammo_reserve: 90 },
        weapon_2: { name: 'weapon_flashbang', type: 'Grenade', state: 'holstered' },
        weapon_3: { name: 'weapon_smokegrenade', type: 'Grenade', state: 'holstered' },
        weapon_4: { name: 'weapon_hegrenade', type: 'Grenade', state: 'holstered' }
      },
      position: `${Math.sin(t / 5) * 700}, ${Math.cos(t / 5) * 700}, 0`
    },
    clock: { round_time: roundTime }
  };
}

function normalize(gsi) {
  const out = gsi || demoState();
  out.ready = Boolean(gsi);
  out.demo = !gsi;
  out.updated_at = lastUpdate || Date.now();
  return out;
}

const server = http.createServer((req, res) => {
  console.log(new Date().toLocaleTimeString(), req.method, req.url);
  
  if (req.method === 'OPTIONS') return send(res, 204, '');

  if (req.url === '/gsi' && req.method === 'POST') {
    console.log("=== GSI REQUEST ===");

    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      console.log(body.slice(0, 500));

      try {
        lastGsi = JSON.parse(body || '{}');
        lastUpdate = Date.now();
        console.log("GSI reçu OK");
        send(res, 200, 'OK');
      } catch (err) {
        console.error("JSON invalide", err);
        send(res, 400, 'Invalid JSON');
      }
    });

    return;
  }

  if (req.url === '/state') {
    return send(res, 200, JSON.stringify(normalize(lastGsi), null, 2), 'application/json; charset=utf-8');
  }

  const requested = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  const file = path.normalize(path.join(ROOT, requested));
  if (!file.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    send(res, 200, data, contentType(file));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const nets = Object.values(os.networkInterfaces()).flat().filter(x => x && x.family === 'IPv4' && !x.internal);
  console.log('XENEON CS2 Dashboard ready');
  console.log(`Local:   http://localhost:${PORT}/`);
  nets.forEach(n => console.log(`Network: http://${n.address}:${PORT}/`));
  console.log('\niCUE iFrame:');
  console.log(`<iframe src="http://localhost:${PORT}/" width="100%" height="100%" frameborder="0"></iframe>`);
});
