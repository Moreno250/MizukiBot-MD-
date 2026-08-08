/**
 * ✿ MizukiBot-MD ─ iniciar.js
 * Conexão, eventos e interface de console.
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const axios = require('axios');
const pino = require('pino');
const readline = require('readline');
const NodeCache = require('node-cache');
const { Boom } = require('@hapi/boom');
const qrcodeTerminal = require('qrcode-terminal');

const { fundo1, fundo2 } = require('./banco de dados/links.json');
const { startMonitor, readJSONCached } = require('./banco de dados/func/optimizer');
const { prefix } = require('./dono/settings.json');
const { banner2, banner3, colors, nescessario, setting, countMessage } = require('./proxy.js');

// ══════════════════════════════════════════════════════════
//  CONSTANTES
// ══════════════════════════════════════════════════════════

const QR_CODE_PATH   = './banco de dados/qrcode';
const COUNTMSG_PATH  = './banco de dados/countmsg.json';
const GRUPOS_DIR     = './banco de dados/grupos';
const SUPORTE_NUM    = '5527992870575';
const WA_VERSION     = [2, 3000, 1044006379];

const DDD_MAP = {
  '11': 'São Paulo', '12': 'São Paulo', '13': 'São Paulo', '14': 'São Paulo',
  '15': 'São Paulo', '16': 'São Paulo', '17': 'São Paulo', '18': 'São Paulo',
  '19': 'São Paulo', '21': 'Rio de Janeiro', '22': 'Rio de Janeiro', '24': 'Rio de Janeiro',
  '27': 'Espírito Santo', '28': 'Espírito Santo',
  '31': 'Minas Gerais', '32': 'Minas Gerais', '33': 'Minas Gerais', '34': 'Minas Gerais',
  '35': 'Minas Gerais', '37': 'Minas Gerais', '38': 'Minas Gerais',
  '41': 'Paraná', '42': 'Paraná', '43': 'Paraná', '44': 'Paraná',
  '45': 'Paraná', '46': 'Paraná',
  '47': 'Santa Catarina', '48': 'Santa Catarina', '49': 'Santa Catarina',
  '51': 'Rio Grande do Sul', '53': 'Rio Grande do Sul', '54': 'Rio Grande do Sul', '55': 'Rio Grande do Sul',
  '61': 'Distrito Federal', '62': 'Goiás', '63': 'Tocantins', '64': 'Goiás',
  '65': 'Mato Grosso', '66': 'Mato Grosso', '67': 'Mato Grosso do Sul',
  '68': 'Acre', '69': 'Rondônia',
  '71': 'Bahia', '73': 'Bahia', '74': 'Bahia', '75': 'Bahia',
  '77': 'Bahia', '79': 'Sergipe',
  '81': 'Pernambuco', '82': 'Alagoas', '83': 'Paraíba', '84': 'Rio Grande do Norte',
  '85': 'Ceará', '86': 'Piauí', '87': 'Pernambuco', '88': 'Ceará', '89': 'Piauí',
  '91': 'Pará', '92': 'Amazonas', '93': 'Pará', '94': 'Pará',
  '95': 'Roraima', '96': 'Amapá', '97': 'Amazonas', '98': 'Maranhão', '99': 'Maranhão',
};

const CONFIG_PADRAO = [{
  antifake: false,
  legenda_estrangeiro: '❌ *Números estrangeiros não são permitidos neste grupo!*',
  listanegra: [],
  ANTI_DDD: { active: false, listaProibidos: [] },
  wellcome: [
    { bemvindo1: false, legendabv: null, legendasaiu: 0 },
    { bemvindo2: false, legendabv: null, legendasaiu: 0 },
  ],
  multiprefix: false,
  prefixos: [prefix],
}];

const MOTIVO_DESCONEXAO = {
  [DisconnectReason.badSession]:          'Sessão corrompida',
  [DisconnectReason.connectionClosed]:    'Conexão fechada',
  [DisconnectReason.connectionLost]:      'Conexão perdida',
  [DisconnectReason.connectionReplaced]:  'Sessão aberta em outro lugar',
  [DisconnectReason.loggedOut]:           'Desconectado do aparelho',
  [DisconnectReason.restartRequired]:     'Reinício necessário',
  [DisconnectReason.timedOut]:            'Tempo esgotado',
  [DisconnectReason.multideviceMismatch]: 'Incompatibilidade multi-dispositivo',
};

// ══════════════════════════════════════════════════════════
//  UI DE CONSOLE
// ══════════════════════════════════════════════════════════

const paint = (cor, txt) => (typeof colors?.[cor] === 'function' ? colors[cor](txt) : String(txt));

const ANSI_RE = /\x1B\[[0-9;]*[A-Za-z]/g;

/**
 * Largura real na tela: emoji ocupa 2 colunas, símbolo (✿ ✔ ✧ ◈) ocupa 1.
 * É esse cálculo que impede a caixa de sair torta.
 */
const EMOJI_ISOLADOS = new Set([
  0x231a, 0x231b, 0x23e9, 0x23ea, 0x23eb, 0x23ec, 0x23f0, 0x23f3,
  0x25fd, 0x25fe, 0x2614, 0x2615, 0x267f, 0x2693, 0x26a1, 0x26aa,
  0x26ab, 0x26bd, 0x26be, 0x26c4, 0x26c5, 0x26ce, 0x26d4, 0x26ea,
  0x26f2, 0x26f3, 0x26f5, 0x26fa, 0x26fd, 0x2705, 0x270a, 0x270b,
  0x2728, 0x274c, 0x274e, 0x2753, 0x2754, 0x2755, 0x2757,
  0x2795, 0x2796, 0x2797, 0x27b0, 0x27bf,
]);

function larguraCP(cp) {
  if (EMOJI_ISOLADOS.has(cp)) return 2;
  if (cp >= 0x2648 && cp <= 0x2653) return 2;
  if (
    (cp >= 0x1100 && cp <= 0x115f) ||
    (cp >= 0x2e80 && cp <= 0xa4cf) ||
    (cp >= 0xac00 && cp <= 0xd7a3) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe30 && cp <= 0xfe6f) ||
    (cp >= 0xff00 && cp <= 0xff60) ||
    (cp >= 0x1f000 && cp <= 0x1faff)
  ) return 2;
  return 1;
}

function larguraVisual(str) {
  const cps = [...String(str).replace(ANSI_RE, '')].map((c) => c.codePointAt(0));
  let w = 0;
  for (let i = 0; i < cps.length; i++) {
    const cp = cps[i];
    if (cp === 0x200d) { i++; continue; }                      // ZWJ: glifo único
    if (cp === 0xfe0f || (cp >= 0x0300 && cp <= 0x036f)) continue; // largura zero
    w += cps[i + 1] === 0xfe0f ? 2 : larguraCP(cp);            // VS16 força emoji
  }
  return w;
}

const SEP = Symbol('separador');
const centro = (texto) => ({ texto, centro: true });

/**
 * Caixa auto-dimensionada.
 * Aceita: string | { texto, centro } | SEP
 */
function caixa(linhas, { cor = 'cyan', titulo = null, minimo = 46 } = {}) {
  const textoDe = (l) => (l === SEP ? '' : typeof l === 'string' ? l : l.texto);
  const conteudo = linhas.filter((l) => l !== SEP).map(textoDe);
  const maior = Math.max(minimo, larguraVisual(titulo || ''), ...conteudo.map(larguraVisual));
  const inner = maior + 4;

  const borda = (e, d) => paint(cor, e + '─'.repeat(inner) + d);
  const linha = (txt, centralizar) => {
    const w = larguraVisual(txt);
    const esq = centralizar ? Math.max(0, Math.floor((inner - w) / 2)) : 2;
    const dir = Math.max(0, inner - w - esq);
    return paint(cor, '│') + ' '.repeat(esq) + txt + ' '.repeat(dir) + paint(cor, '│');
  };

  const out = [borda('╭', '╮')];
  if (titulo) {
    out.push(linha(paint('white', titulo), true));
    out.push(borda('├', '┤'));
  }
  for (const l of linhas) {
    if (l === SEP) out.push(borda('├', '┤'));
    else if (typeof l === 'string') out.push(linha(l, false));
    else out.push(linha(l.texto, !!l.centro));
  }
  out.push(borda('╰', '╯'));
  console.log(out.join('\n'));
}

const log = {
  ok:   (m) => console.log(paint('green',  '  ✓ ') + paint('white', m)),
  info: (m) => console.log(paint('cyan',   '  ◈ ') + paint('white', m)),
  aviso:(m) => console.log(paint('yellow', '  ▲ ') + paint('white', m)),
  erro: (m) => console.log(paint('red',    '  ✗ ') + paint('white', m)),
  dim:  (m) => console.log(paint('gray',   '    ' + m)),
};

const agora = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });

/**
 * Pílula do código de pareamento.
 * Paleta sakura — troque os dois números para mudar a cor (0-255):
 *   218 rosa · 189 lilás · 159 ciano · 223 pêssego · 156 verde
 */
const PILULA_BG = 218; // fundo
const PILULA_FG = 53;  // texto

const esc = (n) => `\x1b[${n}m`;
const fundo = (t) => esc(`48;5;${PILULA_BG}`) + esc(`38;5;${PILULA_FG}`) + esc(1) + t + esc(0);
const ponta = (ch) => esc(`38;5;${PILULA_BG}`) + ch + esc(0);

function telaCodigo(codigo) {
  console.log('');
  console.log(paint('magenta', '  ✿ ') + paint('white', 'Seu código de pareamento'));
  console.log('');
  console.log('    ' + ponta('▐') + fundo(`  ${codigo}  `) + ponta('▌'));
  console.log('');
  console.log(paint('gray', '    WhatsApp › Aparelhos conectados › Conectar com número'));
  console.log('');
}

function telaQR() {
  console.log('');
  caixa([
    centro(paint('white', 'Escaneie o QR abaixo para conectar')),
    SEP,
    paint('gray', '1.') + paint('white', ' WhatsApp › Aparelhos conectados'),
    paint('gray', '2.') + paint('white', ' Conectar um aparelho'),
    paint('gray', '3.') + paint('white', ' Aponte a câmera para o código'),
  ], { cor: 'cyan', titulo: '✧  Q R   C O D E  ✧' });
  console.log('');
}

function telaMenu() {
  console.log('');
  caixa([
    paint('cyan', ' ( 1 ) ') + paint('white', 'Código de pareamento'),
    paint('cyan', ' ( 2 ) ') + paint('white', 'QR Code'),
    paint('cyan', ' ( 3 ) ') + paint('white', 'Suporte'),
  ], { cor: 'magenta', titulo: '✿  C O M O   C O N E C T A R  ✿' });
}

function telaConectado(conn) {
  console.clear();
  if (banner2?.string) console.log(banner2.string);
  if (banner3?.string) console.log(banner3.string);

  const numero = conn.user?.id?.split(':')[0] || '—';
  const nome = conn.user?.name || 'MizukiBot-MD';

  caixa([
    paint('green', '✔ ') + paint('white', 'Status   ') + paint('gray', '│ ') + paint('cyan', 'Conectado'),
    paint('green', '✔ ') + paint('white', 'Bot      ') + paint('gray', '│ ') + paint('cyan', nome),
    paint('green', '✔ ') + paint('white', 'Número   ') + paint('gray', '│ ') + paint('cyan', numero),
    paint('green', '✔ ') + paint('white', 'Prefixo  ') + paint('gray', '│ ') + paint('cyan', setting.prefix),
    paint('green', '✔ ') + paint('white', 'Horário  ') + paint('gray', '│ ') + paint('cyan', agora()),
    paint('green', '✔ ') + paint('white', 'Versão   ') + paint('gray', '│ ') + paint('cyan', WA_VERSION.join('.')),
  ], { cor: 'magenta', titulo: '✿  M I Z U K I B O T - M D  ✿' });
  console.log('');
}

function telaSuporte() {
  const msg = encodeURIComponent('Olá! Preciso de suporte com o MizukiBot-MD.');
  console.log('');
  caixa([
    centro(paint('white', `https://wa.me/${SUPORTE_NUM}?text=${msg}`)),
  ], { cor: 'blue', titulo: '✧  S U P O R T E  ✧' });
  console.log('');
}

// Silencia ruído do Baileys sem esconder erros reais
const _log = console.log;
console.log = (...a) => {
  if (typeof a[0] === 'string' && a[0].startsWith('Closing session')) return;
  if (a[0] && typeof a[0] === 'object' && a[0]._chains !== undefined) return;
  _log(...a);
};

// ══════════════════════════════════════════════════════════
//  UTILITÁRIOS
// ══════════════════════════════════════════════════════════

let rl = null;
const abrirRL = () => {
  if (!rl || rl.closed) rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return rl;
};
const fecharRL = () => { try { if (rl && !rl.closed) rl.close(); } catch {} rl = null; };
const perguntar = (txt) => new Promise((res) => abrirRL().question(txt, res));

// Cache dos fundos de bem-vindo (antes baixava a imagem TODA vez que alguém entrava)
const CACHE_FUNDO = new Map();
const TTL_FUNDO = 30 * 60 * 1000;

async function getBuffer(url) {
  try {
    const { data } = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    return Buffer.from(data, 'binary');
  } catch {
    return null;
  }
}

async function getFundo(url) {
  if (!url) return null;
  const hit = CACHE_FUNDO.get(url);
  if (hit && Date.now() - hit.at < TTL_FUNDO) return hit.buf;
  const buf = await getBuffer(url);
  if (buf) CACHE_FUNDO.set(url, { buf, at: Date.now() });
  return buf;
}

function getEstado(numero) {
  const n = String(numero).replace(/\D/g, '');
  const ddd = n.startsWith('55') ? n.slice(2, 4) : n.slice(0, 2);
  return DDD_MAP[ddd] || 'Desconhecido';
}

const formatarCodigo = (c) => c?.toUpperCase()?.match(/.{1,4}/g)?.join('-') || c;

const kick = (conn, gid, jid, delay = 0) =>
  delay
    ? setTimeout(() => conn.groupParticipantsUpdate(gid, [jid], 'remove').catch(() => {}), delay)
    : conn.groupParticipantsUpdate(gid, [jid], 'remove').catch(() => {});

// Grava o countmsg em lote, não a cada saída de membro
let _timerCount = null;
function salvarCountMessage() {
  clearTimeout(_timerCount);
  _timerCount = setTimeout(() => {
    fs.promises.writeFile(COUNTMSG_PATH, JSON.stringify(countMessage)).catch(() => {});
  }, 2000);
}

function garantirPastas() {
  for (const dir of [GRUPOS_DIR, QR_CODE_PATH]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

// ══════════════════════════════════════════════════════════
//  ESTADO
// ══════════════════════════════════════════════════════════

let sock = null;
let startBase = null;
let sessionStartTime = Math.floor(Date.now() / 1000);
let monitorAtivo = false;
let conectando = false;
let tentativas = 0;
let modoQR = false;

try {
  const mod = require('./index.js');
  startBase = typeof mod === 'function' ? mod : mod?.default || mod?.startBase || mod?.startbase || null;
} catch (e) {
  log.erro('Falha ao carregar index.js: ' + e.message);
}

// ══════════════════════════════════════════════════════════
//  HANDLER ─ PARTICIPANTES DE GRUPO
// ══════════════════════════════════════════════════════════

async function handleGroupParticipantsUpdate(update, conn) {
  const { id, participants, action } = update;
  if (!id?.endsWith('@g.us')) return;

  global._groupMetaCache?.delete(id);
  if (action === 'promote' || action === 'demote') return;

  try {
    const configPath = `${GRUPOS_DIR}/${id}.json`;
    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify(CONFIG_PADRAO, null, 2));

    const cfg = readJSONCached(configPath)?.[0];
    if (!cfg) return;

    let meta;
    try {
      meta = await conn.groupMetadata(id);
    } catch (e) {
      if (e?.data === 403) log.aviso(`Sem acesso ao grupo: ${id}`);
      return;
    }
    if (!meta?.id?.endsWith('@g.us')) return;

    const membros = meta.participants || [];
    const normalizar = (alvo) => {
      if (!alvo) return alvo;
      if (alvo.includes('@lid')) return membros.find((v) => v.id === alvo)?.phoneNumber ?? alvo;
      return alvo;
    };

    const bruto = typeof participants[0] === 'object'
      ? participants[0].id || participants[0].jid || participants[0]
      : participants[0];

    const participante = normalizar(bruto);
    const participanteLid = membros.find((v) => v.phoneNumber === participante)?.id || participante;
    const numero = String(participante).split('@')[0];
    const botNum = conn.user.id.split(':')[0];

    if (participante.startsWith(botNum)) return;

    const isAdd = action === 'add';

    if (isAdd) {
      if (nescessario.listanegraG?.includes(participante)) {
        conn.sendMessage(meta.id, { text: `@${numero} está na lista negra.`, mentions: [participante] });
        return kick(conn, meta.id, participanteLid);
      }

      if (cfg.listanegra?.includes(participante)) {
        conn.sendMessage(meta.id, { text: `@${numero} está na lista negra do grupo.`, mentions: [participante] });
        return kick(conn, meta.id, participanteLid);
      }

      if (cfg.antifake && !numero.startsWith('55')) {
        if (cfg.legenda_estrangeiro !== '0') {
          await conn.sendMessage(meta.id, { text: cfg.legenda_estrangeiro });
        }
        return kick(conn, meta.id, participanteLid, 1000);
      }

      const ddd = numero.substring(2, 4);
      if (cfg.ANTI_DDD?.active && cfg.ANTI_DDD.listaProibidos?.includes(ddd)) {
        conn.sendMessage(meta.id, {
          text: `@${numero} tem DDD bloqueado (${DDD_MAP[ddd] || 'Desconhecido'}).`,
          mentions: [participante],
        });
        return kick(conn, meta.id, participanteLid, 1000);
      }
    }

    if (cfg.antifake && !numero.startsWith('55')) return;

    const [w1, w2] = cfg.wellcome || [];
    const padrao = isAdd ? `Bem-vindo(a) @${numero}!` : `Tchau @${numero}!`;

    const montar = (tpl) => String(tpl)
      .replace(/#hora#/g, agora())
      .replace(/#nomedogp#/g, meta.subject || '')
      .replace(/#numerodele#/g, '@' + numero)
      .replace(/#numerobot#/g, conn.user.id)
      .replace(/#prefixo#/g, cfg.multiprefix ? cfg.prefixos[0] : setting.prefix)
      .replace(/#descrição#/g, meta.desc || '')
      .replace(/#estado#/g, getEstado(numero));

    if (w1?.bemvindo1) {
      const tpl = w1[isAdd ? 'legendabv' : 'legendasaiu'];
      const buff = await getFundo(isAdd ? fundo1 : fundo2);
      const caption = tpl ? montar(tpl) : padrao;
      conn.sendMessage(meta.id, buff
        ? { image: buff, caption, mentions: [participante] }
        : { text: caption, mentions: [participante] });
    }

    if (w2?.bemvindo2) {
      const tpl = w2[isAdd ? 'legendabv' : 'legendasaiu'];
      conn.sendMessage(meta.id, { text: tpl ? montar(tpl) : padrao, mentions: [participante] });
    }

    if (action === 'remove') {
      const gi = countMessage.findIndex((g) => g.groupId === meta.id);
      if (gi !== -1) {
        const pi = countMessage[gi].numbers.findIndex((p) => p.id === participante);
        if (pi !== -1) {
          countMessage[gi].numbers.splice(pi, 1);
          salvarCountMessage();
        }
      }
    }
  } catch (e) {
    log.erro('Handler de participantes: ' + (e?.message || e));
  }
}

// ══════════════════════════════════════════════════════════
//  HANDLER ─ MENSAGENS
// ══════════════════════════════════════════════════════════

function handleMessagesUpsert(upsert, conn) {
  if (typeof startBase !== 'function') return;

  for (const msg of upsert.messages) {
    const isNew = (msg.messageTimestamp || 0) > sessionStartTime;
    setImmediate(() => {
      startBase({ ...upsert, messages: [msg] }, conn, QR_CODE_PATH, isNew)
        .catch((err) => log.erro('Mensagem: ' + (err?.message || err)));
    });
  }
}

// ══════════════════════════════════════════════════════════
//  HANDLER ─ CONEXÃO
// ══════════════════════════════════════════════════════════

async function handleConnectionUpdate(update, conn) {
  const { connection, lastDisconnect, qr } = update;

  if (qr && modoQR) {
    telaQR();
    qrcodeTerminal.generate(qr, { small: true });
    console.log('');
  }

  if (connection === 'close') {
    if (conn !== sock) return; // socket antigo, ignora

    const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
    const motivo = MOTIVO_DESCONEXAO[code] || `Erro ${code || 'desconhecido'}`;

    if (code === DisconnectReason.loggedOut) {
      console.log('');
      caixa([
        centro(paint('white', 'O aparelho foi desconectado.')),
        centro(paint('gray', `Apague a pasta "${QR_CODE_PATH}" e conecte de novo.`)),
      ], { cor: 'red', titulo: '✗  D E S C O N E C T A D O  ✗' });
      console.log('');
      return;
    }

    const espera = Math.min(30000, 2000 * Math.max(1, tentativas));
    tentativas++;
    log.aviso(`${motivo} — reconectando em ${espera / 1000}s (tentativa ${tentativas})`);
    setTimeout(() => iniciarConexao().catch((e) => log.erro(e.message)), espera);
    return;
  }

  if (connection === 'connecting') {
    log.dim('Estabelecendo conexão...');
    return;
  }

  if (connection === 'open') {
    tentativas = 0;
    modoQR = false;
    sessionStartTime = Math.floor(Date.now() / 1000);

    telaConectado(conn);
    conn.sendPresenceUpdate('available').catch(() => {});

    if (!monitorAtivo) {
      monitorAtivo = true;
      startMonitor();
    }
    fecharRL();
  }
}

// ══════════════════════════════════════════════════════════
//  MENU DE CONEXÃO
// ══════════════════════════════════════════════════════════

async function pedirCodigo(conn) {
  try {
    console.log('');
    log.dim('Exemplo: +55 27 99999-9999');
    const bruto = await perguntar(paint('cyan', '  ◈ Número do bot: '));
    const numero = bruto.replace(/\D/g, '');

    if (numero.length < 10) {
      log.erro('Número inválido.');
      return pedirCodigo(conn);
    }

    const codigo = formatarCodigo(await conn.requestPairingCode(numero));
    telaCodigo(codigo);
    fecharRL();
  } catch (e) {
    log.erro('Falha ao gerar o código: ' + (e?.message || e));
  }
}

async function menuConexao(conn) {
  telaMenu();
  const op = (await perguntar(paint('white', '  ╰─➤ '))).trim();

  switch (op) {
    case '1':
      return pedirCodigo(conn);
    case '2':
      modoQR = true;
      log.info('Aguardando QR Code...');
      return;
    case '3':
      telaSuporte();
      return menuConexao(conn);
    default:
      log.erro('Opção inválida.');
      return menuConexao(conn);
  }
}

// ══════════════════════════════════════════════════════════
//  CONEXÃO
// ══════════════════════════════════════════════════════════

const msgRetryCounterCache = new NodeCache({ stdTTL: 300, checkperiod: 120, useClones: false });

async function iniciarConexao() {
  if (conectando) return;
  conectando = true;

  try {
    try { sock?.ev?.removeAllListeners?.(); } catch {}

    const { state, saveCreds } = await useMultiFileAuthState(QR_CODE_PATH);
    const jaLogado = fs.existsSync(`${QR_CODE_PATH}/creds.json`);

    const conn = makeWASocket({
      version: WA_VERSION,
      logger: pino({ level: 'silent' }),
      browser: ['Linux', 'Opera', '10.0.22631'],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: false,
      syncFullHistory: false,
      keepAliveIntervalMs: 30000,
      msgRetryCounterCache,
      // reaproveita o cache global de metadados: menos chamadas à API do WhatsApp
      cachedGroupMetadata: async (jid) => {
        const m = global._groupMetaCache?.get(jid);
        return m?.participants ? m : undefined;
      },
    });

    sock = conn;
    conn.ev.on('creds.update', saveCreds);

    conn.ev.process(async (ev) => {
      if (ev['connection.update']) await handleConnectionUpdate(ev['connection.update'], conn);
      if (ev['messages.upsert']?.messages) handleMessagesUpsert(ev['messages.upsert'], conn);

      if (ev['groups.update']) {
        for (const g of ev['groups.update']) if (g?.id) global._groupMetaCache?.delete(g.id);
      }

      if (ev['group-participants.update']) {
        const lista = Array.isArray(ev['group-participants.update'])
          ? ev['group-participants.update']
          : [ev['group-participants.update']];
        for (const u of lista) await handleGroupParticipantsUpdate(u, conn);
      }
    });

    conectando = false;
    if (!jaLogado) await menuConexao(conn);
  } catch (e) {
    conectando = false;
    throw e;
  }
}

// ══════════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════════

console.clear();
garantirPastas();

caixa([
  centro(paint('magenta', '✿  M I Z U K I B O T - M D  ✿')),
  centro(paint('gray', 'iniciando os módulos...')),
  SEP,
  paint(startBase ? 'green' : 'red', startBase ? '✓' : '✗') + paint('white', ' index.js'),
  paint('green', '✓') + paint('white', ' banco de dados'),
  paint('green', '✓') + paint('white', ' baileys'),
], { cor: 'magenta' });
console.log('');

iniciarConexao().catch((e) => {
  log.erro('Erro na inicialização: ' + e.message);
  log.dim(e.stack || '');
  setTimeout(() => iniciarConexao().catch(() => {}), 5000);
});

process.on('SIGINT', () => {
  fecharRL();
  console.log('\n' + paint('magenta', '  ✿ Até logo!') + '\n');
  process.exit(0);
});

process.on('uncaughtException', (err) => log.erro('Exceção: ' + err.message));
process.on('unhandledRejection', (r) => log.erro('Promessa rejeitada: ' + (r?.message || r)));
