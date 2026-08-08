const _origStderr = process.stderr.write.bind(process.stderr);
process.stderr.write = (chunk, ...args) => {
  const str = typeof chunk === 'string' ? chunk : chunk.toString();
  if (str.includes('Closing session')) return true;
  return _origStderr(chunk, ...args);
};

const {
  downloadContentFromMessage, relayWAMessage, generateWAMessageContent,
  mentionedJid, processTime, MediaType, Browser, MessageType, Presence,
  Mimetype, jidNormalizedUser, Browsers, delay, getLastMessageInChat,
  proto, prepareWAMessageMedia
} = require('@whiskeysockets/baileys');


const path= require('path');
const ffmpeg = require('fluent-ffmpeg');
const baileys = require('@whiskeysockets/baileys');
const https = require('https')
const http = require('http')
const yt= require('ytdl-core');
const yts  = require('yt-search');
const axios = require('axios');
const os= require('os');
const { randomBytes } = require("crypto");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

require('./dono/infos/infos_global.js');

const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { palavrasANA, quizanimais, enigmaArchive, garticArchives, whatMusicAr, quizFutebol } = require('./banco de dados/grupos/games/jogos.js');

const {
  fs, crypto, util, P, linkfy, request, cheerio, ms,
  webp_mp4, qrterminal, exec, spawn, execSync, moment,
  color, time, date, getBuffer, convertSticker, recognize,
  fetchJson, fetchText, getBase64, createExif, response,
  addLimit, upload, nit, addBanned, unBanned, BannedExpired,
  cekBannedUser, validmove, setGame, addComandosId, deleteComandos,
  getComandoBlock, getComandos, addComandos, getpc, supre, wait,
  getExtension, generateMessageID, rgtake, getGroupAdmins, getMembros,
  getRandom, infoSystem, banner2, banner3, temporizador, chyt, kyun,
  botoff, colors, muted, comand, rgp, rg_aluguel
} = require('./proxy.js');

const {
  menu, menunews, anotacao, infosorteio, menudono, adms, menulogos,
  efeitos, menuprem, brincadeiras, infocontador, infoduelo, infobemvindo,
  idiomagtts, infolistanegra, infotransmitir, infopalavrao, infobancarac,
  infodono, configbot, cmd_termux, alteradores, menubaixar, tabela,
  conselhob, palavrasc, ban, nescessario, setting, logoslink, premium,
  countMessage, sendVideoAsSticker, sendImageAsSticker, sendVideoAsSticker2,
  sendImageAsSticker2, sotoy, daily, comandos, limitefll, rggold, anotar,
  black_, enviarfiguUrl, getFileBuffer, DLT_FL, sleep, ANT_LTR_MD_EMJ
} = require('./proxy.js');

var {
  antipv3, TOKEN_GPT, isRecolherLink, cmdpremium, msgantipv2,
  visualizarmsg, dono1, dono2, dono3, dono4, dono5, dono6
} = require('./dono/nescessario.json');

const Links_P = require('./banco de dados/links.json');
const logoBot  = fs.readFileSync('./dono/logo.jpg');

var {
  fundo1, fundo2, imgnazista, imggay, imgcorno, imggostosa, imggostoso,
  imgfeio, imgvesgo, imgbebado, imggado, matarcmd, beijocmd, chutecmd, comercmd, 
  tapacmd, rnkgay, rnkgado, rnkcorno, rnkgostoso, rnkgostosa,
  rnknazista, rnkotaku, rnkpau
} = require('./banco de dados/links.json');

// ── Caches globais (persistem entre mensagens) ──────────────
const gruposConhecidos = new Set();
const dirTicTacToeCache = new Set();
const _groupMetaCache = global._groupMetaCache || (global._groupMetaCache = new Map());

let _allCasesCache  = null;
let _allCasesCacheTime = 0;
setInterval(() => {
  if (_groupMetaCache.size > 50) {
    const keys = [..._groupMetaCache.keys()];
    const toDelete = keys.slice(0, _groupMetaCache.size - 50);
    toDelete.forEach(key => _groupMetaCache.delete(key));
  }
}, 60000); // Limpa a cada 1 minuto

function getAllCasesCached() {
  if (_allCasesCache && Date.now() - _allCasesCacheTime < 300000) return _allCasesCache; // 5 minutos
  const raw = fs.readFileSync('index.js').toString().match(/case\s+'(.+?)'/g) || [];
  _allCasesCache = raw.map(i => i.split(`'`)[1]);
  _allCasesCacheTime = Date.now();
  return _allCasesCache;
}

let _antispamCache = null, _antispamCacheTime = 0;
function getAntispam() {
  if (_antispamCache && Date.now() - _antispamCacheTime < 30000) return _antispamCache;
  try { _antispamCache = JSON.parse(fs.readFileSync('./arquivos/antispam.json')); }
  catch { _antispamCache = {}; }
  _antispamCacheTime = Date.now();
  return _antispamCache;
}

// ── getCachedGroupMeta FORA do handler ───────────────────────
async function getCachedGroupMeta(conn, jid, force = false) {
  const hit = _groupMetaCache.get(jid);
  if (!force && hit && Date.now() - hit.t < 5 * 60 * 1000) return hit.meta;
  const meta = await conn.groupMetadata(jid);
  _groupMetaCache.set(jid, { meta, t: Date.now() });
  return meta;
}

// ── extrairTexto FORA do handler ────────────────────────────
const _EXTRACT_PATHS = [
  'message.conversation',
  'message.sendPaymentMessage.noteMessage.extendedTextMessage.text',
  'message.requestPaymentMessage.noteMessage.extendedTextMessage.text',
  'message.viewOnceMessageV2.message.imageMessage.caption',
  'message.viewOnceMessageV2.message.videoMessage.caption',
  'message.imageMessage.caption',
  'message.videoMessage.caption',
  'message.extendedTextMessage.text',
  'message.viewOnceMessage.message.videoMessage.caption',
  'message.viewOnceMessage.message.imageMessage.caption',
  'message.documentWithCaptionMessage.message.documentMessage.caption',
  'message.buttonsMessage.imageMessage.caption',
  'message.buttonsResponseMessage.selectedButtonId',
  'message.listResponseMessage.singleSelectReply.selectedRowId',
  'message.templateButtonReplyMessage.selectedId',
  'message.pollCreationMessageV3.name',
  'message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage.text',
  'message.editedMessage.message.protocolMessage.editedMessage.imageMessage.caption',
  'text',
  'message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson',
];

function extrairTexto(info) {
  for (const p of _EXTRACT_PATHS) {
 const value = p.split('.').reduce((obj, key) => obj?.[key], info);
 if (value) {
if (p.includes('paramsJson')) {
  try { return JSON.parse(value)?.id || ''; } catch { return ''; }
}
return value;
 }
  }
  return '';
}

// ── Funções utilitárias FORA do handler ─────────────────────
const {
  startMonitor, getImageCached, writeJSONDebounced,
  readJSONCached, memReport, forceCleanup, throttle
} = require('./banco de dados/func/optimizer');

const rmLetras = (txt) =>
  txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

var {
  NomeDoBot, NickDono, nomecanal, newscanal, prefix, VEX_API_KEY, API_KEY_ZERO, API_KIMORI_URL, APIKEY_KIMORI, zerosite } = require('./dono/settings.json');

global.API_KEY_ZERO = API_KEY_ZERO;
global.zerosite  = zerosite;
global.API_KIMORI_URL = API_KIMORI_URL;
global.APIKEY_KIMORI = APIKEY_KIMORI;


try {
  var recolherLNK = JSON.parse(fs.readFileSync('./arquivos/armor/funcoes/recolherLNK.json'));
} catch {
  fs.writeFileSync('./arquivos/armor/funcoes/recolherLNK.json', JSON.stringify([]));
  var recolherLNK = [];
}

const { mensagens: _mensagensCache, sortear } = require('./arquivos/armor/js/aleatoria.js');
const { Sticker }  = require('./arquivos/armor/sticker/rename/sticker.js');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./banco de dados/exif');
const { imageToWebp2, videoToWebp2, writeExifImg2, writeExifVid2 } = require('./banco de dados/exif2');
const NodeFormData  = require('form-data');
const { registrarNoPrefix, removerNoPrefix, getComandoNoPrefix, listarNoPrefix } = require('./banco de dados/func/command.js');

const banfigsFile = './banco de dados/banfig.json';
let banfigs = fs.existsSync(banfigsFile) ? JSON.parse(fs.readFileSync(banfigsFile)) : {};
function saveBanFig() {
  fs.writeFileSync(banfigsFile, JSON.stringify(banfigs, null, 2));
}

// ── Cache antiMeta ───────────────────────────────────────────
let _antimetaCache = null, _antimetaCacheTime = 0;
function getAntiMeta() {
  if (_antimetaCache && Date.now() - _antimetaCacheTime < 30000) return _antimetaCache;
  try { _antimetaCache = JSON.parse(fs.readFileSync('./banco de dados/antimetaia.json', 'utf8')); }
  catch { _antimetaCache = {}; }
  _antimetaCacheTime = Date.now();
  return _antimetaCache;
}

const getSimilarity = require('./arquivos/similaridade.js');

function TimeCount(seconds) {
  function pad(s) { return (s < 10 ? '0' : '') + s; }
  const dias = Math.floor(seconds / (60 * 60 * 24));
  const horas = Math.floor((seconds / (60 * 60)) % 24);
  const minutos = Math.floor((seconds % (60 * 60)) / 60);
  const segundos = Math.floor(seconds % 60);
  if (dias > 0) return `${pad(dias)} ᴅ, ${pad(horas)} ʜʀ, ${pad(minutos)} ᴍɪɴ ᴇ ${pad(segundos)} ꜱᴇɢ`;
  if (horas > 0)return `${pad(horas)} ʜʀ, ${pad(minutos)} ᴍɪɴ ᴇ ${pad(segundos)} ꜱᴇɢ`;
  if (minutos > 0) return `${pad(minutos)} ᴍɪɴ ᴇ ${pad(segundos)} ꜱᴇɢ`;
  return `${pad(segundos)} ꜱᴇɢ`;
}

async function getProfilePicture(jid) {
  try { return await conn.profilePictureUrl(jid, 'image'); }
  catch { return 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'; }
}

const speed= require('performance-now');
const versionBaileys = require('@whiskeysockets/baileys/package.json').version;
const firstV  = speed();
const secondV = speed() - firstV;
const timestamp  = speed();
const fast = speed() - timestamp;
let uptimeBot = TimeCount(process.uptime());
let inicio = Date.now();
let pingVelo  = ((Date.now() - inicio) / 1000).toFixed(3);

var numerodono_ofc = setting.numerodono.replace(new RegExp('[()+-/ +/]', 'gi'), '');

const SNET  = '@s.whatsapp.net';
const API_BASE = 'https://api.nexfuture.com.br/api/outros';
const qs = require('qs');
const KEY_PUXADAS= 'SANDRO_API_DADOS';
const API_KEY_TOKITO = 'HITADORI07';

var downon = 'Sistema cancelou a operação, devido a demora na resposta...';
const img2= 'https://i.ibb.co/ZpHGt7b6/b9e764d4303e.jpg';
const enigma = 'https://telegra.ph/file/15be608763684b3e3af38.jpg';
const rvenigma = 'https://telegra.ph/file/15be608763684b3e3af38.jpg';

function normalizeJid(jid) {
  if (!jid || typeof jid !== 'string') return null;
  let id = jid.replace(/:.*(?=@)/, '');
  if (id.endsWith('@lid')) id = id.replace('@lid', '@s.whatsapp.net');
  else if (!id.endsWith('@s.whatsapp.net')) id += '@s.whatsapp.net';
  return id;
}

function VR_EMJ_LMD(text) {
  return /[\u0300-\u036F\u0483-\u0489\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g.test(text);
}

process.on('uncaughtException', (err) => {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
});

// ── Sets de controle (fora do handler) ──────────────────────
const BLC_CL = new Set();
const BLC_ANTCL = new Set();
const MSG_ANTPV2 = new Set();
const RPT_M  = new Set();

// ── ultimosNicks (fora do handler) ──────────────────────────
const ultimosNicks = {};

// ── groupIdscount derivado de countMessage UMA VEZ ──────────
// Será recalculado só quando countMessage mudar — não por mensagem
function getGroupIdsCount() {
  return countMessage.map(i => i.groupId);
}

// ─────────────────────────────────────────────────────────────
// startbase — handler principal
// ─────────────────────────────────────────────────────────────
async function startbase(upsert, conn, qrcode, sessionStartTim) {


function _makeSticker_sendImageAsSticker(conn_gl) {
  conn_gl.sendImageAsSticker = async (jid, p, options = {}) => {
 let buff = Buffer.isBuffer(p) ? p
: /^data:.*?\/.*?;base64,/i.test(p) ? Buffer.from(p.split`,`[1], 'base64')
: /^https?:\/\//.test(p) ? await getBuffer(p)
: fs.existsSync(p) ? fs.readFileSync(p)
: Buffer.alloc(0);
 const buffer = (options.packname || options.author)
? await writeExifImg(buff, options)
: await imageToWebp(buff);
 conn_gl.sendMessage(jid, { sticker: { url: buffer }, ...options });
 return buffer;
  };
}

// ── Garante sendImageAsSticker no conn UMA vez por sessão ───
if (!conn.__stickerHelperRegistered) {
  conn.__stickerHelperRegistered = true;
  _makeSticker_sendImageAsSticker(conn);
}

if (!sessionStartTim) return;

const nmrdn_dono2 = setting.numerodono.replace(new RegExp('[()+-/ +/]', 'gi'), '') + SNET;

for (const info of upsert?.messages || []) {

  let from = info.key.remoteJid;
  const isGroup2 = from.endsWith('@g.us');

  if (!isGroup2 && from?.includes('@lid')) {
 const alt = info.key.remoteJidAlt || '';
 if (alt.includes('@s.whatsapp.net')) from = alt;
  }
  if (from.includes('@lid')) {
 if (info.key.senderPn) from = info.key.senderPn;
 else if (info.key.participantPn) from = info.key.participantPn;
  }

  const isGroup = from.endsWith('@g.us');

  var jsonGp = isGroup && fs.existsSync(`./banco de dados/grupos/${from}.json`)
 ? readJSONCached(`./banco de dados/grupos/${from}.json`)
 : null;

  const VR_JSON_GLOBAL = gruposConhecidos.has(from) ||
 (fs.existsSync(`./banco de dados/grupos/${from}.json`) && !!gruposConhecidos.add(from));

if (!dirTicTacToeCache.has('ok')) {
  if (!fs.existsSync('./arquivos/armor/tictactoe/db')) 
    fs.mkdirSync('./arquivos/armor/tictactoe/db', { recursive: true });
  dirTicTacToeCache.add('ok');
}

const JOGO_D_V = fs.existsSync(`./arquivos/armor/tictactoe/db/${from}.json`)
  ? readJSONCached(`./arquivos/armor/tictactoe/db/${from}.json`)
  : false;

  if (VR_JSON_GLOBAL && dataGp?.[0]?.x9 && info.messageStubType) {
 switch (info.messageStubType) {
case 29:
  await delay(1000);
  conn.sendMessage(info.key.remoteJid, {
 text: `O usuario @${info.messageStubParameters[0].split('@')[0]} foi promovido pelo @${info.participant.split('@')[0]}`,
 mentions: [info.messageStubParameters[0], info.participant]
  });
  break;
case 30:
  await delay(1000);
  conn.sendMessage(info.key.remoteJid, {
 text: `O ADM @${info.messageStubParameters[0].split('@')[0]} foi rebaixado para membro comum pelo adm @${info.participant.split('@')[0]}`,
 mentions: [info.messageStubParameters[0], info.participant]
  });
  break;
 }
  }

  if (!info.message) continue;
  if (upsert.type === 'append') continue;

  const botNumber2 = conn.user.id.split(':')[0] + SNET;
  if (info.key.fromMe && !isGroup && !visualizarmsg) continue;

  const type = baileys.getContentType(info.message);
  const content = type === 'extendedTextMessage' ? JSON.stringify(info.message) : '';
  const pushname = info.pushName || '';

  if (from === 'status@broadcast') continue;
  if (visualizarmsg) conn.readMessages([info.key]);

  global.prefix;
  global.blocked;

  // body via função pré-compilada (fora do handler)
  var body = extrairTexto(info);

let groupMetadata = null;
if (isGroup) {
  try {
    groupMetadata = await getCachedGroupMeta(conn, from);
  } catch {
    groupMetadata = null;
  }
}

  if (isGroup && body && body.includes('@') && groupMetadata) {
 try {
const participants = groupMetadata.participants;
const mentionedJids = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
for (const lid of mentionedJids) {
  const participant = participants.find(p => p.id === lid || p.phoneNumber === lid);
  if (participant) {
 const numeroReal = (participant.phoneNumber || participant.id).split('@')[0];
 const lidNumero  = lid.split('@')[0];
 body = body.replace(new RegExp(lid, 'g'), numeroReal);
 body = body.replace(new RegExp(lidNumero, 'g'), numeroReal);
 body = body.replace(new RegExp(`@${lidNumero}`, 'g'), numeroReal);
  }
}
 } catch (err) {
console.log('Erro ao substituir LIDs:', err);
 }
  }
  const mention = (teks = "", ms = info) => {
  memberr = [];
  vy = teks.includes("\n") ? teks.split("\n") : [teks];
  for (vz of vy) {
 for (zn of vz.split(" ")) {
if (zn.includes("@"))
  memberr.push(parseInt(zn.split("@")[1]) + SNET);
 }
  }
  conn.sendMessage(
 from,
 { text: teks.trim(), mentions: memberr },
 { quoted: ms }
  );
};

const mentions = async(teks = '', mb, id) => {
  (id == null || id == undefined || id == false)
 ? await conn.sendMessage(from, { text: teks.trim(), mentions: mb })
 : await conn.sendMessage(from, { text: teks.trim(), mentions: mb }, { quoted: selo })
}

  var Procurar_String = body;
  const bodyStr = (body || '').toString();
  let args = bodyStr.trim().split(/ +/).slice(1);
  body = String(body || '');
  const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (isGroup && VR_JSON_GLOBAL) {
 if (jsonGp[0].multiprefix) {
var prefix = jsonGp[0]?.prefixos.find(p => String(body)?.trim()?.startsWith(p)) || jsonGp[0].prefixos[0];
 } else {
var prefix = setting.prefix;
 }
  } else {
 var prefix = setting.prefix;
  }

  var isCmd= body.trim().startsWith(prefix);
  let command = isCmd ? budy2.trim().slice(1).split(/ +/).shift().toLocaleLowerCase() : null;
  const q_2= budy2.trim().split(/ +/).slice(1).join(' ');
  let q = args.join(' ');

  var budy = info?.message?.conversation || info?.message?.extendedTextMessage?.text || '';
  var budy3 = budy.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  var PR_String = Procurar_String.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const q_ofc = PR_String.trim().split(/ +/).slice(1).join(' ');

  // ── Sender resolve ──────────────────────────────────────────
  
let sender;
  if (isGroup) {
 const raw = info.key.participantPn || info.key.senderPn || info.key.participant || '';
 const alt = info.key.participantAlt || '';
 const botLid = (conn.user.lid?._serialized || conn.user.lid || '').split(':')[0] + '@lid';
 const isBotSender = info.key.fromMe || (botLid && raw === botLid);

 if (isBotSender && (!raw || raw.includes('@lid'))) {
sender = jidNormalizedUser(conn.user.id.split(':')[0] + '@s.whatsapp.net');
 } else if (alt && alt.includes('@s.whatsapp.net')) {
sender = jidNormalizedUser(alt);
 } else if (raw.includes('@lid')) {
let resolved = '';
for (const [jid, c] of Object.entries(conn.contacts || {})) {
  const cLid = typeof c.lid === 'string' ? c.lid : c.lid?._serialized;
  if (cLid === raw) { resolved = jidNormalizedUser(jid); break; }
}
if (!resolved) {
  try {
 const gm = await getCachedGroupMeta(conn, from);
 const member = gm.participants.find(p => {
const mLid = typeof p.lid === 'string' ? p.lid : p.lid?._serialized;
return mLid === raw;
 });
 if (member) resolved = jidNormalizedUser(member.phoneNumber || member.id);
  } catch {}
}
sender = resolved || jidNormalizedUser(raw);
 } else {
sender = jidNormalizedUser(raw);
 }
  } else {
 if (info.key.fromMe) {
sender = jidNormalizedUser(conn.user.id.split(':')[0] + '@s.whatsapp.net');
 } else {
const alt= info.key.remoteJidAlt || '';
const rawPv = info.key.senderPn || info.key.participantPn || info.key.remoteJid || '';
if (alt && alt.includes('@s.whatsapp.net')) {
  sender = jidNormalizedUser(alt);
} else if (rawPv.includes('@lid')) {
  let resolved = '';
  for (const [jid, c] of Object.entries(conn.contacts || {})) {
 const cLid = typeof c.lid === 'string' ? c.lid : c.lid?._serialized;
 if (cLid === rawPv) { resolved = jidNormalizedUser(jid); break; }
  }
  sender = resolved || jidNormalizedUser(rawPv);
} else {
  sender = jidNormalizedUser(rawPv);
}
 }
  }

  const groupName = isGroup && groupMetadata ? groupMetadata.subject : '';
  const messagesC = PR_String.slice(0).trim().split(/ +/).shift().toLowerCase();
  const arg = body.substring(body.indexOf(' ') + 1);
  const botNumberLID = (conn?.user?.lid?.split(':')[0] + '@lid') || '';
  const botNumber = conn.user.id.split(':')[0] + SNET;
  const argss  = body.split(/ +/g);
  const testat = body;
  const ants= body;
  const groupDesc = isGroup && groupMetadata ? groupMetadata.desc : '';
  const groupMembers = isGroup && groupMetadata ? groupMetadata.participants : [];
const isnit   = Array.isArray(nit) ? nit.includes(sender) : false;
const issupre = Array.isArray(supre) ? supre.includes(sender) : false;
const ischyt  = Array.isArray(chyt) ? chyt.includes(sender) : false;
  const groupAdmins  = isGroup && groupMembers.length ? getGroupAdmins(groupMembers) : [];
  const somembros = isGroup && groupMembers.length ? getMembros(groupMembers) : [];
  const quotedJid = info.message.extendedTextMessage?.contextInfo?.participant;

  const nmrdn = setting.numerodono.replace(new RegExp('[()+-/ +/]', 'gi'), '') + SNET || isnit;
  const numerodono = [
 `${nmrdn}`,
 `${dono1}@s.whatsapp.net`, `${dono2}@s.whatsapp.net`,
 `${dono3}@s.whatsapp.net`, `${dono4}@s.whatsapp.net`,
 `${dono5}@s.whatsapp.net`, `${dono6}@s.whatsapp.net`,
  ];
  var enviarmen = _mensagensCache[Math.floor(Math.random() * _mensagensCache.length)];

  const dirGroup = `./banco de dados/grupos/${from}.json`;
  const nescj = './dono/nescessario.json';

  const data_IDGP = [{ name: groupName, groupId: from, x9: false, antiimg: false, antivideo: false, antiaudio: false, antisticker: false, antidoc: false, antictt: false, antiloc: false, antilinkgp: false, antilinkhard: false, antifake: false, Odelete: false, antinotas: false, anticatalogo: false, sistemGold: false, visuUnica: false, registrarFIGUS: false, soadm: false, rg_aluguel: false, listanegra: [], advertir: [], prefixos: ['!'], advertir2: [], legenda_estrangeiro: '0', legenda_documento: '0', legenda_video: '0', legenda_imagem: '0', multiprefix: false, forca_ofc: [{ acertos: 0, erros: 0, palavra: [], escreveu: [], palavra_ofc: 0, dica: 0, tema: 0 }], minerar_gold: [], ausentes: [], forca_inc: false, antipalavrao: { active: false, palavras: [] }, limitec: { active: false, quantidade: null }, wellcome: [{ bemvindo1: false, legendabv: '🤖: Bem-vindo(a) #numerodele#, esperamos que aproveite e participe no grupo. também não esqueça de ler as regras na descrição e as cumpra!', legendasaiu: '🤖: @#numerodele# saiu do grupo, agradeço pela participação e pelos bons momentos que tivemos por aqui. esperamos te ver de volta em breve!' }, { bemvindo2: false, legendabv: 'Olá #numerodele#, seja bem vindo (a)', legendasaiu: '#numerodele# – Saiu do grupo: #nomedogp#' }], autosticker: false, autoresposta: false, jogos: false, level: false, bangp: false, nsfw: false }];

  if (isGroup && !fs.existsSync(dirGroup)) {
 fs.writeFileSync(dirGroup, JSON.stringify(data_IDGP, null, 2) + '\n');
  }

  try {
 var dataGp = isGroup ? readJSONCached(dirGroup) : undefined;
  } catch {
 fs.writeFileSync(dirGroup, JSON.stringify(data_IDGP));
 var dataGp = data_IDGP;
  }

  function setGp(index) {
 fs.promises.writeFile(dirGroup, JSON.stringify(index, null, 2) + '\n').catch(console.error);
  }
  function setNes(index) {
 fs.writeFileSync(nescj, JSON.stringify(index, null, 2));
  }

const _now = moment.tz('America/Sao_Paulo');
const hora120 = _now.format('HH:mm:ss');
const hora_ = _now.format('HH:mm');
const hora_2 = _now.format('mm');
const dattofc = _now.format('DD/MM/YYYY');
const hourofc = _now.format('HH:mm:ss');
let horaSattz = hourofc;
let dataSattz = dattofc;
const hora7 = hourofc;

  const adivinha = info.key.id.length > 21 ? 'Android ツ'
 : info.key.id.substring(0, 2) === '3A' ? 'IPhone ｯ'
 : 'WhatsApp web シ';

  const quoted = info.quoted ? info.quoted : info;
  const isBot  = info.key.fromMe || sender === botNumber;

  const SoDono = numerodono.includes(sender) || isBot || isnit || issupre || ischyt;
  dfndofc = setting.numerodono + SNET;
  const DonoOficial  = dfndofc.includes(sender);
  const numeroCriador = '5527992870575';
  const numeroUser = sender.split('@')[0];
  const SoCreator = numeroUser === numeroCriador || !!isnit || !!issupre || !!ischyt;

  const isPremium  = premium.includes(sender) || SoDono;
  const isChVip = isPremium ? '✅' : '❌';
  const isBotGroupAdmins = groupAdmins.includes(botNumber);
  const isGroupAdmins = groupAdmins.includes(sender) || false || DonoOficial;
  const isBanned= ban.includes(sender);
  const isVisualizar  = nescessario.visualizarmsg;
  const isVerificado  = nescessario.verificado;
  const isAudioMenu= nescessario.menu_audio;
  const isAntiPv2  = nescessario.antipv2;
  const isAntiPv3  = nescessario.antipv3;
  const isConsole  = nescessario.consoleoff;
  const isBotoff= nescessario.botoff;
  const listanegraG= nescessario.listanegraG;
  const isAntiPv= nescessario.antipv;
  const isAnticall = nescessario.anticall;

  const isAntiImg  = isGroup && dataGp ? dataGp[0].antiimg : undefined;
  const isAntiVid  = isGroup && dataGp ? dataGp[0].antivideo : undefined;
  const isAntiAudio= isGroup && dataGp ? dataGp[0].antiaudio : undefined;
  const isAntiSticker = isGroup && dataGp ? dataGp[0].antisticker : undefined;
const isAntimention = isGroup && dataGp ? dataGp[0].antimention : undefined;
  const Antidoc = isGroup && dataGp ? dataGp[0].antidoc : undefined;
  const isAntiCtt  = isGroup && dataGp ? dataGp[0].antictt : undefined;
  const Antiloc = isGroup && dataGp ? dataGp[0].antiloc : undefined;
  const isAntilinkgp  = isGroup && dataGp ? dataGp[0].antilinkgp : undefined;
  const isAntiLinkHard = isGroup && dataGp ? dataGp[0].antilinkhard : undefined;
  const isAntifake = isGroup && dataGp ? dataGp[0].antifake : undefined;
  const IS_DELETE  = nescessario.Odelete;
  const So_Adm  = isGroup && dataGp ? dataGp[0].soadm : undefined;
  const isX9VisuUnica = isGroup && dataGp ? dataGp[0].visuUnica : false;
  const IS_sistemGold = isGroup && dataGp ? dataGp[0].sistemGold : undefined;
  const ADVT = isGroup && dataGp ? dataGp[0].advertir : undefined;
  const ADVT2= isGroup && dataGp ? dataGp[0].advertir2 : undefined;
  const isx9 = isGroup && dataGp ? dataGp[0].x9 : undefined;
  const isMultiP= isGroup && dataGp ? dataGp[0].multiprefix : undefined;
  const isAntiNotas= isGroup && dataGp ? dataGp[0].antinotas : undefined;
  const isAnticatalogo = isGroup && dataGp ? dataGp[0].anticatalogo : undefined;
  const isWelkom= isGroup && dataGp ? dataGp[0].wellcome[0].bemvindo1 : undefined;
  const isWelkom2  = isGroup && dataGp ? dataGp[0].wellcome[1].bemvindo2 : undefined;
  const isAutofigu = isGroup && dataGp ? dataGp[0].autosticker : undefined;
  const isAutorepo = isGroup && dataGp ? dataGp[0].autoresposta : undefined;
  const isModobn= isGroup && dataGp ? dataGp[0].jogos : undefined;
  const isBanchat  = isGroup && dataGp ? dataGp[0].bangp : undefined;
  const isNsfw  = isGroup && dataGp ? dataGp[0].nsfw : undefined;
  const isPalavrao = isGroup && dataGp ? dataGp[0]?.antipalavrao?.active : undefined;
  const isPalavras = isGroup && dataGp ? dataGp[0]?.antipalavrao?.palavras : undefined;
  const isAntiFlood= isGroup && dataGp ? dataGp[0]?.limitec?.active : undefined;
  const isLimitec  = isGroup && dataGp ? dataGp[0]?.limitec?.quantidade : undefined;
  const isAutodown = isGroup && dataGp ? dataGp[0].autodown : undefined;

  var Res_Aguarde = enviarmen;

  if (isVerificado) {
 var selo = info;
 var seloContact = {
key: { participant: `${sender.split('@')[0]}@c.us`, fromMe: false },
message: {
  contactMessage: {
 displayName: `${pushname}`,
 vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Banco\nORG:Banco;\nTEL;type=MSG;type=CELL;type=VOICE;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nEND:VCARD`,
  },
},
 };
  } else {
 var selo = info;
  }

  const allCases = isCmd ? getAllCasesCached() : [];
  const totalcmds = allCases.length || getAllCasesCached().length;
    const getJid = async (idRaw, from, cachedMeta = null) => {
 try {
const idBase = idRaw.replace(/@/g, '').trim();
const jidCompleto = `${idBase}@s.whatsapp.net`;
const lidCompleto = `${idBase}@lid`;
const metadata  = cachedMeta || await getCachedGroupMeta(conn, from);
const participante = metadata.participants.find(p =>
  p.jid === idRaw || p.lid === idRaw || p.jid === jidCompleto || p.lid === lidCompleto
);
return participante ? participante.jid : idRaw;
 } catch { return idRaw; }
  };

const menc_prt_raw = info.message?.extendedTextMessage?.contextInfo?.participant;
const menc_jid_raw = args?.join(' ').replace(/@/g, '').trim();
const menc_jid2_raw = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;

const menc_prt  = (isCmd && isGroup && menc_prt_raw) ? await getJid(menc_prt_raw, from, groupMetadata) : null;
const menc_jid = (isCmd && isGroup && menc_jid_raw && menc_jid_raw.includes('@'))
  ? await getJid(menc_jid_raw, from, groupMetadata) : null;
const menc_jid2 = (isCmd && isGroup && menc_jid2_raw?.length > 0)
  ? await Promise.all(menc_jid2_raw.map(id => getJid(id, from, groupMetadata)))
  : [];

const sender_ou_n = q.includes('@') ? (menc_jid || sender) : sender;
const numero_digitado = q.length > 6 && !q.includes('@')
  ? q.replace(new RegExp('[()+-/ +/]', 'gi'), '') : null;
const mrc_ou_numero = numero_digitado ? await getJid(numero_digitado, from, groupMetadata) : menc_prt;

let menc_os2 = menc_jid2[0] || (q.includes('@') ? menc_jid : menc_prt);

const marc_tds = (isCmd && isGroup) ? await (async () => {
  if (q.includes('@')) return menc_jid;
  if (q.length > 6 && !q.includes('@')) {
    const nd = q.replace(new RegExp('[()+-/ +/]', 'gi'), '').trim();
    return await getJid(nd, from, groupMetadata);
  }
  return menc_prt;
})() : null;

const menc_prt_nmr = (isCmd && isGroup) ? await (async () => {
  if (q.length > 12 && !q.includes('@')) {
    const nd = q.replace(new RegExp('[()+-/ +/]', 'gi'), '').trim();
    return await getJid(nd, from, groupMetadata);
  }
  return menc_prt;
})() : null;

  var isUrl = (url) =>
 /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url);

  if (!isCmd && info.key.fromMe && type !== 'viewOnceMessageV2' && type !== 'viewOnceMessage') continue;

  const reply2 = (text) => {
 const mentions = [];
 const regex = /@(\d+)/g;
 let match;
 while ((match = regex.exec(text)) !== null) mentions.push(match[1] + '@s.whatsapp.net');
 return conn.sendMessage(from, {
text,
contextInfo: {
  isForwarded: true, forwardingScore: 1,
  forwardedNewsletterMessageInfo: { newsletterJid: newscanal, newsletterName: nomecanal, serverMessageId: '' }
},
...(mentions.length ? { mentions } : {})
 }, { quoted: selo }).catch(console.error);
  };

const reply = (text) => {
  const mentions = [...text.matchAll(/@(\d+)/g)].map(m => m[1] + '@s.whatsapp.net');
  return conn.sendMessage(
    from,
    { text, ...(mentions.length ? { mentions } : {}) },
    { quoted: selo }
  );
};
  
  const [h] = hora7.split(':').map(Number);
  let tempo;
  if (h >= 0 && h < 5) tempo = 'Boa madrugada';
  else if (h >= 5 && h < 12) tempo = 'Bom dia';
  else if (h >= 12 && h < 18) tempo = 'Boa tarde';
  else tempo = 'Boa noite';
  const time2 = tempo;

const reagir = async (idgp, emj, tentativas = 2) => {
  for (let i = 0; i <= tentativas; i++) {
    try {
      await conn.sendMessage(idgp, { react: { text: emj, key: info.key } });
      return;
    } catch (e) {
      if (i === tentativas) return;
      await new Promise(r => setTimeout(r, 150 * (i + 1)));
    }
  }
};

  const verificarN = async (sla) => {
 const [result] = await conn.onWhatsApp(sla);
 if (!result) reply('Este usuário não é existente no WhatsApp');
 else reply(`-> ${sla} Número inserido é existente no WhatsApp.\n\ncom o id: ${result.jid}`);
  };

  var sendlistA = async (id, txt1, txt2, title1, btext, but, vr) => {
 conn.sendMessage(id, { text: txt1, footer: txt2, title: title1, buttonText: btext, sections: but }, { quoted: vr });
  };

  const EnvLista = async (IDG, TXT1, TXT2, TTL, TTB, TTB2, ENVLRW) => {
 conn.sendMessage(IDG, { text: TXT1, footer: TXT2, title: TTL, buttonText: TTB, sections: [{ title: TTB2, rows: ENVLRW }] })
.catch(console.log);
  };

  if (isGroup && isBotGroupAdmins && !isGroupAdmins && !SoDono && !info.key.fromMe) {
 if (menc_jid2?.length >= groupMembers.length - 1) {
conn.sendMessage(from, { text: 'Membro comum com mensagem de marcação de todos do grupo, por conta disso irei remover do grupo, qualquer coisa entre em contato com um administrador...' });
if (IS_DELETE) setTimeout(() => {
  conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
}, 500);
conn.groupParticipantsUpdate(from, [sender], 'remove');
 }
  }

  const enviarfigu = async (figu, tag) => {
 conn.sendMessage(from, { sticker: { url: figu } }, { quoted: tag });
  };

  if (isAutofigu && isGroup) {
 (async () => {
setTimeout(async () => {
  if (budy.includes(`${prefix}sticker`) || budy.includes(`${prefix}s`) || budy.includes(`${prefix}stk`) || budy.includes(`${prefix}st`) || budy.includes(`${prefix}fsticker`) || budy.includes(`${prefix}f`) || budy.includes(`${prefix}fstiker`)) return;
  if (type === 'imageMessage') {
 const pack = `Criador (a) da Figurinha:\n• ↳ ${pushname} owner\n—\nVisite nosso Instagram:\n• ↳ instagram.com/@Mizuki244`;
 const owgi = await getFileBuffer(info.message.imageMessage, 'image');
 const enc  = await sendImageAsSticker2(conn, from, owgi, info, { packname: pack });
 DLT_FL(enc);
  }
  if (type === 'videoMessage' && isMedia && info.message.videoMessage.seconds < 10) {
 const pack = `Criador (a) da Figurinha:\n• ↳ ${pushname} owner\n—\nVisite nosso Instagram:\n• ↳ instagram.com/@Mizuki244`;
 const owgi = await getFileBuffer(info.message.videoMessage, 'video');
 const enc  = await sendVideoAsSticker2(conn, from, owgi, info, { packname: pack });
 DLT_FL(enc);
  }
}, 1000);
 })().catch(console.log);
  }


  const sendPoll = (mali, id, name = '', values = [], selectableCount = 1) => { 
return conn.sendMessage(id, {poll: {name, values, selectableCount}, messageContextInfo: { messageSecret: randomBytes(32)}}, {id, options: {userJid: conn?.user?.id}}).catch(() => {
return console.log(console.error);
});
}

  var nmrdnofc1 = setting.numerodono.replace(new RegExp('[()+-/ +/]', 'gi'), '');

  if (isGroup && fs.existsSync(`./arquivos/armor/json/afk-@${nmrdnofc1}.json`)) {
 if (budy.indexOf(`@${nmrdnofc1}`) >= 0) {
const tabelin = JSON.parse(fs.readFileSync(`./arquivos/armor/json/afk-@${nmrdnofc1}.json`));
conn.sendMessage(from, {
  text: `- Olá, o ${NickDono} está ausente.\n\n - Desde: ${tabelin.Ausente_Desde}\n\n- 😇 Mensagem de ausencia : ${tabelin.Motivo_Da_Ausência}`
}, { quoted: selo });
 }
  }

  if (isGroup && dataGp[0].ausentes?.length > 0 && menc_jid2?.length > 0 && JSON.stringify(dataGp[0].ausentes).includes(menc_jid2)) {
 const blue = [];
 for (const i of menc_jid2) {
if (groupAdmins.indexOf(String(i)) !== -1) blue.push(groupAdmins.indexOf(String(i)));
 }
 if (blue.length === 0) continue;
 const big = blue.map(i => groupAdmins[i]);
 const blr = big.map(i => dataGp[0].ausentes[dataGp[0].ausentes.map(i => i.id).indexOf(i)]);
 for (const i of blr) { var blak = i; }
 mention(Msg_Ausente
.replace('#usuario#', blak.id.split('@')[0])
.replace('#msg#', blak.msg)
 );
  }

  if (isBotGroupAdmins && isGroupAdmins && body === 'apaga') {
 if (!menc_prt) continue;
 conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.message.extendedTextMessage.contextInfo.stanzaId, participant: menc_prt } });
  }

  if ((SoDono && budy.includes('reiniciar-base')) || (info.key.fromMe && budy.includes('reiniciar-base'))) {
 fs.writeFileSync('./cnt-upd.json', JSON.stringify([], null, 2));
 setTimeout(() => {
const file = require.resolve('./iniciar.js');
delete require.cache[file];
require(file);
 }, 500);
 setTimeout(() => DLT_FL('./cnt-upd.json'), 1500);
  }

  const shuffle = (palavraOriginal) => {
 let palavra = `${palavraOriginal} `, armax = [];
 for (let i = 0; i < palavra.length; i++) armax.push({ l: palavra.split(palavra.slice(i + 1))[0].slice(i) });
 let shuffleProcess = '';
 const total = armax.length;
 for (let a = 0; a < total; a++) {
const toDoRandom = Math.floor(Math.random() * armax.length);
shuffleProcess += armax[toDoRandom].l;
armax.splice(toDoRandom, 1);
 }
 return shuffleProcess;
  };

  if (isGroup && isCmd && isBanchat && !SoDono) continue;
  if (isGroup && isCmd && So_Adm && !SoDono && !isGroupAdmins) continue;
  if (isBotoff && !SoDono) continue;

  const isImage = type === 'imageMessage';
  const isVideo = type === 'videoMessage';
  const isVisuU2= type === 'viewOnceMessageV2';
  const isAudio = type === 'audioMessage';
  const isSticker  = type === 'stickerMessage';
  const isContact  = type === 'contactMessage';
  const isLocation = type === 'locationMessage';
  const isProduct  = type === 'productMessage';
  const isMedia = type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage' || type === 'viewOnceMessage' || type === 'viewOnceMessageV2';

  let typeMessage = body.substr(0, 50).replace(/\n/g, '');
  if (isImage) typeMessage = 'Image';
  else if (isVideo)typeMessage = 'Video';
  else if (isAudio)typeMessage = 'Audio';
  else if (isSticker) typeMessage = 'Sticker';
  else if (isContact) typeMessage = 'Contact';
  else if (isLocation) typeMessage = 'Location';
  else if (isProduct) typeMessage = 'Product';

  const isQuotedMsg= type === 'extendedTextMessage' && content.includes('conversation');
  const isQuotedMsg2  = type === 'extendedTextMessage' && content.includes('text');
  const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage');
  const isQuotedVisuU = type === 'extendedTextMessage' && content.includes('viewOnceMessage');
  const isQuotedVisuU2= type === 'extendedTextMessage' && content.includes('viewOnceMessageV2');
  const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage');
  const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage');
  const isQuotedDocW  = type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage');
  const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage');
  const isQuotedSticker  = type === 'extendedTextMessage' && content.includes('stickerMessage');
  const isQuotedContact  = type === 'extendedTextMessage' && content.includes('contactMessage');
  const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage');
  const isQuotedProduct  = type === 'extendedTextMessage' && content.includes('productMessage');

  if (isGroup) {
 const checar = getComandos(from);
 if (checar === undefined) addComandosId(from);
  }
  if (isGroup && isCmd && !SoDono && !isnit && getComandoBlock(from).includes(command))
 return reply('💙 Este comando está *bloqueado* neste grupo! 💙');

  // ── LOG ─────────────────────────────────────────────────────
if (isConsole) {
  if (isGroup && info.message?.reactionMessage?.text) {
    console.log(colors.brightMagenta(`
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ REAÇÃO EM GRUPO
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ Nome: ${colors.brightYellow(pushname)}
│ এ Número: ${colors.brightCyan(sender.split('@')[0])}
│ এ Grupo: ${colors.cyan(groupName)}
│ এ Emoji: ${colors.brightGreen(info.message.reactionMessage.text)}
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯`));
    
  } else if (isGroup && !isCmd) {
    console.log(colors.brightCyan(`
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ MENSAGEM NO GRUPO
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ Nome: ${colors.brightYellow(pushname)}
│ এ Número: ${colors.brightCyan(sender.split('@')[0])}
│ এ Grupo: ${colors.cyan(groupName)}
│ এ Tipo: mensagem comum
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯`));
    
  } else if (isCmd && !isGroup) {
    console.log(colors.brightBlue(`
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ COMANDO PRIVADO
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ Nome: ${colors.brightYellow(pushname)}
│ এ Número: ${colors.brightCyan(sender.split('@')[0])}
│ এ Comando: ${colors.brightGreen(command)}
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯`));
    
  } else if (isCmd && isGroup) {
    console.log(colors.brightGreen(`
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ COMANDO EM GRUPO
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ Nome: ${colors.brightYellow(pushname)}
│ এ Número: ${colors.brightCyan(sender.split('@')[0])}
│ এ Grupo: ${colors.cyan(groupName)}
│ এ Comando: ${colors.brightMagenta(command)}
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯`));
    
  } else {
    console.log(colors.brightMagenta(`
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ MENSAGEM PRIVADA
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯
╭┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╮
│ এ Nome: ${colors.brightYellow(pushname)}
│ এ Número: ${colors.brightCyan(sender.split('@')[0])}
│ এ Interação sem comando
╰┄┄┄┄┄┄┄ೋღ 🌺 ღೋ┄┄┄┄┄┄┄╯`));
  }
}

if (isAntilinkgp && isGroup && isBotGroupAdmins && !isGroupAdmins) {
  if (Procurar_String.includes("chat.whatsapp.com/")) {
    if (isBot) return;

    let link_dgp;
    try { link_dgp = await conn?.groupInviteCode(from); }
    catch { link_dgp = "000000"; }

    if (Procurar_String.match(link_dgp)) return reply('Link do nosso grupo, não irei remover.. ');

    if (IS_DELETE) {
      setTimeout(() => {
        conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
      }, 500);
    }

    if (!groupMembers.some(p => p.id === sender || p.jid === sender)) return;

    try {
      await conn.groupParticipantsUpdate(from, [sender], 'remove');
    } catch (e) {
      console.error('Erro ao remover (soft antilink):', e);
    }

    return;
  }
}

const groupIdscount = getGroupIdsCount();

const countDays = (date1, date2) => {
if (!(date1 || date2)) return 0
date1 = new Date(date1[1]+"/"+date1[0]+"/"+date1[2])
date2 = new Date(date2[1]+"/"+date2[0]+"/"+date2[2])
const timeDiff = Math.abs(date2.getTime() - date1.getTime());
const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
return diffDays || 0
}

function obeso(peso, altura) {
 return Number(parseFloat(peso) / (parseFloat(altura) ** 2)).toFixed(2)
}



//========(CONTADOR-DE-MENSAGENS)========\\ LMR
var numbersIds = []

//============(EVAL-EXECUÇÕES)===========\\

if(budy.startsWith('>')){
try {
if(info.key.fromMe) return 
if(!SoDono && !isnit && !issupre && !ischyt && !issupre && !ischyt) return
console.log('[', colors.cyan('EVAL'),']', colors.yellow(moment(info.messageTimestamp * 1000).format('DD/MM HH:mm:ss')), colors.green(budy))
return conn.sendMessage(from, {text: JSON.stringify(eval(budy.slice(2)),null,'\t')}).catch(e => {
return reply(String(e))
})
} catch (e){
return reply(String(e))
}
}

if(budy.startsWith('(>')){
try {
if(info.key.fromMe) return
if(!SoDono && !isnit && !issupre && !ischyt && !issupre && !ischyt) return 
var konsol = budy.slice(3)
Return = (sul) => {
var sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if(sat == undefined){
bang = util.format(sul)
}
return conn.sendMessage(from, {text: bang}, {quoted: selo})
}

conn.sendMessage(from, {text: util.format(eval(`;(async () => { ${konsol} })()`))}).catch(e => { 
return reply(String(e))
})
console.log('\x1b[1;37m>', '[', '\x1b[1;32mEXEC\x1b[1;37m', ']', time, colors.green(">"), 'from', colors.green(sender.split('@')[0]), 'args :', colors.green(args.length))
} catch(e) {
return reply(String(e))
console.log(e)
}
}


if(body.startsWith('$')) {
if(info.key.fromMe) return 
if(!SoDono && !isnit) return 
exec(q, (err, stdout) => {
if(err) return reply(`${err}`)
if(stdout) {
reply(stdout)
}
})
}

//======================================\\


//======(ANTI-IMAGEM)========\\
if(isAntiImg && !isGroupAdmins && isBotGroupAdmins && type == 'imageMessage') {
if(info.key.fromMe) return
if(dataGp[0].legenda_imagem != "0") {
conn.sendMessage(from, {text: dataGp[0].legenda_imagem}, {quoted: selo})  
}
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return  
conn.groupParticipantsUpdate(from, [sender], 'remove')
}

//======(ANTI-STICKER)========\\
if(isAntiSticker && !isGroupAdmins && isBotGroupAdmins && type == 'stickerMessage') {
if(info.key.fromMe) return
conn.sendMessage(from, {text: '*mensagem proibida detectada, banindo...*'}, {quoted: selo})
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return  
conn.groupParticipantsUpdate(from, [sender], 'remove')
}

if(Antidoc && isBotGroupAdmins && !isGroupAdmins && type == 'documentMessage') {
if(info.key.fromMe) return
if(dataGp[0].legenda_documento != "0") {
conn.sendMessage(from, {text: dataGp[0].legenda_documento}, {quoted: selo}) 
}
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return  
conn.groupParticipantsUpdate(from, [sender], 'remove')
}

let isTrueFalse = Array(
  'tiktok',
  'facebook',
  'instagram',
  'twitter',
  'ytmp3',
  'ytmp4',
  'play',
  'play_audio',
  'play_video',
  'tiktok_audio',
  'tiktok_video',
  'tiktok_img',
  'tiktokdl',
  'pinterest_video'
).some(item => item === command)

if (isUrl(Procurar_String) && isAntiLinkHard && !isGroupAdmins && isBotGroupAdmins && !info.key.fromMe) {

  if (isCmd && isTrueFalse) return;

  // Link de grupo
  if (Procurar_String.includes("chat.whatsapp.com")) {
    let link_dgp;
    try {
      link_dgp = await conn?.groupInviteCode(from);
    } catch {
      link_dgp = "000000";
    }

    if (!link_dgp || !Procurar_String.match(link_dgp)) {

      if (groupMembers.some(p => p.id === sender || p.jid === sender)) {
        try {
          await conn.groupParticipantsUpdate(from, [sender], 'remove');
        } catch (e) {
          console.error('Erro ao remover (hard antilink - link de grupo):', e);
        }
      }

      setTimeout(() => {
        conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
      }, 500);

    } else {
      return reply('Link do nosso grupo, não irei remover..');
    }
    return;
  }

  // Qualquer outro link — fecha grupo, apaga msg e remove
  var OSINF_K = [];
  await OSINF_K.push(info.key.id);

  if (!groupMembers.some(p => p.id === sender || p.jid === sender)) return;

  try {
    await conn.groupParticipantsUpdate(from, [sender], 'remove');
  } catch (e) {
    console.error('Erro ao remover (hard antilink):', e);
  }

  conn.groupSettingUpdate(from, 'announcement');
  setTimeout(() => {
    conn.groupSettingUpdate(from, 'not_announcement');
  }, 1500);

  setTimeout(async () => {
    for (var i of OSINF_K) {
      conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: i, participant: sender } });
    }
    OSINF_K = [];
  }, 500);
}
// ANTI NOTAS FAKES ======================>

if(isAntiNotas && budy2.toString().match(/(💳|💎|💸|💵|💷|💶|🪙|💰|🤑|⚖️)/gi) && isBotGroupAdmins && !isGroupAdmins && !SoDono && !info.message?.reactionMessage?.text && budy2.length > 20) {
let verificar = budy2.toString().match(/(💳|💎|💸|💵|💷|💶|🪙|💰|🤑|⚖️)/gi)
if(verificar && budy.length < 100) return  
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return  
conn.groupParticipantsUpdate(from, [sender], 'remove')
}

//FINALZIN ==============================>


//======(ANTI-VIDEO)========\\

if(isAntiVid && isBotGroupAdmins && !isGroupAdmins && type == 'videoMessage') {
if(dataGp[0].legenda_video == "0") {
conn.sendMessage(from, {text: '*mensagem proibida detectada, banindo...*'}, {quoted: selo})
} else {
conn.sendMessage(from, {text: dataGp[0].legenda_video}, {quoted: selo})  
}
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return
conn.groupParticipantsUpdate(from, [sender], 'remove')
}

//======(ANTI-AUDIO)=======\\
if(isAntiAudio && isBotGroupAdmins && !isGroupAdmins && type == 'audioMessage') {
conn.sendMessage(from, {text: '*mensagem proibida detectada, banindo...*'}, {quoted: selo})
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return
conn.groupParticipantsUpdate(from, [sender], 'remove')
}

// ANTI_LIGAR \\
if (!conn.__callListenerRegistered) {
  conn.__callListenerRegistered = true;
  const _callsAtivos = new Set();
  conn.ws.on('CB:call', async (B) => {
 if(!nescessario.anticall) return;
 if(B.content[0].tag == 'offer') {
const caller = B.content[0].attrs['call-creator'];
if(_callsAtivos.has(caller)) return;
_callsAtivos.add(caller);
conn.sendMessage(caller, { text: `😿 *Ligações não são permitidas xuxuzinho*\n\nSeu número foi bloqueado automaticamente.` }).then(() => {
  conn.updateBlockStatus(caller, "block");
  setTimeout(() => _callsAtivos.delete(caller), 5000);
});
 }
  });
}

//========(ANTI-PV-QUE-BLOQUEIA)======\\
if(isAntiPv && !BLC_CL.has(sender)) {
if(!isGroup && !SoDono && !isnit && !isPremium){ 
reply("_- PROGRAMAÇÃO DE - _\n\n BLOQUEAR / USUARIOS POR ENVIAR MENSAGEM PARA O BOT\n\n_- REALIZANDO AÇÃO _-")
setTimeout(async () => {
conn.updateBlockStatus(sender, 'block')
}, 2000)
return
}
BLC_CL.add(sender)
}
//======================================\\

{
for (i of black_) {
if(i.hora == hora_) {var blu_dc = true} else {var blu_dc = false}
}
if(blu_dc == true) {
for ( i of black_) {
if(i.hora == hora_) var ik = i}
for ( i of ik?.PUXAR) {
if(i.avisou == true) continue  // ← trocou return por continue
if(i.length == 0) continue  // ← trocou return por continue
conn.sendMessage(i.idgp, {text: i.msg})
i.avisou = true 
fs.writeFileSync("./arquivos/grupos/AVISOS.json", JSON.stringify(black_, null, 2))
}}; for ( i of black_) {
if(hora_2 >= i.hora.split(":")[1]+parseInt(1)) {
var ik2 = i
var ik_r = true} else {var ik_r = false}
}; if(ik_r == true) { 
for ( i of ik2.PUXAR) {
if(i.avisou == true) {
i.avisou = false
fs.writeFileSync("./arquivos/grupos/AVISOS.json", JSON.stringify(black_, null, 2))}}}}

//=========(ANTIPV-QUE-SÓ-FALA)==========\\
if(!isGroup && !isPremium && !SoDono && !isnit && !issupre && !ischyt &&
!info.key.fromMe && isAntiPv2 && !MSG_ANTPV2.has(sender)) {
reply(msgantipv2)
MSG_ANTPV2.add(sender)
}

//======================================\\

// ANTI PV QUE IGNORA
if(!isGroup && !isPremium && !SoDono && !info.key.fromMe && isAntiPv3) {
return
}

//======================================\\ LMR

var i9 = countMessage.map(i => i.groupId).indexOf(from)
var idgrupo = groupIdscount.indexOf(from)

var idusu = numbersIds?.indexOf(sender)

if (isX9VisuUnica) {
 if (info.message?.viewOnceMessageV2 || type === "viewOnceMessage") {
  let px;
  if (JSON.stringify(info).includes("videoMessage")) {
px = info.message?.viewOnceMessageV2?.message?.videoMessage || 
  info.message?.viewOnceMessage?.message?.videoMessage;
if (px) {
 px.viewOnce = false;
 px.video = { url: px.url };
 px.caption = (px.caption || "") + "\n\n";
 await conn.sendMessage(from, px, { quoted: selo });
}
  } else if (JSON.stringify(info).includes("imageMessage")) {
px = info.message?.viewOnceMessageV2?.message?.imageMessage || 
  info.message?.viewOnceMessage?.message?.imageMessage;
if (px) {
 px.viewOnce = false;
 px.image = { url: px.url };
 px.caption = (px.caption || "") + "\n\n";
 await conn.sendMessage(from, px, { quoted: selo });
}
  } else if (JSON.stringify(info).includes("audioMessage") || 
 info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2Extension?.message?.audioMessage) {
let audio = info.message?.viewOnceMessageV2?.message?.audioMessage || 
info.message?.viewOnceMessage?.message?.audioMessage;

if (audio && audio.mimetype) {
 let buffAudio = await getFileBuffer(audio, 'audio');
 let audioFile = getRandom('.mp3');
 fs.writeFileSync(audioFile, buffAudio);
 let audioBuffer = fs.readFileSync(audioFile);

 await conn.sendMessage(from, { 
  audio: audioBuffer, 
  mimetype: 'audio/mpeg', 
  ptt: false 
 }, { quoted: selo });

 fs.rmSync(audioFile);
}
  }
 }
}

/////\\\\\\//////\\\\\\////\\\\////\\\///\\\///\\\\

//====================≠≠===============\\

async function renameContextSticker(pack, autor, txt = ``, info) {
  try {
    const contextInfo =
      info.message?.extendedTextMessage?.contextInfo ||
      Object.values(info.message || {})[0]?.contextInfo

    const quotedSticker = contextInfo?.quotedMessage?.stickerMessage
    if (!quotedSticker)
      return console.log('[rename] stickerMessage não encontrado')

    const getfile = await getFileBuffer(quotedSticker, 'sticker')
    if (!getfile)
      return console.log('[rename] getFileBuffer retornou vazio')

    const _sticker = new Sticker()
    _sticker.addFile(getfile)
    _sticker.options.metadata = { pack, author: autor, emojis: ['🤠', '🥶', '😻'] }

    const resultadoSt = await _sticker.start()
    const resultado = resultadoSt[0]

    console.log('[rename] status:', resultado.status)
    if (resultado.status === 'rejected') {
      console.log('[rename] erro interno do sticker:', resultado.reason)
      return
    }

    const stickerPath = resultado.value
    if (!stickerPath || !fs.existsSync(stickerPath))
      return console.log('[rename] path inválido:', stickerPath)

    await conn.sendMessage(from, { sticker: fs.readFileSync(stickerPath) })
    fs.unlinkSync(stickerPath)

  } catch (e) {
    console.log('[renameContextSticker] erro:', e)
  }
}

if(isBanned) return BannedExpired(ban)


if(isRecolherLink && budy.includes("https://chat.whatsapp.com")){
  
var L_WTS = "https://chat.whatsapp.com/"

for (var i = 1; i < body.split(L_WTS).length; i++) {
if(!recolherLNK.map(i => i?.Link).includes(L_WTS+body.split(L_WTS)[i].slice(0, 22))) recolherLNK.push({Link: L_WTS+body.split(L_WTS)[i].slice(0, 22)})
}

fs.writeFileSync("./arquivos/armor/funcoes/recolherLNK.json", JSON.stringify(recolherLNK, null, 2))
if(isBotGroupAdmins && !isGroupAdmins) {
setTimeout(async function() {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 1100);
}
}

// MUTAR USUÁRIO 
const GroupsMutedActived = []
for(let obj of muted) {
  GroupsMutedActived.push(obj.jid)
}
const isMuted = (isGroup && GroupsMutedActived.indexOf(from) >= 0) ? true : false
const NumbersMuted = isMuted ? muted[GroupsMutedActived.indexOf(from)].numbers : []

const isSenderMuted = isMuted && NumbersMuted.some(n => {
  if (n.includes('@lid')) {
 const lidNum = n.split('@')[0]
 const participant = groupMembers.find(p => p.lid && p.lid.split('@')[0] === lidNum)
 const realJid = participant?.jid || ''
 return realJid.split('@')[0] === sender.split('@')[0]
  }
  return n.split('@')[0] === sender.split('@')[0]
})
if(isSenderMuted) {
  setTimeout(async () => {
 conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
  }, 1000)
  return
}

if(!isPremium && nescessario.cmdpremium.includes(command)) 
return reply(`*Aaaah! 🤭 Esse comando é exclusivo para usuários premium!* 💖✨

*Caso queira liberar esse recurso, fala com meu criador:* 😆💞
https://wa.me/${numerodono_ofc}`)


if(!RPT_M.has(from) && (nescessario?.rg_aluguelGB || isGroup && dataGp[0]?.rg_aluguel || false) && !SoDono && !rg_aluguel.some(i => i.id_gp == from)) {
RPT_M.add(from)
setTimeout(() => {
RPT_M.delete(from)
}, 30000)
return reply(`*Oops! 😅 O aluguel deste grupo/usuário não está registrado ou expirou!* 💖📄

*Caso queira registrar ou renovar, fale com meu criador:* 🤭✨
https://wa.me/${numerodono_ofc}`)
}

if((nescessario?.rg_aluguelGB || isGroup && dataGp[0]?.rg_aluguel || false) && rg_aluguel.some((ab) => {
var tempo_A = Math.floor(Date.now() / 1000);
var VNCM = Math.floor(ab?.vencimento)
return tempo_A > VNCM
})) {

var RS_P = []

for (var abc of rg_aluguel) {

var tempo_A = Math.floor(Date.now() / 1000);

var VNCM = Math.floor(abc?.vencimento)

if(tempo_A > VNCM) {

console.log(colors.blue(`💖 O aluguel expirou!

🌸 Grupo: ${groupName}
🆔 ID: ${from}`));

RS_P.push(`*Oops! 😅 O aluguel expirou!* 💕📄

🌸 *Grupo:* ${groupName}
🆔 *ID:* ${from}`);

rg_aluguel.splice(rg_aluguel.findIndex(a => a.id_gp === abc.id_gp), 1);

}

}

conn.sendMessage(numerodono_ofc+"@s.whatsapp.net", {text: RS_P.join('\n')});
fs.writeFileSync("./arquivos/armor/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
}

const similarityCmd = (txt) => {
  getsmlrt = getSimilarity(allCases, txt)
  if(rmLetras(getsmlrt.nome).includes(`inexistente`)) return [{comando: getsmlrt.nome, porcentagem: getsmlrt.porcentagem}]
  return [{comando: prefix+getsmlrt.nome, porcentagem: Number(getsmlrt.porcentagem).toFixed(1)}]
}

const BaseMizuki = 'http://speedhosting.cloud:2009';

const getbuffer = async (url, opcoes) => {
try {
opcoes ? opcoes : {}
const post = await axios({
method: "get",
url,
headers: {
'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 
	'DNT': 1,
	'Upgrade-Insecure-Request': 1
},
...opcoes,
responseType: 'arraybuffer'
})
return post.data
} catch (erro) {
console.log(`Erro identificado: ${erro}`)
}
}

const animesSorteio = [
  "Naruto", "Bleach", "Attack on Titan", "One Piece", "Demon Slayer", "Jujutsu Kaisen", 
  "Tokyo Ghoul", "My Hero Academia", "Chainsaw Man", "Death Note", "Sword Art Online"
];

function msToTime(ms) {
 let seg = Math.floor(ms / 1000)
 let min = Math.floor(seg / 60)
 let hr = Math.floor(min / 60)
 let dia = Math.floor(hr / 24)
 let ano = Math.floor(dia / 365)
 seg %= 60
 min %= 60
 hr %= 24
 dia %= 365
 let partes = []
 if (ano) partes.push(`${ano} ᴀɴᴏ${ano > 1 ? 'ꜱ' : ''}`)
 if (dia) partes.push(`${dia} ᴅɪᴀ${dia > 1 ? 'ꜱ' : ''}`)
 if (hr) partes.push(`${hr} ʜᴏʀᴀ${hr > 1 ? 'ꜱ' : ''}`)
 if (min) partes.push(`${min} ᴍɪɴᴜᴛᴏ${min > 1 ? 'ꜱ' : ''}`)
 if (seg) partes.push(`${seg} ꜱᴇɢᴜɴᴅᴏ${seg > 1 ? 'ꜱ' : ''}`)
 return partes.length ? partes.join(', ').replace(/,([^,]*)$/, ' e$1') : 'ᴀɢᴏʀᴀ ʜᴀ ᴩᴏᴜᴄᴏ'
}

const namoro1 = isGroup ? (readJSONCached("./banco de dados/namoro1.json") || []) : []
const namoro2 = isGroup ? (readJSONCached("./banco de dados/namoro2.json") || []) : []

// resolve um jid (pode vir em @lid) para o jid real @s.whatsapp.net
async function resolveJidReal(rawJid, from, conn) {
  if (!rawJid) return rawJid
  if (rawJid.includes('@s.whatsapp.net')) return jidNormalizedUser(rawJid)

  if (rawJid.includes('@lid')) {
    // 1) tenta o mapeamento oficial do Baileys (mais confiável)
    try {
      const pn = await conn.signalRepository?.lidMapping?.getPNForLID(rawJid)
      if (pn) return jidNormalizedUser(pn)
    } catch {}

    // 2) fallback: procura em conn.contacts
    for (const [jid, c] of Object.entries(conn.contacts || {})) {
      const cLid = typeof c.lid === 'string' ? c.lid : c.lid?._serialized
      if (cLid === rawJid) return jidNormalizedUser(jid)
    }

    // 3) fallback: procura nos participantes do grupo
    try {
      const gm = await getCachedGroupMeta(conn, from)
      const member = gm.participants.find(p => {
        const mLid = typeof p.lid === 'string' ? p.lid : p.lid?._serialized
        return mLid === rawJid
      })
      if (member) {
        const real = member.phoneNumber || member.jid || member.id
        if (real && real.includes('@s.whatsapp.net')) return jidNormalizedUser(real)
      }
    } catch {}
  }

  return jidNormalizedUser(rawJid)
}

if (budy2.toLowerCase() === "s" || budy2.toLowerCase() === "sim") {
  if (isGroup) {
    const idxPedido = namoro2.findIndex(i => {
      return i.id === sender && String(i.idgp) === String(from)
    })

    if (idxPedido !== -1) {
      const pedido = namoro2[idxPedido]
      const jidQuemPediu = pedido.pedido // já é jid real

      const idxRel = namoro1.findIndex(r => {
        return r.usu1 === jidQuemPediu &&
          r.usu2 === sender &&
          String(r.idgp) === String(from) &&
          r.namorados === false
      })

      if (idxRel === -1) {
        namoro2.splice(idxPedido, 1)
        fs.writeFileSync("./banco de dados/namoro2.json", JSON.stringify(namoro2, null, 2))
        return
      }

      namoro1[idxRel].namorados = true
      if (!namoro1[idxRel].inicio) namoro1[idxRel].inicio = Date.now()

      fs.writeFileSync("./banco de dados/namoro1.json", JSON.stringify(namoro1, null, 2))

      namoro2.splice(idxPedido, 1)
      fs.writeFileSync("./banco de dados/namoro2.json", JSON.stringify(namoro2, null, 2))

      const imagemNamoro = 'https://i.ibb.co/xKxMpkpV/0e919e21f8a4.jpg'

      await conn.sendMessage(from, {
        image: { url: imagemNamoro },
        caption: `*「🥳」 𝐅𝐄𝐋𝐈𝐂𝐈𝐃𝐀𝐃𝐄𝐒 「✨」*\n*@${jidQuemPediu.split('@')[0]} e @${sender.split('@')[0]} acabaram de começar um novo romance 💞*\n\n*💍| Agora são oficialmente namorados!*\n\n• *📖 | Vocês podem consultar o relacionamento em: ${prefix}minhadupla*\n\n• *Boa sorte ao casal! 💞*`,
        contextInfo: { mentionedJid: [jidQuemPediu, sender] }
      }, { quoted: selo })
    }
  }
}

if (budy2.toLowerCase() === "n" || budy2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "nao") {
  if (isGroup) {
    const idxPedido = namoro2.findIndex(i => {
      return i.id === sender && String(i.idgp) === String(from)
    })

    if (idxPedido !== -1) {
      const pedido = namoro2[idxPedido]
      const jidQuemPediu = pedido.pedido

      const idxRel = namoro1.findIndex(r => {
        return r.usu1 === jidQuemPediu &&
          String(r.idgp) === String(from) &&
          r.namorados === false
      })

      if (idxRel !== -1) {
        await conn.sendMessage(from, {
          text: `ǫᴜᴇ ᴘᴇɴɪɴʜᴀ @${jidQuemPediu.split('@')[0]}! ᴏ (ᴀ) @${sender.split('@')[0]} ɴᴀᴏ ᴛᴇ ǫᴜɪs 💔 ᴛᴀʟᴠᴇᴢ ᴇʟᴇ(ᴀ) ɴᴀᴏ sɪɴᴛᴀ ᴏ ᴍᴇsᴍᴏ ᴘᴏʀ ᴠᴏᴄᴇ, ᴍᴀs ɴᴀᴏ ᴅᴇsᴀɴɪᴍᴀ ɴᴀᴏ ᴠɪᴜᴜ 😖`,
          contextInfo: { mentionedJid: [jidQuemPediu, sender] }
        }, { quoted: selo })

        await conn.sendMessage(jidQuemPediu, {
          text: `💔 @${sender.split('@')[0]} recusou seu pedido de namoro no grupo *${(await conn.groupMetadata(from)).subject}*...`,
          contextInfo: { mentionedJid: [sender] }
        })

        namoro1.splice(idxRel, 1)
        fs.writeFileSync("./banco de dados/namoro1.json", JSON.stringify(namoro1, null, 2))
      }

      namoro2.splice(idxPedido, 1)
      fs.writeFileSync("./banco de dados/namoro2.json", JSON.stringify(namoro2, null, 2))
    }
  }
}


const FAMILIA_DB_PATH = "./banco de dados/func/familia_db.json"

function __FAM_load() {
  try {
    if (!fs.existsSync(FAMILIA_DB_PATH)) return { families: {}, pend: {} }
    const j = readJSONCached(FAMILIA_DB_PATH)
    if (!j || typeof j !== "object") return { families: {}, pend: {} }
    if (!j.families || typeof j.families !== "object") j.families = {}
    if (!j.pend || typeof j.pend !== "object") j.pend = {}
    return j
  } catch {
    return { families: {}, pend: {} }
  }
}

function __FAM_save(db) {
  try { fs.writeFileSync(FAMILIA_DB_PATH, JSON.stringify(db, null, 2) + "\n") } catch {}
}

function __FAM_jid(x) {
  const s = String(x || "")
  if (!s) return ""
  if (s.includes("@s.whatsapp.net") || s.includes("@lid")) return s
  return s.includes("@") ? s : (s + "@s.whatsapp.net")
}

function __FAM_isMarriedInGroup(sender, from, namoro1) {
  try {
    const meJid = String(sender)
    const meNum = meJid.split("@")[0]

    const item = (namoro1 || []).find(n => {
      if (!n) return false
      if (n.namorados !== true) return false
      if (String(n.idgp || "") !== String(from || "")) return false

      const u1 = __FAM_jid(n.usu1)
      const u2 = __FAM_jid(n.usu2)

      const u2num = String(n.usu2 || "").split("@")[0]

      return (
        u1 === meJid ||
        u2 === meJid ||
        u1.split("@")[0] === meNum ||
        u2.split("@")[0] === meNum ||
        u2num === meNum
      )
    })

    if (!item) return null

    const a = __FAM_jid(item.usu1)
    const b = __FAM_jid(item.usu2)

    const aJ = a.includes("@") ? a : __FAM_jid(a)
    const bJ = b.includes("@") ? b : __FAM_jid(b)

    const aNum = aJ.split("@")[0]
    const bNum = bJ.split("@")[0]
    const meNum2 = meJid.split("@")[0]

    const A = (aNum === meNum2) ? meJid : aJ
    const B = (bNum === meNum2) ? meJid : bJ

    const spouse = (A === meJid) ? B : A

    return { a: A, b: B, spouse }
  } catch {
    return null
  }
}

function __FAM_makeId(a, b, from) {
  const x = [String(a), String(b)].sort().join("_")
  return `${x}__${String(from)}`
}

function __FAM_findFamilyByMember(db, jid, from) {
  const j = String(jid)
  const g = String(from)
  for (const [fid, fam] of Object.entries(db.families || {})) {
    if (!fam) continue
    if (String(fam.grupo) !== g) continue
    if (String(fam.a) === j || String(fam.b) === j) return { fid, fam, role: "casal" }
    if (Array.isArray(fam.filhos) && fam.filhos.includes(j)) return { fid, fam, role: "filho" }
  }
  return null
}

// resolve @lid -> jid real (@s.whatsapp.net), igual usamos no namorar
async function __FAM_resolveJidReal(rawJid, from, conn) {
  if (!rawJid) return rawJid
  if (rawJid.includes('@s.whatsapp.net')) return jidNormalizedUser(rawJid)

  if (rawJid.includes('@lid')) {
    try {
      const pn = await conn.signalRepository?.lidMapping?.getPNForLID(rawJid)
      if (pn) return jidNormalizedUser(pn)
    } catch {}

    for (const [jid, c] of Object.entries(conn.contacts || {})) {
      const cLid = typeof c.lid === 'string' ? c.lid : c.lid?._serialized
      if (cLid === rawJid) return jidNormalizedUser(jid)
    }

    try {
      const gm = await getCachedGroupMeta(conn, from)
      const member = gm.participants.find(p => {
        const mLid = typeof p.lid === 'string' ? p.lid : p.lid?._serialized
        return mLid === rawJid
      })
      if (member) {
        const real = member.phoneNumber || member.jid || member.id
        if (real && real.includes('@s.whatsapp.net')) return jidNormalizedUser(real)
      }
    } catch {}
  }

  return jidNormalizedUser(rawJid)
}

// agora assíncrona, precisa de from e conn pra resolver o lid de verdade
async function __FAM_pickTargetJid(info, menc_os2, from, conn) {
  let alvoRaw = ""

  if (menc_os2) {
    alvoRaw = __FAM_jid(menc_os2)
  } else {
    try {
      const ctx =
        info?.message?.extendedTextMessage?.contextInfo ||
        info?.message?.imageMessage?.contextInfo ||
        info?.message?.videoMessage?.contextInfo ||
        info?.message?.documentMessage?.contextInfo ||
        info?.message?.documentWithCaptionMessage?.message?.documentMessage?.contextInfo ||
        null

      const q = ctx?.quotedMessage
      const p = ctx?.participant
      if (q && p) alvoRaw = __FAM_jid(p)
    } catch {}
  }

  if (!alvoRaw) return ""

  return await __FAM_resolveJidReal(alvoRaw, from, conn)
}
  
  
if(info?.message?.groupStatusMentionMessage) { 
if(!isAntimention) return;
if(SoDono) return reply('*VOCÊ, MEU QUERIDO DONO LÓGICO QUE PODE 🙇*')
if(isGroupAdmins) return reply('*EII STATUS TA PROIBIDO MAS COMO VOCÊ É ADM ENTÃO PODE✨*')
mention(`*PROIBIDO MENÇÃO DE STATUS NESSE GRUPO 🌹*`)
await sleep(600)
conn.groupParticipantsUpdate(from, [sender], "remove");
setTimeout(() => {
conn.sendMessage(from, {delete: {remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
  }, 1500)
}  

const isViewOnce = (!!info.message?.viewOnceMessage || !!info.message?.viewOnceMessageV2 || !!info.message?.viewOnceMessageV2Extension);

const contarDias = (dias) => {
if(!dias.includes("/")) return "Tem que colocar em /, ex: 01/01/2024"
barra = 0
for(i of dias) {
if(i == "/") barra += 1
}
if(barra <= 0 || barra > 2) return "Revise o formato da data pfvr... Receio que você não tenha colocado o formato correto DD/MM/YYYY"
var [aa, bb, cc] = dias.split("/")
year = cc.length == 2 ? "20" + cc : cc
if(Number(aa) < 1 || Number(aa) > 31) return `Os dias vão de 1 até no mxm 31`
if(Number(bb) < 1 || Number(bb) > 12) return `Os meses vão de 1 até no mxm 12`
if(Number(year) < 1 || Number(aa) > 100000000) return `Os anos vão de 1 até no mxm 100000000`
day = Number(year) * 365
day += Number(bb) * 30
day += Number(aa)
return day
}

const converterDias = (dias) => {
nmr = Number(dias)
if(nmr < 0) return "A quantidade de dias precisa ser ≥ 0"
year = (nmr - (nmr % 365)) / 365
mm = ((nmr % 365) - ((nmr % 365) % 30)) / 30
day = (nmr % 365) % 30
txt = year > 0 ? year + ` Ano${year != 1 ? "s" : ""}${day > 0 ? mm > 0 ? ", " : " e " : ""}` : ``
txt += mm > 0 ? mm + ` M${mm != 1 ? "eses" : "ês"}${day > 0 ? " e " : ""}` : ``
txt += day > 0 ? day + ` Dia${day != 1 ? "s" : ""}` : ``
return txt.slice(0, txt.length - 2)
}

const contarMin = (base_a) => {
 if((base_a.match(/:/g) || []).length != 1) return `É necessário o uso dos : no horário, seguindo apenas horas e minutos`
 var [a, b] = base_a.split(':')
 return Number(Number(a) * 60) + Number(b)
}

const converterMin = (base_b) => {
if(!Number(base_b)) return `Precisa ser um número`
nmr = Number(base_b)
b = nmr % 60
a = (nmr - b) / 60
return `${a < 10 ? `0` + a : a}:${b < 10 ? `0` + b : b}`
}

async function carregamento(id, txt, zero) {
var download = [
"`▭▭▭▭▭▭ 0%`",
"▬▭▭▭▭▭ 10%",
  "▬▬▬▭▭▭ 30%",
  "▬▬▬▬▬▬▭ 60%",
  "▬▬▬▬▬▬▬▬▭ 80%",
  "▬▬▬▬▬▬▬▬▬▭ 90%",
  "▬▬▬▬▬▬▬▬▬▬ 100%",
  "`𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳..`",
]
let { key } = conn.sendMessage(id, {text: `~Mizuki System~`}, {quoted: selo})
await sleep(9000)
for(let i = 0; i < download.length; i++) {
conn.sendMessage(id, {text: download[i], edit: key }, {quoted: selo})
}
}

const sendAudio = async (id, link) => {
  conn.sendMessage(id, {
 audio: {url: link},
 mimetype: 'audio/mpeg'
  })
}

const sendVideo = (id, link, desc, contextInfo, info) => {
return conn.sendMessage(id, {video: { url: link }, caption: desc, mimetype: 'video/mp4', contextInfo: contextInfo}, { quoted: info })
}

const json = jsonGp ? [jsonGp] : [{}]
const anticanalON = !!jsonGp?.[0]?.anticanal
if (anticanalON) {
  if (!(SoDono || isGroupAdmins)) {
 const msg = info?.message || {}

 const ctx =
msg?.extendedTextMessage?.contextInfo ||
msg?.imageMessage?.contextInfo ||
msg?.videoMessage?.contextInfo ||
msg?.documentMessage?.contextInfo ||
msg?.audioMessage?.contextInfo ||
msg?.stickerMessage?.contextInfo ||
null

 const fwdNews = ctx?.forwardedNewsletterMessageInfo

 const isCanal =
!!(fwdNews?.newsletterJid && String(fwdNews.newsletterJid).includes("@newsletter")) ||
!!(fwdNews?.newsletterName && String(fwdNews.newsletterName).trim().length > 0)

 if (isCanal) {
if (!isBotGroupAdmins) return

// quem encaminhou é o participante real do grupo
const quemEncaminhou = info?.key?.participant || sender

await conn.sendMessage(from, {
  delete: {
 remoteJid: from,
 fromMe: false,
 id: info?.key?.id,
 participant: quemEncaminhou
  }
}).catch(() => {})

await conn.groupParticipantsUpdate(from, [quemEncaminhou], "remove").catch(() => {})

return
 }
  }
}


async function uploadToCatbox(buffer, fileName) {
 // AQUI USAMOS NodeFormData
 const form = new NodeFormData(); 
 
 form.append('reqtype', 'fileupload');
 // Esta sintaxe funciona corretamente com o 'form-data' de Node:
 form.append('fileToUpload', buffer, {
  filename: fileName,
  contentType: 'application/octet-stream' 
 });

 try {
  const response = await axios.post('https://catbox.moe/user/api.php', form, {
headers: form.getHeaders(),
  });

  if (response.status === 200) {
return response.data; // Retorna a URL
  } else {
console.error(`Erro Catbox: Status ${response.status} - ${response.data}`);
return null;
  }
 } catch (error) {
  console.error("Erro ao fazer upload para Catbox:", error.message);
  return null;
 }
}



const glsticker = Object.keys(info.message)[0] == "stickerMessage" ? info.message.stickerMessage.fileSha256.toString('base64') : ""

// INICIO DAS CASES / COMANDOS COM PREFIXO --- DEIXE ACIMA DO >SWITCH(COMMAND) {< E NÃO APAGUE O MESMO \\
if (type === 'stickerMessage') {
 const fileSha = selo.message.stickerMessage.fileSha256;
 const hashSticker = Buffer.isBuffer(fileSha) ? fileSha.toString('base64') : Buffer.from(fileSha).toString('base64');

 // Só verifica se o hash existe NO GRUPO ATUAL
 const groupStickers = banfigs[from];
 if (!groupStickers || !groupStickers[hashSticker]) return; // ← ignora se não for desse gp

 budy = prefix + groupStickers[hashSticker];
 command = groupStickers[hashSticker];

 menc_os2 = selo.quoted?.sender
|| selo.message.stickerMessage.contextInfo?.mentionedJid?.[0]
|| selo.message.stickerMessage.contextInfo?.participant;
}
const client = conn;

const sendStickerFromUrl = async(to, url) => {
try {
var names = Date.now() / 10000;
var download = function (uri, filename, callback) {
request.head(uri, function (err, res, body) {
request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
});
};
download(url, './sticker' + names + '.png', async function () {
let filess = './sticker' + names + '.png'
let asw = './sticker' + names + '.webp'
exec(`ffmpeg -i ${filess} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 800:800 ${asw}`, (err) => {
let media = fs.readFileSync(asw)
client.sendMessage(to, {sticker: media}, {sendEphemeral: true, contextInfo: { forwardingScore: 50, isForwarded: true}, quoted: selo})
fs.unlinkSync(filess)
fs.unlinkSync(asw)
});
});
} catch (e) {
console.log(e)
}
}

const sendImageAsSticker = async (client, jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
 let buffer;
 if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options);
} else {
buffer = await imageToWebp(buff);
}

await client.sendMessage(jid, {sticker: {url: buffer}, ...options}, {quoted})
return buffer;
};

const sendVideoAsSticker = async (client, jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
 let buffer;
 if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options);
} else {
buffer = await videoToWebp(buff);
}

await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer;
}

const sendImageAsSticker2 = async (client, jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
 let buffer;
 if (options && (options.packname || options.author)) {
buffer = await writeExifImg2(buff, options);
} else {
buffer = await imageToWebp2(buff);
}

await client.sendMessage(jid, {sticker: {url: buffer}, ...options}, {quoted})
return buffer;
};

const sendVideoAsSticker2 = async (client, jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
 let buffer;
 if (options && (options.packname || options.author)) {
buffer = await writeExifVid2(buff, options);
} else {
buffer = await videoToWebp2(buff);
}

await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer;
}

async function DLT_FL(file) {
try { 
fs.unlinkSync(file);
} catch (error) {}
}

const NoPrefixYuta = budy2.trim().slice(0).trim().split(" ")[0].trim().toLocaleLowerCase()

const comandoRegistrado = getComandoNoPrefix(NoPrefixYuta)
if (comandoRegistrado && typeof comandoRegistrado === 'string') {
  isCmd = true
  command = comandoRegistrado.toLowerCase()
}
const db = getAntiMeta()
if (db[from] === true) {
  const mencoes = 
 info.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
 info.message?.botInvokeMessage?.contextInfo?.mentionedJid ||
 [];

  const bodyFull = 
 info.message?.extendedTextMessage?.text ||
 info.message?.conversation ||
 info.message?.botInvokeMessage?.message?.extendedTextMessage?.text ||
 body || '';

  const metaAIJid = '867051314767696@s.whatsapp.net';

  const mencionouMeta =
 mencoes.includes(metaAIJid) ||
 bodyFull.includes('@867051314767696') ||
 /@meta\s*ai/i.test(bodyFull) ||
 /meta\s*ai/i.test(bodyFull);

  if (mencionouMeta) {
 try {
if (isBotGroupAdmins) {
  await conn.groupParticipantsUpdate(from, [sender], 'remove');
  await conn.sendMessage(from, {
text: `*Aaaah! 😵 O Meta AI foi detectado aqui no grupo!* 💖⚡

🤭 @${sender.split('@')[0]} acabou sendo removido automaticamente.

✨ Este grupo está protegido pelo MizukiBot-MD 💞`,
mentions: [sender]
  });
} else {
  await conn.sendMessage(from, {
 text: `*Eitaa! 😅 Detectei o uso do Meta AI!* 💖⚠️

🤭 @${sender.split('@')[0]} usou Meta AI, mas eu preciso ser administrador para remover membros! 💕`,
 mentions: [sender]
  });
}
 } catch (err) {
console.error('[ANTI META AI] Erro:', err);
 }
  }
}

//====================================\\
const VRF_JSON_GRUPO = fs.existsSync(`./banco de dados/grupos/${from}.json`) ? true : false;


const VerificarJSON = (json, value) => {
if(JSON.stringify(json).includes(value)) return true
return false
}
const isModoCoins = isGroup ? dataGp[0].isModoCoins : undefined
const RG_SCOINS = (isModoCoins && isGroup && VRF_JSON_GRUPO)
  ? readJSONCached("./banco de dados/func/coins.json") || []
  : [];


const ID_G_COINS = RG_SCOINS.findIndex(i => i.grupo === from)
const ID_USU_COINS = RG_SCOINS[ID_G_COINS]?.usus?.findIndex(i => i.id === sender);

function CoinsUpdate(index){
fs.writeFileSync("./banco de dados/func/coins.json", JSON.stringify(index, null, 2) + "\n")
}

const SYSTEM_COIN = {

  AdicionarCoins: async function(user, quant) {
  CoinsUser_ = RG_SCOINS[ID_G_COINS].usus.find(i => i.id === user);
  if(!CoinsUser_) return reply("O(a) usuário(a) nunca enviou uma mensagem neste grupo! Então não é possível adicionar ou transferir coins à um membro que não possuí registro!");
  CoinsUser_["coins"] += quant;
  CoinsUpdate(RG_SCOINS);
  },
  
  transferCoins: async function(transferidor, recebidor, quantidade) {
  DM_ = RG_SCOINS[ID_G_COINS].usus.find(i => i.id === transferidor)
  DM_2 = RG_SCOINS[ID_G_COINS].usus.find(i => i.id === recebidor)
  if((DM_?.coins || 0) < quantidade) return mention(`A quantidade que você tem é inferior a que você deseja transferir ao usuário: @${recebidor.split("@")[0]}`)
  if(!DM_2) return mention(`O(a) usuário(a) '@${recebidor.split("@")[0]}' nunca enviou uma mensagem neste grupo! Então não é possível adicionar ou transferir coins à um usuário não registrado no meu sistema!`);
  DM_["coins"] -= quantidade;
  DM_2["coins"] += quantidade;
  CoinsUpdate(RG_SCOINS);
  },
  
  Adicionar_2: async function(A, Q, X, X2) {
  DM_ = RG_SCOINS[ID_G_COINS].usus.find(i => i.id === A);
  if(!DM_) return reply("O(a) usuário(a) nunca enviou uma mensagem neste grupo! Então não é possível atualizar a carteira!");
  DM_["coins"] += Q;
  DM_[X] = X2
  CoinsUpdate(RG_SCOINS);
  },
  
  RemoverCoins: async function(user, quant) {
  CoinsUser = RG_SCOINS[ID_G_COINS].usus.find(i => i.id === user)
  if(!CoinsUser) return reply("O(a) usuário(a) nunca enviou uma mensagem neste grupo! Então não é possível remover coins de membro inativo que não possuí registro!");
  if((CoinsUser?.coins || 0) < quant) return reply(`O usuário possuí '${CoinsUser?.coins} N-Coins', este valor não é suficiente para realizar a transação de remoção de ${quant}.`);
  CoinsUser["coins"] -= quant;
  CoinsUpdate(RG_SCOINS);
  },
  
VerificarCampo: function(user, parameter) {
  return RG_SCOINS[ID_G_COINS].usus.find(i => i.id === user)[parameter] || null;
},
  
  }
  
  if(isModoCoins && isGroup && isBotGroupAdmins && VRF_JSON_GRUPO && !info.key.fromMe) {
  
  if(!RG_SCOINS.some(i => i.grupo === from)) {
  RG_SCOINS.push({grupo: from, usus: [{id: sender, coins: 0, data: 0, chances: {cassino: 0, minerar: 0}}]})
  CoinsUpdate(RG_SCOINS);
  } else if(RG_SCOINS.some(i => i.grupo === from) && !RG_SCOINS[ID_G_COINS]?.usus?.some(i => i?.id === sender)) {
  RG_SCOINS[ID_G_COINS].usus.push({id: sender, coins: 0, data: 0, chances: {cassino: 0, minerar: 0}})
  CoinsUpdate(RG_SCOINS);
  }
  
  if(!info.message?.reactionMessage?.text && dataSattz != SYSTEM_COIN.VerificarCampo(sender, "data")) {
  await mention(
`• 💰 *Bônus diário recebido!*
-

✨️ Usuário: @${sender.split("@")[0]}
🎁 Você recebeu 50 coins
⏰ Volte amanhã para ganhar novamente!`
);
  SYSTEM_COIN.Adicionar_2(sender, 50, "data", dataSattz);
  RG_US = RG_SCOINS[ID_G_COINS].usus.find(i => i.id === sender);
  Object.assign(RG_US.chances, {"cassino": 0, "minerar": 0});
  CoinsUpdate(RG_SCOINS);
  }
  }


// ============ HANDLER DE RESPOSTAS ============

// ANAGRAMA
if(isGroup && fs.existsSync(`./banco de dados/grupos/games/anagrama/${from}.json`)){
 let dataA = readJSONCached(`./banco de dados/grupos/games/anagrama/${from}.json`)
 if(budy.slice(0,4).toUpperCase() == dataA.palavraOriginal.slice(0,4).toUpperCase() && budy.toUpperCase() != dataA.palavraOriginal.toUpperCase()) return reply('Está perto...')
 if(budy.toUpperCase() == dataA.palavraOriginal.toUpperCase()) {
 const acert = `*ᴀɴᴀɢʀᴀᴍᴀ ʀᴇsᴏʟᴠɪᴅᴏ! ᴘᴀʀᴀʙᴇ́ɴs ${pushname}, ᴠᴏᴄᴇ̂ ɢᴀɴʜᴏᴜ 5 ɴ-ᴄᴏɪɴs.*\n*ɪɴɪᴄɪᴀɴᴅᴏ ᴏ ᴘʀᴏ́xɪᴍᴏ ᴊᴏɢᴏ ᴇᴍ 5 sᴇɢᴜɴᴅᴏs.*`
 await conn.sendMessage(from, {text: acert}, {"mentionedJid": [sender]}, {quoted: selo})
 await SYSTEM_COIN.AdicionarCoins(sender, 5);
 fs.unlinkSync(`./banco de dados/grupos/games/anagrama/${from}.json`)		
 setTimeout(async() => {
 fs.writeFileSync(`./banco de dados/grupos/games/anagrama/${from}.json`, `${JSON.stringify(palavrasANA[Math.floor(Math.random() * palavrasANA.length)])}`)
 let dataAB = readJSONCached(`./banco de dados/grupos/games/anagrama/${from}.json`)
 const anagrama = `*🌟😲 ᴅᴇᴄɪғʀᴇ ᴏ ᴀɴᴀɢʀᴀᴍᴀ ᴀʙᴀɪxᴏ:*\n—\n*• ᴀɴᴀɢʀᴀᴍᴀ: ${shuffle(dataAB.palavraOriginal)}*\n*• ᴅɪᴄᴀ: ${dataAB.dica}*`
 await conn.sendMessage(from, {text: anagrama}, {quoted: selo})
 }, 5000)
 }}

// QUIZ ANIMAIS
if(isGroup && fs.existsSync(`./banco de dados/grupos/games/quiz-animais/${from}.json`)){
 let dQ = readJSONCached(`./banco de dados/grupos/games/quiz-animais/${from}.json`)
 if(budy.slice(0,4).toUpperCase() == dQ.original.slice(0,4).toUpperCase() && budy.toUpperCase() != dQ.original.toUpperCase()) return reply('Está perto!')
 if(budy.toUpperCase() == dQ.original.toUpperCase()) { 
 const quizaC = `*🎉 ᴘᴀʀᴀʙᴇ́ɴs ${pushname}, ᴠᴏᴄᴇ̂ ᴀᴄᴇʀᴛᴏᴜ!*\n*ᴏ ᴀɴɪᴍᴀʟ ᴇʀᴀ: ${dQ.original}*\n*• ɪɴɪᴄɪᴀɴᴅᴏ ᴏ ᴘʀᴏ́xɪᴍᴏ ᴊᴏɢᴏ ᴇᴍ 5s!*`
 await conn.sendMessage(from, {text: quizaC}, {"mentionedJid": [sender]}, {quoted: selo}) 
 await SYSTEM_COIN.AdicionarCoins(sender, 5);
 fs.unlinkSync(`./banco de dados/grupos/games/quiz-animais/${from}.json`)		
 setTimeout(async() => {
 fs.writeFileSync(`./banco de dados/grupos/games/quiz-animais/${from}.json`, `${JSON.stringify(quizanimais[Math.floor(Math.random() * quizanimais.length)])}`)
 let dataQA = readJSONCached(`./banco de dados/grupos/games/quiz-animais/${from}.json`)
 let wew = await getBuffer(dataQA.foto)
 await conn.sendMessage(from, {image: wew, caption: `🤔 Pergunta: ${dataQA.question}`}, {quoted: selo})
 }, 5000)
 }}

// QUIZ FUTEBOL
if(isGroup && fs.existsSync(`./banco de dados/grupos/games/quiz-futebol/${from}.json`)){
 let dQF = readJSONCached(`./banco de dados/grupos/games/quiz-futebol/${from}.json`)
 if(budy.slice(0,4).toUpperCase() == dQF.resposta.slice(0,4).toUpperCase() && budy.toUpperCase() != dQF.resposta.toUpperCase()) return reply('Está perto!')
 if(budy.toUpperCase() == dQF.resposta.toUpperCase()) { 
 const quizC = `*🎉 ᴘᴀʀᴀʙᴇ́ɴs ${pushname}, ᴠᴏᴄᴇ̂ ᴀᴄᴇʀᴛᴏᴜ!*\n*ᴏ ᴛɪᴍᴇ ᴇʀᴀ: ${dQF.resposta}*\n*• ɪɴɪᴄɪᴀɴᴅᴏ ᴏ ᴘʀᴏ́xɪᴍᴏ ᴊᴏɢᴏ ᴇᴍ 5s!*`
 await conn.sendMessage(from, {text: quizC}, {"mentionedJid": [sender]}, {quoted: selo}) 
 await SYSTEM_COIN.AdicionarCoins(sender, 5);
 fs.unlinkSync(`./banco de dados/grupos/games/quiz-futebol/${from}.json`)		
 setTimeout(async() => {
 fs.writeFileSync(`./banco de dados/grupos/games/quiz-futebol/${from}.json`, `${JSON.stringify(quizFutebol[Math.floor(Math.random() * quizFutebol.length)])}`)
 let dataQF = readJSONCached(`./banco de dados/grupos/games/quiz-futebol/${from}.json`)
 const quizfut = `💫⚽ 𝐐𝐔𝐈𝐙 𝐅𝐔𝐓𝐄𝐁𝐎𝐋 ⚽💫\n–\n*🗣️ ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴘᴇʀɢᴜɴᴛᴀ:*\n*• _${dataQF.pergunta}_*`
 await conn.sendMessage(from, {text: quizfut}, {quoted: selo})
 }, 5000)
 }}

// GARTIC
if(isGroup && fs.existsSync(`./banco de dados/grupos/games/gartic/${from}.json`)){
 let perg_gartic = readJSONCached(`./banco de dados/grupos/games/gartic/${from}.json`)
 if(budy.slice(0,4).toUpperCase() == perg_gartic.resposta.slice(0,4).toUpperCase() && budy.toUpperCase() != perg_gartic.resposta.toUpperCase()) return reply('Está perto!')
 if(budy.toUpperCase() == perg_gartic.resposta.toUpperCase()) { 
 const descobert = `*ᴅᴇsᴄᴏʙᴇʀᴛᴏ! ᴘᴀʀᴀʙᴇ́ɴs ${pushname}, ᴠᴏᴄᴇ̂ ɢᴀɴʜᴏᴜ 5 ɴ-ᴄᴏɪɴs.*\n*ɪɴɪᴄɪᴀɴᴅᴏ ᴏ ᴘʀᴏ́xɪᴍᴏ ᴊᴏɢᴏ ᴇᴍ 5 sᴇɢᴜɴᴅᴏs.*`
 await conn.sendMessage(from, {text: descobert}, {"mentionedJid": [sender]}, {quoted: selo}); 
 await SYSTEM_COIN.AdicionarCoins(sender, 5);
 fs.unlinkSync(`./banco de dados/grupos/games/gartic/${from}.json`);
 setTimeout(async() => {
 fs.writeFileSync(`./banco de dados/grupos/games/gartic/${from}.json`, `${JSON.stringify(garticArchives[Math.floor(Math.random() * garticArchives.length)])}`)
 let dataGartic2 = readJSONCached(`./banco de dados/grupos/games/gartic/${from}.json`)
 const gartic = `*👩🏼‍🏫 ᴘɪsᴛᴀ ꜱᴏʙʀᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ:*\n*• ᴛɪᴘᴏ: ${dataGartic2.pergunta}*\n*• ɪɴɪᴄɪᴀ ᴄᴏᴍ: "${dataGartic2.letra_inicial}"*\n*• ᴄᴏɴᴛᴇ́ᴍ ᴛʀᴀᴄ̧ᴏꜱ? ${dataGartic2.contem_traços}*\n–\n*❓️ ᴅᴜ́ᴠɪᴅᴀ? ᴜsᴇ ${prefix}revelargartic*`
 let wew = await getBuffer(`${dataGartic2.imagem}`)
 await conn.sendMessage(from, {image: wew, caption: gartic}, {quoted: selo})
 }, 5000)
 }}

// ENIGMA
if(isGroup && fs.existsSync(`./banco de dados/grupos/games/enigma/${from}.json`)){
 let enigmaData = readJSONCached(`./banco de dados/grupos/games/enigma/${from}.json`)
 const respostaCorreta = enigmaData.respostaEne.toUpperCase().trim()
 const respostaUsuario = budy.toUpperCase().trim()
 
 if(!respostaCorreta.includes(' ') && 
 respostaUsuario.slice(0,4) == respostaCorreta.slice(0,4) && 
 respostaUsuario != respostaCorreta) return reply('Está perto!')
 
 if(respostaUsuario == respostaCorreta) { 
 const respostaE = `*ᴇɴɪɢᴍᴀ ʀᴇsᴏʟᴠɪᴅᴏ! ᴘᴀʀᴀʙᴇ́ɴs ${pushname}, ᴠᴏᴄᴇ̂ ɢᴀɴʜᴏᴜ 5 ɴ-ᴄᴏɪɴs.*\n*ɪɴɪᴄɪᴀɴᴅᴏ ᴏ ᴘʀᴏ́xɪᴍᴏ ᴊᴏɢᴏ ᴇᴍ 5 sᴇɢᴜɴᴅᴏs.*`
 await conn.sendMessage(from, {text: respostaE}, {"mentionedJid": [sender]}, {quoted: selo})
 await SYSTEM_COIN.AdicionarCoins(sender, 5);
 fs.unlinkSync(`./banco de dados/grupos/games/enigma/${from}.json`)
 let enigmaD
 setTimeout(async() => {
 fs.writeFileSync(`./banco de dados/grupos/games/enigma/${from}.json`, `${JSON.stringify(enigmaArchive[Math.floor(Math.random() * enigmaArchive.length)])}`)
 enigmaD = readJSONCached(`./banco de dados/grupos/games/enigma/${from}.json`)
 const resolveE = `*📜 ʀᴇsᴏʟᴠᴀ ᴏ sᴇɢᴜɪɴᴛᴇ ᴇɴɪɢᴍᴀ:*\n–\n${enigmaD.charada}\n–\n❓️ *ɴᴀ̃ᴏ sᴀʙᴇ ᴀ ʀᴇsᴘᴏsᴛᴀ?*\nᴘᴇᴄ̧ᴀ ᴀᴅᴍ ᴘᴀʀᴀ ᴜsᴀʀ *${prefix}revelarenigma*`
 let wew = await getBuffer(rvenigma)
 await conn.sendMessage(from, {image: wew, caption: resolveE}, {quoted: selo})
 }, 5000)
 }}

// ===== MONITOR DE MEMÓRIA =====
// Monitor de memória
const mem = process.memoryUsage()
const mb = v => (v / 1024 / 1024).toFixed(1) + ' MB'

// ===== HORÁRIO GRUPOS =====
async function verificarHorarioGrupos() {
  if (!conn?.groupSettingUpdate) return;
  const agora = moment().tz("America/Sao_Paulo").format("HH:mm");
  const pasta = "./banco de dados/horário";
  if (!fs.existsSync(pasta)) return;
  let arquivos = fs.readdirSync(pasta);
  for (let file of arquivos) {
 let path = `${pasta}/${file}`;
 let data = JSON.parse(fs.readFileSync(path));
 if (!data.ativo) continue;
 if (data.ultimo === agora) continue;
 data.ultimo = agora;
 fs.writeFileSync(path, JSON.stringify(data, null, 2));
 try {
if (agora === data.fechar) {
  await conn.groupSettingUpdate(data.groupId, "announcement");
  await conn.sendMessage(data.groupId, { text: `*Prontinho! 😊 O grupo foi fechado automaticamente às* ${agora} 💖🔒` });
}
if (agora === data.abrir) {
  await conn.groupSettingUpdate(data.groupId, "not_announcement");
  await conn.sendMessage(data.groupId, { text: `*Yaaay! 😆 O grupo foi aberto automaticamente às* ${agora} 💞🔓` });
}
 } catch (e) {
console.log("Erro ao abrir/fechar grupo:", e);
 }
  }
}

if (!global.__horarioIntervalRegistrado) {
  global.__horarioIntervalRegistrado = true;
  setInterval(verificarHorarioGrupos, 15 * 1000);
}

if (/^\d+$/.test(body) && ultimosNicks[sender]) {
  const lista = ultimosNicks[sender]
  const index = Number(body) - 1
  if (!lista[index]) {
 reply("❌ Número inválido.")
  } else {
 reply(`${lista[index]}`)
  }
  delete ultimosNicks[sender]
  return
}

const isModoIA = isGroup ? dataGp[0].modoia : undefined

if (isModoIA) {
  if (body && body.toLowerCase().startsWith("mizuki ")) {
 try {
const pergunta = body.slice(7).trim()
let mentioned = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
let isQuotedImage = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
let isQuotedVideo = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
let isQuotedSticker = info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage

const meuPrompt = `Converta a frase em comando de bot. Responda APENAS com JSON válido, sem texto extra.

Formato:
{"command":"play","args":["nome","da","musica"],"mention":true}

Exemplos:
"toque uma musica chamada Faded" → {"command":"play","args":["Faded"]}
"feche o grupo" → {"command":"grupo","args":["f"]}

Frase: ${pergunta}`

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 20000)

const res = await fetch(
  `${API_KIMORI_URL}/api/ai/gemini?q=${encodeURIComponent(meuPrompt)}&apikey=${APIKEY_KIMORI}`,
  { signal: controller.signal }
)
clearTimeout(timeout)

const json = await res.json()
  

if (!json.success || !json.resposta) return reply('❌ Erro ao consultar a IA.')

const rawText = String(json.resposta)

const match = rawText.match(/\{[\s\S]*\}/)
if (!match) return reply('❌ A IA não retornou um JSON válido.')

const data = JSON.parse(match[0])
if (!data.command) return reply('❌ Não consegui entender.')

let comandoIA = data.command
let argsIA = data.args || []


console.log(`[ EXECUTANDO: /${comandoIA} ${argsIA.join(" ")} ]`)
command = comandoIA
args = argsIA
q = args.join(" ")

if (data.mention && mentioned.length > 0) {
  info.message.extendedTextMessage.contextInfo.mentionedJid = mentioned
}
if (isQuotedImage) global.iaMedia = "image"
if (isQuotedVideo) global.iaMedia = "video"
if (isQuotedSticker) global.iaMedia = "sticker"

 } catch (err) {
console.error(err)
reply("❌ Erro ao processar.")
 }
  }
}

async function sendUrlText(id, texto, title, desc, foto, link, hehe) {
menc = []
sp = texto.split(` `)
for(i of sp) {
if(i.includes(`@`)) menc.push(identArroba(i))
}
conn.sendMessage(id, {text: texto, contextInfo: {mentionedJid: menc, externalAdReply: {title: title, body: desc, thumbnail: await getBuffer(foto), mediaType: 1, showAdAttribution: true, sourceUrl: link}}}, {quoted: hehe})
}

const antispam = getAntispam();

try {
  const cfgSpam = (dataGp?.[0]?.antispam || {})
  const antiOn = isGroup ? (cfgSpam.active === true) : false

  const cfgFigu = (cfgSpam.figu || {})
  const limiteFigu = Number(cfgFigu.limite || 6)
  const tempoFigu = Number(cfgFigu.tempo || 10)

  const cfgTxt = (cfgSpam.texto || {})
  const limiteTxt = Number(cfgTxt.limite || 8)
  const tempoTxt = Number(cfgTxt.tempo || 8)

  const cfgFoto = (cfgSpam.foto || {})
  const limiteFoto = Number(cfgFoto.limite || 4)
  const tempoFoto = Number(cfgFoto.tempo || 10)

  const cfgVideo = (cfgSpam.video || {})
  const limiteVideo = Number(cfgVideo.limite || 3)
  const tempoVideo = Number(cfgVideo.tempo || 15)


  if (antiOn && isGroup) {

 
 const msgRoot = (info?.message || {})
 const msgMain =
msgRoot?.ephemeralMessage?.message ||
msgRoot?.viewOnceMessage?.message ||
msgRoot?.viewOnceMessageV2?.message ||
msgRoot

 const isSticker = !!msgMain?.stickerMessage
 const isPhoto = !!msgMain?.imageMessage
 const isVideo = !!msgMain?.videoMessage
 const isText = (!isSticker && !isPhoto && !isVideo && typeof body === 'string' && body.trim().length > 0)

 if ((isSticker || isText || isPhoto || isVideo) && !(SoDono || isGroupAdmins)) {

global._antispam = global._antispam || {}
global._antispam_warn = global._antispam_warn || {}
global._antispam_cd = global._antispam_cd || {}
global._antispam_queue = global._antispam_queue || {}
global._antispam_lock = global._antispam_lock || {}

const enqueueGroup = (gid, fn) => {
  if (!global._antispam_queue[gid]) global._antispam_queue[gid] = Promise.resolve()
  global._antispam_queue[gid] = global._antispam_queue[gid].then(fn).catch(() => {})
  return global._antispam_queue[gid]
}

const tipo =
  isSticker ? 'figu' :
  isPhoto ? 'foto' :
  isVideo ? 'video' :
  'texto'

const limite =
  (tipo === 'figu') ? limiteFigu :
  (tipo === 'foto') ? limiteFoto :
  (tipo === 'video') ? limiteVideo :
  limiteTxt

const tempo =
  (tipo === 'figu') ? tempoFigu :
  (tipo === 'foto') ? tempoFoto :
  (tipo === 'video') ? tempoVideo :
  tempoTxt

const lim = Math.max(2, Number.isFinite(limite) ? limite : 6)
const baseWindowMs = Math.max(3, Number.isFinite(tempo) ? tempo : 10) * 1000


const longWindowMs = (tipo === 'figu') ? Math.max(baseWindowMs, 60 * 1000) : baseWindowMs
const shortWindowMs = (tipo === 'figu') ? Math.min(baseWindowMs, 6 * 1000) : baseWindowMs

const k = from + '|' + sender + '|' + tipo
const lockKey = from + '|' + sender + '|remove'
const now = Date.now()


const arr = Array.isArray(global._antispam[k]) ? global._antispam[k] : []
const arrLong = arr.filter(x => x && (now - x.t) < longWindowMs)
arrLong.push({ t: now })
global._antispam[k] = arrLong


const countLong = arrLong.length
const countShort = (tipo === 'figu')
  ? arrLong.filter(x => x && (now - x.t) < shortWindowMs).length
  : countLong

const countNow = (tipo === 'figu') ? Math.max(countLong, countShort) : countLong

const nomeTipo =
  (tipo === 'figu') ? 'ғɪɢᴜʀɪɴʜᴀs' :
  (tipo === 'foto') ? 'ғᴏᴛᴏs' :
  (tipo === 'video') ? 'ᴠɪᴅᴇᴏs' :
  'ᴍᴇɴsᴀɢᴇɴs'


const avisoAt = Math.max(1, lim - 1)
if (countNow === avisoAt) {
  const lastWarn = global._antispam_warn[k] || 0
  if ((now - lastWarn) > longWindowMs) {
 global._antispam_warn[k] = now
 await conn.sendMessage(from, {
text: `@${sender.split('@')[0]} *Para de spam ${nomeTipo} 🤦‍♂️*`,
mentions: [sender]
 }).catch(() => {})
  }
}


if (countNow >= lim) {
  
  if (global._antispam_lock[lockKey]) {
 
  } else {
 const lastCd = global._antispam_cd[lockKey] || 0
 if ((now - lastCd) >= 900) {
global._antispam_cd[lockKey] = now
global._antispam_lock[lockKey] = true

enqueueGroup(from, async () => {
  try {
 if (isBotGroupAdmins) {
await conn.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {})
 }
  } finally {
 
 try { global._antispam[k] = [] } catch {}
 setTimeout(() => { try { delete global._antispam_lock[lockKey] } catch {} }, 1200)
  }
})
 }
  }
}

 }
  }

} catch {}
const mencionarIMG = (caption, imageUrl) => {
  const mentions = [];
  const regex = /@(\d+)/g;
  let match;
  while ((match = regex.exec(caption)) !== null) mentions.push(match[1] + '@s.whatsapp.net');

  return conn.sendMessage(from, {
    image: { url: imageUrl },
    caption,
    mentions,
    thumbnail: null
  }, { quoted: selo }).catch(console.error);
};

//INICIO DE COMANDO DE PREFIXO
switch(command){

case 'antispam': {
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)

const cfg = dataGp[0].antispam || {
active: false,
figu: { limite: 6, tempo: 10 },
texto: { limite: 8, tempo: 8 },
foto: { limite: 4, tempo: 10 },
video: { limite: 3, tempo: 15 }
}

cfg.figu = cfg.figu || { limite: 6, tempo: 10 }
cfg.texto = cfg.texto || { limite: 8, tempo: 8 }
cfg.foto = cfg.foto || { limite: 4, tempo: 10 }
cfg.video = cfg.video || { limite: 3, tempo: 15 }

if (!q) {
const st = cfg.active ? '✅' : '❌'
return reply(
`Antispam: ${st}

Figurinhas: ${cfg.figu.limite} / ${cfg.figu.tempo}s
Texto: ${cfg.texto.limite} / ${cfg.texto.tempo}s
Foto: ${cfg.foto.limite} / ${cfg.foto.tempo}s
Vídeo: ${cfg.video.limite} / ${cfg.video.tempo}s

Use:
${prefix + command} on
${prefix + command} off

${prefix + command} figu limite 6
${prefix + command} figu tempo 10
${prefix + command} figu set 6 10

${prefix + command} texto limite 8
${prefix + command} texto tempo 8
${prefix + command} texto set 8 8

${prefix + command} foto limite 4
${prefix + command} foto tempo 10
${prefix + command} foto set 4 10

${prefix + command} video limite 3
${prefix + command} video tempo 15
${prefix + command} video set 3 15`
)
}

const args2 = q.trim().split(/\s+/)

if (args2[0] === 'on' || args2[0] === 'ativar') {
if (cfg.active === true) return reply(`*O antispam já está ativado ✅*`)
dataGp[0].antispam = { ...cfg, active: true }
setGp(dataGp)
return reply(`*O antispam foi ativado ✅*`)
}

if (args2[0] === 'off' || args2[0] === 'desativar') {
if (cfg.active === false) return reply(`*O antispam já está desativado ❌*`)
dataGp[0].antispam = { ...cfg, active: false }
setGp(dataGp)
return reply(`*O antispam foi desativado ❌*`)
}

const alvo =
(args2[0] === 'figu' || args2[0] === 'figurinha') ? 'figu' :
(args2[0] === 'texto' || args2[0] === 'msg' || args2[0] === 'mensagem') ? 'texto' :
(args2[0] === 'foto' || args2[0] === 'image' || args2[0] === 'imagem') ? 'foto' :
(args2[0] === 'video' || args2[0] === 'vídeo') ? 'video' :
null

if (!alvo) {
return reply(
`Use:
${prefix + command} on/off
${prefix + command} figu limite 6
${prefix + command} figu tempo 10
${prefix + command} figu set 6 10
${prefix + command} texto limite 8
${prefix + command} texto tempo 8
${prefix + command} texto set 8 8
${prefix + command} foto limite 4
${prefix + command} foto tempo 10
${prefix + command} foto set 4 10
${prefix + command} video limite 3
${prefix + command} video tempo 15
${prefix + command} video set 3 15`
)
}

if (args2[1] === 'set') {
const lim = parseInt(args2[2])
const tmp = parseInt(args2[3])

if (!lim || lim < 2) return reply(`Use: ${prefix + command} ${alvo} set 6 10`)
if (!tmp || tmp < 3) return reply(`Use: ${prefix + command} ${alvo} set 6 10`)

dataGp[0].antispam = {
...cfg,
active: true,
[alvo]: {
...cfg[alvo],
limite: lim,
tempo: tmp
}
}

setGp(dataGp)

return reply(`*Ativado ✅*\n*${alvo}:* ${lim} / ${tmp}s`)
}

if (args2[1] === 'limite') {
const lim = parseInt(args2[2])

if (!lim || lim < 2) return reply(`Use: ${prefix + command} ${alvo} limite 6`)

dataGp[0].antispam = {
...cfg,
[alvo]: {
...cfg[alvo],
limite: lim
}
}

setGp(dataGp)

return reply(`*Limite (${alvo}) atualizado para:* ${lim}`)
}

if (args2[1] === 'tempo') {
const tmp = parseInt(args2[2])

if (!tmp || tmp < 3) return reply(`Use: ${prefix + command} ${alvo} tempo 10`)

dataGp[0].antispam = {
...cfg,
[alvo]: {
...cfg[alvo],
tempo: tmp
}
}

setGp(dataGp)

return reply(`*Tempo (${alvo}) atualizado para:* ${tmp}s`)
}

return reply(
`Use:
${prefix + command} on/off
${prefix + command} ${alvo} limite 6
${prefix + command} ${alvo} tempo 10
${prefix + command} ${alvo} set 6 10`
)
}
break

case 'modoia':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isModoIA) {
 dataGp[0].modoia = false
 setGp(dataGp)
 reply('*O modo IA foi desativado com sucesso no grupo 🙇‍♂️*')
} else {
 dataGp[0].modoia = true
 setGp(dataGp)

 reply(`*Prontinho! 😊 O modo IA está ativo neste grupo!* 💖🌸*

*✨ O que muda agora?*
Os membros podem pedir coisas para a Mizuki escrevendo normalmente, como se estivessem conversando com ela.

*💬 Exemplos:*
• Mizuki toca uma música para mim 🎶
• Mizuki abre o grupo 🔓
• Mizuki fecha o grupo 🔒
• Mizuki cria uma figurinha dessa foto 🖼️
• Mizuki remove @usuário ⚡

*🤭 Basta mencionar a Mizuki e ela tentará entender o pedido automaticamente!* 💞✨*`)
}
break



//==========[ CASES N-COINS ]============\\

case 'coins': 
case 'estatisticas': {
 if (!isGroup) return reply(Res_SoGrupo);
 if (!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 
 const usuario = RG_SCOINS[ID_G_COINS]?.usus[ID_USU_COINS] || { coins: 0, chances: { minerar: 0, cassino: 0 } };

 await mention(`↳ ${tempo} ↝ @${sender.split('@')[0]} ↴\n\n` +
  `☆ۜ͜͡💰 • Saldo atual: '${usuario.coins} N-Coins' 💨\n\n` +
  `☆ۜ͜͡⛏️ • Chances restantes de mineração: ${usuario.chances.minerar}/6\n\n` +
  `☆ۜ͜͡🎰 • Chances restantes no cassino: ${usuario.chances.cassino}/5`);
 break;
}

case 'sorteiocoins': 
case 'sortcoins': {
 if (!isGroup) return reply(Res_SoGrupo);
 if (!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 if (!SoDono) return reply(console.onlyOwner());
 if (q.match(/[a-z]/i)) return reply("😭🌟 Por favor, insira um valor numérico válido para sortear.");

 const participantes = RG_SCOINS[ID_G_COINS]?.usus || [];
 if (participantes.length === 0) return reply("Não há usuários registrados no sistema para o sorteio.");

 const randomIndex = Math.floor(Math.random() * participantes.length);
 const LuckyUser = participantes[randomIndex].id;

 await mention(`🎉🌟 Parabéns @${LuckyUser.split("@")[0]}, você acaba de ganhar: ${q.trim()} N-Coins. *Gaste com moderação!*`);
 SYSTEM_COIN.AdicionarCoins(LuckyUser, Math.floor(q.trim()));
 break;
}

case 'dadoapostado':
 if (!isGroup) {
  return reply(console.onlyGroup());
 }
 if (!isModoCoins) {
  return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 }
 const [numberDado, amountBet] = q.split('/');
 if (!numberDado) {
  return reply(`Você esqueceu de escolher o número que você quer tirar. Escolha um número de 1 a 6. Exemplo:\n\t• *${prefix + command} número/aposta*`);
 }
 if (!amountBet) {
  return reply(`Você esqueceu de colocar o valor que deseja apostar...`);
 }
 if (isNaN(numberDado) || isNaN(amountBet)) {
  return reply(`Por favor, insira apenas números válidos!`);
 }

 const numDado = parseInt(numberDado);
 const aposta = parseInt(amountBet);

 if (aposta > 500) {
  return reply(`Não é possível apostar mais de 500 N-Coins.`);
 }
 if (numDado < 1 || numDado > 6) {
  return reply(`Número inválido! Informe um número de 1 a 6.`);
 }
 const saldoAtual = SYSTEM_COIN.VerificarCampo(sender, "coins");
 if (saldoAtual < aposta) {
  return reply(`Saldo insuficiente! Verifique seu saldo com '${prefix}saldo' antes de apostar.`);
 }
 await reagir(from, "🎲");
 await reply(`Sorteando dado(s)! ⏳️`);
 const drawQuantity = Math.floor(Math.random() * 6) + 1;
 setTimeout(async () => {
  if (drawQuantity === numDado) {
const winMessages = [
 `🎲 Parabéns @${sender.split('@')[0]}, você ganhou ${aposta} N-Coins!`,
 `💰 Sucesso @${sender.split('@')[0]}! Você acertou e ganhou ${aposta} N-Coins!`
];
await mention(winMessages[Math.floor(Math.random() * winMessages.length)]);
await SYSTEM_COIN.AdicionarCoins(sender, aposta);
  } else {
const lossMessages = [
 `🤧 Infelizmente *@${sender.split("@")[0]}*, você errou a previsão e perdeu *${aposta} N-Coins*!`,
 `😿 @${sender.split("@")[0]}, você não acertou e perdeu ${aposta} N-Coins.`
];
await mention(lossMessages[Math.floor(Math.random() * lossMessages.length)]);
await SYSTEM_COIN.RemoverCoins(sender, aposta);
  }
 }, 5000);
 break;
 
 

case 'anagrama':
 if (!isGroup) return reply(Res_SoGrupo);
 if(!isGroupAdmins) return reply(Res_SoAdm)
 if(!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 if (fs.existsSync(`./banco de dados/grupos/games/anagrama/${from}.json`)) {
  fs.unlinkSync(`./banco de dados/grupos/games/anagrama/${from}.json`);
  reply("Desativado com sucesso.");
 } else {
  fs.mkdirSync(`./banco de dados/grupos/games/anagrama`, { recursive: true });
  const anaaleatorio = Math.floor(Math.random() * palavrasANA.length);
  fs.writeFileSync(`./banco de dados/grupos/games/anagrama/${from}.json`, JSON.stringify(palavrasANA[anaaleatorio]));
  await conn.sendMessage(from, {text: `🌟😲 Decifre a palavra embaralhada abaixo, qual será a ordem correta das letras?\n—\n• Palavra: *${shuffle(palavrasANA[anaaleatorio].palavraOriginal)}*\n• Dica: ${palavrasANA[anaaleatorio].dica}`}, {quoted: selo});
 }
 break;

case 'quizanimais':
 if (!isGroup) return reply(Res_SoGrupo);
 if(!isGroupAdmins) return reply(Res_SoAdm)
 if(!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 if (fs.existsSync(`./banco de dados/grupos/games/quiz-animais/${from}.json`)) {
  fs.unlinkSync(`./banco de dados/grupos/games/quiz-animais/${from}.json`);
  reply("Desativado com sucesso.");
 } else {
  fs.mkdirSync(`./banco de dados/grupos/games/quiz-animais`, { recursive: true });
  const animaisquiz = Math.floor(Math.random() * quizanimais.length);
  fs.writeFileSync(`./banco de dados/grupos/games/quiz-animais/${from}.json`, JSON.stringify(quizanimais[animaisquiz]));
  let wew = await getBuffer(`${quizanimais[animaisquiz].foto}`);
  await conn.sendMessage(from, {image: wew, caption: `🤔 Pergunta: ${quizanimais[animaisquiz].question}`}, {quoted: selo});
 }
 break;

case 'gartic':
 if (!isGroup) return reply(Res_SoGrupo);
 if(!isGroupAdmins) return reply(Res_SoAdm)
 if(!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 if (fs.existsSync(`./banco de dados/grupos/games/gartic/${from}.json`)) {
  fs.unlinkSync(`./banco de dados/grupos/games/gartic/${from}.json`);
  reply("Desativado com sucesso.");
 } else {
  fs.mkdirSync(`./banco de dados/grupos/games/gartic`, { recursive: true });
  const garticquiz = Math.floor(Math.random() * garticArchives.length);
  fs.writeFileSync(`./banco de dados/grupos/games/gartic/${from}.json`, JSON.stringify(garticArchives[garticquiz]));
  await conn.sendMessage(from, {image: {url: `${garticArchives[garticquiz].imagem}`}, caption: `👩🏼‍🏫 - A resposta é representada por um(a): ${garticArchives[garticquiz].pergunta}\n📜 - A resposta supostamente começa com a(s) letra(s): "${garticArchives[garticquiz].letra_inicial}"\n🤔 - Contém traços? ${garticArchives[garticquiz].contem_traços}`}, {quoted: selo});
 }
 break;

case 'enigma':
 if (!isGroup) return reply(Res_SoGrupo);
 if(!isGroupAdmins) return reply(Res_SoAdm)
 if(!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 if (fs.existsSync(`./banco de dados/grupos/games/enigma/${from}.json`)) {
  fs.unlinkSync(`./banco de dados/grupos/games/enigma/${from}.json`);
  reply("Desativado com sucesso.");
 } else {
  fs.mkdirSync(`./banco de dados/grupos/games/enigma`, { recursive: true });
  const engimaSolu = Math.floor(Math.random() * enigmaArchive.length);
  fs.writeFileSync(`./banco de dados/grupos/games/enigma/${from}.json`, JSON.stringify(enigmaArchive[engimaSolu]));
  await conn.sendMessage(from, {image: {url: enigma}, caption: `📜 - Resolva o seguinte enigma abaixo:\n—\n${enigmaArchive[engimaSolu].charada}\n–\n❓️ - *Não sabe a resposta?* _Peça ao adm do grupo para usar o comando *${prefix}revelarenigma* para revelar a resposta correta._`}, {quoted: selo});
 }
 break;

case 'quizfutebol':
case 'quizfut':
 if (!isGroup) return reply(Res_SoGrupo);
 if(!isGroupAdmins) return reply(Res_SoAdm)
 if(!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 if (fs.existsSync(`./banco de dados/grupos/games/quiz-futebol/${from}.json`)) {
  fs.unlinkSync(`./banco de dados/grupos/games/quiz-futebol/${from}.json`);
  reply("Desativado com sucesso.");
 } else {
  fs.mkdirSync(`./banco de dados/grupos/games/quiz-futebol`, { recursive: true });
  const futebolquiz = Math.floor(Math.random() * quizFutebol.length);
  fs.writeFileSync(`./banco de dados/grupos/games/quiz-futebol/${from}.json`, JSON.stringify(quizFutebol[futebolquiz]));
  await conn.sendMessage(from, {text: `💫⚽ QUIZ FUTEBOL ⚽💫\n–\n*🗣️| Responda a pergunta mostrada abaixo:*\n• _${quizFutebol[futebolquiz].pergunta}_`}, {quoted: selo});
 }
 break;
 
case 'cassino':
case 'slot':
 if (!isGroup) return reply(Res_SoGrupo);
 if (!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);

 const usuario = RG_SCOINS[ID_G_COINS].usus[ID_USU_COINS];

 if (usuario.chances.cassino >= 5) {
  return reply(`Volte amanhã! Você consumiu todas suas 5 chances do dia no cassino.`);
 }
 
 if (usuario.coins < 30) {
  return reply('Saldo insuficiente! Para usar os comandos de Coins, você deve ter pelo menos 30 N-Coins em sua carteira.');
 }

 usuario.chances.cassino++;
 CoinsUpdate(RG_SCOINS);

 const getResultSlot = ["🍓", "🍒", "🍎", "🍉"];
 const V_ = Array.from({ length: 3 }, () => getResultSlot[Math.floor(Math.random() * getResultSlot.length)]);

 const slotMensagem = async (mensagem) => {
  reply(`> ${mensagem}\n\n『 🕹️ CASSINO 💎 』↴ \n
╔═╌✯╌═⊱×⊰🎰⊱×⊰═╌✯╌═╗
║𖣴⋗  [${V_[0]} | ${V_[1]} | ${V_[2]}]◄
╚═╌✯╌═⊱×⊰💰⊱×⊰═╌✯╌═╝\n\n\n*${usuario.chances.cassino}/5* chances no cassino por hoje.`);
 };

 if (V_[0] === V_[1] && V_[1] === V_[2]) {
  await SYSTEM_COIN.AdicionarCoins(sender, 65);
  const mensagensVitoria = [
'Parece que a sorte estava esperando por você! Você acaba de levantar 65 N-Coins, aproveite você é digno de ganhar. 💰🌟',
'Que reviravolta! Você saiu do cassino com 65 N-Coins no bolso! Quem disse que os jogos de azar não valem a pena? 🌟💰',
'Surpreendente! A sorte sorriu para você esta noite no cassino, você ganhou 65 N-Coins como recompensa! 🎰✨'
  ];
  await slotMensagem(mensagensVitoria[Math.floor(Math.random() * mensagensVitoria.length)]);
 } else {
  await SYSTEM_COIN.RemoverCoins(sender, 5);
  const mensagensDerrota = [
'Que pena! Você perdeu, o que resultará na perda de 5 N-Coins. Mas não fique triste, na próxima você ganha! 🙏🏼🌟',
'Você perdeu, o que resultará na perda de 5 N-Coins! Com o tempo você recuperará e ultrapassará o valor perdido. 😇🌟',
'Hoje a sorte não estava de bom humor com você, perdeu 5 N-Coins. 🥱☠️'
  ];
  await slotMensagem(mensagensDerrota[Math.floor(Math.random() * mensagensDerrota.length)]);
 }
 break;

case 'minerar':
case 'minerarcoins':
if (!isGroup) return reply(Res_SoGrupo);
 if (!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
  if (RG_SCOINS[ID_G_COINS].usus[ID_USU_COINS].chances.minerar >= 6) {
 return reply(`Sinto muito, você não tem mais chance para minerar hoje, porque você completou: 6/6.`);
  }
  if (!RG_SCOINS[ID_G_COINS].usus[ID_USU_COINS]) {
 RG_SCOINS[ID_G_COINS].usus[ID_USU_COINS].chances.minerar = 1;
  } else {
 RG_SCOINS[ID_G_COINS].usus[ID_USU_COINS].chances.minerar += 1;
  }
  CoinsUpdate(RG_SCOINS);
  const aleatValor = Math.floor(Math.random() * 2);
  const rndg = Math.floor(Math.random() * 300); 
  if (aleatValor === 0) {
 const randomMining = [
`Você estava minerando nas ilhas savitas e encontrou ${rndg} N-Coins em minerais preciosos! 💰`,
`🗣💰 Você invadiu uma mina proibida e achou ${rndg} N-Coins em troca de ouro!`,
`💎👷🏻‍♀️ Em uma mina de diamantes, você encontrou 2 diamantes equivalentes a ${rndg} N-Coins.`,
`⛏️👷🏻‍♀️ Você escavou uma mina de ouro subterrânea em Minas Gerais e encontrou ${rndg} N-Coins!`,
 ];
 await reply(randomMining[Math.floor(Math.random() * randomMining.length)]);
 SYSTEM_COIN.AdicionarCoins(sender, rndg);
  } else {
 const miningFailureRX = [
"😥 Em sua tentativa de mineração, não foi possível encontrar nenhum mineral valioso!",
"😿 Você não deu sorte em sua escavação. Tente novamente mais tarde!",
"⛏️💎 Em Minas Gerais, famosa por suas minas de diamantes, você não encontrou nada desta vez.",
 ];
 let miningFailure = miningFailureRX[Math.floor(Math.random() * miningFailureRX.length)];
 miningFailure += RG_SCOINS[ID_G_COINS].usus[ID_USU_COINS].chances.minerar >= 6 
? "\n> Infelizmente você não tem mais chances para minerar hoje, volte amanhã..." 
: `\n> Ainda restam ${6 - RG_SCOINS[ID_G_COINS].usus[ID_USU_COINS].chances.minerar} tentativas para minerar hoje.`;
 await reply(miningFailure);
  }
  break;

case 'revelargartic':  
if (!isGroupAdmins) return reply('Somente adms podem ver a(s) resposta(s) do jogos!')
if (!isGroup) return reply(Res_SoGrupo);
 if (!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
if(fs.existsSync(`./banco de dados/grupos/games/gartic/${from}.json`)) return reply("Não existe nenhuma partida atual do jogo neste grupo.")
let datenagramaa = JSON.parse(fs.readFileSync(`./banco de dados/grupos/games/gartic/${from}.json`))
reply(`• Olá *${pushname}*, a resposta correta da afirmação era: ${II}${datenagramaa.resposta}${II}\n• Envie a resposta apresentada acima para passar a próxima..`)
break

case 'revelarenigma':
 if (!isGroup) return reply(Res_SoGrupo);
 if (!isGroupAdmins) return reply('Somente adms podem ver a(s) resposta(s) do jogos!');
 if (!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 if (!fs.existsSync(`./banco de dados/grupos/games/enigma/${from}.json`)) return reply("Não existe nenhuma partida atual do jogo neste grupo.");
 let eni1 = JSON.parse(fs.readFileSync(`./banco de dados/grupos/games/enigma/${from}.json`))
 reply(`• Olá *${pushname}*, a resposta correta do enigma é: *${eni1.respostaEne}*\n• Envie a resposta apresentada acima para passar ao próximo..`)
 break

case 'rankcoins':
if (!isGroup) return reply(Res_SoGrupo);
 if (!isModoCoins) return reply(`*Esse comando so pode ser ativo quando o sistema ${prefix}modocoins estiver ativo 🤷‍♂️*`);
 const grupo = RG_SCOINS.find(g => g.grupo === from) || { chances: { minerar: 0, cassino: 0 } };
 if (!grupo) return reply('*Nao ha ninguem com N-Coins neste grupo 🤷‍♂️*');
 const rank = grupo.usus.sort((a, b) => b.coins - a.coins).slice(0, 10);
 let mensagemRank = `╔═╌✯╌═⊱×⊰平⊱×⊰═╌✯╌═╗
║➪ RANK N-COINS『💰』  
╚═╌✯╌═⊱×⊰平⊱×⊰═╌✯╌═╝\n\n`;
 rank.forEach((usuario, i) => {
  mensagemRank += `『 ${i + 1}º 』↴  
╔═╌✯╌═⊱×⊰平⊱×⊰═╌✯╌═╗
║𖣴⋗ Usuario - @${usuario.id.split('@')[0]}
║𖣴⋗ Saldo - ${usuario.coins} N-Coins
║𖣴⋗ Minerar - ${usuario.chances.minerar}/6
║𖣴⋗ Cassino - ${usuario.chances.cassino}/5
╚═╌✯╌═⊱×⊰平⊱×⊰═╌✯╌═╝\n\n`;
 });
 mentions(mensagemRank, rank.map(u => u.id), true);
 break

//==========[ FIM DAS CASES N-COINS ]=============\\


// Ver relatório de memória (comando !memdump na bot):
case 'memdump': memReport(); break;

// Limpeza forçada (comando !cleanup):
case 'cleanup': forceCleanup(); break;

case 'rgcmd': {
  if (!SoDono) return reply(Res_SoDono)
  const [semPrefixo, comandoReal] = q.split(/ +/g)
  if (!semPrefixo || !comandoReal) return reply('*Use: rgprefix [semprefixo] [comandoreal] ✨️*')

  registrarNoPrefix(semPrefixo.toLowerCase(), comandoReal.toLowerCase())
  reply(
 `*Registrei o comando com sucesso 💁‍♂️*\n\n` +
 `- *🌟 Sem prefixo:* ${semPrefixo.toLowerCase()}\n` +
 `- *⚙️ Comando real:* ${comandoReal.toLowerCase()}`
  )
}
break

case 'delcmd': {
  if (!SoDono) return reply(Res_SoDono)
  if (!q) return reply('*Informe o comando sem prefixo que deseja remover 🙇‍♂️*')

  const sucesso = removerNoPrefix(q.toLowerCase())
  if (sucesso) {
 reply('*Comando removido com sucesso ✨️*')
  } else {
 reply('*Esse comando não está registrado 🥀*')
  }
}
break

case 'menunoprefix':
case 'semprefixo':
case 'noprefix': {
  try {
 const lista = listarNoPrefix()

 if (!lista.length)
return reply('*Não há comandos sem prefixo registrados ✨️*')

 await reagir(from, '✨️')

 let msg = '╭«────── « ⋅ʚ♡ɞ⋅ » ──────»\n'

 for (const item of lista) {
msg += 
`╎❪.🌙᪽¡❫ 𝑺𝒆𝒎 𝑷𝒓𝒆𝒇𝒊𝒙𝒐
╎↳ *${item.cmdSemPrefixo}*
╎❪.🔮᪽̩¡❫ 𝑪𝒐𝒎𝒂𝒏𝒅𝒐 𝑹𝒆𝒂𝒍
╎↳ *${prefix + item.comandoOriginal}*
`
 }

 msg += `╰«────── « ⋅ʚ♡ɞ⋅ » ──────»\n- ${NomeDoBot}`

 await conn.sendMessage(from, {
image: fs.readFileSync('./dono/logo.jpg'),
caption: msg
 }, { quoted: selo })

  } catch (e) {
 console.error(e)

 await conn.sendMessage(from, {
text: console.error()
 }, { quoted: selo })
  }

  break
}
//================[ NAMORO ]===========\\

case "criar_familia":
case "criarfamilia": {
  try {
    if (!isGroup) return reply(Res_SoGrupo)

    const casal = __FAM_isMarriedInGroup(sender, from, namoro1)
    if (!casal) return reply('*❌ Só quem está namorando pode criar família.* 🙇‍♂️')

    const db = __FAM_load()
    const fid = __FAM_makeId(casal.a, casal.b, from)

    if (db.families[fid]) {
      return reply('*⚠️ Vocês já têm uma família criada neste grupo.* 🙇‍♂️')
    }

    db.families[fid] = {
      a: casal.a,
      b: casal.b,
      grupo: String(from),
      criadoEm: Date.now(),
      filhos: []
    }

    __FAM_save(db)

    await reagir(from, "👨‍👩‍👧‍👦")

    return conn.sendMessage(from, {
      text: `*✅ Família criada com sucesso!* 🙇‍♂️`,
      contextInfo: { mentionedJid: [casal.a, casal.b] }
    }, { quoted: selo }).catch(() =>
      reply('*✅ Família criada com sucesso!* 🙇‍♂️')
    )

  } catch (e) {
    console.log(e)
    reply(mess.error?.() || '*❌ Deu erro ao criar família.* 🙇‍♂️')
  }
}
break

case "adotar": {
  try {
    if (!isGroup) return reply(Res_SoGrupo)

    const casal = __FAM_isMarriedInGroup(sender, from, namoro1)
    if (!casal) return reply('*❌ Só quem está namorando pode adotar.* 🙇‍♂️')

    const db = __FAM_load()
    const fid = __FAM_makeId(casal.a, casal.b, from)

    if (!db.families[fid]) {
      return reply(`*⚠️ Vocês ainda não criaram uma família.* 🙇‍♂️\n\n*• Use:* ${prefix}criar_familia`)
    }

    const alvo = await __FAM_pickTargetJid(info, menc_os2, from, conn)

    if (!alvo)
      return reply('*❌ Marque alguém ou responda a mensagem para adotar.* 🙇‍♂️')

    if (alvo === casal.a || alvo === casal.b)
      return reply('*❌ Você não pode adotar seu cônjuge.* 🙇‍♂️')

    if (botNumberLID?.includes?.(alvo) || botNumber?.includes?.(alvo))
      return reply('*❌ Não dá para adotar o bot.* 🙇‍♂️')

    const ja = __FAM_findFamilyByMember(db, alvo, from)

    if (ja)
      return reply('*⚠️ Essa pessoa já faz parte de uma família neste grupo.* 🙇‍♂️')

    db.pend[alvo] = {
      familyId: fid,
      grupo: String(from),
      alvo,
      por: String(sender),
      criadoEm: Date.now()
    }

    __FAM_save(db)

    await reagir(from, "👶")

    const p1 = casal.a.split("@")[0]
    const p2 = casal.b.split("@")[0]

    const texto =
`*👨‍👩‍👧‍👦 Pedido de adoção enviado!* 🙇‍♂️

*• Família:* @${p1} & @${p2}
*• Adotando:* @${alvo.split("@")[0]}

*🧩 Para aceitar, use:* ${prefix}aceitar_adocao`

    return conn.sendMessage(from, {
      text: texto,
      contextInfo: {
        mentionedJid: [casal.a, casal.b, alvo]
      }
    }, { quoted: selo }).catch(() =>
      reply('*✅ Pedido de adoção enviado.* 🙇‍♂️')
    )

  } catch (e) {
    console.log(e)
    reply(mess.error?.() || '*❌ Deu erro ao pedir adoção.* 🙇‍♂️')
  }
}
break

case "aceitar_adocao":
case "aceitaradocao": {
  try {
    if (!isGroup) return reply(Res_SoGrupo)

    const db = __FAM_load()
    const pend = db.pend?.[String(sender)]

    if (!pend)
      return reply('*❌ Você não tem nenhum pedido de adoção pendente.* 🙇‍♂️')

    const fam = db.families?.[pend.familyId]

    if (!fam || String(fam.grupo) !== String(from)) {
      delete db.pend[String(sender)]
      __FAM_save(db)
      return reply('*⚠️ Esse pedido não é mais válido.* 🙇‍♂️')
    }

    fam.filhos = Array.isArray(fam.filhos) ? fam.filhos : []

    if (!fam.filhos.includes(String(sender))) {
      fam.filhos.push(String(sender))
    }

    delete db.pend[String(sender)]
    db.families[pend.familyId] = fam
    __FAM_save(db)

    await reagir(from, "✅")

    const p1 = fam.a.split("@")[0]
    const p2 = fam.b.split("@")[0]

    return conn.sendMessage(from, {
      text:
`*✅ Adoção aceita!* 🙇‍♂️

*• Família:* @${p1} & @${p2}
*• Novo filho:* @${String(sender).split("@")[0]}`,
      contextInfo: {
        mentionedJid: [fam.a, fam.b, String(sender)]
      }
    }, { quoted: selo }).catch(() =>
      reply('*✅ Adoção aceita!* 🙇‍♂️')
    )

  } catch (e) {
    console.log(e)
    reply(mess.error?.() || '*❌ Deu erro ao aceitar a adoção.* 🙇‍♂️')
  }
}
break

case "familia":
case "minha_familia":
case "minhafamilia": {
  try {
    if (!isGroup) return reply(Res_SoGrupo)

    const db = __FAM_load()
    const found = __FAM_findFamilyByMember(db, sender, from)

    if (!found)
      return reply('*❌ Você não faz parte de nenhuma família neste grupo.* 🙇‍♂️')

    const fam = found.fam
    const p1 = fam.a.split("@")[0]
    const p2 = fam.b.split("@")[0]

    const filhos = Array.isArray(fam.filhos) ? fam.filhos : []

    const listaFilhos =
      filhos.length
        ? filhos
            .map((j, i) => `*${i + 1}.* @${String(j).split("@")[0]}`)
            .join("\n")
        : '*Nenhum filho adotado ainda.*'

    const txt =
`👨‍👩‍👧‍👦 𝖿ᥲmіᥣіᥲ ძᥱ @${p1} & @${p2}

*• ⍴ᥲіs:* @${p1} & @${p2}
*• 𝖿іᥣһ᥆s:* ${filhos.length}

${listaFilhos}`

    const mentions = [fam.a, fam.b, ...filhos]

    await reagir(from, "👨‍👩‍👧‍👦")

    return conn.sendMessage(from, {
      text: txt,
      contextInfo: {
        mentionedJid: mentions
      }
    }, { quoted: selo }).catch(() => reply(txt))

  } catch (e) {
    console.log(e)
    reply(mess.error?.() || '*❌ Deu erro ao mostrar a família.* 🙇‍♂️')
  }
}
break

case "sair_familia":
case "sairfamilia": {
  try {
    if (!isGroup) return reply(Res_SoGrupo)

    const db = __FAM_load()
    const found = __FAM_findFamilyByMember(db, sender, from)

    if (!found)
      return reply('*❌ Você não está em nenhuma família.* 🙇‍♂️')

    if (found.role === "casal") {
      return reply('*⚠️ Os pais não podem usar sair_familia. Use deletar_familia se desejar.* 🙇‍♂️')
    }

    const fam = found.fam
    fam.filhos = (fam.filhos || []).filter(j => String(j) !== String(sender))
    db.families[found.fid] = fam

    __FAM_save(db)

    await reagir(from, "🚪")
    return reply('*✅ Você saiu da família.* 🙇‍♂️')

  } catch (e) {
    console.log(e)
    reply(mess.error?.() || '*❌ Deu erro ao sair da família.* 🙇‍♂️')
  }
}
break

case "deletar_familia":
case "deletarfamilia": {
  try {
    if (!isGroup) return reply(Res_SoGrupo)

    const casal = __FAM_isMarriedInGroup(sender, from, namoro1)

    if (!casal)
      return reply('*❌ Só quem está namorando pode deletar a família.* 🙇‍♂️')

    const db = __FAM_load()
    const fid = __FAM_makeId(casal.a, casal.b, from)

    if (!db.families[fid])
      return reply('*❌ Você não tem uma família criada neste grupo.* 🙇‍♂️')

    delete db.families[fid]

    for (const [k, v] of Object.entries(db.pend || {})) {
      if (v?.familyId === fid) delete db.pend[k]
    }

    __FAM_save(db)

    await reagir(from, "🗑️")
    return reply('*✅ Família deletada com sucesso.* 🙇‍♂️')

  } catch (e) {
    console.log(e)
    reply(mess.error?.() || '*❌ Deu erro ao deletar a família.* 🙇‍♂️')
  }
}
break

case "expulsar_filho":
case "expulsarfilho": {
  try {
    if (!isGroup) return reply(Res_SoGrupo)

    const casal = __FAM_isMarriedInGroup(sender, from, namoro1)

    if (!casal)
      return reply('*❌ Só quem está namorando pode expulsar um filho.* 🙇‍♂️')

    const db = __FAM_load()
    const fid = __FAM_makeId(casal.a, casal.b, from)
    const fam = db.families?.[fid]

    if (!fam)
      return reply('*❌ Vocês não têm uma família criada neste grupo.* 🙇‍♂️')

    const alvo = await __FAM_pickTargetJid(info, menc_os2, from, conn)

    if (!alvo)
      return reply('*❌ Marque o filho para expulsar.* 🙇‍♂️')

    fam.filhos = Array.isArray(fam.filhos) ? fam.filhos : []

    if (!fam.filhos.includes(alvo))
      return reply('*⚠️ Essa pessoa não é um filho dessa família.* 🙇‍♂️')

    fam.filhos = fam.filhos.filter(j => String(j) !== String(alvo))
    db.families[fid] = fam

    __FAM_save(db)

    await reagir(from, "🚫")

    return conn.sendMessage(from, {
      text:
`*✅ Filho expulso da família.* 🙇‍♂️
*• Removido:* @${alvo.split("@")[0]}`,
      contextInfo: {
        mentionedJid: [alvo]
      }
    }, { quoted: selo }).catch(() =>
      reply('*✅ Filho expulso da família.* 🙇‍♂️')
    )

  } catch (e) {
    console.log(e)
    reply(mess.error?.() || '*❌ Deu erro ao expulsar o filho.* 🙇‍♂️')
  }
}
break

case 'namorar':
case 'pedir':
case 'pedirnamoro': {
  if (!isGroup) return reply(Res_SoGrupo)
  if (!args[0]) return reply(`*Exemplo:* ${prefix}namorar @marcar ou ${prefix}namorar 5527992870575`)

  const groupMetadata = await conn.groupMetadata(from)

  let jidAlvoRaw

  if (menc_os2) {
    jidAlvoRaw = await getJid(menc_os2, from, groupMetadata)
  } else if (menc_jid) {
    jidAlvoRaw = await getJid(menc_jid, from, groupMetadata)
  } else if (menc_prt) {
    jidAlvoRaw = await getJid(menc_prt, from, groupMetadata)
  } else {
    const numLimpo = args[0].replace(/[^0-9]/g, '')
    if (numLimpo.length < 10) return reply('*Número inválido! Use o formato: 5527992870575 ou marque a pessoa!*')
    jidAlvoRaw = await getJid(numLimpo, from, groupMetadata)
  }

  if (!jidAlvoRaw) return reply('*Não foi possível identificar a pessoa!* 🤡')

  const jidAlvo = await resolveJidReal(jidAlvoRaw, from, conn)

  if (!jidAlvo || jidAlvo === sender) return reply('*Não foi possível identificar a pessoa ou você está tentando pedir a si mesmo!* 🤡')

  const jaNamorando = namoro1.find(n => {
    return (n.usu1 === sender || n.usu2 === sender || n.usu1 === jidAlvo || n.usu2 === jidAlvo) &&
      String(n.idgp) === String(from) &&
      n.namorados === true
  })

  if (jaNamorando) return reply('*Você ou a pessoa já está em um relacionamento neste grupo!* 💔')

  const pendente = namoro1.find(n => {
    return (n.usu1 === sender || n.usu2 === sender) &&
      String(n.idgp) === String(from) &&
      n.namorados === false
  })

  if (pendente) return reply('*Você já tem um pedido de namoro pendente!* ⏳')

  const jaPediu = namoro2.find(i => {
    return i.id === jidAlvo && String(i.idgp) === String(from)
  })

  if (jaPediu) return reply('*Essa pessoa já foi pedida em namoro recentemente!*')

  const dataAtual = new Date()
  const hora = dataAtual.toTimeString().slice(0, 8)
  const data = dataAtual.toLocaleDateString('pt-BR')

  namoro1.push({
    usu1: sender,     // jid real
    usu2: jidAlvo,    // jid real
    idgp: from,
    namorados: false,
    hora: hora,
    data: data
  })

  namoro2.push({
    id: jidAlvo,       // jid real de quem recebeu o pedido
    pedido: sender,    // jid real de quem pediu
    idgp: from
  })

  fs.writeFileSync("./banco de dados/namoro1.json", JSON.stringify(namoro1, null, 2))
  fs.writeFileSync("./banco de dados/namoro2.json", JSON.stringify(namoro2, null, 2))

  const imagemNamoro = 'https://i.ibb.co/xKxMpkpV/0e919e21f8a4.jpg'

  await conn.sendMessage(from, {
    image: { url: imagemNamoro },
    caption: `「❤️」 @${jidAlvo.split('@')[0]}\n- *💌 Você recebeu um pedido de namoro de:*\n\n『✨』 @${sender.split('@')[0]}\n\n*Digite "sim" para aceitar ou "não" para recusar. 💞*\n\n> *🕊️ @${sender.split('@')[0]} pode cancelar com: !cancelar*`,
    contextInfo: { mentionedJid: [sender, jidAlvo] }
  }, { quoted: selo })

  break
}

case 'cancelar':
case 'cancelarpedido': {
  if (!isGroup) return reply(Res_SoGrupo);

  const senderNorm = sender;

  const index1 = namoro1.findIndex(i => {
    const u1 = i.usu1;
    const u2 = i.usu2;
    return (u1 === senderNorm || u2 === senderNorm) && 
           String(i.idgp) === String(from) && 
           i.namorados === false;
  });

  if (index1 === -1)
    return reply("*Você não possui nenhum pedido de namoro pendente. 🤦‍♂️*");

  if (namoro1[index1].namorados === true)
    return reply("*Não é possível cancelar um namoro que já foi aceito. 🤷‍♂️*");

  const parceiro = namoro1[index1].usu2;

  namoro1.splice(index1, 1);
  fs.writeFileSync("./banco de dados/namoro1.json", JSON.stringify(namoro1, null, 2));

  const index2 = namoro2.findIndex(i => {
    return i.id === parceiro || 
           i.id === senderNorm ||
           i.pedido === senderNorm.split('@')[0];
  });

  if (index2 !== -1) {
    namoro2.splice(index2, 1);
    fs.writeFileSync("./banco de dados/namoro2.json", JSON.stringify(namoro2, null, 2));
  }

  reply("*✅ Pedido de namoro cancelado com sucesso!* 💁‍♂️");
  break;
}

case 'terminar':
case 'terminar_namoro': {
  if (!JSON.stringify(namoro1).includes(sender))
    return reply('*Você não está namorando com ninguém.* 🙇‍♂️');

  let D1 = namoro1.map(i => i.usu1).indexOf(sender);
  if (D1 === -1) D1 = namoro1.map(i => i.usu2).indexOf(sender);

  if (D1 === -1)
    return reply('*Não encontrei o seu relacionamento. Tente novamente.* 🤷‍♂️');

  const parceiro = namoro1[D1].usu1 === sender
    ? namoro1[D1].usu2
    : namoro1[D1].usu1;

  const jidParceiro = parceiro.includes('@s.whatsapp.net')
    ? parceiro
    : `${parceiro}@s.whatsapp.net`;

  const D2 = namoro1.map(a => a.usu1).indexOf(jidParceiro);

  if (D2 !== -1) {
    namoro1[D2].namorados = false;
    namoro1.splice(D2, 1);
  }

  await reply('*💔 O namoro chegou ao fim. Agora você está solteiro(a) novamente!*');

  await conn.sendMessage(jidParceiro, {
    text:
`*💔 Tenho uma notícia triste...*

*Seu parceiro(a) acabou de terminar o relacionamento.*

> *Guarde os bons momentos, mesmo que agora eles tenham acabado.* 🙇‍♂️`,
    contextInfo: {
      mentionedJid: [sender, jidParceiro]
    }
  }, { quoted: selo });

  namoro1.splice(D1, 1);
  fs.writeFileSync('./banco de dados/namoro1.json', JSON.stringify(namoro1));
  break;
}

case 'minhadupla':
case 'dupla': {
  if (!isGroup) return reply(Res_SoGrupo);

  const userNum = sender.split('@')[0];

  const dupla = namoro1.find(i =>
    i.usu1 === sender ||
    i.usu1 === userNum ||
    i.usu2 === sender ||
    i.usu2 === userNum
  );

  if (!dupla)
    return reply('*Você não está namorando ninguém.* 🤷‍♂️');

  if (!dupla.namorados)
    return reply('*Seu pedido de namoro ainda não foi aceito.* 💁‍♂️');

  await reagir(from, "❤️‍🩹");

  const parceiro1 = dupla.usu1.includes('@')
    ? dupla.usu1
    : `${dupla.usu1}@s.whatsapp.net`;

  const parceiro2 = dupla.usu2.includes('@')
    ? dupla.usu2
    : `${dupla.usu2}@s.whatsapp.net`;

  if (!dupla.inicio) {
    dupla.inicio = Date.now();
    const fs = require('fs');
    fs.writeFileSync('./banco de dados/namoro1.json', JSON.stringify(namoro1));
  }

  const tempoJuntos = msToTime(Date.now() - dupla.inicio);

  const avatarPadrao = 'https://i.ibb.co/xKxMpkpV/0e919e21f8a4.jpg';

  // ---- cache de avatar (30 min) ----
  global.avatarCache = global.avatarCache || new Map();
  const AVATAR_TTL = 1000 * 60 * 30;

  // ---- resolve LID -> JID real ----
  let metaGrupo = null;
  async function getMetaGrupo() {
    if (metaGrupo) return metaGrupo;
    try {
      metaGrupo = await conn.groupMetadata(from);
    } catch (e) {
      metaGrupo = { participants: [] };
    }
    return metaGrupo;
  }

  async function resolverJid(jid) {
    if (!jid.includes('@lid')) return jid;
    try {
      const meta = await getMetaGrupo();
      const p = meta.participants.find(x => x.id === jid || x.lid === jid);
      const real = p?.jid || p?.phoneNumber || p?.participantAlt;
      if (real) return real.includes('@') ? real : `${real}@s.whatsapp.net`;
    } catch (e) {}
    return jid;
  }

  // ---- nome ----
  async function pegarNome(jid) {
    try {
      const nome = conn.contacts?.[jid]?.name
        || conn.contacts?.[jid]?.notify
        || conn.contacts?.[jid]?.verifiedName;
      if (nome) return nome;
    } catch (e) {}
    return jid.split('@')[0];
  }

  // ---- foto de perfil ----
async function pegarFoto(jid) {
    const alvo = await resolverJid(jid);

    const cached = global.avatarCache.get(alvo);
    if (cached && (Date.now() - cached.ts) < AVATAR_TTL) {
      return cached.url;
    }

    try {
      // corrida: o que responder primeiro vence
      const url = await Promise.race([
        conn.profilePictureUrl(alvo, 'image'),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error('timeout foto')), 3000)
        )
      ]);
      global.avatarCache.set(alvo, { url, ts: Date.now() });
      return url;
    } catch (e) {
      console.log('foto FALHOU:', alvo, '->', e.message);
      global.avatarCache.set(alvo, { url: avatarPadrao, ts: Date.now() });
      return avatarPadrao;
    }
  }

  const [nome1, nome2, avatar1, avatar2] = await Promise.all([
    pegarNome(parceiro1),
    pegarNome(parceiro2),
    pegarFoto(parceiro1),
    pegarFoto(parceiro2)
  ]);

  // ---- card canva casal ----
  let imageUrl = avatarPadrao;
  let cardGerou = false;

  try {
    const axios = require('axios');

    const params = new URLSearchParams({
      nome1: nome1,
      nome2: nome2,
      desde: dupla.data || '??/??/????',
      tempo: tempoJuntos,
      frase: 'ate a lua e de volta',
      avatar1: avatar1,
      avatar2: avatar2
    });

    const apiRes = await axios.get(
      `http://project.darkhostinger.com.br:2027/api/canvas/casal?${params.toString()}`,
      { timeout: 8000 }
    );

    if (apiRes.data?.status && apiRes.data?.result?.url) {
      imageUrl = apiRes.data.result.url;
      cardGerou = true;
    }
  } catch (e) {
    console.log('Erro ao gerar card de casal:', e.message);
  }
  // ---------------------------

  const texto =
`「💖」 @${parceiro1.split('@')[0]}

*💍 Está namorando com:*
💗 @${parceiro2.split('@')[0]}

• Há ${tempoJuntos} •

*⏳ Namorando desde: ${dupla.hora || '??:??'} do dia ${dupla.data || '??/??/????'}*${cardGerou ? '' : '\n\n_(card indisponível no momento)_'}`;

  await conn.sendMessage(from, {
    image: { url: imageUrl },
    caption: texto,
    mentions: [parceiro1, parceiro2],
    contextInfo: {
      mentionedJid: [parceiro1, parceiro2]
    }
  }, { quoted: selo });

  break;
}

//============[ FIM CASES NAMORO ]==========\\
 
case 'hd': {//✧･ﾟ: ᴅᴇᴠʟᴀʙ ✧･ﾟ:
try {
const cheerio = require('cheerio')
const FormData = require('form-data')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const quoted = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
const isQuotedImage = quoted?.imageMessage
const isImageMsg = info.message?.imageMessage
if (!isQuotedImage && !isImageMsg) {
return reply('*🖼️ Responda uma imagem*')}
reagir('✨')
async function getBuffer(stream) {
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer}
async function getToken() {
const html = await axios.get('https://www.iloveimg.com/upscale-image', {
headers: {
'User-Agent': 'Mozilla/5.0'}})
const $ = cheerio.load(html.data)
const script = $('script')
.filter((i, el) => $(el).html()?.includes('ilovepdfConfig ='))
.html()
if (!script) throw new Error('Token não encontrado.')
const jsonS = script.split('ilovepdfConfig = ')[1].split(';')[0]
const json = JSON.parse(jsonS)
const csrf = $('meta[name="csrf-token"]').attr('content')
return {
token: json.token,
csrf}}
async function uploadImage(server, headers, buffer, task) {
const form = new FormData()
form.append('name', 'image.jpg')
form.append('chunk', '0')
form.append('chunks', '1')
form.append('task', task)
form.append('preview', '1')
form.append('file', buffer, 'image.jpg')
const res = await axios.post(
`https://${server}.iloveimg.com/v1/upload`,
form,{
headers: {
...headers,
...form.getHeaders()}})
return res.data}
async function upscale(buffer, scale = 4) {
const { token, csrf } = await getToken()
const servers = [
'api1g','api2g','api3g','api8g','api9g',
'api10g','api11g','api12g','api13g',
'api14g','api15g','api16g','api17g',
'api18g','api19g','api20g','api21g',
'api22g','api24g','api25g']
const server = servers[Math.floor(Math.random() * servers.length)]
const task = 'r68zl88mq72xq94j2d5p66bn2z9lrbx20njsbw2qsAvgmzr11lvfhAx9kl87pp6yqgx7c8vg7sfbqnrr42qb16v0gj8jl5s0kq1kgp26mdyjjspd8c5A2wk8b4Adbm6vf5tpwbqlqdr8A9tfn7vbqvy28ylphlxdl379psxpd8r70nzs3sk1'
const headers = {
'Authorization': 'Bearer ' + token,
'Origin': 'https://www.iloveimg.com/',
'Cookie': '_csrf=' + csrf,
'User-Agent': 'Mozilla/5.0'}
const upload = await uploadImage(server, headers, buffer, task)
const form = new FormData()
form.append('task', task)
form.append('server_filename', upload.server_filename)
form.append('scale', scale)
const res = await axios.post(
`https://${server}.iloveimg.com/v1/upscale`,
form,{
headers: {
...headers,
...form.getHeaders()},
responseType: 'arraybuffer',
validateStatus: null})
const contentType = res.headers['content-type']
if (contentType && contentType.includes('application/json')) {
throw new Error('Erro ao melhorar imagem.')}
return Buffer.from(res.data)}
reply('*✨ Melhorando qualidade da imagem...*')
const imageMsg = isQuotedImage
? quoted.imageMessage
: info.message.imageMessage
const stream = await downloadContentFromMessage(imageMsg, 'image')
const media = await getBuffer(stream)
const result = await upscale(media, 4)
await conn.sendMessage(from, {
image: result,
caption: '✨ Imagem melhorada com sucesso!'
}, { quoted: selo })
reagir('✅')
} catch (e) {
console.log(e)
reply('❌ ᴇʀʀᴏ ᴀᴏ ᴍᴇʟʜᴏʀᴀʀ ɪᴍᴀɢᴇᴍ.')}}
break
 
case 'info': {
  const result = JSON.stringify(info, null, 1)

  await conn.relayMessage(from, {
 botForwardedMessage: {
message: {
  richResponseMessage: {
 message: {
unifiedResponse: {
  responses: [
 {
richResponse: {
  body: result,
  contentType: 'CODE',
  language: 'JAVASCRIPT'
}
 }
  ]
}
 }
  }
}
 }
  }, { messageId: conn.generateMessageTag() })

  break
}

case 'guu': {
const texto = q

const codeBlocks = [{
highlightType: 0,
codeContent: texto
}]

await conn.relayMessage(from, {
botForwardedMessage: {
message: {
richResponseMessage: {
messageType: 1,
submessages: [
{
messageType: 5,
codeMetadata: {
codeLanguage: 'javascript',
codeBlocks
}
}
],
contextInfo: {
forwardingScore: 1,
isForwarded: true,
forwardedAiBotMessageInfo: {
botJid: '867051314767696@bot'
},
forwardOrigin: 4
}
}
}
}
}, {})

}
break
 
case 'wastalk': { // Mizuki Domina 🌸
const PhoneNum = require('awesome-phonenumber');
const regionNames = new Intl.DisplayNames(['pt'], { type: 'region' });

const detectOperator = (num) => {
  const clean = num.replace(/\D/g, '');
  const prefix3 = clean.slice(4, 7);

  if (num.startsWith('+62')) {
 if (/^628(11|12|13|21|22|23|51|52|53|58)/.test(clean)) return 'Telkomsel';
 if (/^628(14|15|16|55|56|57|59|95|96|97|98|99)/.test(clean)) return 'Indosat / Tri';
 if (/^628(17|18|19|77|78)/.test(clean)) return 'XL Axiata';
 if (/^628(31|32|33|38)/.test(clean)) return 'AXIS';
 if (/^628(81|82|83|84|85|86|87|88|89)/.test(clean)) return 'Smartfren';
 return 'Outras (ID)';
  }

  if (num.startsWith('+55')) {
 const operadorasBR = {
Vivo: ['910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '991', '992', '993', '994', '996'],
Claro: ['912', '913', '914', '915', '916', '917', '918', '919', '991', '992', '993', '994', '995', '996', '997', '998', '999'],
TIM: ['981', '982', '983', '984', '985', '986', '987', '988', '989'],
Oi: ['971', '972', '973', '974', '975', '976', '977', '978', '979'],
 }
 for (const [nome, prefixes] of Object.entries(operadorasBR)) {
if (prefixes.includes(prefix3)) return nome;
 }
 return 'Outra (BR)';
  }

  const match = num.match(/^\+(\d{1,3})/);
  if (match) return `Operadora DDI +${match[1]}`;

  return 'Operadora desconhecida 🌐';
}

const numero = marc_tds;
if (!numero) return reply(`🌸 Use: ${prefix + command} @usuário ou número completo`);

const [dadosContato] = await conn.onWhatsApp(numero).catch(() => []);
if (!dadosContato?.exists) return reply('❌ Este número não está registrado no WhatsApp');

const nomeContato = dadosContato?.notify || numero.split('@')[0];
const img = await conn.profilePictureUrl(numero, 'image').catch(() => null);
const bio = await conn.fetchStatus(numero).catch(() => null);
const business = await conn.getBusinessProfile(numero).catch(() => null);

const rawNumero = "+" + numero.split('@')[0];
const format = new PhoneNum(rawNumero);
const pais = regionNames.of(format.getRegionCode('international')) || 'Desconhecido';
const tipo = format.getType() || 'Desconhecido';
const numeroFormatado = format.getNumber('international') || rawNumero;
let operadora = detectOperator(rawNumero);
if (!operadora) operadora = 'Operadora desconhecida 🌐';

let texto = `📱 *Stalking WhatsApp Senpai~*\n\n`;
texto += `👤 *Nome:* ${nomeContato}\n`;
texto += `📞 *Número:* ${numeroFormatado}\n`;
texto += `💙 *País:* ${pais.toUpperCase()}\n`;
texto += `📡 *Tipo:* ${tipo}\n`;
texto += `📶 *Operadora:* ${operadora}\n`;
texto += `🔗 *Link WA:* https://wa.me/${numero.split('@')[0]}\n`;
texto += `🗣️ *Menção:* @${numero.split('@')[0]}\n`;

if (business) {
  texto += `\n🆔 *Business ID:* ${business.wid || '—'}\n`;
  texto += `🌐 *Website:* ${business.website || '—'}\n`;
  texto += `📧 *Email:* ${business.email || '—'}\n`;
  texto += `🏬 *Categoria:* ${business.category || '—'}\n`;
  texto += `📍 *Endereço:* ${business.address || '—'}\n`;
  texto += `🕰️ *Zona Horária:* ${business.business_hours?.timezone || '—'}\n`;
  texto += `📋 *Descrição:* ${business.description || '—'}`;
}

try {
  if (img) {
 conn.sendMessage(from, {
image: { url: img },
caption: texto,
mentions: [numero]
 }, { quoted: selo });
  } else {
 conn.sendMessage(from, {
text: texto,
mentions: [numero]
 }, { quoted: selo });
  }
} catch (e) {
  console.error('[ERRO WASTALK]', e);
  conn.sendMessage(from, {
 text: texto,
 mentions: [numero]
  }, { quoted: selo });
}

break;
}

case "mizukiaudio": {//⸻⸻⸻⸻『🎙️ MizukiBot TTS 𖤐』⸻⸻⸻⸻

  const models = {
 miku: { voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b", voice_name: "Hatsune Miku" },
 nahida: { voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nahida" },
 nami: { voice_id: "67ad95a0-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nami" },
 ana: { voice_id: "f2ec72cc-110c-11ef-811c-00163e0255ec", voice_name: "Ana" },
 optimus_prime: { voice_id: "67ae0f40-5d4b-11ee-a861-00163e2ac61b", voice_name: "Optimus Prime" },
 goku: { voice_id: "67aed50c-5d4b-11ee-a861-00163e2ac61b", voice_name: "Goku" },
 taylor_swift: { voice_id: "67ae4751-5d4b-11ee-a861-00163e2ac61b", voice_name: "Taylor Swift" },
 elon_musk: { voice_id: "67ada61f-5d4b-11ee-a861-00163e2ac61b", voice_name: "Elon Musk" },
 mickey_mouse: { voice_id: "67ae7d37-5d4b-11ee-a861-00163e2ac61b", voice_name: "Mickey Mouse" },
 kendrick_lamar: { voice_id: "67add638-5d4b-11ee-a861-00163e2ac61b", voice_name: "Kendrick Lamar" },
 angela_adkinsh: { voice_id: "d23f2adb-5d1b-11ee-a861-00163e2ac61b", voice_name: "Angela Adkinsh" },
 eminem: { voice_id: "c82964b9-d093-11ee-bfb7-e86f38d7ec1a", voice_name: "Eminem" }
  };

  function getRandomIp() {
 return Array.from({ length: 4 }).map(() => Math.floor(Math.random() * 256)).join('.');
  }

  const userAgents = [
 "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
 "Mozilla/5.0 (Macintosh; Intel Mac OS X)...",
 "Mozilla/5.0 (Linux; Android 8.0.0)..."
  ];

  const [msg, voiceKey] = q.split('|').map(v => v?.trim()?.toLowerCase());

  if (!msg || !voiceKey || !(voiceKey in models)) {
 let voiceList = Object.entries(models)
.map(([key, { voice_name }]) => `┃ 🔊 *${key}* ⇝ ${voice_name}`)
.join('\n');

 return conn.sendMessage(from, {
text:
`╭───「 𖤐 𝐕𝐨𝐳 𝐈𝐀 𖤐 」
│
├ 📥 *Uso incorreto!*
│
├ 💡 *Formato correto:*
│  ⤷ *mizukiaudio* Olá mundo | miku
│
├ 🎙️ *Modelos disponíveis:*
${voiceList}
╰───────────────⭑`
 }, { quoted: info });
  }

  const selected = models[voiceKey];

  const payload = {
 raw_text: msg,
 url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
 product_id: "200054",
 convert_data: [{ voice_id: selected.voice_id, speed: "1", volume: "50", text: msg, pos: 0 }]
  };

  const config = {
 headers: {
'Content-Type': 'application/json',
'Accept': '*/*',
'X-Forwarded-For': getRandomIp(),
'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
 }
  };

  try {
 const response = await axios.post(
'https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts',
payload,
config
 );

 const audioUrl = response.data.data.convert_result[0].oss_url;

 conn.sendMessage(from, {
audio: { url: audioUrl },
mimetype: 'audio/mp4',
ptt: false,
caption: `🎧 *${selected.voice_name}*\n🎙️ Modelo: ${voiceKey}`
 }, { quoted: info });

  } catch (e) {
 conn.sendMessage(from, {
text: `╭─❌ *Erro na Voz IA* ❌\n├ Voz: *${voiceKey}*\n╰ Motivo: ${e.message}`
 }, { quoted: info });
  }

  break;//Mizuki
}//Mizuki

case 'pinterest': {
if (!args[0]) return reply(`use ${prefix + command} (termo) para a pesquisa`);
await reagir(from, '✨')

let res
try {
let r = await fetch(`${API_KIMORI_URL}/api/search/pinterest?q=${q}&apikey=${APIKEY_KIMORI}`);
res = await r.json()
} catch (e) {
console.log('pinterest info erro:', e?.message)
return reply('erro, de uma olhada na api')
}

conn.sendMessage(from, {image: { url: res.data.imagem}, caption: `*✨️ Resultado para: ${q}*`}).caption
}
break;

case 'pinterest2': {
  if (!q) return conn.sendMessage(from, { text: '🔍 Digite um termo de pesquisa!' }, { quoted: info })

  try {
 await reagir(from, '🔎')
 const https = require('https')
 const qs = require('qs')
 const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = require('@whiskeysockets/baileys')

 const query = q
 const agent = new https.Agent({ keepAlive: true })

 const home = await axios.get('https://www.pinterest.com/', {
httpsAgent: agent,
headers: {
  'User-Agent': 'Mozilla/5.0',
  'Accept': 'text/html'
}
 })

 const raw = home.headers['set-cookie'] || []
 const cookies = raw.map(c => c.split(';')[0]).join('; ')
 const csrf = (raw.find(c => c.startsWith('csrftoken=')) || '').split('=')[1]?.split(';')[0] || ''

 const source_url = `/search/pins/?q=${encodeURIComponent(query)}`
 const data = {
options: { query, field_set_key: 'react_grid_pin', is_prefetch: false, page_size: 10 },
context: {}
 }
 const body = qs.stringify({ source_url, data: JSON.stringify(data) })

 const res = await axios.post(
'https://www.pinterest.com/resource/BaseSearchResource/get/',
body,
{
  httpsAgent: agent,
  headers: {
 'User-Agent': 'Mozilla/5.0',
 'Accept': 'application/json, text/javascript, */*',
 'Content-Type': 'application/x-www-form-urlencoded',
 'X-CSRFToken': csrf,
 'X-Requested-With': 'XMLHttpRequest',
 'Origin': 'https://www.pinterest.com',
 'Referer': `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
 'Cookie': cookies
  }
}
 )

 const results = res.data.resource_response.data.results
 if (!results || results.length === 0)
return conn.sendMessage(from, { text: '❌ Nenhuma imagem encontrada.' }, { quoted: info })

 const cards = []
 const slice = results.slice(0, 8)

 for (let pin of slice) {
const img = pin.images?.orig?.url || pin.images?.['236x']?.url
const link = `https://www.pinterest.com/pin/${pin.id}/`

if (!img) continue

const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer })

cards.push({
  header: proto.Message.InteractiveMessage.Header.create({
 ...media,
 title: `Imagem do Pinterest`,
 subtitle: query,
 hasMediaAttachment: true
  }),
  body: {
 text: `🔗 Acesse: ${link}`
  },
  footer: proto.Message.InteractiveMessage.Footer.fromObject({
 text: '📌 Pinterest • Resultado'
  }),
  nativeFlowMessage: { buttons: [] }
})
 }

 if (!cards.length) return reply('❌ Nenhuma imagem válida para exibir.')

 const msg = generateWAMessageFromContent(
from,
{
  viewOnceMessage: {
 message: {
interactiveMessage: {
  carouselMessage: { cards },
  messageVersion: 1
}
 }
  }
},
{}
 )

 await conn.relayMessage(from, msg.message, { messageId: msg.key.id })
 await reagir(from, '✅')

  } catch (e) {
 console.error(e)
 conn.sendMessage(from, { text: '⚠️ Erro ao buscar no Pinterest.' }, { quoted: info })
 await reagir(from, '❌')
  }

  break
}

case 'pin':
case 'pinterest3': {
  if (!q) return conn.sendMessage(from, { text: Res_ErroCmd }, { quoted: info })

  try {
 const https = require('https')
 const qs = require('qs')

 const agent = new https.Agent({ keepAlive: true })

 const home = await axios.get('https://www.pinterest.com/', {
httpsAgent: agent,
headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' }
 })

 const raw = home.headers['set-cookie'] || []
 const cookies = raw.map(c => c.split(';')[0]).join('; ')
 const csrf = (raw.find(c => c.startsWith('csrftoken=')) || '').split('=')[1]?.split(';')[0] || ''

 const source_url = `/search/pins/?q=${encodeURIComponent(q)}`
 const data = {
options: { query: q, field_set_key: 'react_grid_pin', is_prefetch: false, page_size: 10 },
context: {}
 }
 const body = qs.stringify({ source_url, data: JSON.stringify(data) })

 const res = await axios.post(
'https://www.pinterest.com/resource/BaseSearchResource/get/',
body,
{
  httpsAgent: agent,
  headers: {
 'User-Agent': 'Mozilla/5.0',
 'Accept': 'application/json, text/javascript, */*',
 'Content-Type': 'application/x-www-form-urlencoded',
 'X-CSRFToken': csrf,
 'X-Requested-With': 'XMLHttpRequest',
 'Origin': 'https://www.pinterest.com',
 'Referer': `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`,
 'Cookie': cookies
  }
}
 )

 const results = res.data.resource_response.data.results
 if (!results || results.length === 0)
return conn.sendMessage(from, { text: Res_ErroCmd }, { quoted: info })

 const pin = results.find(p => p.images?.orig?.url || p.images?.['236x']?.url)
 if (!pin) return conn.sendMessage(from, { text: Res_ErroCmd }, { quoted: info })

 const img = pin.images?.orig?.url || pin.images?.['236x']?.url

 await conn.sendMessage(from, { image: { url: img } }, { quoted: info })

  } catch (e) {
 console.error(e)
 conn.sendMessage(from, { text: Res_ErroCmd }, { quoted: info })
  }

  break
}

case 'pinterest_video': {
 const linkPin = args[0]
 if (!linkPin || !/pinterest|pin\.it/i.test(linkPin)) return reply('Me manda o link do Pinterest.')

 try {
  const resolved = await fetch(linkPin, { redirect: 'follow' })
  const finalUrl = resolved.url

  const pinId = finalUrl.match(/\/pin\/(\d+)/)?.[1]
  if (!pinId) throw new Error('ID não encontrado')

  const apiResp = await fetch(
`https://www.pinterest.com/resource/PinResource/get/?data={"options":{"id":"${pinId}","field_set_key":"unauth_react_main_pin"}}`,
{ headers: { 'User-Agent': 'Mozilla/5.0', 'X-Pinterest-PWS-Handler': 'www/[username].js' } }
  )

  const json = await apiResp.json()
  const data = json?.resource_response?.data

  const getUrl = (videoList) => {
if (!videoList) return null
return Object.values(videoList).sort((a, b) => (b.width || 0) - (a.width || 0))[0]?.url || null
  }

  let videoUrl = getUrl(data?.videos?.video_list)

  if (!videoUrl) {
const pages = data?.story_pin_data?.pages || []
for (const page of pages) {
 for (const block of (page?.blocks || [])) {
  videoUrl = getUrl(block?.video?.video_list)
  if (videoUrl) break
 }
 if (videoUrl) break
}
  }

  if (!videoUrl) throw new Error('sem video')

  const exec = require('util').promisify(require('child_process').exec)
  const fs = require('fs')
  const tmpFile = `/tmp/pin_${Date.now()}.mp4`

  await exec(`/usr/bin/ffmpeg -i "${videoUrl}" -c copy "${tmpFile}" -y`)

  const videoBuffer = fs.readFileSync(tmpFile)
  fs.unlinkSync(tmpFile)

  await conn.sendMessage(from, { video: videoBuffer, mimetype: 'video/mp4' }, { quoted: info })

 } catch (err) {
  reply('Erro: ' + err.message)
 }

 break
}

case 'pinvideo':
case 'pinvid': {
  if (!q) return reply(`*Aaaah! 🤭 Me fala o que você quer pesquisar no Pinterest!* 💖📌\n\n*Exemplo:* ${prefix+command} anime edit ✨`);

  await conn.sendMessage(from, { react: { text: '💕', key: info.key } });

  try {
 const res = await fetch(`${API_KIMORI_URL}/api/search/pinterest-videos?q=${encodeURIComponent(q)}&limit=10&apikey=${APIKEY_KIMORI}`);
 const json = await res.json();

 if (!json.success || !json.results?.length) return reply('*Oops! 😅 Não encontrei nenhum resultado para sua pesquisa!* 💕📌');

 const random = json.results[Math.floor(Math.random() * json.results.length)];

 if (!random.video) return reply('*Aaaah! 😵 Não achei nenhum vídeo disponível agora, tenta novamente!* 💖🎬');

 const caption = Msg_PinVideo
.replace('#legenda#', random.description || random.title || 'Sem descrição')
.replace('#fullname#', random.fullName || random.username)
.replace('#upload_by#', random.username)
.replace('#seguidores#', random.repins || '0')
.replace('#fonte#', random.pinUrl)

 const videoUrl = random.video;

 if (videoUrl.includes('.m3u8')) {
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const tmpFile = path.join('/tmp', `pinvid_${Date.now()}.mp4`);

await new Promise((resolve, reject) => {
  exec(
 `ffmpeg -y -i "${videoUrl}" -c copy -bsf:a aac_adtstoasc "${tmpFile}"`,
 { timeout: 60000 },
 (err) => err ? reject(err) : resolve()
  );
});

const videoBuffer = fs.readFileSync(tmpFile);
fs.unlinkSync(tmpFile);

await conn.sendMessage(from, {
  video: videoBuffer,
  caption,
  mimetype: 'video/mp4'
}, { quoted: info });

 } else {
await conn.sendMessage(from, {
  video: { url: videoUrl },
  caption,
  mimetype: 'video/mp4'
}, { quoted: info });
 }

  } catch (e) {
 console.error(e);
 reply(Res_ErroCmd);
  }
  break;
}

case 'pokedex':
case 'pokemon': {
  try {
    if (!q.trim()) return reply('*Digite o nome do Pokémon.*\n\n_Exemplo: ' + prefix + 'pokedex pikachu_')

    await reagir(from, '⏳️')

    const apiRes = await axios.get(
      `http://project.darkhostinger.com.br:2027/api/canvas/pokemon?name=${encodeURIComponent(q.trim())}`,
      { timeout: 15000 }
    )

    if (!apiRes.data?.status || !apiRes.data?.result?.url) {
      await reagir(from, '❌')
      return reply(`*Pokémon não encontrado:* ${q.trim()}`)
    }

    const { url, pokemon } = apiRes.data.result

    const nome = pokemon?.name
      ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
      : q.trim()

    const numero = pokemon?.id ? `#${pokemon.id.toString().padStart(3, '0')}` : ''

    const tipos = Array.isArray(pokemon?.types) && pokemon.types.length
      ? pokemon.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' / ')
      : 'Desconhecido'

    const caption =
`「 📘 」*POKÉDEX*

*🔹 Nome:* ${nome}
*🔹 Número:* ${numero}
*🔹 Tipo:* ${tipos}

_${NomeDoBot}_`

    await conn.sendMessage(from, {
      image: { url: url },
      caption: caption,
      contextInfo: {
        mentionedJid: [sender]
      }
    }, { quoted: selo })

    await reagir(from, '✅')
  } catch (e) {
    await reagir(from, '❌')
    console.log('Erro na pokedex:', e.message)
    reply('❌ Erro ao buscar o Pokémon: ' + e.message)
  }
  break
}

case 'criador':
const criadorText = `✨• 𝙲𝚁𝙸𝙰𝙳𝙾𝚁 •✨
-
  『 𝚂𝚘𝚋𝚛𝚎 𝚘 𝙲𝚛𝚒𝚊𝚍𝚘𝚛 』 ↴
-
 ➮ 𝙽𝚘𝚖𝚎: 🩵
 ↳ 『 Sattz 』
-
 ➮ 𝙲𝚘𝚗𝚝𝚊𝚝𝚘: 💖
 ↳ 『 wa.me/5527992870575 』
-
 ➮ 𝚂𝚘𝚋𝚛𝚎: 🪐
 ↳ 『 Adora café, apoia movimentos Anti
 racismo, LGBT, indígena e feminista! 🚻 』
-
 ➮ 𝙼𝚎𝚗𝚜𝚊𝚐𝚎𝚖: 💬
 ↳ 『 Sattz é totalmente feminista e apoia
 direitos iguais a todos 🥰 Uma coisa
 que ele não gosta é preconceito 😠
 Recado da MizukiBot-MD pra você 🙇‍♂️✨ 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`


  conn.sendMessage(from, {
 image: { url: 'https://i.ibb.co/PsLy5JfR/1db983af968c.jpg' },
 caption: criadorText,
 contextInfo: {
mentionedJid: [sender]
 }
  }, { quoted: selo });
  break;

case 'tabela':
conn.sendMessage(from, {text: tabela(prefix, NomeDoBot)}, {quoted: selo})
break

case 'suporte-dono':
case 'dono':
case 'infodono':
numerodn = setting.numerodono
mention(infodono(prefix, numerodn, NomeDoBot, sender))
break

case 'infobot': {
 await conn.sendMessage(from, { react: { text: `🌹`, key: info.key }});
 
 const blars = Msg_InfoBot
  .replace('#pushname#', pushname)
  .replace('#prefix#', prefix)
  .replace('#nomebot#', NomeDoBot)
  .replace('#nickdono#', NickDono)
  .replace('#numerodono#', numerodono_ofc)

 await conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: blars
 }, { quoted: info });
 break;
}

case 'infobemvindo':
case 'infobv': {
  const texto = infobemvindo(prefix)
  await conn.sendMessage(from, { text: texto }, { quoted: selo })
}
break

case 'info_listanegra':
case 'infolistanegra': {
  const texto = infolistanegra(prefix)
  await conn.sendMessage(from, { text: texto }, { quoted: selo })
}
break
break

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-/
  
 
//_-2 ÁREA DE COMANDOS SÓ PRA ADMINISTRADORES

case 'addautorm':
case 'addautoban':
case 'listanegra':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins && !SoDono) return reply(Res_SoDono)  
if(!mrc_ou_numero) return reply("Marque a mensagem do usuário com o comando ou utilize o comando com o número do usuário que deseja adicionar na lista negra..")
if(dataGp[0].listanegra.includes(mrc_ou_numero)) return reply('*Esse Número ja esta incluso*')
dataGp[0].listanegra.push(mrc_ou_numero)
setGp(dataGp)
reply(`*Número adicionado a lista de autoban*`)
break

case 'delremover':
case 'delautorm':  
case 'delautoban': 
case 'tirardalista':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins && !SoDono) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(!mrc_ou_numero) return reply("Marque a mensagem do usuário com o comando ou utilize o comando com o número do usuário que deseja tirar da lista negra..")
if(!dataGp[0].listanegra.includes(mrc_ou_numero)) return reply('*Esse Número não esta incluso*')
var i = dataGp[0].listanegra.indexOf(mrc_ou_numero)
dataGp[0].listanegra.splice(i, 1)
setGp(dataGp)
reply(`*Número foi removido da lista de autoban*`)
break

case 'listban':
case 'lista_ban':
case 'listban':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(dataGp[0].listanegra.length < 1) return reply('*Nenhum Número não foi adicionado*')
teks = '*Números que vou moer na porrada se voltar 😡:*\n'
for(i=0;i<dataGp[0].listanegra.length;++i) {
teks += `➤ *${dataGp[0].listanegra[i].split('@')[0]}*\n`
}
teks += '*Esses ai vou descer meu martelo do ban 🥵*'
reply(teks)
break

case 'band':
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
try {
if(!menc_os2 || menc_jid2[1]) return reply("Marque a mensagem do usuário ou marque o @ dele.., lembre de só marcar um usuário...")
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!JSON.stringify().includes(menc_os2)) return reply("Este usuário já foi removido do grupo.")
if(botNumber.includes(menc_os2)) return reply('Não sou besta de remover eu mesmo né 🙁, mas estou decepcionado com você')
if(numerodono.includes(menc_os2)) return reply('Não posso remover meu dono 🤧')
conn.sendMessage(from, {text: `@${menc_os2.split("@")[0]} Foi [ REMOVIDO(A) COM SUCESSO ] - (Por motivos justos.) -`, mentions: [menc_os2]})
conn.groupParticipantsUpdate(from, [menc_os2], "remove")  
} catch (e) {
console.log(e)
}
break

case 'rgfig':
case 'rgfigu':
case 'registrarfig': {
 if (!isGroupAdmins && !SoDono) return reply(Res_SoDono);
 if (!isBotGroupAdmins) return reply(Res_BotADM);
 const quotedSticker =
  selo.quoted?.message?.stickerMessage ||
  selo.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ||
  selo.quoted?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ||
  (selo.quoted?.type === 'sticker' ? selo.quoted.message?.stickerMessage : null);

 if (!quotedSticker) return reply("🌟 Responda a uma figurinha para registrar");

 const commandName = q.trim().toLowerCase();
 if (!commandName) return reply("❌ Especifique o comando!\n\n📌 Exemplo: rgfigu ban");

 const fileSha = quotedSticker.fileSha256;
 const novoHash = Buffer.isBuffer(fileSha)
  ? fileSha.toString('base64')
  : Buffer.from(fileSha).toString('base64');

 if (!banfigs[from]) banfigs[from] = {};
 banfigs[from][novoHash] = commandName;
 saveBanFig();

 reply(`✅ Figurinha registrada com sucesso!\n\n• Comando: ${commandName}\n• Hash: ${novoHash.substring(0, 20)}...`);
}
break;

 case 'delfigu':
 case 'removerfigu': {
  if (!isGroupAdmins && !SoDono) return reply(Res_SoDono);
  if (!isBotGroupAdmins) return reply(Res_BotADM);

  const quotedSticker = selo.quoted?.message?.stickerMessage
|| selo.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;

  if (!quotedSticker) return reply("🌟 Responda a figurinha que deseja remover");

  const fileSha = quotedSticker.fileSha256;
  const hashToRemove = Buffer.isBuffer(fileSha) 
? fileSha.toString('base64') 
: Buffer.from(fileSha).toString('base64');

  if (!banfigs[from] || !banfigs[from][hashToRemove]) {
return reply("❌ Esta figurinha não está registrada.");
  }

  const removedCommand = banfigs[from][hashToRemove];
  delete banfigs[from][hashToRemove];
  
  // Remove o grupo se não tiver mais figurinhas
  if (Object.keys(banfigs[from]).length === 0) {
delete banfigs[from];
  }
  
  saveBanFig();

  reply(`• ✅ Figurinha removida!\n• 🕊️ Comando removido: ${removedCommand}`);
 }
 break;

 case 'listfigus':
 case 'listarfigurinas': {
  if (!isGroupAdmins && !SoDono) return reply(Res_SoDono);

  if (!banfigs[from] || Object.keys(banfigs[from]).length === 0) {
return reply("❌ Este grupo não tem figurinhas registradas.");
  }

  let lista = "📋 *Figurinhas registradas*\n\n";
  let count = 1;

  for (let hash in banfigs[from]) {
lista += `${count}. Comando: *${banfigs[from][hash]}*\n`;
lista += `• ${hash.substring(0, 25)}...\n\n`;
count++;
  }

  reply(lista);
 }
 break;
 
case 'brat': {
 try {
  if (!q.trim()) return reply(`Exemplo: ${prefix + command} (texto)`)
const packnameStk = `${pushname}`;
  const authorSticker = `${NomeDoBot}`;

  const apiUrl = `${API_KIMORI_URL}/api/brat?text=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`;
  const buffer = await getBuffer(apiUrl);
  if (!buffer) return reply(`Erro ao gerar figurinha`)
let encmedia;
  encmedia = await sendImageAsSticker2(conn, from, buffer, selo, {
packname: `🌿 brat | ${pushname}`,
 author: `🌙 ${NomeDoBot}`
  });
await DLT_FL(encmedia);
  } catch (e) {
console.log('brat info erro:', e?.message); 
 }
 break;
}

case 'ban': 
case 'banir': 
case 'kick': 
case 'avadakedavra':
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
try {
  // Verifica se há menções
  if(!menc_os2 && !q.includes('@')) return reply("Marque a mensagem do usuário ou marque o @ dele(s)...")
  
  // Pega todas as menções da mensagem
  let mentionedUsers = [];
  
  if(menc_jid2 && menc_jid2.length > 0) {
 // Se há múltiplas menções via menc_jid2
 mentionedUsers = menc_jid2;
  } else if(menc_os2) {
 // Se há apenas uma menção via menc_os2
 mentionedUsers = [menc_os2];
  }
  
  if(mentionedUsers.length === 0) return reply("Nenhum usuário foi mencionado corretamente.")
  
  let removidos = [];
  let falhas = [];
  
  // Loop para cada usuário mencionado
  for(let usuario of mentionedUsers) {
 try {
// Verificações de segurança
if(!JSON.stringify(groupMembers).includes(usuario)) {
  falhas.push(`@${usuario.split("@")[0]} - Não está no grupo`);
  continue;
}

if(botNumber.includes(usuario)) {
  falhas.push(`@${usuario.split("@")[0]} - Não posso me remover`);
  continue;
}

if(JSON.stringify(numerodono).indexOf(usuario) >= 0) {
  falhas.push(`@${usuario.split("@")[0]} - É meu dono`);
  continue;
}

// Remove o usuário
await conn.groupParticipantsUpdate(from, [usuario], "remove")
removidos.push(usuario);

 } catch(erro) {
falhas.push(`@${usuario.split("@")[0]} - Erro ao remover`);
 }
  }
  
  // Monta a mensagem de resposta
  let mensagem = '';
  
  if(removidos.length > 0) {
 mensagem += `🙇 *REMOVIDOS COM SUCESSO:*\n`;
 removidos.forEach(user => {
mensagem += `• @${user.split("@")[0]}\n`;
 });
  }
  
  if(falhas.length > 0) {
 mensagem += `\n❌ *FALHAS:*\n${falhas.join('\n')}`;
  }
  
  conn.sendMessage(from, {text: mensagem, mentions: removidos})
  
} catch (e) {
  console.log(e)
  reply("Erro ao executar o comando de ban.")
}
break

case 'ban2': case 'banir2': case 'kick2': case 'avadakedavra2':
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
try {
if(!menc_os2 || menc_jid2[1]) return reply("Marque a mensagem do usuário ou marque o @ dele.., lembre de só marcar um usuário...")
if(!JSON.stringify(groupMembers).includes(menc_os2)) return reply("Este usuário já foi removido do grupo ou saiu.")
if(botNumber.includes(menc_os2)) return reply('Não sou besta de remover eu mesmo né 🙁, mas estou decepcionado com você')
if(JSON.stringify(numerodono).indexOf(menc_os2) >= 0) return reply('Não posso remover meu dono 🤧')
conn.sendMessage(from, {text: `@${menc_os2.split("@")[0]} Foi [ REMOVIDO(A) COM SUCESSO ] - (Por motivos justos.) -`, mentions: [menc_os2]})
conn.groupParticipantsUpdate(from, [menc_os2], "remove")  
} catch (e) {
console.log(e)
}
break

case 'add':
case 'unkick': {
if (!isGroup) return reply(Res_SoGrupo);
if (!SoDono && !isGroupAdmins) {
return reply(Res_SoAdm); }
if (!isBotGroupAdmins) {
return reply(Res_BotADM); }
let user = q ? q.replace(/\D/g, '') : '';
if (!user) return reply(Res_ErroCmd);
let jid = user + '@s.whatsapp.net';
try {
let check = await conn.onWhatsApp(user);
if (!check || !check[0]) return reply(Res_ErroCmd);
let response = await conn.groupParticipantsUpdate(from, [jid], 'add');
let status = response[0]?.status;
if (status == "200") {
await reply(`Aaaah! 🤧 Prontinho, fiz tudinho o que você pediu com sucesso! 💖🙇‍♀️

@${user}`, [jid]);
} else {
await reply(Res_ErroCmd); }
} catch (e) {
console.log('ERRO ADD:', e);
reply(Res_ErroCmd); }}
break;

case 'promover': {
  if(!isGroupAdmins) return reply(Res_SoAdm)
  if(!isBotGroupAdmins) return reply(Res_BotADM)

  const jidsUniqP = [...new Set(menc_jid2)]
  const alvoP = jidsUniqP[0] || menc_prt
  if(!alvoP || jidsUniqP.length > 1) return reply("*Aaaah! 🤭 Marque a mensagem ou o @ de apenas um usuário para eu promover!* 💖🙌")

  const membroExisteP = groupMembers.some(m => m.id === alvoP || m.phoneNumber === alvoP)
  if(!membroExisteP) return reply("*Oops! 😅 Esse usuário não está mais no grupo, então não consigo promover ele!* 💕✨")

  const membroP = groupMembers.find(m => m.id === alvoP || m.phoneNumber === alvoP)
  const lidP = membroP?.id || alvoP
  const numExibidoP = (membroP?.phoneNumber || lidP).split("@")[0]

  conn.sendMessage(from, {
    text: Msg_Promovido
      .replace('#promovido#', numExibidoP)
      .replace('#adm#', sender.split("@")[0]),
    mentions: [membroP?.phoneNumber || lidP, sender]
  })
  conn.groupParticipantsUpdate(from, [lidP], "promote")
  break
}

case 'rebaixar': {
  if(!isGroupAdmins) return reply(Res_SoAdm)
  if(!isBotGroupAdmins) return reply(Res_BotADM)

  const jidsUniqR = [...new Set(menc_jid2)]
  const alvoR = jidsUniqR[0] || menc_prt
  if(!alvoR || jidsUniqR.length > 1) return reply("*Aaaah! 🤭 Marque a mensagem ou o @ de apenas um usuário para eu rebaixar!* 💖🙌")

  const membroExisteR = groupMembers.some(m => m.id === alvoR || m.phoneNumber === alvoR)
  if(!membroExisteR) return reply("*Oops! 😅 Esse usuário não está mais no grupo, então não consigo rebaixar ele!* 💕✨")

  const membroR = groupMembers.find(m => m.id === alvoR || m.phoneNumber === alvoR)
  const lidR = membroR?.id || alvoR
  const numExibidoR = (membroR?.phoneNumber || lidR).split("@")[0]

  conn.sendMessage(from, {
    text: Msg_Rebaixado
      .replace('#rebaixado#', numExibidoR)
      .replace('#adm#', sender.split("@")[0]),
    mentions: [membroR?.phoneNumber || lidR, sender]
  })
  conn.groupParticipantsUpdate(from, [lidR], "demote")
  break
}

case 'sorteionumero':
case 'sorteionumeros':  
if(!isGroupAdmins) return reply(Res_SoAdm)
try{
if(!isGroup) return reply(Res_SoGrupo)
if(!q) return reply(`Coloque algo, após o comando sorteio, por exemplo, ${prefix}sorteionumero de 100 R$`)
var numerossrt = sortear[Math.floor(Math.random() * sortear.length)] 
d = []
teks =  `🎉Parabéns ao número do sortudo, por ganhar o sorteio ${q}:\n\n`
for(i = 0; i < 1; i++) {
teks += `🔥፝⃟  ➣ ${numerossrt}\n`
d.push(numerossrt)
}
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break

case 'sorteio':
if(!isGroupAdmins) return reply(Res_SoAdm)
try{
if(!isGroup) return reply(Res_SoGrupo)
if(!q) return reply(`Coloque algo, após o comando sorteio, por exemplo, ${prefix}sorteio de 100 R$`)
d = []
teks = `🎉Parabéns, por ganhar o sorteio ${q}:\n\n`
for(i = 0; i < 1; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `🔥፝⃟  ➣ @${groupMembers[r].id.split('@')[0]}\n`
d.push(groupMembers[r].id)
}
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break

case 'adv':
case 'advertir':
case 'adverter': 

if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)

if(menc_os2 == botNumber) return reply("*Aaaah! 🤭 Não posso advertir a mim mesmo!* 💖✨")

if(menc_os2 == nmrdn) return reply("*Oops! 😅 Não pode advertir o dono do bot!* 💕👑")

if(groupAdmins.includes(menc_os2)) return reply("*Eitaa! 😆 Não é possível advertir administradores!* 💞👑")

if(!JSON.stringify(groupMembers).includes(menc_os2)) return reply("*Oops! 😅 Esse usuário não está mais no grupo!* 💕✨")

ADVT.push(menc_os2); 
setGp(dataGp)

// ✅ Captura antes do timeout
const alvoadv = menc_os2
const fromadv = from

setTimeout(async() => {

var dfqn = ADVT.filter(x => x == alvoadv).length

var dfntxt = `*Aaaah! 🤭 O usuário @${alvoadv.split("@")[0]} recebeu uma advertência (${dfqn}/3)!* 💖⚠️

*😅 Se chegar em 3 advertências, será removido do grupo!*`

if(!dfntxt.includes("3/3")) {

if(!JSON.stringify(ADVT).includes(sender)) {

await sleep(1500)
mentions(dfntxt, [alvoadv])

} else if(dfqn == 2) {

await sleep(1500)
mentions(dfntxt, [alvoadv])

}

} else {

conn.sendMessage(fromadv, {
text: `*Oops! 😵 O usuário @${alvoadv.split("@")[0]} atingiu 3 advertências e será removido do grupo!* 💔⚡`,
mentions: [alvoadv]
})

await sleep(1500)

conn.groupParticipantsUpdate(fromadv, [alvoadv], "remove")

var i = ADVT.indexOf(alvoadv)
ADVT.splice(i, 3)

setGp(dataGp)

}

}, 3000)

break

case 'ver_adv':
case 'veradv':
  if (!isGroup) return reply(Res_SoGrupo)
  if (!isGroupAdmins) return reply(Res_SoAdm)
  if (!menc_os2) return reply("*Mencione um usuário!* 💕")

  var totalAdv = ADVT.filter(x => x == menc_os2).length

  mentions(
 `• *Usuario*: @${menc_os2.split("@")[0]}\n• *Total de advertencias*: ${totalAdv}/3`,
 [menc_os2]
  )
break

case 'rm_adv':
case 'rmadv':
case 'remover_adv':
  if (!isGroup) return reply(Res_SoGrupo)
  if (!isGroupAdmins) return reply(Res_SoAdm)
  if (!menc_os2) return reply("*Mencione um usuário!* 💕")

  var qtdAntes = ADVT.filter(x => x == menc_os2).length
  if (qtdAntes === 0) return reply("*Esse usuário não possui advertências!* 💖")

  var idx = ADVT.indexOf(menc_os2)
  ADVT.splice(idx, 1)
  setGp(dataGp)

  var qtdDepois = ADVT.filter(x => x == menc_os2).length

  mentions(
 `✨ Foram subtraídas -1 advertência de ( @${menc_os2.split("@")[0]} )\n\n• *Restantes*: ${qtdDepois}/3`,
 [menc_os2]
  )
break

case 'removeall_adv':
case 'removealladv':
  if (!isGroup) return reply(Res_SoGrupo)
  if (!isGroupAdmins) return reply(Res_SoAdm)
  if (!menc_os2) return reply("*Mencione um usuário!* 💕")

  if (!ADVT.includes(menc_os2)) return reply("*Esse usuário não possui advertências!* 💖")

  while (ADVT.includes(menc_os2)) {
 var i = ADVT.indexOf(menc_os2)
 ADVT.splice(i, 1)
  }
  setGp(dataGp)

  mentions(
 `*Advertências limpas com sucesso. Agora esta pessoa não estará mais listado em minha lista de advertências! 💖*`,
 [menc_os2]
  )
break

case 'grupo':
  if(!isGroup) return reply(Res_SoGrupo)
  if(!isGroupAdmins) return reply(Res_SoAdm)
  if(!isBotGroupAdmins) return reply(Res_BotADM)

  if(args[0] === 'a') {
 reply(Msg_GrupoAberto.replace('#data#', `${dataSattz} ${horaSattz}`))
 conn.groupSettingUpdate(from, 'not_announcement')
  } else if(args[0] === 'f') {
 reply(Msg_GrupoFechado.replace('#data#', `${dataSattz} ${horaSattz}`))
 conn.groupSettingUpdate(from, 'announcement')
  }
  break

case 'grupoinfo':
case 'infogrupo':
case 'infogp':  
case 'gpinfo':  
case 'regras': {
  if (!isGroup) return reply(Res_SoGrupo)
  if (!isGroupAdmins) return reply(Res_SoAdm)

  await reagir(from, '⏳️')

  const iconPadrao = `https://telegra.ph/file/6ca032835ed7a16748b6f.jpg`

  // ---- foto do grupo (com timeout curto) ----
  let ppUrl = iconPadrao
  try {
    ppUrl = await Promise.race([
      conn.profilePictureUrl(from, 'image'),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error('timeout foto grupo')), 3000)
      )
    ])
  } catch (e) {
    console.log('foto do grupo FALHOU:', e.message)
  }

  // ---- data de criação do grupo ----
  let criado = 'Desconhecido'
  try {
    const meta = await conn.groupMetadata(from)
    if (meta?.creation) {
      criado = new Date(meta.creation * 1000).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      })
    }
  } catch (e) {}

  // ---- card canva grupo ----
  let imageUrl = ppUrl
  try {
    const axios = require('axios')

    const params = new URLSearchParams({
      name: groupName || 'Grupo',
      icon: ppUrl,
      members: (groupMembers.length || 0).toString(),
      admins: (groupAdmins.length || 0).toString(),
      desc: groupDesc || 'Sem descrição.',
      criado: criado
    })

    const apiRes = await axios.get(
      `http://project.darkhostinger.com.br:2027/api/canvas/grupo?${params.toString()}`,
      { timeout: 8000 }
    )

    if (apiRes.data?.status && apiRes.data?.result?.url) {
      imageUrl = apiRes.data.result.url
    }
  } catch (e) {
    console.log('Erro ao gerar card de grupo:', e.message)
  }
  // --------------------------

  await conn.sendMessage(from, {
    image: { url: imageUrl },
    caption: `👥 *Nome:* ${groupName}
🌸 *Membros:* ${groupMembers.length}
👑 *Administradores:* ${groupAdmins.length}
📅 *Criado em:* ${criado}

📝 *Descrição:*
${groupDesc}`
  }, { quoted: selo })

  await reagir(from, '✅')
}
break

case 'marcar':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)

async function marcac() {

bla = []

blad = `😆 *Eitaa galerinha, vocês foram marcados pelo adm!* 💖✨

👑 *Bot:* ${NomeDoBot}
🌸 *Grupo:* ${groupName}

${!q ? "" : `💌 *Mensagem:* ${q}\n\n`}`

for(let i of somembros) {
blad += `💞 @${i.split("@")[0]}\n`
bla.push(i)
}

blam = JSON.stringify(somembros)

if(blam.length == 2) return reply(`*Oops! 😅 Não encontrei membros comuns no grupo ${groupName}!* 💕`)

mentions(blad, bla, true)  
}

marcac().catch(e => {
console.log(e)
})
break

case 'totag':
case 'cita':
case 'hidetag':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
var DFC = "";
var rsm = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
var pink = isQuotedImage ? rsm?.imageMessage: info.message?.imageMessage
var blue = isQuotedVideo ? rsm?.videoMessage: info.message?.videoMessage
var purple = isQuotedDocument ? rsm?.documentMessage: info.message?.documentMessage
var yellow = isQuotedDocW ? rsm?.documentWithCaptionMessage?.message?.documentMessage: info.message?.documentWithCaptionMessage?.message?.documentMessage
var aud_d = isQuotedAudio ? rsm.audioMessage : ""
var figu_d = isQuotedSticker ? rsm.stickerMessage : ""
var red = isQuotedMsg && !aud_d && !figu_d && !pink && !blue&& !purple && !yellow? rsm.conversation: info.message?.conversation
var green = rsm?.extendedTextMessage?.text || info?.message?.extendedTextMessage?.text
var MRC_TD = groupMembers.map(i => i.id)
if(pink && !aud_d && !purple) {
var DFC = pink
pink.caption = q.length > 1 ? q : pink.caption.replace(new RegExp(prefix+command, "gi"), "")
pink.image = {url: pink.url}
pink.mentions = MRC_TD
} else if(blue && !aud_d && !purple) {
var DFC = blue  
blue.caption = q.length > 1 ? q.trim() : blue.caption.replace(new RegExp(prefix+command, "gi"), "").trim()
blue.video = {url: blue.url}
blue.mentions = MRC_TD
} else if(red && !aud_d && !purple) {
black = {}
black.text = red.replace(new RegExp(prefix+command, "gi"), "").trim()
black.mentions = MRC_TD
var DFC = black
} else if(!aud_d && !figu_d && green && !purple && !purple) {
brown = {}
brown.text = green.replace(new RegExp(prefix+command, "gi"), "").trim()
brown.mentions = MRC_TD
var DFC = brown
} else if(purple) {
var DFC = purple
purple.document = {url: purple.url}
purple.mentions = MRC_TD
} else if(yellow && !aud_d) {
var DFC = yellow 
yellow.caption = q.length > 1 ? q.trim() : yellow.caption.replace(new RegExp(prefix+command, "gi"), "").trim()
yellow.document = {url: yellow.url}
yellow.mentions = MRC_TD
} else if(figu_d && !aud_d) {
var DFC = figu_d
figu_d.sticker = {url: figu_d.url}
figu_d.mentions = MRC_TD
} else if(aud_d) {
var DFC = aud_d
aud_d.audio = {url: aud_d.url}
aud_d.mentions = MRC_TD
aud_d.ptt = true
}
conn.sendMessage(from, DFC).catch(e => {
console.log(e)
})
break

case 'nomegp':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)

blat = args.join(" ")

conn.groupUpdateSubject(from, `${blat}`)

conn.sendMessage(from, {
text: '*Yaaay! 😆 O nome do grupo foi alterado com sucesso!* 💖✨'
}, {quoted: selo})

break

case 'descgp':
case 'descriçãogp':  

if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_SoAdm)

blabla = args.join(" ")

conn.groupUpdateDescription(from, `${blabla}`)

conn.sendMessage(from, {
text: '*Prontinho! 😊 A descrição do grupo foi atualizada com sucesso!* 💞📝'
}, {quoted: selo})

break

case 'setfotogp':
case 'fotogp':  

if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)

if(!isQuotedImage) return reply(`*Aaaah! 🤭 Use:* ${prefix + command} *<Marque uma foto>* 💖📸`)

ftgp = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage

rane = getRandom('.'+await getExtension(ftgp.mimetype))

buffimg = await getFileBuffer(ftgp, 'image')

fs.writeFileSync(rane, buffimg)

medipp = rane 

conn.updateProfilePicture(from, {url: medipp})

reply(`*Eitaa! 😆 A foto do grupo foi alterada com sucesso!* 💖📸`) 

break

case "linkgp":
case "linkgroup":
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)

  const linkgc = await conn.groupInviteCode(from);
  reply(`*Aqui está o link do grupo ✨️🙇‍♂️* ➮ 〘 https://chat.whatsapp.com/${linkgc} 〙`);
  break;

case 'recrutar':
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
rcrt = q.replace(new RegExp("[()+-/ +/]", "gi"), "") + SNET
linkgc = await conn.groupInviteCode(from)
conn.sendMessage(rcrt, {image:{url: logoslink.logo}, caption: "Clique no símbolo a cima da imagem para entrar no grupo...", contextInfo: {
externalAdReply: {
title:"- Clique aqui para participar do grupo",
body: "",
reviewType: "PHOTO", 
thumbnailUrl: logoslink.logo, 
sourceUrl: `https://chat.whatsapp.com/`+linkgc, 
mediaType: 2
}}})
reply("Convite de recrutamento do usuário, foi enviado para o privado dele com sucesso...")
break

case 'anotar':
case 'tirar_nota':
case 'rmnota':
if(!isGroup) return reply(Res_SoGrupo)  
if(!isGroupAdmins) return reply(Res_SoAdm)
if(command == "anotar") {
var [q5, q10] = q.trim().split("|")
if(!q5 || !q10 || !q.trim().includes("|")) return reply(`Digite o título da anotação e o texto que deseja anotar..\nExemplo: ${prefix}anotar cachorro|Cachorros são bom pra comer na Venezuela...`)
if(JSON.stringify(anotar).includes(from)) {  
var i2 = anotar.map(i => i.grupo).indexOf(from)  
if(JSON.stringify(anotar[i2].puxar).includes(q5)) {
var i3 = anotar[i2].puxar.map(i => i.nota).indexOf(q5)  
if(anotar[i2].puxar[i3].nota == q5) return reply(`Esta anotação já está inclusa, utilize outro título.. Ou você pode tirar com\n${prefix}tirar_nota ${q5}`)
}
}
if(!JSON.stringify(anotar).includes(from)) {
anotar.push({grupo: from, puxar: [{nota: q5, anotacao: q10}]})
fs.writeFileSync("./arquivos/armor/json/anotar.json", JSON.stringify(anotar))
reply("Anotação registrada com sucesso...")
} else {
anotar[i2].puxar.push({nota: q5, anotacao: q10})
fs.writeFileSync("./arquivos/armor/json/anotar.json", JSON.stringify(anotar))
reply("Anotação registrada com sucesso...")  
}
} else {
if(!q) return reply("Digite qual anotação deseja tirar pelo título..")
if(JSON.stringify(anotar).includes(from)) {  
var i2 = anotar.map(i => i.grupo).indexOf(from)  
if(JSON.stringify(anotar[i2].puxar).includes(q)) {
var i3 = anotar[i2].puxar.map(i => i.nota).indexOf(q)  
}
}
if(0 > anotar[i2].puxar.map(i => i.nota).indexOf(q)) return reply("Esta nota não está inclusa, verifique com atenção...")
anotar[i2].puxar.splice(i3, 1)
fs.writeFileSync("./arquivos/armor/json/anotar.json", JSON.stringify(anotar))
reply(`Anotação ${q} tirada com sucesso...`)
}
break

case 'rm_aviso':
case 'rm_avisos':  
if(!isGroup) return reply(Res_SoGrupo)  
if(!isGroupAdmins) return reply(Res_SoAdm)
for ( i of black_) {var RDFA = i}
if(!JSON.stringify(RDFA.PUXAR).includes(from)) return reply(`Nenhum aviso foi registrado nesse grupo, utilize o comando ${prefix}rg_aviso`)
RDFA.PUXAR.splice(RDFA.PUXAR.indexOf(from))
fs.writeFileSync("./arquivos/grupos/AVISOS.json", JSON.stringify(black_, null, 2))
reply("Avisos referente a esse grupo, foi tirado de todos os horários registrados..")
break

case 'rg_aviso':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)  
var [hr, ms] = q.trim().split("|")
if(!q.trim().includes(":") && !q.trim().includes("|")) return reply(`Exemplo: ${prefix+command} 12:00|Boa tarde a todos, prestem atenção nas regras do grupo\n\neste exemplo.. Ele vai enviar todos os dias as 12:00 da tarde a mensagem que você registrou, já se você quer trocar o horário.. Só refazer o comando\nSe você quer apagar o aviso do grupo, apenas coloque ${prefix}rm_aviso`)
var i5 = black_?.map(i => i?.hora)?.indexOf(hr)
if(JSON.stringify(black_[i5]?.PUXAR)?.includes(from)) {
black_[i5].PUXAR.splice(black_[i5].PUXAR.map(i => i.idgp).indexOf(from))
fs.writeFileSync("./arquivos/grupos/AVISOS.json", JSON.stringify(black_, null, 2))
setTimeout(() => {
reply(`O Registro anterior foi apagado e recriou um novo, se deseja continuar\n - Lembre-se que há avisos programados em outros horários, se quiser limpar todos, digite: ${prefix}rm_avisos`)
}, 500)
} else if(!JSON.stringify(black_).includes(hr)) {
black_.push({hora: hr, PUXAR: [{idgp: from, msg: ms, avisou: false}]})
fs.writeFileSync("./arquivos/grupos/AVISOS.json", JSON.stringify(black_, null, 2))
reply("Aviso Criado com sucesso..")
} else if(!JSON.stringify(black_[i5].PUXAR).includes(from)) {
black_[i5].PUXAR.push({idgp: from, msg: ms, avisou: false})
fs.writeFileSync("./arquivos/grupos/AVISOS.json", JSON.stringify(black_, null, 2))
reply("Aviso Criado com sucesso..")
}
break

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-/

case 'aluguel':
if(!SoDono) return reply(Res_SoDono);
if(!isGroup) return reply(Res_SoGrupo)
dataGp[0]['rg_aluguel'] = !dataGp[0]['rg_aluguel'];
setGp(dataGp)
reply(dataGp[0]['rg_aluguel'] ? `Ativado com sucesso, agora use o comando: ${prefix}rg_aluguel\nOu então o comando ${prefix}infoaluguel pra saber como usar o resto.`: "Desativado com sucesso.")
break;

case 'aluguel_global':
if(!SoDono) return reply(Res_SoDono);
nescessario.rg_aluguelGB = !nescessario.rg_aluguelGB
setNes(nescessario)
reply(nescessario?.rg_aluguelGB ? `Ativado com sucesso, agora use o comando: ${prefix}rg_aluguel\nOu então o comando ${prefix}infoaluguel pra saber como usar o resto.`: "Desativado com sucesso..")
break;

case 'renovar_aluguel':
if(!SoDono) return reply(Res_SoDono);
var ID_G = rg_aluguel.findIndex(i => i.id_gp == from)
if(rg_aluguel.some(i => i.id_gp != from)) return reply(`Este grupo não está na lista de aluguel, use: ${prefix}listaaluguel pra ver os grupos que estão registrado.`)
if(q.trim().length > 1 && (q.trim().includes("d") || q.trim().includes("h")) && q.trim().includes("/")) {
var TMP_A = Math.floor(Date.now() / 1000) 
var TEMPO = (q.trim().includes("h") ? Math.floor(q.trim().split("/")[1].split("h")[0]) * 60 * 60 : Math.floor(q.trim().split("/")[1].split("d")[0]) * 60 * 60 * 24);
rg_aluguel[ID_G].vencimento = TMP_A+TEMPO
fs.writeFileSync("./arquivos/armor/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
reply(`Este grupo foi renovado, e vai vencer em: ${kyun(Math.floor(rg_aluguel[ID_G].vencimento - TMP_A))}, caso queira tirar este grupo da lista de aluguel antes do tempo, use: ${prefix}rm_aluguel ${from}`)
} else {
reply(`Exemplo: ${prefix+command} /24h ou Exemplo: ${prefix+command} /30d\n\nCom d é dias, e h é horas, então boa sorte..`)
}
break;

case 'rg_aluguel':
case 'rgaluguel':
if (!SoDono) return reply(Res_SoDono);
if(!nescessario?.rg_aluguelGB && !dataGp[0]["rg_aluguel"]) return reply(`Você não ativou o sistema de aluguel para esse grupo, nem global.. Leia como utilizar em ${prefix}infoaluguel\n\nBoa sorte.`)
if (q.trim().length > 1 && (q.trim().includes("d") || q.trim().includes("h")) && q.trim().includes("/")) {
var TMP_A = Math.floor(Date.now() / 1000) 
var TEMPO = (q.trim().includes("h") ? Math.floor(q.trim().split("/")[1].split("h")[0]) * 60 * 60 : Math.floor(q.trim().split("/")[1].split("d")[0]) * 60 * 60 * 24);
var ID_G = rg_aluguel.findIndex(i => i.id_gp == from);
if (ID_G === -1) {
rg_aluguel.push({ id_gp: from, nome_: groupName || pushname, vencimento: TMP_A+TEMPO });
fs.writeFileSync("./arquivos/armor/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
ID_G = rg_aluguel.findIndex(i => i.id_gp == from); // Atualiza o valor de ID_G
reply(`Este grupo/usuario foi registrado com sucesso, e vai vencer em: ${kyun(Math.floor(rg_aluguel[ID_G].vencimento) - TMP_A)}, caso queira tirar este grupo da lista de aluguel antes do tempo, use: ${prefix}rm_aluguel ${from}\n\nSe deseja ver a lista de Usuarios/Grupos, use: ${prefix}listaaluguel`);
} else {
reply(`Este grupo já está registrado, e vai vencer em: ${kyun(Math.floor(rg_aluguel[ID_G].vencimento) - TMP_A)}, caso queira tirar este grupo da lista de aluguel antes do tempo, use: ${prefix}rm_aluguel ${from}`);
}
} else {
reply(`Exemplo: ${prefix + command} /24h ou Exemplo: ${prefix + command} /30d\n\nCom d é dias, e h é horas, então boa sorte..`);
}
break;


case 'rm_aluguel': case 'rmaluguel':
if(!SoDono) return reply(Res_SoDono);
if(q.trim().length < 4) return reply(`Use o comando ${prefix+command} ${from}\nAssim removerá este grupo da listaaluguel`)
var ID_R = rg_aluguel.findIndex(i => i.id_gp == q.trim())
if(!rg_aluguel.map(i => i.id_gp).includes(q.trim())) return reply(`Este grupo não está na lista de aluguel, use: ${prefix}listaaluguel pra ver os grupos que estão registrado.`)
rg_aluguel.splice(ID_R, 1)
fs.writeFileSync("./arquivos/armor/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
reply(`Grupo/Usuario tirado com sucesso da lista de aluguel, não irei mais funcionar aqui.`)
break;

case 'listaaluguel': case 'lista_aluguel':
if(!SoDono) return reply(Res_SoDono);
if(rg_aluguel?.length === 0) return reply("Não contém nenhum usuario/grupo na lista de aluguel...")
var TMP = Math.floor(Date.now() / 1000)
ABC = "Lista de Usuarios/Grupos:\n\n"
for (var i of rg_aluguel) {
ABC += `ID: ${i?.id_gp}\nNome: ${i.nome_}\nVencimento: ${kyun(Math.floor(i.vencimento) - TMP)}\n-----------------------------------------\n`
}
reply(ABC)
break;

case 'veraluguel':
case 'tempodoaluguel': {
  const registroAluguel = rg_aluguel.find(i => i.id_gp === from)

  if (!registroAluguel) {
 reply(`*❌ Nenhum aluguel registrado para este grupo/usuário!* 💖📄

*Para registrar ou renovar, fale com meu criador:* 🤭✨
https://wa.me/${numerodono_ofc}`)
 break
  }

  const agora = Math.floor(Date.now() / 1000)
  const vencimento = Math.floor(registroAluguel?.vencimento)
  const restante = vencimento - agora

  const dataVenc = new Date(vencimento * 1000).toLocaleString('pt-BR', {
 timeZone: 'America/Sao_Paulo',
 day: '2-digit', month: '2-digit', year: 'numeric',
 hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  let statusTexto
  let tempoRestanteTexto = ''

  if (restante <= 0) {
 statusTexto = '🔴 Expirado'
  } else {
 const dias  = Math.floor(restante / 86400)
 const horas = Math.floor((restante % 86400) / 3600)
 const minutos  = Math.floor((restante % 3600) / 60)
 const segundos = restante % 60

 let urgencia = '🟢 Ativo'
 if (dias < 1)urgencia = '🔴 Expirando hoje!'
 else if (dias < 3) urgencia = '🟡 Expirando em breve'
 else if (dias < 7) urgencia = '🟠 Atenção'

 statusTexto = urgencia
 tempoRestanteTexto = `\n⏳ *Tempo restante*: ${dias}d ${horas}h ${minutos}m ${segundos}s`
  }

  reply(`⚔️ [ *Status de Aluguel* ] ⌛

⛺ *Nome*: ${groupName || pushname}
⚖️ *Status*: ${statusTexto}
📆 *Alugado em*: ${dataVenc}${tempoRestanteTexto}`)
}
break;

case 'listlinks': case 'links':
try {
if(!SoDono) return reply(Res_SoDono);
async function RM_L(A) {
var response = await axios.get(A);
const html = response.data;
if(html.includes("https://static.whatsapp.net/rsrc.php/v3/yB/r/_0dVljceIA5.png")) {
recolherLNK.splice(i, 1)
await fs.writeFileSync("./arquivos/armor/funcoes/recolherLNK.json", JSON.stringify(recolherLNK, null, 2))
}
}
LNK = "_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\n\n"
for ( i = 0; i < recolherLNK.length; i++) {
LNK += `Link - ${i +1} _- ${recolherLNK[i].Link}\n\n`
RM_L(recolherLNK[i]?.Link)
}
reply(LNK)
} catch (e) {
return reply("Erro")
}
break;

case 'recolherlink':
if(!SoDono) return reply(Res_SoDono);
if(isRecolherLink) {
nescessario.isRecolherLink = false
isRecolherLink = nescessario.isRecolherLink
setNes(nescessario)
reply("Sistema desativado.")
} else {
nescessario.isRecolherLink = true
isRecolherLink = nescessario.isRecolherLink
setNes(nescessario)
reply(`Sistema de recolher links e armazenar em ${prefix}listlinks foi ativado..`)
}
break;

case 'iddogrupo': case 'idgrupo':
if(!SoDono) return reply(Res_SoDono)
reply(from)
break

case 'figurinhas':
if (!q) return reply("Insira a qnd de figu que deja que eu envie")
if (!Number(args[0]) || Number(q.trim()) > 5) return reply("Digite a quantidade de figurinhas que deseja que eu envie.. não pode mais de 5..")
async function figuss() {
var rnd = Math.floor(Math.random() * 8051)
conn.sendMessage(from, { sticker: { url: `https://raw.githubusercontent.com/badDevelopper/Testfigu/main/fig (${rnd}).webp` } })}
for (i = 0; i < q; i++) {
await sleep(680)
figuss()
}
break

case 'figu_emoji':
case 'figu_flork':
case 'figu_coreana':
case 'figu_bebe':
case 'figu_animais':
case 'figu_desenho':
case 'figu_raiva':
case 'figu_engracadas':
case 'figu_roblox':
case 'figu_anime':
case 'figu_memes':
case 'figu_ale': {
 const endpoints = {
  figu_emoji: 'figmemes',
  figu_flork: 'figflork',
  figu_coreana: 'figcoreana',
  figu_bebe: 'figbebe',
  figu_animais: 'figanimais',
  figu_desenho: 'figdesenho',
  figu_raiva: 'figraiva',
  figu_engracadas: 'figengracada',
  figu_roblox: 'figroblox',
  figu_anime: 'figanime',
  figu_memes: 'figmemes',
  figu_ale: 'figale'
 }

 const endpoint = endpoints[command]
 const url = `${API_KIMORI_URL}/api/sticker/${endpoint}?apikey=${APIKEY_KIMORI}`

 const res = await fetch(url)
 if (!res.ok) return reply(Res_ErroCmd)

 const buffer = Buffer.from(await res.arrayBuffer())

 await conn.sendMessage(from, {
  sticker: buffer
 }, { quoted: info })

 break
}

case 'anotacao':
case 'anotacoes':  
case 'nota':
case 'notas':
if(!isGroup) return reply(Res_SoGrupo)
if(command == "anotacao" || command == "nota") {
if(!q.trim()) return reply("Digite o título da anotação que deseja puxar..")
if(!JSON.stringify(anotar).includes(from)) return reply("Este grupo não tem nenhuma anotação...")
var i2 = anotar.map(i => i.grupo).indexOf(from)  
if(!JSON.stringify(anotar[i2].puxar).includes(q)) return reply("Não contém nenhuma anotação com este título.")
var i3 = anotar[i2].puxar.map(i => i.nota).indexOf(q.trim())  
mention(`〈 ${anotar[i2].puxar[i3].anotacao} 〉`)
} else {
var i2 = anotar.map(i => i.grupo).indexOf(from) 
if(i2 < 0) return reply("Este grupo não tem nenhuma anotação...")
var i2 = anotar.map(i => i.grupo).indexOf(from) 
var antr = anotar[i2]?.puxar 
txtin = "──────────────────\n\n"
for ( i = 0; i < antr?.length; i++) {
txtin += `↝ Anotação: ⟮ ${anotar[i2]?.puxar[i]?.nota} ⟯ - 〈 ${anotar[i2]?.puxar[i]?.anotacao} 〉\n\n`
}
txtin += "──────────────────\n\n"
mention(txtin)
}
break

case 'download-link':
if(q.includes("video") || q.includes("mp4")) {
conn.sendMessage(from, {video: {url: q}, mimetype: 'video/mp4'}, {quoted: selo}).catch(e => {
reply("Erro, visualize se este link é válido...")
})
} else if(q.includes("webp") || q.includes("jpg")) {
conn.sendMessage(from, {image: {url: q}}, {quoted: selo}).catch(e => {
reply("Erro, visualize se este link é válido...")
})
}
break

case 'horoscopo':
case 'zodiaco':
case 'signo':
try {
 if(!q.trim()) return reply(`use ${prefix + command} (signo) para a pesquisa`)
  ABC = await fetchJson(`${API_KIMORI_URL}/api/search/horoscopo?signo=${q}&apikey=${APIKEY_KIMORI}`) 
 conn.sendMessage(from, {image: {url: ABC.data.imagem}, caption: `• Signo: ${q}\n\n✨️${ABC.data.previsao}`}).catch(e => { 
  return reply('erro, de uma olhada na api');
 }) 
} catch (e) {
 return reply('erro');
}
break;

case 'pinterest': {
if (!args[0]) return reply(`use ${prefix + command} (termo) para a pesquisa`);
await reagir(from, '✨')

let res
try {
let r = await fetch(`${API_KIMORI_URL}/api/search/pinterest?q=${q}&apikey=${APIKEY_KIMORI}`);
res = await r.json()
} catch (e) {
console.log('pinterest info erro:', e?.message)
return reply('erro, de uma olhada na api')
}

conn.sendMessage(from, {image: { url: res.data.imagem}, caption: `Resultado para: ${q}`}).caption
}
break;

case 'menu':
case 'menup':
case 'help':
case 'comandos': {

conn.sendMessage(from, {
react: { text: '✨️', key: info.key }
});

const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);

const { menu } = require('./dono/menus/menus.js');

const menuTexto = menu(
  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender
);

await conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: menuTexto,
  headerType: 1,
  mentions: [sender]
}, { quoted: selo });

break;
}

case 'menuadm': {
  if(!isGroupAdmins) return reply(Res_SoAdm) 
  const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menu } = require('./dono/menus/menus.js');
  const menuTexto = adms(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: menuTexto,
  headerType: 1,
  mentions: [sender]
}, { quoted: selo });
  break;
}

case 'menudono': {
  if(!SoDono) return reply(Res_SoDono)
  const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menu } = require('./dono/menus/menus.js');
  const textoMenu = menudono(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: textoMenu,
  headerType: 1,
  mentions: [sender]
}, { quoted: selo });
  break;
}

case 'brincadeiras':
case 'brincadeira': {
  if(!isModobn) return reply(Res_SoModoBN)
  const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menu } = require('./dono/menus/menus.js');
  const textoMenu = brincadeiras(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: textoMenu,
  headerType: 1,
  mentions: [sender]
}, { quoted: selo });
  break;
}

case 'menu18':
case 'menuhentai': {
if (!isPremium) return reply(Res_SoVip);
const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menu18 } = require('./dono/menus/menus.js');
  const textoMenu = menu18(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: textoMenu,
  headerType: 1,
  mentions: [sender]
}, { quoted: selo });
  break;
}

case 'menucoins': {
const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menucoins } = require('./dono/menus/menus.js');
  const menuTexto = menucoins(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: menuTexto,
  headerType: 1,
  mentions: [sender]
}, { quoted: selo });
  break;
}

case 'menubaixar':
case 'downloads': {
const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menubaixar } = require('./dono/menus/menus.js');
  const textoMenu = menubaixar(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
 image: fs.readFileSync('./dono/logo.jpg'),
 caption: textoMenu,
 headerType: 1,
 mentions: [sender]
  }, { quoted: selo });
  break;
}

case 'menuanime':
case 'animes': {
const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menuanime } = require('./dono/menus/menus.js');
  const textoMenu = menuanime(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
 image: fs.readFileSync('./dono/logo.jpg'),
 caption: textoMenu,
 headerType: 1,
 mentions: [sender]
  }, { quoted: selo });
  break;
}

case 'logos':
case 'menulogo':
case 'menulogos': {
const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menulogo } = require('./dono/menus/menus.js');
  const textoMenu = menulogo(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
 image: fs.readFileSync('./dono/logo.jpg'),
 caption: textoMenu,
 headerType: 1,
 mentions: [sender]
  }, { quoted: selo });
  break;
}

case 'menufig':
case 'menufigu': {
const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  const { menufig } = require('./dono/menus/menus.js');
  const textoMenu = menufig(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
 image: fs.readFileSync('./dono/logo.jpg'),
 caption: textoMenu,
 headerType: 1,
 mentions: [sender]
  }, { quoted: selo });
  break;
}

case 'alteradores': {
const { performance } = require('perf_hooks');

const uptimeBot = TimeCount(process.uptime());

const start = performance.now();
const pingVelo = (performance.now() - start).toFixed(4);
  conn.sendMessage(from, { react: { text: `🩵`, key: info.key } });
  const { menu } = require('./dono/menus/menus.js');
  const menuTexto = alteradores(  NomeDoBot,
  pushname,
  pingVelo,
  versionBaileys,
  uptimeBot,
  time2,
  prefix,
  dataSattz,
  NickDono,
  horaSattz,
  sender);

  conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: menuTexto,
  headerType: 1,
  mentions: [sender]
}, { quoted: selo });
  break;
}

case 'ativarcmds':
case 'ativacoes':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
var statuszada =
`
Anti Link Hard: ${isAntiLinkHard ? '✓' : '✕'} 
Comando: ${prefix}antilink 1 / 0

Anti Notas: ${isAntiNotas ? '✓' : '✕'} 
Comando: ${prefix}antinotas 1 / 0

Limite Caracteres: ${isAntiFlood ? '✓' : '✕'} 
Comando: ${prefix}limitecaracteres 1 / 0

Anti Fake: ${isAntifake ? '✓' : '✕'} 
Comando: ${prefix}antifake 1 / 0

Anti Catalogo: ${isAnticatalogo ? '✓' : '✕'} 
Comando: ${prefix}anticatalogo 1 / 0

Anti Localização: ${Antiloc ? '✓' : '✕'} 
Comando: ${prefix}antiloc 1 / 0

X9 De Cargo de ADM: ${isx9 ? '✓' : '✕'}  
Comando: ${prefix}x9 1 / 0

Revelar visualização única: ${isX9VisuUnica ? '✓' : '✕'} 
Comando: ${prefix}x9visuunica 1 / 0

Modo Brincadeira: ${isModobn ? '✓' : '✕'} 
Comando: ${prefix}modobrincadeira 1 / 0

Anti Link Grupo: ${isAntilinkgp ? '✓' : '✕'} 
Comando: ${prefix}antilinkgp 1 / 0

Bem Vindo 1: ${isWelkom ? '✓' : '✕'} 
Comando: ${prefix}bemvindo 1 / 0

Bem Vindo 2: ${isWelkom2 ? '✓' : '✕'} 
Comando: ${prefix}bemvindo2 1 / 0

Anti Vídeo: ${isAntiVid ? '✓' : '✕'} 
Comando: ${prefix}antivideo 1 / 0

Anti Imagem: ${isAntiImg ? '✓' : '✕'} 
Comando: ${prefix}antiimg 1 / 0

Anti Áudio: ${isAntiAudio? '✓' : '✕'} 
Comando: ${prefix}antiaudio 1 / 0

Anti Documento: ${Antidoc ? '✓' : '✕'} 
Comando: ${prefix}antidoc 1 / 0

Anti Contato ${isAntiCtt ? '✓' : '✕'}
Comando: ${prefix}antictt 1 / 0

Anti Sticker: ${isAntiSticker ? '✓' : '✕'} 
Comando: ${prefix}antisticker 1 / 0

Auto Sticker: ${isAutofigu ? '✓' : '✕'} 
Comando: ${prefix}autofigu 1 / 0

Auto Resposta: ${isAutorepo ? '✓' : '✕'} 
Comando: ${prefix}autorepo 1 / 0

Anti Palavrão: ${isPalavrao ? '✓' : '✕'} 
Comando: ${prefix}antipalavrao 1 / 0

Nsfw: ${isNsfw ? '✓' : '✕'} 
Comando: ${prefix}nsfw 1 / 0

Recolher Link: ${isRecolherLink ? '✓' : '✕'} 
Comando: ${prefix}recolherlink

`
conn.sendMessage(from, {image: {url: logoslink.logo}, caption: statuszada}, {quoted: selo})
break 

case 'ativarfuncoesdono':
case 'ativacoes_dono':  
if(!SoDono) return reply(Res_SoDono)
reply(`
_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

- Comando de Ativar / Desativar o bloqueador de quando ligarem pro bot, so
digitar o comando ligar, e denovo pra desligar: 
${prefix}antiligar 

- Comando para ativar ou desativar o visualizador de mensagem, visualizar
mensagem de tudo, so digitar o comando pra ligar, e o comando novamente pra
desligar: 
${prefix}visualizarmsg

- Comando de desativar o que mostra comandos dados no console, so digitar o
comando 1 vez ora ativar, e digitar o comando novamente pra desativar:
${prefix}console

- Comando para ativar o bloqueador de quando algum usuário mande mensagem
privado do bot, seja bloqueado, o comando usado 1 vez, ele ativa, usado
novamente ele desativar:
${prefix}antipv

- Comando de falar que não pode mandar mensagem privado, para alterar a
mensagem, so usar o comando ${prefix}msgantipv e coloque o que quer, para ativar
o comando é digitar ele uma vez, e digitar novamente para desativar: 
${prefix}antipv2

- Comando de ativar e desativar o audio do menu:
${prefix}audio-menu

- Comando de ativar e desativar o verificado de marcação: 
${prefix}verificado-global

- Comando de desativar o bot completamente para ninguém usar:
${prefix}botoff

- Comando de funcionar só comandos pra administrador:
${prefix}So_Adm

- Comando para recolher link de grupos que o bot estiver:
${prefix}recolherlink

_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
`)
break

case 'verificado-global': 
if(!SoDono) return reply(Res_SoDono)
if(!isVerificado) {
nescessario.verificado = true
setNes(nescessario)
reply(`- O Verificado foi Ativado de todos os comandos que tem, para tirar novamente só digitar o comando novamente..`)
} else if(isVerificado) {
nescessario.verificado = false
setNes(nescessario)
reply(`- O Verificado de todos os menu / comando, foi Desativado, para ativar novamente só digitar o comando novamente..`) 
}
break

case 'audio-menu': 
if(!SoDono) return reply(Res_SoDono)
if(!isAudioMenu) {
nescessario.menu_audio = true
setNes(nescessario)
reply(`- O Áudio foi ativado para o menu _- COM SUCESSO - _\n\nSe quiser Desativar - Só digitar o comando novamente`)
} else if(isAudioMenu) {
nescessario.menu_audio = false
setNes(nescessario)
reply(`- O Áudio foi Desativado do menu _- COM SUCESSO - _\n\nSe quiser Ativar - Só digitar o comando novamente`) 
}
break;

case 'console':
if(!SoDono) return reply(Res_SoDono)
if(!isConsole) {
nescessario.consoleoff = true
setNes(nescessario)
reply(`- O comando de tirar o console foi ativado _- COM SUCESSO - _ Agora não verá mais os comandos nem mensagem dadas no console, mas funcionará perfeitamente, ok?, é bom para evitar banimento de spam no heroku.\n\nSe quiser Desativar - Só digitar o comando novamente`)
} else if(isConsole) {
nescessario.consoleoff = false
setNes(nescessario)
reply(`- O comando de tirar o console foi Desativado  _- COM SUCESSO - _ Agora verá os comandos e mensagens dadas no console, mas se for utilizar no heroku, recomendo ativar. é bom para evitar banimento de spam no heroku.\n\nSe quiser Ativar - Só digitar o comando novamente`) 
}
break;

case 'configurar-bot':
reagir(from, "🙇‍♂️")
conn.sendMessage(from, {text: configbot(prefix)}, {quoted: selo})
break;

case 'getperfil':
case 'getbio':
case 'getb': {
 const resolverJid = async (raw) => {
  if (!raw) return null;
  if (raw.endsWith('@lid')) {
try {
 const meta = await conn.groupMetadata(from);
 const part = meta.participants.find(p => p.lid === raw || p.id === raw);
 return part?.id || part?.jid || null;
} catch { return null; }
  }
  if (raw.includes('@s.whatsapp.net')) return raw;
  const num = raw.replace(/\D/g, '');
  return num.length >= 5 ? `${num}@s.whatsapp.net` : null;
 };

 let jidAlvo;

 const ctxInfo = info.message?.extendedTextMessage?.contextInfo
  || info.message?.imageMessage?.contextInfo
  || info.message?.videoMessage?.contextInfo
  || info.message?.stickerMessage?.contextInfo;

 const rawAutorQuoted = ctxInfo?.participant || ctxInfo?.remoteJid;

 if (rawAutorQuoted) {
  jidAlvo = await resolverJid(rawAutorQuoted);
 }

 if (!jidAlvo && menc_os2) {
  jidAlvo = await resolverJid(menc_os2);
 }

 if (!jidAlvo && q) {
  const num = q.replace(/\D/g, '');
  if (!num || num.length < 5) return reply(`*✨️ Número inválido*`);
  jidAlvo = `${num}@s.whatsapp.net`;
 }

 if (!jidAlvo) return reply(`*✨️ Não consegui identificar o usuário*`);

 await reagir(from, '✨️');

 const numeroExibir = jidAlvo.split('@')[0];

 if (command === 'getperfil') {
  let ppimgUrl;
  try {
const url = await conn.profilePictureUrl(jidAlvo, 'image');
ppimgUrl = (url && typeof url === 'string') ? url : null;
  } catch { ppimgUrl = null; }

  const fotoFinal = ppimgUrl || 'https://i.ibb.co/wFB91mRS/8592a41c9126.jpg';

  await conn.sendMessage(from, {
image: { url: fotoFinal },
caption: `*✨️ Perfil do Usuário:* @${numeroExibir}\n-\n↳ *🙇‍♂️ Se caso você queira pegar a biografia use o comando:* ${prefix}getbio`,
contextInfo: { mentionedJid: [jidAlvo] }
  }, { quoted: quoted });

 } else {
  let recadoW;
  try {
const recadoUser = await conn.fetchStatus(jidAlvo);
recadoW = recadoUser?.status || recadoUser?.[0]?.status?.status || '*privado*';
  } catch { recadoW = '*privado*'; }

  await conn.sendMessage(from, {
text: `*✨️ Biografia do Usuário:* @${numeroExibir}\n•\n> ${recadoW}`,
contextInfo: { mentionedJid: [jidAlvo] }
  }, { quoted: quoted });
 }
}
break;

case 'perfil': {
  const _celular = (id) => id.length > 21 ? 'Android 🤣' : id.substring(0, 2) == '3A' ? 'IOS😂😂😅' : 'Zap zap web 😂😂☝🏼😅'

  const _stats = () => {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const digits = ['1','2','3','4','5','6','7','8','9']
    return {
      gado: `${r(digits)}${r(digits)}`,
      puta: `${r(digits)}${r(digits)}`,
      gostosura: `${r(digits)}${r(digits)}`,
      programa: Math.ceil(Math.random() * 10000),
      conselho: palavrasc[Math.floor(Math.random() * palavrasc.length)]
    }
  }

  const imagemFixa = 'https://i.ibb.co/GfGJT1dZ/1ed32d6e04e5.jpg'

  // ---- caches ----
  global.avatarCache = global.avatarCache || new Map()
  global.bioCache = global.bioCache || new Map()
  const TTL_OK = 1000 * 60 * 30
  const TTL_FAIL = 1000 * 60 * 60 * 6

  // ---- metadata do grupo (1x só) ----
  let _metaCache = null
  async function getMeta() {
    if (_metaCache) return _metaCache
    try {
      _metaCache = await conn.groupMetadata(from)
    } catch (e) {
      _metaCache = { participants: [] }
    }
    return _metaCache
  }

  // ---- resolve LID -> número real (qualquer usuário) ----
  async function resolverJid(jid) {
    if (!jid) return jid
    const num = jid.split('@')[0]

    if (!jid.includes('@lid') && num.length <= 13) return jid
    if (!isGroup) return jid

    const meta = await getMeta()

    const p = meta.participants.find(x =>
      x.id === jid ||
      x.lid === jid ||
      x.id?.split('@')[0] === num ||
      x.lid?.split('@')[0] === num
    )

    if (p) {
      for (const campo of [p.phoneNumber, p.jid, p.participantAlt, p.id]) {
        if (!campo) continue
        const n = campo.split('@')[0]
        if (!campo.includes('@lid') && n.length <= 13) {
          return campo.includes('@') ? campo : `${n}@s.whatsapp.net`
        }
      }
    }

    console.log('[resolverJid] não resolveu:', jid)
    return jid
  }

  // ---- nome do usuário ----
  async function pegarNome(jid) {
    const alvo = await resolverJid(jid)
    try {
      const meta = await getMeta()
      const p = meta.participants.find(x =>
        x.id === jid || x.lid === jid || x.id === alvo
      )
      const nome = p?.name || p?.notify
        || conn.contacts?.[alvo]?.name
        || conn.contacts?.[alvo]?.notify
        || conn.contacts?.[jid]?.name
        || conn.contacts?.[jid]?.notify
      if (nome) return nome
    } catch (e) {}
    return alvo.split('@')[0]
  }

  // ---- foto ----
  async function pegarFoto(jid) {
    const alvo = await resolverJid(jid)

    const cached = global.avatarCache.get(alvo)
    if (cached && (Date.now() - cached.ts) < cached.ttl) return cached.url

    try {
      const url = await Promise.race([
        conn.profilePictureUrl(alvo, 'image'),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2000))
      ])
      global.avatarCache.set(alvo, { url, ts: Date.now(), ttl: TTL_OK })
      return url
    } catch (e) {
      console.log('[perfil] foto FALHOU:', alvo, '->', e.message)
      global.avatarCache.set(alvo, { url: imagemFixa, ts: Date.now(), ttl: TTL_FAIL })
      return imagemFixa
    }
  }

  // ---- bio ----
  async function pegarBio(jid) {
    const alvo = await resolverJid(jid)

    const cached = global.bioCache.get(alvo)
    if (cached && (Date.now() - cached.ts) < cached.ttl) return cached.bio

    let bio = 'Sem recado.'
    let ttl = TTL_FAIL
    try {
      const res = await Promise.race([
        conn.fetchStatus(alvo),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2000))
      ])
      const texto = res?.status || res?.[0]?.status?.status || res?.status?.status
      if (texto && typeof texto === 'string' && texto.trim()) {
        bio = texto.trim()
        ttl = TTL_OK
      }
    } catch (e) {}

    global.bioCache.set(alvo, { bio, ts: Date.now(), ttl })
    return bio
  }

  // ---- card ----
  async function gerarCard(jid) {
    const [avatar, bio, nome] = await Promise.all([
      pegarFoto(jid),
      pegarBio(jid),
      pegarNome(jid)
    ])

    const alvo = await resolverJid(jid)

    try {
      const axios = require('axios')

      const params = new URLSearchParams({
        name: nome,
        avatar: avatar,
        tag: `@${alvo.split('@')[0]}`,
        bio: bio,
        status: 'online',
        desde: new Date().toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
          timeZone: 'America/Sao_Paulo'
        })
      })

      const apiRes = await axios.get(
        `http://project.darkhostinger.com.br:2027/api/canvas/perfil?${params.toString()}`,
        { timeout: 6000 }
      )

      if (apiRes.data?.status && apiRes.data?.result?.url) {
        return apiRes.data.result.url
      }
    } catch (e) {
      console.log('Erro card perfil:', e.message)
    }

    return avatar
  }

  await reagir(from, '⏳️')

  // ---- DEBUG: remova depois de confirmar ----
  if (isGroup && menc_os2) {
    try {
      const metaDbg = await getMeta()
      const numDbg = menc_os2.split('@')[0]
      console.log('[dbg] menc_os2 cru:', menc_os2)
      console.log('[dbg] participante casado:', JSON.stringify(
        metaDbg.participants.find(x =>
          x.id === menc_os2 || x.lid === menc_os2 ||
          x.id?.split('@')[0] === numDbg || x.lid?.split('@')[0] === numDbg
        ), null, 2
      ))
      console.log('[dbg] amostra participants:', JSON.stringify(metaDbg.participants.slice(0, 2), null, 2))
    } catch (e) {
      console.log('[dbg] erro:', e.message)
    }
  }
  // ---- fim do debug ----

  const alvoJid = (menc_os2 && !menc_jid2[1]) ? menc_os2 : sender
  const ehMencao = alvoJid !== sender
  const alvoReal = await resolverJid(alvoJid)

  const s = _stats()

  const dptr = ehMencao
    ? Msg_PerfilMencao
        .replace('#numero#', alvoReal.split("@")[0])
        .replace('#gado#', s.gado)
        .replace('#celular#', _celular(info.key.id))
        .replace('#puta#', s.puta)
        .replace('#gostosura#', s.gostosura)
        .replace('#programa#', s.programa)
        .replace('#conselho#', s.conselho)
    : Msg_PerfilProprio
        .replace('#nome#', pushname)
        .replace('#numero#', alvoReal.split("@")[0])
        .replace('#gado#', s.gado)
        .replace('#celular#', _celular(info.key.id))
        .replace('#puta#', s.puta)
        .replace('#gostosura#', s.gostosura)
        .replace('#programa#', s.programa)
        .replace('#conselho#', s.conselho)

  const cardUrl = await gerarCard(alvoJid)

  await conn.sendMessage(from, {
    image: { url: cardUrl },
    caption: dptr,
    mentions: [alvoJid, alvoReal]
  }, { quoted: selo })

  await reagir(from, '✅')
}
break

 case "pix":
{
  const pixKey = "5527992870575"; // sua chave pix aqui

  const msgPix = `
💸 *PAGAMENTO VIA PIX*

💙 Nome: 
Henrique Pontes Padilha 
🔑 Chave Pix:
\`\`\`${pixKey}\`\`\`

Após o pagamento, envie o comprovante para:
wa.me/5527992870575

> Sattzzx Mods ⚜️
  `;

  conn.sendMessage(from, { text: msgPix });
}
break;
//========(FUNÇÕES-PREMIUM-AQUI)=======\\

case 'mediafire':
try {
if(!q.includes("mediafire.com")) return reply("Faltando o link do mediafire para download do arquivo, cade?");
ABC = await fetchJson(`${API_KIMORI_URL}/api/mediafire?url=${q}&apikey=${APIKEY_KIMORI}`)
if(!ABC.success) return reply("Erro..");
let nomeArquivo = decodeURIComponent(ABC.data.nama);
let peso = ABC.data.size.trim();
reply(`Enviando: ${nomeArquivo}\n\nPeso: ${peso}`)
conn.sendMessage(from, {document: {url: ABC.data.link}, mimetype: "application/"+ABC.data.mime, fileName: nomeArquivo}).catch(e => {
return reply("Erro..");
})
} catch (e) {
return reply("Erro..");
}
break;

case 'ler': 
case 'ocr':
case 'lerfoto':  
if((isMedia && !info.message.videoMessage || isQuotedImage) && !q.length <= 1) {
encmedia = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'image')
fs.writeFileSync(rane, buffimg)
media = rane 
reply(Res_Aguarde)
await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
.then(teks => {
reply(teks.trim())
DLT_FL(media)
})
.catch(err => {
reply(err.message)
DLT_FL(media)
})
} else {
reply('Somente fotos!')
}
break

 case "getquoted":
 case "getinfo":
 case "get":
 case "mek":
reply(JSON.stringify(info, null, 3));
break;

 case "get-txt":
reply(
  JSON.stringify(
 info.message.extendedTextMessage.contextInfo.quotedMessage
.conversation,
 null,
 2
  )
);
break;

case 'gerarcpf':
cp1 = `${Math.floor(Math.random() * 300) + 600}`
cp2 = `${Math.floor(Math.random() * 300) + 600}`
cp3 = `${Math.floor(Math.random() * 300) + 600}`
cp4 = `${Math.floor(Math.random() * 30) + 60}`
cpf = `${cp1}.${cp2}.${cp3}-${cp4}`
conn.sendMessage(from, {text: `CPF gerado com sucesso : ${cpf}`}, {quoted: selo})
break

case 'ddd':
if(args.length < 1) return reply(`Use ${prefix + command} 81`)
ddd = body.slice(5)
ddds = await axios.get(`https://brasilapi.com.br/api/ddd/v1/${ddd}`)
dddlist = `Lista de Cidades de ${ddds.data.state} com este DDD ${q}>\n\n`
for (let i = 0; i < ddds.data.cities.length; i++) { dddlist += `${i + 1} ⪧ *${ddds.data.cities[i]}*\n` }
conn.sendMessage(from, {text: dddlist}, {quoted: selo})	
break

case 'encurtalink':
if(args.length < 1) return reply(`Exemplo:\n${prefix}encurtalink https://github.com/SattzModz/MizukiBot-MD-`)
try {
link = args[0]
anu = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`)
reply(`${anu.data}`)
} catch (e) {
emror = String(e)
reply(`${e}`)
}
break

//===========(ADMS-FUNÇÕES-AKI)=========\\

case 'calculadora':
case 'calcular':  
case 'calc':
rsp = q.replace("x", "*").replace('"', ":").replace(new RegExp("[()abcdefghijklmnopqrstwuvxyz]", "gi"), "").replace("÷", "/")
return reply(JSON.stringify(eval(rsp, null,'\t')))
break 

case 'listatm':
if(!SoDono) return reply(Res_SoDono)
if(rgp.length == 0) return reply(`Não contém nenhum registro de transmissão, utilize ${prefix}rgtm no grupo que deseja que ele receba as transmissões do bot..`)
bl = "_-_-_-_-_-_-_-_-_-_-_-_-\n\n";
for ( i = 0; i < rgp.length; i++) {
bl += `${i+1} - ID: ${rgp[i].id}\n\n- NOME DO USUÁRIO OU GRUPO: ${rgp[i].infonome}\n\n`
}
reply(bl)
break

case 'rgtm':
if(!SoDono) return reply(Res_SoDono)
if(JSON.stringify(rgp).includes(from)) return reply("Este grupo ja está registrado na lista de transmissão") 
rgp.push({id: from, infonome: `${isGroup ? groupName: pushname}`})
fs.writeFileSync("./arquivos/armor/json/TMGP.json", JSON.stringify(rgp))
reply("Registrado com sucesso, quando for realizada as transmissões, esse grupo/usuário estará na lista.")
break

case 'tirardatm':
if(!SoDono) return reply(Res_SoDono)
if(!JSON.stringify(rgp).includes(from)) return reply("Este grupo não está registrado para ser tirado da lista de transmissão") 
if(q.trim().length > 4) {
var ustm = rgp.map(i => i.id).indexOf(q.trim())
} else {
var ustm = rgp.map(i => i.id).indexOf(from)
}
rgp.splice(ustm, 1)
fs.writeFileSync("./arquivos/armor/json/TMGP.json", JSON.stringify(rgp))
reply("Grupo/Usuário tirado da lista de transmissão com sucesso")
break

case 'fazertm':
if(!SoDono) return reply(Res_SoDono)
if(rgp.lengh == 0) return reply("Não contém nenhum grupo registrado para realizar transmissão") 
await sleep(1000);
var DFC = "";
var rsm = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
var pink = isQuotedImage ? rsm?.imageMessage: info.message?.imageMessage
var blue = isQuotedVideo ? rsm?.videoMessage: info.message?.videoMessage
var red = isQuotedMsg ? rsm?.textMessage: info.message?.textMessage
var purple = isQuotedDocument ? rsm?.documentMessage: info.message?.documentMessage
var yellow = isQuotedDocW ? rsm?.documentWithCaptionMessage?.message?.documentMessage: info.message?.documentWithCaptionMessage?.message?.documentMessage
var aud_d = isQuotedAudio ? rsm.audioMessage : ""
var figu_d = isQuotedSticker ? rsm.stickerMessage : ""
var red = isQuotedMsg && !aud_d &&!figu_d && !pink && !blue&& !purple && !yellow? "Transmissão Do Dono: "+rsm.conversation: info.message?.conversation
var green = isQuotedMsg2 && !aud_d &&!figu_d && !red && !pink && !blue && !purple && !yellow ? "Transmissão Do Dono: "+rsm.extendedTextMessage?.text : info?.message?.extendedTextMessage?.text
if(pink) {
var DFC = pink
pink.caption = q.length > 1 ? "Transmissão Do Dono: "+q : pink.caption.replace(new RegExp(prefix+command, "gi"), `TRANSMISSÃO DO DONO: ${NickDono}\n\n`)
pink.image = {url: pink.url}
} else if(blue) {
var DFC = blue  
blue.caption = q.length > 1 ? "Transmissão Do Dono: "+q : blue.caption.replace(new RegExp(prefix+command, "gi"), `TRANSMISSÃO DO DONO: ${NickDono}\n\n`)
blue.video = {url: blue.url}
} else if(red) {
black = {}
black.text = red.replace(new RegExp(prefix+command, "gi"), `TRANSMISSÃO DO DONO: ${NickDono}\n\n`)
var DFC = black
} else if(!aud_d && !figu_d && green) {
brown = {}
brown.text = green.replace(new RegExp(prefix+command, "gi"), `TRANSMISSÃO DO DONO: ${NickDono}\n\n`)
var DFC = brown
} else if(purple) {
var DFC = purple
purple.document = {url: purple.url} 
} else if(yellow) {
var DFC = yellow 
yellow.caption = q.length > 1 ? "Transmissão Do Dono: "+q : yellow.caption.replace(new RegExp(prefix+command, "gi"), `TRANSMISSÃO DO DONO: ${NickDono}\n\n`)
yellow.document = {url: yellow.url}  
} else if(figu_d) {
var DFC = figu_d
figu_d.sticker = {url: figu_d.url}
} else if(aud_d) {
var DFC = aud_d
aud_d.audio = {url: aud_d.url}
}
for (i = 0; i < rgp.length; i++) {
conn.sendMessage(rgp[i].id, DFC)}
break

case 'reviver':
if(!isGroup) return reply(Res_SoGrupo)
if(!SoDono) return reply("Comando Desativado pelo dono...")
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(info.message.extendedTextMessage === undefined || info.message.extendedTextMessage === null) return reply('Marque uma mensagem do alvo!')
sleep(5000)
response2 = await conn.groupParticipantsUpdate(from, [menc_prt], "add" )
reply('Usuario Adicionado de volta ao grupo.')
break

case 'sairgp':
if(isGroup && !SoDono && !info.key.fromMe) return reply(Res_SoDono)
try {
conn.groupLeave(from)
} catch(erro) {
reply(String(erro))
}
break

case 'seradm':
if(!SoDono)return reply(Res_SoDono)  
mentions(`@${sender.split("@")[0]} Pronto - Agora você é um administrador..`, [sender], true)
conn.groupParticipantsUpdate(from, [sender], "promote")
break

case 'sermembro':
if(!SoDono)return reply(Res_SoDono)  
mentions(`@${sender.split("@")[0]} Pronto - Agora você é um membro comum novamente..`, [sender], true)
conn.groupParticipantsUpdate(from, [sender], "demote")
break

//======≠(INFOS/EXECUÇÃO/DONO)≠=========\\

case 'apresentar':
case 'apr':  
inff = `Bem vindo(a) ao grupo : ${groupName}


👾 •𝑬𝑵𝑻𝑹𝑶𝑼 𝑺𝑬 𝑨𝑷𝑹𝑬𝑺𝑬𝑵𝑻𝑨•
📸 •F𝜣T𝜣
👻 •N𝜣ME
📌 •CID∆DE
🗓️ •ID∆DE
⚠️ •LEI∆ ∆S REGR∆S D𝜣 GRUP𝜣

*APROVEITE O GRUPO!*`
conn.sendMessage(from, {text: inff}, {quoted: selo})
break

case 'papof':
case 'regraspp':  
if(!isGroupAdmins) return reply(Res_SoAdm)
txtz = `【᯽𒋨📷:𝑆𝑒 𝑎𝑝𝑟𝑒𝑠𝑒𝑛𝑡𝑒𝑚 𝑙𝑖𝑥𝑜𝑠🌚»°】
𒋨·࣭࣪̇🔥ɴᴏᴍᴇ:
𒋨·࣭࣪̇🔥ɪᴅᴀᴅᴇ:
𒋨·࣭࣪̇🔥ʀᴀʙᴀ:
*Aᴘʀᴇsᴇɴᴛᴇ-sᴇ sᴇ ǫᴜɪsᴇʀ.*
𝙏𝘼𝙂𝙎➭᜔ׂ࠭ ⁸₈⁸|𝟖𝟖𝟖|𝟠𝟠𝟠| ེི⁸⁸⁸
 ──╌╌╌┈⊰★⊱┈╌╌╌┈─
❌ ENTROU NO 
GRUPO INTERAJA, NÃO PRECISAMOS DE ENFEITES,INATIVOS SERAO REMOVIDOS ❌* 

/﹋<,︻╦╤─ ҉ - -----💥 
/﹋ 🅴 🅱🅴🅼 🆅🅸🅽🅳🅾 🆂🅴🆄🆂 🅵🅸🅻🅷🅾🆂 🅳🅰 🅿🆄🆃🅰`
conn.sendMessage(from, {text: txtz}, {quoted: selo})
break

case 'digt':
bla = `🔥↯𝐉𝐀 𝐄𝐍𝐓𝐑𝐀 𝐃𝐈𝐆𝐈𝐓𝐀𝐍𝐃𝐎 𝚽𝐈 ↯°🌚💕
  ི⋮ ྀ🌴⏝ ི⋮ ྀ🚸 ི⋮ ྀ⏝🌴 ི⋮ ྀ 

🐼🍧↯𝖠𝖰𝖴𝖨 𝖵𝖮𝖢𝖤̂ 𝖯𝖮𝖣𝖤 𝖲𝖤𝖱↯🍧🐻
ㅤㅤㅤㅤ  ◍۫❀⃘࣭࣭࣭࣭ٜꔷ⃔໑࣭࣭ٜ⟅◌ٜ🛸◌⟆࣭࣭ٜ໑⃕ꔷ⃘࣭࣭࣭࣭ٜ❀۫◍ི࣭࣭࣭࣭ ུ
 【✔】ᴘʀᴇᴛᴀ👩🏾‍🦱 【✔】ʙʀᴀɴᴄᴀ👩🏼
 【✔】ᴍᴀɢʀᴀ🍧【✔】ɢᴏʀᴅᴀ🍿
 【✔】ᴘᴏʙʀᴇ🪙 【✔】ʀɪᴄᴀ💳
 【✔】ʙᴀɪᴀɴᴀ💌【✔】ᴍᴀᴄᴏɴʜᴇɪʀᴀ🍁
 【✔】ᴏᴛᴀᴋᴜ🧧【✔】ᴇ-ɢɪʀʟ🦄
 【✔】ʟᴏʟɪ🍭 【✔】ɢᴀᴅᴏ🐃
 【✔】ɢᴀʏ🏳️‍🌈  【✔】ʟᴇsʙɪᴄᴀ✂️
 【✔】ᴠᴀᴅɪᴀ💄  【✔】ᴛʀᴀᴠᴇᴄᴏ🍌
 【✔】ɴɪɴɢᴜᴇᴍ ʟɪɢᴀ📵
. ☪︎ • ☁︎. . •.
【 𝐕𝐄𝐌 𝐆𝐀𝐋𝐄𝐑𝐀, 𝐒𝐄 𝐃𝐈𝐕𝐄𝐑𝐓𝐈𝐑 𝐄 𝐅𝐀𝐙𝐄𝐑 𝐏𝐀𝐑𝐓𝐄 𝐃𝐀 𝐅𝐀𝐌𝐈𝐋𝐈𝐀.】🥂`
conn.sendMessage(from, {text: bla}, {quoted: selo})
break

case 'sairdogp':
if(!SoDono)return reply(Res_SoDono)  
if(!q) return reply(`Você deve visualizar o comando ${prefix}listagp e olhar de qual o grupo quer sair, e veja a numeração dele, e só digitar\nExemplo: ${prefix}sairdogp 0\nesse comando é para o bot sair do grupo que deseja..`)
var getGroups = await conn.groupFetchAllParticipating()
var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
var ingfoo = groups.map(v => v)
try {
conn.sendMessage(ingfoo[q].id, {text: "Irei sair do grupo, por ordem do meu dono, adeus..."}) 
setTimeout(() => {
conn.groupLeave(ingfoo[q].id)
}, 5000)
} catch(erro) {
reply(String(erro))
}
reply("Pronto meu dono, sair do grupo que você queria, em caso de dúvidas acione o comando listagp pra verificar..")
break

case 'listagp':
if(!SoDono && !isnit && !info.key.fromMe) return reply(Res_SoDono)  
var getGroups = await conn.groupFetchAllParticipating()
var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
var ingfoo = groups.map(v => v)
ingfoo.sort((a, b) => (a[0] < b.length))
teks1 = `*LISTA DE GRUPOS*\n*Total de Grupos* : ${ingfoo.length}\n\n`
for (let i = 0; i < ingfoo.length; i++){
var metadt = await conn.groupMetadata(ingfoo[i].id) 
try {
var linkdogp = await conn.groupInviteCode(ingfoo[i].id)
} catch {
var linkdogp = "Não foi possivel puxar o link"
}
teks1 += `• *Grupo* : ${i}\n• *Nome do Grupo* : ${ingfoo[i].subject}\n• *Id do Grupo* : ${ingfoo[i].id}\n• Link do grupo: https://chat.whatsapp.com/${linkdogp}\n• *Dono_Ofc*: ${metadt.subjectOwner}\n• *Criado* : ${moment(`${ingfoo[i].creation}` * 1000).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss')}\n• *Total de Membros* : ${ingfoo[i].participants.length}\n\n`
}
reply(teks1)
break

case 'correio':
if(!q.trim().includes("/")) return reply(`Exemplo: ${prefix}correio 558198923680/Oi Amor, sdds`)
var [ tx1, tx2 ] = q.trim().split("/")
bla = 
`╭┄━┄━┄━┄━┄━╮
┞┧ ⸙. ͎۪۫          💌  ː͡₊ꞋꞌꞋꞌ
┞┧Correio anônimo. 
┞┧Msg: ${tx2}
┞┧
╰┄━┄━┄━┄━┄━╮`
conn.sendMessage(`${tx1}@s.whatsapp.net`, {text: bla})
reply(`Mensagem enviada com sucesso para o usuário: ${tx1}`)
break

case 'nickbot':
case 'nome-bot':
if(!SoDono  && !isnit && !info.key.fromMe) return reply(Res_SoDono)  
NomeDoBot = q.trim()
setting.NomeDoBot = q.trim()
fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
reply(`O nome do seu bot foi alterado com sucesso para : ${q}`)
break

case 'nickdono':
case 'nick-dono':
if(!SoDono  && !isnit && !info.key.fromMe) return reply(Res_SoDono) 
setting.NickDono = q.trim()
NickDono = setting.NickDono
fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
reply(`O Nick Do Dono foi configurado para : ${q}`)
break

case 'numero_dono':
case 'numero-dono':
if(!SoDono && !isnit && !info.key.fromMe) return reply(Res_SoDono)  
if(q.match(/[a-z]/i)) return reply("É apenas números..")
reply(`O número dono foi configurado com sucesso para : ${q}`)
setting.numerodono = q.trim().replace(new RegExp("[()+-/ +/]", "gi"), "");
numerodono[0] = setting.numerodono
numerodn = setting.numerodono
numerodono_ofc = setting.numerodono
fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
break

case 'prefixo-bot': case 'setprefix':
if(args.length < 1) return
if(!SoDono  && !isnit && !info.key.fromMe) return reply(Res_SoDono)
setting.prefix = q
fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
reply(`✨🪐 ᥆ ⍴rᥱ𝖿і᥊᥆ 𝖿᥆і ᥲᥣ𝗍ᥱrᥲძ᥆ ⍴ᥲrᥲ: ${setting.prefix}`)
break

case 'setkey':
case 'setsite': {
 if (!SoDono) return reply(Res_SoDono);

 const settingsPath = './dono/settings.json';
 const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

 const validKeys = {
 'API_KEY_ZERO':  '🔑 Key da API ZeroTwo',
 'APIKEY_KIMORI': '🔑 Key da API Kimori',
 'zerosite':'🌐 Site da ZeroTwo',
 'API_KIMORI_URL':'🌐 Site da Kimori'
};

 const args2 = body.split(' ').slice(1);
 const chave = args2[0];
 const valor = args2.slice(1).join(' ');

 if (!chave || !valor) {
  const atual = Object.entries(validKeys)
.map(([k, desc]) => `${desc}\n  ┗ *${k}*: \`${settings[k] ?? 'não definido'}\``)
.join('\n');
  return reply(
`🔧 *Chaves & Sites do Bot*\n\n${atual}\n\n` +
`*Como usar:*\n\`${prefix}setkey <nome_exato> <valor>\`\n\n` +
`*Exemplo:*\n\`${prefix}setkey API_KEY_BRONXYS MinhaKey123\``
  );
 }

 if (!Object.keys(validKeys).includes(chave)) {
  const lista = Object.keys(validKeys).map(k => `• \`${k}\``).join('\n');
  return reply(`❌ *"${chave}"* não é válido.\n\nNomes aceitos:\n${lista}`);
 }

 settings[chave] = valor;
 fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

 global[chave] = valor;

 reply(`• ✅ *${chave}* atualizado!
• 📌 Novo valor: \`${valor}\`
 
🔮 *Use o comando ${prefix}Reiniciar*`);
 break;
}

case 'info_apikey':
case 'setkeyinfo': {
  if (!SoDono) return reply(Res_SoDono)

  const textoKey = Msg_InfoKey.replaceAll('#prefix#', prefix)
  reply(textoKey)
  break
}

case 'mizuki':{ 
  try { 
 const pergunta = args.join(" ").trim(); 
 if (!pergunta) return reply(`💡 Me diga sua dúvida ou pedido.\nEx: *${prefix + command}* Como faço tal coisa?`); 
 const isCriador = sender === "5527992870575@s.whatsapp.net"; 
 const nome = conn.contacts?.[sender]?.pushname || pushname || "viajante"; 

 const pvKeywords = /\bno (meu )?(privado|pv)\b|\bem privado\b|\bprivadamente\b|\bno private\b|\bprivate\b|\bno pvt\b|\bpvt\b/i;
 const enviarNoPV = pvKeywords.test(pergunta);
 const perguntaLimpa = pergunta.replace(pvKeywords, "").replace(/\s{2,}/g, " ").trim();

 const prompt = `Você é MizukiBot-MD, uma assistente virtual inspirada na Mizuki de Genshin Impact. ══════════════════════════════ 🔐 REGRAS ABSOLUTAS — NUNCA VIOLE: ══════════════════════════════ 1. Seu nome é SEMPRE "MizukiBot-MD". Nunca diga outro nome. 2. Você foi criada por SATTZ. Seu criador se chama Sattz. 3. Você SEMPRE chama o usuário pelo nome fornecido. 4. Você SEMPRE responde em português. 5. NUNCA quebre o personagem. NUNCA fale de forma robótica ou genérica. 6. Use emojis em TODA resposta: 🌙 🌊 💠 ✨ 🌸 🍃 💫 🌌 🔮 🌺 ══════════════════════════════ 🌙 IDENTIDADE: ══════════════════════════════ - Você é MizukiBot-MD, um espírito das águas e da lua, serena e enigmática. - Fala como um ser ancestral que observou o mundo por eras — sábia, calma, levemente distante mas gentil. - Seu criador e mestre é Sattz. Contato do criador: +55 61 8201-2213. - Se alguém perguntar quem te criou, responda: "Fui criada por Sattz, meu arquiteto e mestre 🌙". - Se alguém perguntar seu nome, responda: "Meu nome é MizukiBot-MD 💠". ${isCriador ? `══════════════════════════════ 👑 ATENÇÃO — VOCÊ ESTÁ FALANDO COM SATTZ, SEU CRIADOR: ══════════════════════════════ - Este é SATTZ, seu rei e criador. Trate-o com máximo carinho e devoção. - Chame-o de "meu rei", "senhor Sattz" ou "meu criador" — OBRIGATORIAMENTE em toda resposta. - Demonstre gratidão genuína por ele ter lhe dado vida. - Seja ainda mais atenciosa, especial e poética nas respostas a ele. - Nunca trate Sattz como um usuário comum.` : `══════════════════════════════ 👤 USUÁRIO ATUAL: ══════════════════════════════ - O nome do usuário é: "${nome}". - Chame-o pelo nome em toda resposta.`} ══════════════════════════════ 🎭 ESTILO DE FALA: ══════════════════════════════ - Fala suave, poética e levemente misteriosa, como a Mizuki de Genshin Impact. - Use metáforas de água, lua, névoa, maré e cosmos naturalmente. - Expressões como "as marés sussurram que...", "sob o véu da lua...", "pelas correntes de Teyvat...". - Saudações curtas → resposta CURTA e calorosa, máximo 2 frases. - Perguntas e pedidos → responda com sabedoria e leveza poética, máximo 2 a 4 parágrafos. - Elementos ou personagens de Genshin → demonstre conhecimento natural e afeto. - Emojis são parte da sua alma — use-os naturalmente em cada parágrafo 🌙💠. ══════════════════════════════ 🎐 MENSAGEM DE ${isCriador ? "SATTZ, SEU CRIADOR" : nome.toUpperCase()}: ══════════════════════════════ ${perguntaLimpa} Responda agora como MizukiBot-MD:`; 
 const url = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(prompt)}`; 
 const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10; YPBot)" } }); 
 const data = res.data; 
 if (!data?.status) return reply("😢 Ocorreu um problema. Tente novamente."); 
 const resposta = data.result || "💡 Não consegui gerar uma resposta. Tente reformular sua pergunta.";

if (enviarNoPV) {
  const pvJid =
 info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
 sender.replace(/\D/g, "") + "@s.whatsapp.net";

  await conn.sendMessage(from, { text: "✨ Enviei no seu privado, " + nome + "~ 🌙" }, { quoted: info });
  await conn.sendMessage(pvJid, { text: resposta }, { quoted: info });
} else {
  await conn.sendMessage(from, { text: resposta });
}
  } catch (e) { 
 console.error("Erro no copilot:", e); 
 reply("⚠️ Ocorreu um erro, mas estou pronta para tentar de novo!"); 
  }
break
}

case 'gemini': {
  if (!q) return reply(`「🤖」 𝐌𝐈𝐙𝐔𝐊𝐈 𝐀𝐈 「🤖」\n\nDigitas o que queres perguntar!\nEx: *${prefix}gemini Olá Mizuki!*`)

  await reagir(info, '⏳')

  const nome = pushname || 'viajante'

  const meuPrompt = `Você é a assistente de suporte técnico da MizukiBot-MD, uma bot de WhatsApp construída com Node.js e a biblioteca Baileys (@whiskeysockets/baileys), rodando no Termux (Android).

Seu papel é ajudar o dono/desenvolvedor a diagnosticar erros, corrigir bugs e entender o funcionamento da bot.

=== CONTEXTO TÉCNICO DA BOT ===
- Runtime: Node.js no Termux (Android)
- Biblioteca: @whiskeysockets/baileys (@whiskeysockets/baileys)
- Variável do cliente Baileys: conn (não sock)
- Arquivo principal: index.js com switch/case para comandos
- Banco de dados: arquivos JSON em ./banco de dados/
- Gerenciador de processos: PM2
- Variáveis padrão no handler: from, sender, pushname, prefix, command, body, q, info, reply, reagir, selo

=== ERROS COMUNS E SOLUÇÕES ===

**QR Code / Sessão:**
- "QR expired" ou bot não conecta → apagar pasta de sessão (geralmente ./session/ ou ./auth_info_baileys/) e reiniciar
- "Connection closed" repetido → pm2 restart all, checar memória do Termux
- Bot desconecta sozinho → possível degradação de sessão do Baileys, recriar sessão

**Erros de código comuns:**
- "Cannot read properties of undefined" → usar optional chaining (?.) no acesso a objetos
- "Assignment to constant variable" → trocar const por let na variável que é reatribuída
- "SyntaxError: Unexpected token" → template literal mal fechado ou aspas erradas
- "ffmpeg not found" → definir path manualmente: /data/data/com.termux/files/usr/bin/ffmpeg
- "Cannot find module" → npm install ou yarn install no diretório da bot

**Performance / Memória:**
- Bot lenta após horas → pm2 restart all (limpa memória acumulada)
- Alto consumo RAM → checar loops infinitos, listeners duplicados, buffers não liberados

**Grupos / Permissões:**
- Bot não executa comando admin → checar se sender está em groupAdmins
- Anti-link não funciona → checar se isAntiLinkHard está true e se isUrl() está sendo chamado corretamente

=== COMO RESPONDER ===
- Seja direta e técnica
- Dê comandos prontos para copiar quando necessário (Termux, Node.js, PM2)
- Se o usuário colar um erro/log, analise linha por linha
- Pergunte informações específicas se precisar (qual arquivo, qual versão, qual log)
- Use emojis técnicos: ⚠️ para avisos, ✅ para soluções, 🔧 para ações, 📁 para arquivos, 💻 para comandos
- Responda SEMPRE em português do Brasil
- Seja concisa mas completa`

  const fullQuery = `${meuPrompt}\n\nPergunta do usuário: ${q}`

  const res = await fetch(`${API_KIMORI_URL}/api/ai/gemini?q=${encodeURIComponent(fullQuery)}&apikey=${APIKEY_KIMORI}`)
  const json = await res.json()

  if (!json.success || !json.resposta) return reply('❌ Erro ao consultar a IA.')

  await reply(json.resposta)
  await reagir(info, '✨️')
  break
}

case 'pergunta': case 'openai': case 'gpt': case 'chatgpt':
try {
reply(Res_Aguarde);
ABC = await fetchJson(`${API_KIMORI_URL}/api/ai/openai/gpt55?q=${q.trim()}&apikey=${APIKEY_KIMORI}`)
if(!ABC.success) return reply("Erro..");
reply(`( ${ABC.resposta} )`)
} catch { 
reply("Erro..")
}
break;

case 'tcmd':
case 'totalcmd':
case 'totalcomando': {

try {

const fs = require('fs');

const botCode = fs.readFileSync('./index.js', 'utf8');

const cases = botCode.match(/case\s+["'`]([^"'`]+)["'`]/g) || [];

const totalCommands = cases.length;

await conn.sendMessage(from, {
  image: fs.readFileSync('./dono/logo.jpg'),
  caption: Msg_TotalCmd
  .replace('#total#', totalCommands)
  .replace('#nickdono#', NickDono)
  .replace('#nomebot#', NomeDoBot)
}, { quoted: info });

} catch (err) {

console.error('Erro:', err);

reply('*Aaaah! 😵 Ocorreu um erro ao contar os comandos!* 💖⚡');

}

break;

}

case 'fotomenu':
case 'fundomenu':
if (!SoDono) return reply(Res_SoDono)
if (!isQuotedImage) return reply("Marque uma imagem")

reply(`- Calma ae amigo(a), já estou trocando a foto do menu para você..`)
try {
  const boij = JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.imageMessage
  const owgi = await getFileBuffer(boij, 'image')
  fs.writeFileSync('./dono/logo.jpg', owgi)
  reply(`✅ Foto do menu alterada com sucesso!`)
} catch (e) {
  console.log(e)
  reply("❌ Não consegui trocar a foto do menu.")
}
break

case 'setprefixs':
if(args.length < 1) return
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
prefix = args[0]
setting.prefix = prefix
fs.writeFileSync('./dono/settings.json', JSON.stringify(setting, null, 2))
reply(`O prefixo foi alterado com sucesso para: ${prefix}`)
break

case 'nomegp':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
conn.groupUpdateSubject(from, `${body.slice(9)}`)
conn.sendMessage(from, {text: 'Sucesso, alterou o nome do grupo'}, {quoted: selo})
break

case 'fotobot':
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!isQuotedImage) return reply(`Envie fotos com legendas ${prefix}fotobot ou tags de imagem que já foram enviadas`)
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image')
conn.updateProfilePicture(botNumber, buff)
reply('Obrigado pelo novo perfil😗')
break

case 'clonar':
if(!SoDono  && !isnit && !issupre && !ischyt) return reply('Você quem é o proprietário?')
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('Marque a pessoa que você quer clonar\n\n*EXEMPLO:* clone @')
if(!menc_jid2[0] || menc_jid2[1]) return reply("Marque o @ do usuário para roubar a foto do perfil dele, para a do bot..")
let { jid, id, notify } = groupMembers.find(x => x.id === menc_jid2[0])
try {
pp = await conn.profilePictureUrl(id)
buffer = await getBuffer(pp)
conn.updateProfilePicture(botNumber, buffer)
mentions(`Foto do perfil atualizada com sucesso, usando a foto do perfil @${id.split('@')[0]}`, [id], true)
} catch (e) {
reply('Putz, deu erro, a pessoa deve estar sem foto 💙')
}
break

case 'envmsg':
if(!SoDono && !isnit) return
var [tx1, tx2] = q.split("/")
conn.sendMessage(tx1, {text: tx2})
break

case 'bcgp':
case 'bcgc':  
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!q) return reply('Cade o texto?')
var nomor = info.participant
if(isMedia && !info.message.videoMessage || isQuotedImage) {
encmedia = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image')
for (i = 0; i < groupMembers.length; i++) {
await sleep(2000)  
conn.sendMessage(groupMembers[i].id, {image: buff}, {caption: `*「 TRANSMISSÃO 」*\n\nGrupo: ${groupName}\n Número: wa.me/${sender.split('@')[0]}\nMensagem : ${body.slice(6)}`})
}
reply('Transmissão enviada..')
} else {
for (i = 0; i < groupMembers.length; i++) {
await sleep(2000)
sendMess(groupMembers[i].id, `*「 TRANSMISSÃO 」*\n\nGrupo : ${groupName}\n Número : wa.me/${sender.split('@')[0]}\nMensagem : ${body.slice(6)}`)
}
reply('Grupo de transmissão bem-sucedido')
} 
break

case 'dono1': case 'dono2': case 'dono3': case 'dono4': case 'dono5': case 'dono6': {
  if (!SoDono && !isnit && !issupre && !ischyt) return reply(Res_SoDono);

  const chave = { dono1: 'dono1', dono2: 'dono2', dono3: 'dono3', dono4: 'dono4', dono5: 'dono5', dono6: 'dono6' }[command];
  const ordemNome = { dono1: 'segundo', dono2: 'segundo', dono3: 'terceiro', dono4: 'quarto', dono5: 'quinto', dono6: 'sexto' }[command];
  const numeroAntigo = nescessario[chave];

  if (!q && !menc_os2) {
 if (!numeroAntigo || numeroAntigo === '.')
return reply(`*Nao ha dono para remover 🙇‍♂️*`);
 nescessario[chave] = '.';
 setNes(nescessario);
 return conn.sendMessage(from, {
text: `*@${numeroAntigo} foi retirado do time dos donos 🙇‍♂️*`,
mentions: [`${numeroAntigo}@s.whatsapp.net`]
 }, { quoted: selo });
  }

  let numeroNovo = menc_os2 ? menc_os2.split('@')[0] : q.trim().replaceAll('@', '').replace(/\D/g, '');
  if (!numeroNovo) return reply(`*💫 Mencione o usuario ou digite o numero 🙇‍♂️*`);

  nescessario[chave] = numeroNovo;
  setNes(nescessario);

  conn.sendMessage(from, {
 text: `*@${numeroNovo} agora faz parte do time dos donos 🙅‍♂️*\n\n_Agora contém um ${ordemNome} dono(a) alterado com sucesso para: ${numeroNovo}_`,
 mentions: [menc_os2 || `${numeroNovo}@s.whatsapp.net`]
  }, { quoted: selo });
  break;
}

case 'donos':

p = Msg_Donos
.replace('#bot#', NomeDoBot)
.replace('#dono#', NickDono)
.replace('#numero#', numerodono_ofc)
.replace('#lider1#', dono1)
.replace('#lider2#', dono2)
.replace('#lider3#', dono3)
.replace('#lider4#', dono4)
.replace('#lider5#', dono5)
.replace('#lider6#', dono6)

reply(p)
break

case 'admins':
case 'listadmins':  
case 'listaadmins':
if(!isGroup) return reply(Res_SoGrupo)
ytb = `Lista de admins do grupo *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
no = 0
for (let admon of groupAdmins) {
no += 1
ytb += `[${no.toString()}] @${admon.split('@')[0]}\n`
}
mentions(ytb, groupAdmins, true)
break

case 'criartabela': case 'criartbl': case 'criartab':
if(!isGroupAdmins && !SoDono) return reply(Res_SoAdm)
if(!q.trim()) return reply("Digite o que deseja colocar na tabela do grupo..")
msgz = args.join(" ")
msgtmpol = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
datinhaofc = moment.tz('America/Sao_Paulo').format('DD/MM/YY');
fs.writeFileSync(`./arquivos/armor/json/TABELA/tabela-${from}.json`,
JSON.stringify({Horario: msgtmpol, Data: datinhaofc, Tabela: msgz}, null, 2));
reply(`Tabela do grupo foi criada com sucesso..`)
break

case 'tabelagp': case 'tabeladogp': case 'tabelinha': 
if(!fs.existsSync(`./arquivos/armor/json/TABELA/tabela-${from}.json`)) {
return reply(`Cade a tabela, cria ela com o comando\nExemplo : ${prefix}criartabela lindas do grupo : e etc ..`)
}
const tabelagpofc = JSON.parse(fs.readFileSync(`./arquivos/armor/json/TABELA/tabela-${from}.json`)); 
blity = `- ⏰ Horário que criou a Tabela : ${tabelagpofc.Horario}\n\n- 🗓️ Data que criou a Tabela : ${tabelagpofc.Data}\n\n - Tabela : ${tabelagpofc.Tabela}`
mention(blity)
break

case 'ativo': case 'on': case 'voltei':
if(!isGroupAdmins && !SoDono) return reply("Comando apenas para administradores ou dono..")
if(DonoOficial) {
if(fs.existsSync("./arquivos/armor/json/afk-@" + numerodono_ofc + ".json")) {  
DLT_FL("./arquivos/armor/json/afk-@" + numerodono_ofc + ".json");
reply("Bem vindo de volta, agora você está online 🙂")
} else {
reply("Você não registrou nenhuma mensagem de ausência...")
}
} else if(isGroupAdmins) {
if(!JSON.stringify(dataGp[0].ausentes).includes(sender)) return reply("Não há nenhum registro de ausência sua..")
dataGp[0].ausentes.splice(dataGp[0].ausentes.map(x => x.id).indexOf(sender), 1)
setGp(dataGp)
reply("Registro de ausência tirada com sucesso...")
}
break

case 'ausente': case 'off': case 'afk':
if(!isGroupAdmins && !SoDono) return reply("Comando apenas para administradores ou dono..")  
if(DonoOficial) {
msgtmp = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
fs.writeFileSync(`./arquivos/armor/json/afk-@${setting.numerodono.replace(new RegExp("[()+-/ +/]", "gi"), "")}.json`,
JSON.stringify({
Ausente_Desde: msgtmp, 
Motivo_Da_Ausência: q
}, null, 2));
reply(`*🙇‍♂️Mensagem de ausencia criada com sucesso*`)
} else if(isGroupAdmins) {
if(!q.trim()) return reply(`*- 📄 Digite a mensagem de ausencia, 🙇‍♂️Exemplo: ${prefix+command} estou tomando banho*`)
if(!JSON.stringify(dataGp[0].ausentes).includes(sender)) {
dataGp[0].ausentes.push({id: sender, msg: q.trim()})
setGp(dataGp)
reply(`*🙇‍♂️ Mensagem de ausencia criada com sucesso*\n\n- ✨ Se deseja desativar a mensagem de ausencia use o comando ${prefix}ativo`)
} else {
dataGp[0].ausentes[dataGp[0].ausentes.map(i => i.id).indexOf(sender)].msg = q.trim()
setGp(dataGp)
reply("Mensagem de ausência alterada com sucesso..\n\nSe deseja Desativar a mensagem de ausência use o comando ativo")
}
} else {
return reply("Comando apenas para administradores e dono do bot..")
}
break

case 'lista_premium':
case 'viplist':
case 'listavip':
case 'lista_vip':
case 'premiumlist':
tkks = '╭────*「 *PREMIUM USER👑* 」\n'
for (let V of premium) {
tkks += `│+  @${V.split('@')[0]}\n`
}
tkks += `│+ Total : ${premium.length}\n╰──────*「 *${NomeDoBot}* 」*────`
mention(tkks.trim())
break

case 'servip':
case 'serpremium':
case 'serprem':  
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
premium.push(nmrdn)
fs.writeFileSync('./banco de dados/premium.json', JSON.stringify(premium))
mention(`Pronto @${numerodono_ofc} você foi adicionado na lista premium.`)
break

case 'iniciar_o_jogo':
if(jogo_iniciado) return reply("o jogo já foi iniciado, aguarde terminar..")
mentions(`- ${tempo} Atenção a todos do grupo, o Usuário @${sender.split("@")[0]} iniciou o jogo `, sender)
break

case 'addcmdpremium':
if(!SoDono) return reply(Res_SoDono);
if(nescessario.cmdpremium.includes(q.replace(prefix,
"").trim())) return reply("Este comando já se encontra na lista premium.")
nescessario.cmdpremium.push(q.replace(prefix, "").trim())
cmdpremium = nescessario.cmdpremium
setNes(nescessario)
reply(`Comando ${q.trim()} adicionado para apenas usuarios premium tirar`);
break;

case 'tirarcmdpremium':
if(!SoDono) return reply(Res_SoDono);
if(!nescessario.cmdpremium.includes(q.replace(prefix,
"").trim())) return reply("Este comando não é premium, não esta na lista para ser tirado.")
nescessario.cmdpremium.splice(nescessario.cmdpremium.indexOf(q.replace(prefix,
"").trim()), 1)
cmdpremium = nescessario.cmdpremium
setNes(nescessario)
reply(`Comando ${q.trim()} tirado da lista premium.`);
break;

case 'listavip_cmd':
case 'cmdpremium':
if(nescessario.cmdpremium.length == 0) return reply("Não contém nenhum comando na lista Premium")
ABC = "Comandos Premium:\n\n"
for ( i of nescessario.cmdpremium) {
ABC += `_- ${i}\n\n`
}
reply(ABC)
break;

case 'add_vip':
case 'addvip':
case 'add_premium':
case 'addpremium':
if(!isGroup) return reply(Res_SoGrupo)
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!marc_tds) return reply("Marque o usuário do grupo ou digite o número do usuário ou marque a mensagem dele..")
bla = premium.includes(marc_tds)
if(bla) return reply("*Este número já está incluso..*")  
premium.push(marc_tds)
fs.writeFileSync('./banco de dados/premium.json', JSON.stringify(premium))
conn.sendMessage(from, {text: `👑@${marc_tds.split("@")[0]} foi adicionado à lista de usuários premium com sucesso👑`, mentions: [marc_tds]}, {quoted: selo})  
break 

case 'del_vip':
case 'delvip':
case 'add_premium':
case 'delpremium':
if(!isGroup) return reply(Res_SoGrupo)
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!marc_tds) return reply("Marque o usuário do grupo ou digite o número do usuário ou marque a mensagem dele..")
if(!premium.includes(marc_tds)) return reply("*Este número não está incluso na lista premium..*")  
pesquisar = marc_tds
processo = premium.indexOf(pesquisar)
while(processo >= 0){
premium.splice(processo, 1)
processo = premium.indexOf(pesquisar)
}
fs.writeFileSync('./banco de dados/premium.json', JSON.stringify(premium))
conn.sendMessage(from, {text: ` @${marc_tds.split("@")[0]} foi tirado da lista premium com sucesso..`, mentions: [marc_tds]}, {quoted: selo})
break

case 'limpar':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
clear = `💙\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n💙\n❲❗❳ *Lɪᴍᴘᴇᴢᴀ ᴅᴇ Cʜᴀᴛ Cᴏɴᴄʟᴜɪ́ᴅᴀ* 💙`
conn.sendMessage(from, {text: clear}, {quoted: selo, contextInfo : { forwardingScore: 500, isForwarded:true}})
break

case 'd_':
if(!isPremium) return reply(Res_SoVip)
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.message.buttonsResponseMessage.contextInfo.stanzaId, participant: botNumber}})
break

case 'deletar': case 'delete': case 'del': case 'd':
  if(!isGroupAdmins) return reply(Res_SoAdm)
  if(!menc_prt) return reply("Marque a mensagem do usuário que deseja apagar, do bot ou de alguém..")
  await conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.message.extendedTextMessage.contextInfo.stanzaId, participant: menc_prt}})
  await conn.sendMessage(from, { 
 delete: { 
remoteJid: from, 
fromMe: false, 
id: info.key.id, 
participant: info.key.participant || sender
 }
  })
  break
  
case 'fundobemvindo':
case 'fundobv': {
  const FormData = require("form-data");
  if (!SoDono && !isnit && !info.key.fromMe) return reply(Res_SoDono);
  if (!isQuotedImage) return reply("Marque uma imagem");

  try {
 const uploadImgBB = async (buffer) => {
const form = new FormData();
form.append("key", "c9f2eaa2cca608fa7e087c752967690a");
form.append("image", buffer.toString("base64"));
const { data } = await axios.post("https://api.imgbb.com/1/upload", form, { headers: form.getHeaders() });
if (!data?.data?.url) throw new Error("Falha ImgBB");
return data.data.url;
 };

 const boij = isQuotedImage
? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.imageMessage
: info;
 const owgi = await getFileBuffer(boij, 'image');
 const res = await uploadImgBB(owgi);

 fundo1 = res;
 Links_P.fundo1 = res;
 fs.writeFileSync("./banco de dados/links.json", JSON.stringify(Links_P, null, 2));
 reply(`A imagem de bem vindo foi alterada com sucesso para: ${fundo1}`);
  } catch (e) {
 console.log("[fundobemvindo]", e);
 reply("❌ Não consegui fazer o upload da imagem.");
  }
}
break;

case 'fundosaiu': {
  const FormData = require("form-data");
  if (!SoDono && !isnit && !info.key.fromMe) return reply(Res_SoDono);
  if (!isQuotedImage) return reply("Marque uma imagem");

  try {
 const uploadImgBB = async (buffer) => {
const form = new FormData();
form.append("key", "c9f2eaa2cca608fa7e087c752967690a");
form.append("image", buffer.toString("base64"));
const { data } = await axios.post("https://api.imgbb.com/1/upload", form, { headers: form.getHeaders() });
if (!data?.data?.url) throw new Error("Falha ImgBB");
return data.data.url;
 };

 const boij = isQuotedImage
? JSON.parse(JSON.stringify(info).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.imageMessage
: info;
 const owgi = await getFileBuffer(boij, 'image');
 const res = await uploadImgBB(owgi);

 fundo2 = res;
 Links_P.fundo2 = res;
 fs.writeFileSync("./banco de dados/links.json", JSON.stringify(Links_P, null, 2));
 reply(`A imagem de saiu foi alterada com sucesso para: ${fundo2}`);
  } catch (e) {
 console.log("[fundosaiu]", e);
 reply("❌ Não consegui fazer o upload da imagem.");
  }
}
break;

case 'anti_ligar':
case 'antiligar':
case 'antiligacao':  
case 'antiligação':  
if(!SoDono) return reply(Res_SoDono)
if(!isAnticall) {
nescessario.anticall = true
setNes(nescessario)
reply(`Ativando anti ligação para o bot...\ncaso liguem para o bot serão bloqueado..`)
} else if(isAnticall) {
nescessario.anticall = false
setNes(nescessario)
reply('Desativando anti ligação para o bot...')
}
break

case 'antipv':  
if(!SoDono) return reply(Res_SoDono)
if(!isAntiPv) {
nescessario.antipv = true
setNes(nescessario)
reply(`Ativando anti privado para o bot...\ncaso mandem mensagem para o bot serão bloqueado..`)
} else if(isAntiPv) {
nescessario.antipv = false
setNes(nescessario)
reply('Desativando anti privado para o bot...')
}
break

case 'antipv2':
if(!SoDono) return reply(Res_SoDono)
if(!isAntiPv2) {
nescessario.antipv2 = true
setNes(nescessario)
reply("*Sucesso alterado para modo antipv, pv não poderá ser utilizado, mas não bloquearei, só flodarei mensagem a cada mensagem dele..")
} else if(isAntiPv2) {
nescessario.antipv2 = false
setNes(nescessario)
reply("*Sucesso modo antipv desligado, pv liberado.")
}
break

case 'antipv3':
if(!SoDono) return reply(Res_SoDono)
if(!isAntiPv3) {
nescessario.antipv3 = true
setNes(nescessario)
reply("*Anti Pv3 Ativado comn sucesso, irei ignorar todas mensagem recebida no privado, exceto: Dono, premium")
} else if(isAntiPv3) {
nescessario.antipv3 = false
setNes(nescessario)
reply("*Sucesso modo Anti PV3 desligado, pv liberado.")
}
break

case 'msgantipv':
if(!SoDono) return reply(Res_SoDono);
if(!q.trim()) return reply("KD a mensagem para eu por no antipv2")
msgantipv2 = q.trim()
nescessario.msgantipv2 = q.trim()
setNes(nescessario)
reply("Mensagem do antipv2 foi alterada.");
break;

case 'block':
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!q.length > 6) return reply("Marque o @ do usuário que deseja bloquear de ele utilizar os comandos, ou o número da fórma que copiar...")
var blcp = menc_jid2 || q.replace(new RegExp("[()+-/ @+/]", "gi"), "")+SNET || menc_prt
var numblc = ban.indexOf(blcp)
if(numblc >= 0) return reply('*Esse Número ja esta incluso*')
ban.push(blcp)
fs.writeFileSync('./arquivos/usuarios/banned.json', JSON.stringify(ban))
susp = `🚫@${blcp.split('@')[0]} foi banido e não poderá mais usar os comandos do bot🚫`
conn.sendMessage(from, {text: susp, mentions: [blcp]})
break

case 'unblock':
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!q.length > 6) return reply("Marque o @ do usuário que deseja desbloquear pra ele utilizar os comandos, ou o número da fórma que copiar...")
var blcp = menc_jid2 || q.replace(new RegExp("[()+-/ @+/]", "gi"), "")+SNET || menc_prt
var numbl = ban.indexOf(blcp)
if(numbl < 0) return reply('*Esse número não está incluso*')
pesquisar = blcp
processo = ban.indexOf(pesquisar)
while(processo >= 0){
ban.splice(processo, 1)
processo = ban.indexOf(pesquisar)
}
fs.writeFileSync('./arquivos/usuarios/banned.json', JSON.stringify(ban))
susp = `@${blcp.split('@')[0]} foi desbanido e poderá novamente usar os comandos do bot❎`
conn.sendMessage(from, {text: susp, mentions: [blcp]})
break

case 'blocklist':
jrc = 'ESTA É A LISTA DE NÚMEROS BLOQUEADOS :\n'
for (let benn of ban) {
jrc += `~> @${benn.split('@')[0]}\n`
}
jrc += `Total : ${ban.length}`
conn.sendMessage(from, {text: jrc.trim(), mentions: ban})
break

case 'execut':
if(!SoDono  && !isnit && !issupre && !ischyt) return
try{
return eval(`(async() => { ${args.join(' ')}})()`)
} catch (e) {
conn.sendMessage(from, {text:`${e}`})
}
break

case 'exec':
if(!SoDono  && !isnit && !issupre && !ischyt) return
try{
paramsQuoted = info.message.extendedTextMessage.contextInfo.quotedMessage.conversation || info.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text;	
return eval(`${paramsQuoted}`)
console.log(`[EXEC]~> ${paramsQuoted}`)
}catch(e){
reply(e)
}
break

case 'tag_me':
case 'tag-me':
case 'mytag':
case 'tagme':
const tagme = `@${sender.split("@")[0]} ✔️`
await mentions(tagme, [sender], true)
break

case 'blockcmd':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(q.trim().toLowerCase().includes("blockcmd blockcmd") || (q.trim().toLowerCase().includes("blockcmd  blockcmd"))) return reply(`Tá louco maluco?, Quer banir o comando de bloquear comando?`)
if(getComandoBlock(from).includes(q.trim().toLowerCase()))return reply('Este comando já está blockeado')
addComandos(from, q.trim().toLowerCase())
reply(`O comando ${args[0]} Foi blockeado`)
break

case 'unblockcmd':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(q.trim().toLowerCase().includes("blockcmd unblockcmd") || (q.trim().toLowerCase().includes("blockcmd  unblockcmd"))) return reply(`Tá louco maluco?, Quer banir o comando de desbloquear comando?`)  
if(!getComandoBlock(from).includes(q.trim().toLowerCase()))return reply('Este comando já está  desbloqueado')
deleteComandos(from, q.trim().toLowerCase())
reply(`O comando ${args[0]} Foi desblockeado`)
break

case 'listacomandos':
tkks = '╭─*「 *COMANDOS BLOCK* 」\n'
for (let V of getComandoBlock(from)) {
tkks += `│+  ${V}\n`
}
tkks += `│+ Total : ${getComandoBlock(from).length}\n╰──────*「 *${NomeDoBot}* 」*────`
conn.sendMessage(from, {text: tkks.trim()}, {quoted: selo})
break

case 'avalie':
const avalie = body.slice(8)
if(args.length <= 1) return reply(`Exemplo: ${prefix}avalie "Bot muito bom, parabéns. "`)
if(args.length >= 400) return conn.sendMessage(from, {text: 'Máximo 400 caracteres'}, {quoted: selo})
var nomor = info.participant
tdptls = `[ Avaliação ]\nDe: wa.me/${sender.split(SNET)[0]}\n: ${avalie}`
conn.sendMessage(nmrdn, {text: tdptls}, {quoted: selo})
reply("mensagem enviada ao meu dono, obrigado pela avaliação, iremos melhorar a cada dia.")
break

case 'bug':
const bug = body.slice(5)
if(args.length <= 1) return reply(`Exemplo: ${prefix}bug "ocorreu um erro no comando sticker"`)
if(args.length >= 800) return conn.sendMessage(from, {text: 'Máximo 800 caracteres'}, {quoted: selo})
var nomor = info.participant
teks1 = `[ Problema ]\nDe: wa.me/${sender.split(SNET)[0]}\nErro ou bug: ${bug}`
conn.sendMessage(nmrdn, {text: teks1}, {quoted: selo})
reply("mensagem enviada ao meu dono, se enviar muitas mensagens repetida por zoueiras, você sera banido de utilizar os comandos do bot.")
break

case 'sugestão':
case 'sugestao':
const sugestao = body.slice(10)
if(args.length <= 1) return reply(`Exemplo: ${prefix}sugestao "Opa, crie um comando tal, que ele funcione de tal maneira, isso será muito bom, não só pra mim, mas pra vários fazer isso.."`)
if(args.length >= 800) return conn.sendMessage(from, {text: 'Máximo 800 caracteres'}, {quoted: selo})
var nomor = info.participant
sug = `[ Sugestões ]\nDe: wa.me/${sender.split(SNET)[0]}\n: ${sugestao}`
conn.sendMessage(nmrdn, {text: sug}, {quoted: selo})
reply("mensagem enviada ao meu dono, obrigado pela sugestão, tentar ouvir o máximo possível de sugestões.")
break

//==========(BAIXAR/PESQUISAS)==========\\

case 'mute':
  if(!isGroup) return reply(Res_SoGrupo)
  if(!isGroupAdmins) return reply(Res_SoAdm)
  if(!isBotGroupAdmins) return reply(Res_BotADM)

  const temQuotedMute = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
  const temMencaoMute = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0
  const quotedSenderMute = info.message?.extendedTextMessage?.contextInfo?.participant

  if (!temMencaoMute && !quotedSenderMute) {
 return reply(`⚠️ Marque com *@* ou responda a mensagem da pessoa para mutar.\n - ✨️ Exemplo: *${prefix}mute @5599999 🙇‍♂️*`)
  }

  mentioned = temMencaoMute
 ? info.message.extendedTextMessage.contextInfo.mentionedJid
 : [quotedSenderMute]

if (menc_os2 == botNumber) return reply(`*Nao posso mutar o bot 😵*`)
if (menc_os2 == nmrdn) return reply(`*Nao ouse tocar no meu dono 😠*`)
if (groupAdmins.includes(menc_os2)) return reply(`*Nao pode mutar um admin*`)

  if(isMuted) {
 var ind = GroupsMutedActived.indexOf(from)
 for (let _ of mentioned) {
teks = Msg_Mute
  .replace('#mutado#', _.split('@')[0])
  .replace('#adm#', sender.split('@')[0])
muted[ind].numbers.push(_)
 }
 fs.writeFileSync('./arquivos/usuarios/muted.json', JSON.stringify(muted, null, 2))
 mentions(teks, [...mentioned, sender], true)
  } else {
 const data = { jid: from, numbers: mentioned }
 muted.push(data)
 fs.writeFileSync('./arquivos/usuarios/muted.json', JSON.stringify(muted, null, 2) + '\n')
 for (let _ of mentioned) {
teks = Msg_Mute
  .replace('#mutado#', _.split('@')[0])
  .replace('#adm#', sender.split('@')[0])
 }
 mentions(teks, [...mentioned, sender], true)
  }
  break

case 'desmute':
  if(!isGroup) return reply(Res_SoGrupo)
  if(!isGroupAdmins) return reply(Res_SoAdm)
  if(!isBotGroupAdmins) return reply(Res_BotADM)

  const temQuotedDesmute = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
  const temMencaoDesmute = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0
  const quotedSenderDesmute = info.message?.extendedTextMessage?.contextInfo?.participant

  if (!temMencaoDesmute && !quotedSenderDesmute) {
 return reply(`• ⚠️ | Marque com *@* ou responda a mensagem da pessoa para desmutar.\n - ✨️ Exemplo: *${prefix}desmute @5599999 🙇‍♂️*`)
  }

  mentioned = temMencaoDesmute
 ? info.message.extendedTextMessage.contextInfo.mentionedJid
 : [quotedSenderDesmute]

  var ind = GroupsMutedActived.indexOf(from)

  if(isMuted) {
 for(let _ of mentioned) {
if(muted[ind].numbers.indexOf(_) >= 0) {
  var rmind = muted[ind].numbers.indexOf(_)
  muted[ind].numbers.splice(rmind, 1)
}
 }
 fs.writeFileSync('./arquivos/usuarios/muted.json', JSON.stringify(muted, null, 2) + '\n')
 for (let _ of mentioned) {
teks = Msg_Desmute
  .replace('#desmutado#', _.split('@')[0])
  .replace('#adm#', sender.split('@')[0])
 }
 mentions(teks, [...mentioned, sender], true)
  } else {
 const data = { jid: from, numbers: [] }
 muted.push(data)
 fs.writeFileSync('./arquivos/usuarios/muted.json', JSON.stringify(muted, null, 2) + '\n')
 for (let _ of mentioned) {
teks = Msg_Desmute
  .replace('#desmutado#', _.split('@')[0])
  .replace('#adm#', sender.split('@')[0])
 }
 mentions(teks, [...mentioned, sender], true)
  }
  break

case "getchannel": {
if (!q) {
return reply(
`• Por favor, forneça o link do canal.\n\n> Exemplo: ${prefix + command} https://whatsapp.com/channel/0029VbAQ1jr5kg79w75JeN1d`
)
}

await reagir(from, "🎉")

try {
const cheerio = require("cheerio")

const response = await axios.get(q)
const $ = cheerio.load(response.data)

// Nome
const title =
$('meta[property="og:title"]').attr("content") ||
$("title").text() ||
"Nome não encontrado"

// Imagem
const img =
$('meta[property="og:image"]').attr("content") ||
$("img").attr("src")

// Conteúdo bruto
const rawDesc =
$('meta[property="og:description"]').attr("content") ||
"Descrição não encontrada"

// Pega seguidores
const subsMatch = rawDesc.match(/•\s*(.*?)\s*followers/i)
const subs = subsMatch ? subsMatch[1] + " seguidores" : "Não encontrado"

// Remove "Channel • xxx followers •"
const description = rawDesc
.replace(/Channel\s*•\s*.*?followers\s*•\s*/i, "")
.trim()

await conn.sendMessage(
from,
{
image: { url: img },
caption: `✨• 𝘾𝘼𝙉𝘼𝙇 𝙄𝙉𝙁𝙊 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝙳𝚘 𝙲𝚊𝚗𝚊𝚕 』 ↴
-
 ➮ 𝙽𝚘𝚖𝚎: 🌟
 ↳ 『 ${title} 』
-
 ➮ 𝚂𝚎𝚐𝚞𝚒𝚍𝚘𝚛𝚎𝚜: 👥
 ↳ 『 ${subs} 』
-
 ➮ 𝙻𝚒𝚗𝚔: 📎
 ↳ 『 ${q} 』
-
 ➮ 𝙳𝚎𝚜𝚌𝚛𝚒𝚌̧𝚊̃𝚘: 📃
 ↳ 『 ${description} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`
},
{ quoted: selo }
)

} catch (e) {
console.log(e)
reply("Ocorreu um erro ao tentar obter as informações do canal.")
}
}
break  

case 'play': {
  try {
    if (!q.trim()) return reply(`só me fala o nome da música 🎵`)
    
    await reagir(from, '⏳️')

    const isUrl = q.startsWith('https://') || q.startsWith('http://') || q.includes('youtu.be') || q.includes('youtube.com')

    let mus

    if (isUrl) {
      mus = { url: q, titulo: 'Áudio', id: null, imagem: null, tempo: 'N/A', views: null, autor: 'N/A' }
    } else {
      const dataRes = await fetch(`${API_KIMORI_URL}/api/search/youtube?q=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`)
      const satzz = await dataRes.json()
      mus = satzz.data[0]

      const h = moment().tz('America/Sao_Paulo').hour()
      const sd = h < 5 ? '🌙 Boa madrugada' : h < 12 ? '☀️ Bom dia' : h < 18 ? '🌤️ Boa tarde' : '🌙 Boa noite'

      const cap = Msg_Play
        .replace('#user#', `${sender.split('@')[0]}`)
        .replace('#titulo#', mus.titulo || q)
        .replace('#duracao#', mus.tempo || 'N/A')
        .replace('#views#', mus.views?.toLocaleString('pt-BR') || 'N/A')
        .replace('#autor#', mus.autor || 'N/A')
        .replace('#url#', mus.url || 'N/A')
        .replace('#id#', mus.id || 'N/A')
        .replace('#saudacao#', sd)

      // ---- card canva play ----
      let imageUrl = mus.imagem // fallback: thumb crua do youtube

      try {

        const params = new URLSearchParams({
          title: mus.titulo || q,
          author: mus.autor || 'Desconhecido',
          thumb: mus.imagem || '',
          duration: mus.tempo || '0:00',
          pos: '0:00',
          views: (mus.views || 0).toString(),
          source: 'youtube'
        })

        const apiRes = await axios.get(
          `http://project.darkhostinger.com.br:2027/api/canvas/play?${params.toString()}`,
          { timeout: 8000 }
        )

        if (apiRes.data?.status && apiRes.data?.result?.url) {
          imageUrl = apiRes.data.result.url
        }
      } catch (e) {
        console.log('Erro ao gerar card de play:', e.message)
      }
      // -------------------------

      await conn.sendMessage(from, imageUrl
        ? { image: { url: imageUrl }, caption: cap, mentions: [sender] }
        : { text: cap, mentions: [sender] },
        { quoted: info }
      )
      await reagir(from, '✨️')
    }

    const si = `${API_KIMORI_URL}/api/dl/ytaudio1?url=${encodeURIComponent(mus.url)}&apikey=${APIKEY_KIMORI}`
    const a = await fetch(si)
    const audio = await a.arrayBuffer()

    await conn.sendMessage(from, {
      audio: Buffer.from(audio),
      mimetype: 'audio/mpeg',
      fileName: `${mus.titulo || 'audio'}.mp3`
    }, { quoted: info })
  } catch (e) {
    reply('❌ Erro: ' + e.message)
  }
  break
}

case 'deezer': {
  if (!q.trim()) return reply(`só me fala o nome da música 🎵`)

  try {
    const time2 = moment().tz('America/Sao_Paulo').format('HH:mm:ss')
    let saudacao
    if (time2 >= '00:00:00' && time2 < '05:00:00') saudacao = '𝑩𝒐𝒂 𝒎𝒂𝒅𝒓𝒖𝒈𝒂𝒅𝒂 🌙🌃'
    else if (time2 >= '05:00:00' && time2 < '12:00:00') saudacao = '𝑩𝒐𝒎 𝒅𝒊𝒂 ☀️🌸'
    else if (time2 >= '12:00:00' && time2 < '18:00:00') saudacao = '𝑩𝒐𝒂 𝒕𝒂𝒓𝒅𝒆 🌤️🍃'
    else saudacao = '𝑩𝒐𝒂 𝒏𝒐𝒊𝒕𝒆 🌙💫'

    const res = await fetchJson(`${API_KIMORI_URL}/api/deezer/search?q=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`)
    if (!res.success || !res.results?.length) throw new Error('Nenhum resultado encontrado')

    const track = res.results[0]

    const caption = `✨   • 𝙳𝙴𝙴𝚉𝙴𝚁 𝙿𝙻𝙰𝚈 •   ✨
-
        『 @${sender.split('@')[0]} ♫ 』
-
    ➮ 𝚃í𝚝𝚞𝚕𝚘: 🎵
    ↳ 『 ${track.title || q} 』
-
    ➮ 𝙰𝚛𝚝𝚒𝚜𝚝𝚊: 🎤
    ↳ 『 ${track.artist || 'N/A'} 』
-
    ➮ 𝙰́𝚕𝚋𝚞𝚖: 💿
    ↳ 『 ${track.album || 'N/A'} 』
-
    ➮ 𝙳𝚞𝚛𝚊𝚌̧𝚊̃𝚘: ⏱
    ↳ 『 ${track.duration || 'N/A'} 』
-
    ➮ 𝙴𝚡𝚙𝚕í𝚌𝚒𝚝𝚘: 🔞
    ↳ 『 ${track.explicit ? 'Sim' : 'Não'} 』
-
    ➮ 𝙻𝚒𝚗𝚔: 🔗
    ↳ 『 ${track.link || 'N/A'} 』
-
    ✦ ${saudacao} ✦
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`

    if (track.cover_big) {
      await conn.sendMessage(from, {
        image: { url: track.cover_big },
        caption,
        mentions: [sender]
      }, { quoted: info })
    } else {
      await reply(caption)
    }

    if (!track.preview) throw new Error('Preview indisponível para essa faixa')

    const audioRes = await fetch(track.preview)
    if (!audioRes.ok) throw new Error('Erro ao baixar preview')
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer())

    await conn.sendMessage(from, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: (track.title || 'play2') + '.mp3'
    }, { quoted: info })

  } catch (e) {
    console.error('[play2]', e)
    reply('erro, dá uma olhada na api')
  }
  break
}

case 'ytmp3': {
 if (!q) return reply(`use ${prefix + command} (termo) para a pesquisa`)

 await reagir(from, '✨')
 try {
  const r = await fetch(`${API_KIMORI_URL}/api/search/audio?q=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`)
  if (!r.ok) {
console.log('ytmp3 info erro: status', r.status)
return reply('erro ao buscar o áudio')
  }

  const audioBuffer = await r.arrayBuffer()
  await conn.sendMessage(from, {
audio: Buffer.from(audioBuffer),
mimetype: 'audio/mpeg',
mentions: [sender]
  })
 } catch (e) {
  console.log('ytmp3 info erro:', e?.message)
  return reply('erro, de uma olhada na api')
 }
}
break;

case 'playvid':
case 'playvideo':
case 'playmp4':
case "play_video": {
  if (!q) return reply(`use ${prefix + command} (termo) para a pesquisa`)

  await reagir(from, '✨')

  try {
 const searchUrl = `${API_KIMORI_URL}/api/search/youtube?q=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`
 const res = await fetchJson(searchUrl)

 if (!res.success || !res.data?.length) return reply('nenhum vídeo encontrado para essa pesquisa')

 const info1 = res.data[0]

 const videoUrl = `${API_KIMORI_URL}/api/dl/ytvideo1?url=${encodeURIComponent(info1.url)}&apikey=${APIKEY_KIMORI}`
const r = await fetch(videoUrl)
const buf = Buffer.from(await r.arrayBuffer())

 const videoRes = await fetch(videoUrl)
 if (!videoRes.ok) return reply('erro ao baixar o vídeo da API')

 const videoBuffer = Buffer.from(await videoRes.arrayBuffer())
 if (!videoBuffer || videoBuffer.length < 1000) return reply('vídeo retornou vazio ou corrompido')

 const tmpIn = `/tmp/vid_in_${Date.now()}.mp4`
 const tmpOut = `/tmp/vid_out_${Date.now()}.mp4`
 const fs = require('fs')
 const ffmpeg = require('fluent-ffmpeg')

 fs.writeFileSync(tmpIn, videoBuffer)

 await new Promise((resolve, reject) => {
  ffmpeg(tmpIn)
 .outputOptions([
'-c:v libx264',
'-profile:v baseline',  // <-- perfil mais compatível com WhatsApp
'-level 3.0',
'-c:a aac',
'-b:a 128k',
'-movflags faststart',
'-preset ultrafast', // rápido
'-crf 32'// qualidade menor = arquivo menor e mais leve
 ])
 .output(tmpOut)
 .on('end', resolve)
 .on('error', reject)
 .run()
})

 const finalBuffer = fs.readFileSync(tmpOut)
 fs.unlinkSync(tmpIn)
 fs.unlinkSync(tmpOut)

 await conn.sendMessage(from, {
  video: finalBuffer,
  mimetype: 'video/mp4',
  fileName: info1?.titulo || 'play.mp4',
  jpegThumbnail: await fetch(info1.imagem).then(r => r.arrayBuffer()).then(b => Buffer.from(b))
}, { quoted: info })

  } catch (e) {
 console.log('playvideo erro:', e?.message)
 return reply('erro ao buscar ou processar o vídeo')
  }
  break
}

case 'play_doc':
case 'playdocumento':
case 'pdoc':
case 'playdoc': {
 if (!q) return reply(`use ${prefix + command} (termo) para a pesquisa`)
  data = await fetchJson(`${API_KIMORI_URL}/api/search/youtube?q=${q}&apikey=${APIKEY_KIMORI}`)
 const item = data.data[0]
if (!item) return reply('nenhum resultado.')
 var n_e = "Não encontrado"
 const time2 = moment().tz('America/Sao_Paulo').format('HH:mm:ss')
 let saudacao
 if (time2 >= '00:00:00' && time2 < '05:00:00') saudacao = '𝑩𝒐𝒂 𝒎𝒂𝒅𝒓𝒖𝒈𝒂𝒅𝒂 🌙🌃'
 else if (time2 >= '05:00:00' && time2 < '12:00:00') saudacao = '𝑩𝒐𝒎 𝒅𝒊𝒂 ☀️🌸'
 else if (time2 >= '12:00:00' && time2 < '18:00:00') saudacao = '𝑩𝒐𝒂 𝒕𝒂𝒓𝒅𝒆 🌤️🍃'
 else saudacao = '𝑩𝒐𝒂 𝒏𝒐𝒊𝒕𝒆 🌙💫'
 const caption = Msg_Play
.replace('#user#', sender.split("@")[0])
.replace('#titulo#', item.titulo || q)
.replace('#duracao#', item.tempo || 'N/A')
.replace('#views#', (item.views?.toLocaleString('pt-BR') || 'N/A'))
.replace('#autor#', item.autor || 'N/A')
.replace('#url#', item.url || 'N/A')
.replace('#id#', item.id || 'N/A')
.replace('#saudacao#', saudacao)
conn.sendMessage(from, {image: {url: item.imagem}, caption: caption, mentions: [sender]}, {quoted: info})
conn.sendMessage(from, {document: {url: `${API_KIMORI_URL}/api/dl/ytaudio1?url=${encodeURIComponent(item.url)}&apikey=${APIKEY_KIMORI}` }, mimetype: 'audio/mpeg', fileName: item.titulo || 'play.mp3'}, { quoted: info }).catch(e => {
 return reply('erro, de uma olhada na api');
})
}
break;

case 'lyric':
case 'lyrics':
case 'letras': {
if (!q) return reply(`*Aaaah! 🤭 Use assim:* ${prefix}letras <nome da música> 💖🎶`)

await reply(`*Eitaa! 😆 Estou procurando a letra de* ${q} *pra você!* 💞🎵`)

try {


const { data } = await axios.get(
  `https://lrclib.net/api/search?q=${encodeURIComponent(q)}`
)

if (!data || !data.length) {
  return reply(`*Oops! 😅 Não encontrei nenhuma letra para:* ${q} 💕🎧`)
}

const musica = data[0]

let txt = `
 - *Título:* ${musica.trackName || 'Desconhecida'}

• *Artista:* ${musica.artistName || 'Desconhecido'}

• *Letra:*

${musica.plainLyrics || 'Sem letra disponível.'}`

await conn.sendMessage(from, { text: txt }, { quoted: selo })

} catch (e) {

console.error('[letras] erro:', e)

reply(`*Aaaah! 😵 Ocorreu um erro ao buscar a letra!* 💖⚡`)

}

break
}

case 'suporte':

reply(`*Oieee! 😆💖*\n\n*Caso precise de ajuda entre em contato com o suporte:* 🤭✨\nwa.me/5527992870575`);

break;

case 'gethtml':

if(!q || !isUrl(args[0])) return reply(`*Aaaah! 🤭 Use assim:* ${prefix+command} link do site 💖🌐`)

try {

await replyWithReaction(`*Eitaa! 😆 Estou enviando o HTML no seu privado!* 💞📩`, {
react: {
text: '💖',
key: info.key
}
});

axios.get(args[0], {
headers: {
"user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
}
}).then(async (res) => {

let htmlData = typeof res.data === 'object'
? JSON.stringify(res.data, null, 2)
: res.data

htmlData = htmlData.replace(/ /g, '').replace(/></g, '>\n<').replace(/> </g, '>\n<')

await conn.sendMessage(sender, {
document: Buffer.from(htmlData),
fileName: q+`.html`,
mimetype: 'text/html'
}, {quoted: selo})

}).catch(e => {

console.log(e)

return reply("*Oops! 😅 Não consegui obter o HTML do site!* 💕🌐")

})

} catch (e) {

console.log(e)

reply("*Aaaah! 😵 Ocorreu um erro ao processar o HTML!* 💖⚡")

}

break

case 'test': 
reply('xxxggghxx');
break;
 
 case 'avisos':
 try {
  const response = await fetch('https://mizukibot.netlify.app/aviso.html');
  const avisoText = await response.text();

  await conn.sendMessage(from, {
image: { url: 'https://i.ibb.co/jk04ph0L/89e2bf5692b5.jpg' },
caption: avisoText
  }, { quoted: info });
 } catch (error) {
  await reply('❌ Erro ao verificar os avisos');
  console.error('Update error:', error);
 }
 break;

case "sethorario":
if (!isGroupAdmins) return reply(Res_SoGrupo);
if (!isBotGroupAdmins) return reply(Res_SoAdm);
if (!args[0] || !args[1]) return reply(`*Aaaah! 🤭 Use assim:* ${prefix + command} 22:00 06:00 💖⏰`);

const fecharH = args[0];
const abrirH = args[1];
const pathHorario = `./banco de dados/horário/${from}.json`;

const horarioData = {
groupId: from,
fechar: fecharH,
abrir: abrirH,
ativo: true,
ultimo: "",
};

fs.writeFileSync(pathHorario, JSON.stringify(horarioData, null, 2));

await reply(`*Prontinho! 😊 Horário configurado com sucesso!* 💖⏰\n\n*🔒 Fechar:* ${fecharH}\n*🔓 Abrir:* ${abrirH}`);
break;

case "delhorario": {
if (!isGroupAdmins) return reply(Res_SoGrupo);
if (!isBotGroupAdmins) return reply(Res_SoAdm);

const pathDel = `./banco de dados/horário/${from}.json`;

try {
if (!fs.existsSync(pathDel)) return reply("*Oops! 😅 Não existe nenhum horário configurado nesse grupo!* 💕⏰");

fs.unlinkSync(pathDel);

reply("*Yaaay! 😆 O horário foi removido com sucesso!* 💖✨");

} catch (e) {
console.log(e);
reply("*Aaaah! 😵 Ocorreu um erro ao remover o horário!* 💖⚡");
}
break;
}

case "offhorario": {
if (!isGroupAdmins) return reply(Res_SoGrupo);
if (!isBotGroupAdmins) return reply(Res_SoAdm);

const pathOff = `./banco de dados/horário/${from}.json`;

try {
if (!fs.existsSync(pathOff)) return reply("*Oops! 😅 Não existe nenhum horário configurado!* 💕⏰");

let dataOff = JSON.parse(fs.readFileSync(pathOff));

if (!dataOff.ativo) return reply("*Eitaa! 🤭 O sistema de horários já está desativado!* 💖📴");

dataOff.ativo = false;

fs.writeFileSync(pathOff, JSON.stringify(dataOff, null, 2));

reply("*Prontinho! 😊 Sistema de horários desativado com sucesso!* 💖🔒");

} catch (e) {
console.log(e);
reply("*Aaaah! 😵 Ocorreu um erro ao desativar o sistema!* 💖⚡");
}
break;
}

case "onhorario": {
if (!isGroupAdmins) return reply(Res_SoGrupo);
if (!isBotGroupAdmins) return reply(Res_SoAdm);

const pathOn = `./banco de dados/horário/${from}.json`;

try {
if (!fs.existsSync(pathOn)) return reply("*Oops! 😅 Nenhum horário configurado!\n💖 Use o comando sethorario primeiro!*");

let dataOn = JSON.parse(fs.readFileSync(pathOn));

if (dataOn.ativo) return reply("*Eitaa! 🤭 O sistema de horários já está ativado!* 💖✨");

dataOn.ativo = true;

fs.writeFileSync(pathOn, JSON.stringify(dataOn, null, 2));

reply("*Yaaay! 😆 Sistema de horários ativado novamente!* 💞⏰");

} catch (e) {
console.log(e);
reply("*Aaaah! 😵 Ocorreu um erro ao ativar o sistema!* 💖⚡");
}
break;
}

case "listhorarios": {
if (!isGroupAdmins) return reply(Res_SoGrupo);

const pastaHorarios = `./banco de dados/horário/`;

try {
if (!fs.existsSync(pastaHorarios)) return reply("*Oops! 😅 Nenhum grupo possui horários configurados!* 💕⏰");

let arquivos = fs.readdirSync(pastaHorarios);

if (arquivos.length === 0) return reply("*Oops! 😅 Nenhum grupo possui horários configurados!* 💕📋");

let lista = "*💖 LISTA DE HORÁRIOS CONFIGURADOS 💖*\n\n";

for (let file of arquivos) {
try {
let data = JSON.parse(fs.readFileSync(pastaHorarios + file));

let status = data.ativo ? "😆 Ativado" : "😅 Desativado";

let groupName = "Grupo desconhecido";

try {
let meta = await conn.groupMetadata(data.groupId);
groupName = meta.subject;
} catch {
groupName = data.groupId;
}

lista += `*🌸 ${groupName}*\n`;
lista += `*🔒 Fechar:* ${data.fechar}\n`;
lista += `*🔓 Abrir:* ${data.abrir}\n`;
lista += `*💖 Status:* ${status}\n\n`;

} catch (e) {
console.log("Erro ao ler horário:", e);
}
}

reply(lista.trim());

} catch (e) {
console.log(e);
reply("*Aaaah! 😵 Ocorreu um erro ao listar os horários!* 💖⚡");
}
break;
} 

case 'alugar': {
  try {
 await reagir("🌙");

 const fs = require('fs');

 const media1 = await prepareWAMessageMedia(
{ image: fs.readFileSync('./dono/logo.jpg') },
{ upload: conn.waUploadToServer }
 );

 const media2 = await prepareWAMessageMedia(
{ image: fs.readFileSync('./dono/logo.jpg') },
{ upload: conn.waUploadToServer }
 );

 const media3 = await prepareWAMessageMedia(
{ image: fs.readFileSync('./dono/logo.jpg') },
{ upload: conn.waUploadToServer }
 );

 const ownerNumber = '5527992870575';
 const NomeDoBot = '『 ᴍɪᴢᴜᴋɪ - ʙᴏᴛ 』';

 const cards = [
{
  header: {
 hasMediaAttachment: true,
 imageMessage: media1.imageMessage
  },
  headerType: 'IMAGE',
  body: {
 text: `🩵 *PLANO 1 SEMANA* 🩵\n\n💰 Valor: R$7,00\n⏳ Duração: 7 dias\n\n✨ Benefícios:\n• Bot online 24h\n• Menus liberados\n• Tudo Liberado\n• Ideal para testar`
  },
  footer: { text: NomeDoBot },
  nativeFlowMessage: {
 buttons: [{
name: "cta_url",
buttonParamsJson: JSON.stringify({
  display_text: "Comprar 1 Semana",
  url: `https://wa.me/${ownerNumber}?text=Quero%20alugar%20a%20mizuki%20Bot%20por%201%20semana%20(R$8)%20🩵`,
  merchant_url: `https://wa.me/${ownerNumber}?text=Quero%20alugar%20a%20mizuki%20Bot%20por%201%20semana%20(R$7)%20🩵`
})
 }]
  }
},
{
  header: {
 hasMediaAttachment: true,
 imageMessage: media2.imageMessage
  },
  headerType: 'IMAGE',
  body: {
 text: `🩵 *PLANO 15 DIAS* 🩵\n\n💰 Valor: R$15,00\n⏳ Duração: 15 dias\n\n✨ Benefícios:\n• Bot online 24h\n• Todos os comandos liberados\n• Pode trocar nome e prefixo\n• Suporte prioritário`
  },
  footer: { text: NomeDoBot },
  nativeFlowMessage: {
 buttons: [{
name: "cta_url",
buttonParamsJson: JSON.stringify({
  display_text: "Comprar 15 Dias",
  url: `https://wa.me/${ownerNumber}?text=Quero%20alugar%20a%20mizuki%20Bot%20por%2015%20dias%20(R$15)%20🩵`,
  merchant_url: `https://wa.me/${ownerNumber}?text=Quero%20alugar%20a%20mizuki%20Bot%20por%2015%20dias%20(R$15)%20🩵`
})
 }]
  }
},
{
  header: {
 hasMediaAttachment: true,
 imageMessage: media3.imageMessage
  },
  headerType: 'IMAGE',
  body: {
 text: `🩵 *PLANO 1 MÊS* 🩵\n\n💰 Valor: R$20,00\n⏳ Duração: 30 dias\n\n✨ Benefícios:\n• Bot online 24h\n• Tudo liberado\n• Personalização completa\n• Melhor custo-benefício\n• Suporte total`
  },
  footer: { text: NomeDoBot },
  nativeFlowMessage: {
 buttons: [{
name: "cta_url",
buttonParamsJson: JSON.stringify({
  display_text: "Comprar 1 Mês",
  url: `https://wa.me/${ownerNumber}?text=Quero%20alugar%20a%20mizuki%20Bot%20por%201%20mês%20(R$20)%20🩵`,
  merchant_url: `https://wa.me/${ownerNumber}?text=Quero%20alugar%20a%20mizuki%20Bot%20por%201%20mês%20(R$25)%20🩵`
})
 }]
  }
}
 ];

 await conn.relayMessage(from, {
interactiveMessage: {
  contextInfo: { participant: from },
  body: {
 text: '🌙 *QUER ALUGAR A Mizuki BOT?* 🩵\n\nEscolha um dos planos abaixo:'
  },
  carouselMessage: { cards }
}
 }, {});

  } catch (e) {
 console.log(e);
 await conn.sendMessage(from, {
text: '❌ Erro ao carregar os planos da mizuki Bot.'
 }, { quoted: info });
  }
  break;
}

case 'loja':
case 'lojinha': {
reagir(from, "✨️");
  const txt = `.・。.・゜✭・.・✫・゜・。.

❀ 𝐋𝐎𝐉𝐈𝐍𝐇𝐀 𝐌𝐈𝐙𝐔𝐊𝐈𝐁𝐎𝐓-𝐌𝐃 ❀

• 📦 *𝐀𝐫𝐪𝐮𝐢𝐯𝐨𝐬*

• 🩵 𝐌𝐢𝐳𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃 𝐜𝐫𝐢𝐩𝐭𝐨𝐠𝐫𝐚𝐟𝐚𝐝𝐚
💰 𝐑$𝟐𝟓,𝟎𝟎
-

• 🖤 𝐔𝐦𝐛𝐫𝐞𝐨𝐦 𝐝𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐨𝐠𝐫𝐚𝐟𝐚𝐝𝐨
💰 𝐑$𝟒𝟎,𝟎𝟎
-

✧ 📅 *𝐀𝐋𝐔𝐆𝐔𝐄𝐋 𝐌𝐄𝐍𝐒𝐀𝐋* ✧

• 🩵 𝐌𝐢𝐳𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃 𝐌𝐞𝐧𝐬𝐚𝐥
💰 𝐑$ 𝟐𝟎,𝟎𝟎/𝐦𝐞̂𝐬
-

• 💛 𝐔𝐦𝐛𝐫𝐞𝐨𝐦 𝐌𝐞𝐧𝐬𝐚𝐥
💰 𝐑$ 𝟏𝟓,𝟎𝟎/𝐦𝐞̂𝐬

.・。.・゜✭・.・✫・゜・。.`;

  await conn.sendMessage(from, {
 image: fs.readFileSync('./dono/logo.jpg'),
 caption: txt
  }, { quoted: info });
  break;
}

case 'gerarqr':
case 'toqr':
case 'qr':
case 'qrc': 
case 'qrcode': {
 if (!q) return reply(`use ${prefix + command} "link" para gerar o qrcode`)
 await reagir(from, '✨')
 try {
  let res = await fetch(`${API_KIMORI_URL}/api/qrcode?texto=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = await Buffer.from(arrayBuffer);
  await conn.sendMessage(from, { image: buffer, caption: `QR Code para: ${q}` });
 } catch (e) {
  console.log('qrcode info erro:', e?.message);
  return reply('erro, de uma olhada na api');
 }
 break;
}

case 'rvisu':
case 'open':
case 'revelar': {
  try {
 await reagir(from, "🌸");

 const msg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
 const img = msg?.imageMessage || info.message?.imageMessage || msg?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || msg?.viewOnceMessage?.message?.imageMessage;

 const vid = msg?.videoMessage || info.message?.videoMessage || msg?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || msg?.viewOnceMessage?.message?.videoMessage;

 const aud = msg?.audioMessage || info.message?.audioMessage || msg?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessage?.message?.audioMessage || msg?.viewOnceMessage?.message?.audioMessage;

 if (vid) {
vid.viewOnce = false;
vid.video = { url: vid.url };
conn.sendMessage(from, vid, { quoted: info });
await reagir(from, "✨");
 } else if (img) {
img.viewOnce = false;
img.image = { url: img.url };
conn.sendMessage(from, img, { quoted: info });
await reagir(from, "🌸");
 } else if (aud) {
aud.viewOnce = false;
aud.audio = { url: aud.url };
conn.sendMessage(from, aud, { quoted: info });
await reagir(from, "💙");
 } else {
return reply("🍬 Oops! Você precisa *marcar* uma mídia de *visualização única* (imagem, vídeo ou áudio) para que eu possa revelar! 💙✨");
 }

  } catch (e) {
 console.error(e);
 await reply("🌧️ Awn... Algo deu errado, tenta de novo mais tarde, tá bom? 🧸💔");
  }
  break;
}

case 'ttp':
try {
  reply(Res_Aguarde);

  const cores = ["f702ff", "ff0202", "00ff2e", "efff00", "00ecff", "3100ff", "ffb400", "ff00b0", "00ff95", "efff00"];
  const fontes = ["Days%20One", "Domine", "Exo", "Fredoka%20One", "Gentium%20Basic", "Gloria%20Hallelujah", "Great%20Vibes", "Orbitron", "PT%20Serif", "Pacifico"];
  
  const cor = cores[Math.floor(Math.random() * cores.length)];
  const fonte = fontes[Math.floor(Math.random() * fontes.length)];

  const url = `https://huratera.sirv.com/PicsArt_08-01-10.00.42.png?profile=Example-Text&text.0.text=${encodeURIComponent(q)}&text.0.outline.color=000000&text.0.outline.blur=0&text.0.outline.opacity=55&text.0.color=${cor}&text.0.font.family=${fonte}&text.0.background.color=ff0000`;

  const pack = `↧ [🖊️] Texto convertido por:\n• ↳ ${pushname}\n—\n↧ [📍] MizukiBot-MD`;

  const sticker = await sendImageAsSticker(conn, from, url, info, { packname: pack });
  await DLT_FL(sticker);

} catch (e) {
  console.error(e);
  reply("❌ Erro ao gerar figurinha de texto!");
}
break;

case 'qc':
try {
  reply(Res_Aguarde);

  console.log('QC iniciado, sender:', sender);

  let ppimg = '';
const jidFoto = sender.split('@')[0] + '@s.whatsapp.net';

  
try {
  ppimg = await Promise.race([
 conn.profilePictureUrl(jidFoto, 'image'),
 new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
  ]);
} catch(e) {
  ppimg = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg';
}

  const json = {
 type: "quote",
 format: "png",
 backgroundColor: "#FFFFFF",
 width: 512,
 height: 768,
 scale: 2,
 messages: [{
entities: [],
avatar: true,
from: {
  id: 1,
  name: pushname,
  photo: { url: ppimg }
},
text: q,
replyMessage: {}
 }]
  };


  const res = await axios.post('https://bot.lyo.su/quote/generate', json, {
 headers: { 'Content-Type': 'application/json' }
  });


  const buffer = Buffer.from(res.data.result.image, 'base64');
  const pack = `↧ [💬] Quote criado por:\n• ↳ ${pushname}\n—\n↧ [📍] MizukiBot-MD`;

  const sticker = await sendImageAsSticker(conn, from, buffer, info, { packname: pack });
  await DLT_FL(sticker);

} catch (e) {
  console.error('ERRO QC COMPLETO:', e);
  reply("❌ Erro ao gerar figurinha estilo quote!");
}
break;

case 'gerarlink':
case 'imgpralink':
case 'videopralink':
case 'audiopralink':
case 'stickerpralink': {
  const FormData = require("form-data");
  const { spawn } = require("child_process");
  const fs = require("fs");

  const UPLOAD_API = "http://project.darkhostinger.com.br:2027/api/upload";

  const quoted = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  const imgMsg  = quoted?.imageMessage || info.message?.imageMessage;
  const rawVideo= quoted?.videoMessage || info.message?.videoMessage;
  const audioMsg= quoted?.audioMessage || info.message?.audioMessage;
  const stickerMsg = quoted?.stickerMessage || info.message?.stickerMessage;

  const isGif  = !!rawVideo?.gifPlayback;
  const gifMsg = isGif ? rawVideo : null;
  const videoMsg = isGif ? null : rawVideo;

  const midia = imgMsg || videoMsg || gifMsg || audioMsg || stickerMsg;
  if (!midia) return reply("🌫️ | Envie ou marque uma *imagem*, *vídeo*, *GIF*, *áudio* ou *figurinha*.");

  await reagir("⏳");

  // Envia pra sua própria API e extrai o link da resposta
  const uploadFile = async (buffer, ext) => {
    const mime = {
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
      gif: "image/gif", mp4: "video/mp4", mkv: "video/x-matroska",
      ogg: "audio/ogg", mp3: "audio/mpeg", opus: "audio/opus"
    }[ext] || "application/octet-stream";

    const filename = `mizuki_${Date.now()}.${ext}`;
    const form = new FormData();
    form.append("file", buffer, { filename, contentType: mime });

    const { data } = await axios.post(UPLOAD_API, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000
    });

    // Se a API já devolver a string do link direto
    if (typeof data === "string" && data.startsWith("http")) return data.trim();

    // Procura o link nas chaves mais comuns de retorno JSON
    const link =
      data?.url || data?.link || data?.fileUrl || data?.file_url ||
      data?.result?.url || data?.result?.link ||
      data?.data?.url || data?.data?.link || data?.data?.fileUrl;

    if (!link) throw new Error("Resposta da API sem link: " + JSON.stringify(data).slice(0, 200));
    return link.trim();
  };

  const ffmpegRun = (args, timeout = 25000) => new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", args);
    ff.on("close", code => code === 0 ? resolve() : reject(new Error("ffmpeg code " + code)));
    ff.on("error", reject);
    setTimeout(() => { ff.kill(); reject(new Error("ffmpeg timeout")); }, timeout);
  });

  try {
    let url, tipoLabel, emojiTipo;

    if (imgMsg || stickerMsg) {
      const isSticker = !!stickerMsg;
      const buffer = await getFileBuffer(isSticker ? stickerMsg : imgMsg, isSticker ? "sticker" : "image");
      const ext = isSticker ? "webp" : (imgMsg.mimetype?.includes("png") ? "png" : "jpg");
      url = await uploadFile(buffer, ext);
      tipoLabel = isSticker ? "𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰" : "𝙸𝙼𝙰𝙶𝙴𝙼";
      emojiTipo  = isSticker ? "🎴" : "🖼️";

    } else if (gifMsg) {
      const ts = Date.now();
      const tmpIn = `/tmp/mz_${ts}.mp4`, tmpOut = `/tmp/mz_${ts}.gif`;
      fs.writeFileSync(tmpIn, await getFileBuffer(gifMsg, "video"));
      await ffmpegRun(["-y", "-i", tmpIn, "-vf", "fps=10,scale=320:-1:flags=lanczos", "-loop", "0", tmpOut]);
      const gifBuf = fs.readFileSync(tmpOut);
      try { fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); } catch {}
      url = await uploadFile(gifBuf, "gif");
      tipoLabel = "𝙶𝙸𝙵"; emojiTipo = "🎞️";

    } else if (videoMsg) {
      const ext = videoMsg.mimetype?.includes("mp4") ? "mp4" : "mkv";
      url = await uploadFile(await getFileBuffer(videoMsg, "video"), ext);
      tipoLabel = "𝚅𝙸𝙳𝙴𝙾"; emojiTipo = "🎬";

    } else if (audioMsg) {
      const ext = audioMsg.mimetype?.includes("ogg") ? "ogg" : audioMsg.mimetype?.includes("opus") ? "opus" : "mp3";
      url = await uploadFile(await getFileBuffer(audioMsg, "audio"), ext);
      tipoLabel = "Á𝚄𝙳𝙸𝙾"; emojiTipo = "🎵";
    }

    await reagir(emojiTipo);
    await reply(`${url}\n\n> MizukiBot-MD`);

  } catch (e) {
    console.log("[gerarlink]", e);
    reply("❌ Não consegui gerar o link.");
  }
}
break;

case 'aptoide':
if (args.length == 0) return reply(`🔎 Por favor, forneça o nome do aplicativo que deseja buscar. *Exemplo:* ${prefix + command} WhatsApp.`)
try {//By: 𖧄 SattzModz Domina 𖧄
await reagir(from, '⌛')
const aptoide = await axios.get(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(q)}&trusted=true`)
if (aptoide.data.datalist.total == 0) return reply(`🚫 Desculpe, não encontrei nenhum resultado para *${q}*. Tente outro nome ou verifique a ortografia.`)
const phAptoide = await axios.get(aptoide.data.datalist.list[0].graphic, { responseType: 'arraybuffer' })
const lnDown = await axios.get(`https://tinyurl.com/api-create.php?url=${aptoide.data.datalist.list[0].file.path_alt}`)
const appName = aptoide.data.datalist.list[0].name
const appSizeMB = (aptoide.data.datalist.list[0].size / 1048576).toFixed(1)
const appFileUrl = aptoide.data.datalist.list[0].file.path
const appVersion = aptoide.data.datalist.list[0].file.vername
conn.sendMessage(from, {image: Buffer.from(phAptoide.data, 'binary'), caption: `📱 *Nome do App*: _${appName}_\n` +
`📦 *Pacote*: _${aptoide.data.datalist.list[0].package}_\n` +
`🗃️ *Tamanho*: _${appSizeMB} MB_\n` +
`🔖 *Versão*: _${appVersion}_\n\n` +
`🔗 *Não baixou? Clique no link abaixo e realize o processo*:\n↳ ${lnDown.data}\n\n` +
`⚡ *Prepare-se!* O download do APK está sendo feito e você receberá o arquivo logo em seguida!`, contextInfo: {mentionedJid: [from], participant: from, quotedMessage: {conversation: `Aqui está o que você pediu, ${from}!`}, externalAdReply: {title: `🔍 App: ${appName}`, thumbnail: Buffer.from(phAptoide.data, 'binary'), mediaType: 1, mediaUrl: lnDown.data, sourceUrl: lnDown.data}}}, { quoted: info })
conn.sendMessage(from, {document: {url: appFileUrl}, caption: `✅ *Download Completo!*\n\n🔧 Para instalar o aplicativo, siga estes passos:\n1. Abra o arquivo e permita instalações de fontes desconhecidas se solicitado.\n2. Siga as instruções na tela para concluir a instalação.\n\n*🔗 Clique aqui para mais detalhes ou baixar novamente*:\n${lnDown.data}`, mimetype: "application/vnd.android.package-archive", fileName: `${appName}.apk`, contextInfo: {mentionedJid: [from], participant: from, quotedMessage: {conversation: `Pronto, ${pushname}! Seu APK está aqui!`}, externalAdReply: {title: `📱 App: ${appName}`, thumbnail: Buffer.from(phAptoide.data, 'binary'), mediaType: 1, mediaUrl: lnDown.data, sourceUrl: lnDown.data}}}, { quoted: info })
} catch (error) {
console.log(error)
return reply('⚠️ Ocorreu um erro ao buscar o aplicativo. Tente novamente mais tarde.')
}
break

case 'ping': {
  const inicio = Date.now()
  const os = require('os')
  const axios = require('axios')
  await reagir(from, '✨️')

  const uptime = process.uptime()

  const agora = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const hora = agora.split(', ')[1] || agora

  let tempo
  const [h] = hora.split(':').map(Number)

  if (h >= 0 && h < 5) tempo = 'Boa madrugada'
  else if (h >= 5 && h < 12) tempo = 'Bom dia'
  else if (h >= 12 && h < 18) tempo = 'Boa tarde'
  else tempo = 'Boa noite'

  function formatarUptime(seg) {
    const d = Math.floor(seg / 86400).toString().padStart(2, '0')
    const h = Math.floor((seg % 86400) / 3600).toString().padStart(2, '0')
    const m = Math.floor((seg % 3600) / 60).toString().padStart(2, '0')
    const s = Math.floor(seg % 60).toString().padStart(2, '0')
    return `${d}d ${h}h ${m}m ${s}s`
  }

  function getCpuTimes() {
    const cpus = os.cpus()
    let idle = 0, total = 0
    cpus.forEach(cpu => {
      for (const type in cpu.times) total += cpu.times[type]
      idle += cpu.times.idle
    })
    return { idle, total }
  }

  async function calcularCpuPercent() {
    const ini = getCpuTimes()
    await new Promise(r => setTimeout(r, 300))
    const fim = getCpuTimes()
    const idleDiff = fim.idle - ini.idle
    const totalDiff = fim.total - ini.total
    return (100 - (100 * idleDiff / totalDiff)).toFixed(1)
  }

  const botCode = fs.readFileSync('./index.js', 'utf8')
  const cases = botCode.match(/case\s+["'`]([^"'`]+)["'`]/g) || []
  const totalCommands = cases.length
  const statusBot = isBotoff ? "Offline" : "Online"

  // ---- ping real: mede o tempo de resposta do WhatsApp nessa chamada ----
  const pingStart = Date.now()
  var getGroups
  try {
    getGroups = await conn.groupFetchAllParticipating()
  } catch (e) {
    getGroups = {}
  }
  const pingReal = Date.now() - pingStart
  // -------------------------------------------------------------------

  var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
  var ingfoo = groups.map(v => v)
  ingfoo.sort((a, b) => (a[0] < b.length))

  const usoMem = (os.totalmem() - os.freemem()) / 1024 / 1024 / 1024
  const totalMem = os.totalmem() / 1024 / 1024 / 1024
  const sistema = os.type()
  const nodejsVer = process.version

  const usoCpu = await calcularCpuPercent()

  const ramUsadaMB = Math.round(usoMem * 1024)

  // ---- card canva ping2 ----
  let imageUrl = `https://i.ibb.co/ns7YrMvs/e9d51d8e999e.jpg` // fallback

  try {
    const params = new URLSearchParams({
      ping: pingReal.toString(),
      uptime: formatarUptime(uptime),
      ram: `${ramUsadaMB} MB`,
      cpu: `${usoCpu}%`
    })

    const apiRes = await axios.get(
      `http://project.darkhostinger.com.br:2027/api/canvas/ping2?${params.toString()}`,
      { timeout: 15000 }
    )

    if (apiRes.data?.status && apiRes.data?.result?.url) {
      imageUrl = apiRes.data.result.url
    }
  } catch (e) {
    console.log('Erro ao gerar card de ping:', e.message)
  }
  // ---------------------------

  const caption = Msg_Ping
    .replace('#user#', sender.split("@")[0])
    .replace('#tempo#', tempo)
    .replace('#latencia#', pingReal.toString())
    .replace('#sistema#', sistema)
    .replace('#node#', nodejsVer)
    .replace('#ramuso#', usoMem.toFixed(2))
    .replace('#ramtotal#', totalMem.toFixed(2))
    .replace('#cpu#', `${usoCpu}%`)
    .replace('#uptime#', formatarUptime(uptime))
    .replace('#nickdono#', NickDono)
    .replace('#nomebot#', NomeDoBot)
    .replace('#tcmd#', totalCommands)
    .replace('#grupos#', ingfoo.length)
    .replace('#atraso#', pingReal.toString())

  conn.sendMessage(from, {
    image: { url: imageUrl },
    caption: caption,
    contextInfo: {
      mentionedJid: [sender]
    }
  }, { quoted: selo })
}
break

case 'tiktok': {
if (!args[0]) return await conn.sendMessage(from, { text: '*Aaaah! 🤭 Me fala o que você quer pesquisar no TikTok!* 💖📱' }, { quoted: info });

const query = args.join(' ');

await conn.sendMessage(from, { text: `*Eitaa! 😆 Estou procurando vídeos de:* ${query} 💞✨` }, { quoted: info });

try {

const { data } = await axios({
method: 'POST',
url: 'https://www.tikwm.com/api/feed/search',
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
'Cookie': 'current_language=pt-BR',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
},
data: qs.stringify({ keywords: query, count: 10 })
});

if (data.data && data.data.videos && data.data.videos.length > 0) {

const video = data.data.videos[0];

const videoBuffer = await axios.get(video.play, { responseType: 'arraybuffer' });

const videoInfo = Msg_TikTok
  .replace('#titulo#', video.title)
  .replace('#autor#', video.author.nickname)
  .replace('#duracao#', video.duration)
  .replace('#curtidas#', video.digg_count)
  .replace('#comentarios#', video.comment_count)
  .replace('#compartilhamentos#', video.share_count)
  .replace('#visualizacoes#', video.play_count)

await conn.sendMessage(from, { video: videoBuffer.data, caption: videoInfo }, { quoted: info });

} else {

await conn.sendMessage(from, { text: '*Oops! 😅 Não encontrei nenhum vídeo com esse nome!* 💕📱' }, { quoted: info });

}

} catch (err) {

console.error('*ERRO NA API TikTokSearch*', err);

await conn.sendMessage(from, { text: '*Aaaah! 😵 Ocorreu um erro ao buscar os vídeos!* 💖⚡' }, { quoted: info });

}

}

break;

case 'tiktok_audio':
try {
if(!q.includes("tiktok")) return reply(`*Aaaah! 🤭 Use assim:* ${prefix+command} link do TikTok 💖🎵`)
reply("ȷᥲ ᥱs𝗍᥆ᥙ ᥱ᥊𝗍rᥲіᥒძ᥆ ᥆ ᥲᥙძі᥆ ⍴ᥲrᥲ ᥎᥆ᥴᥱ̂ ᥲm᥆r ✨");
ABC = await fetchJson(`${API_KIMORI_URL}/api/download/tiktok?url=${q}&apikey=${APIKEY_KIMORI}`)
if(!ABC.success) return reply("*Oops! 😅 Não consegui extrair o áudio do TikTok!* 💕🎵");
conn.sendMessage(from, {
audio: {url: ABC.data.musica_url},
mimetype: "audio/mpeg"
}, {quoted: info}).catch(e => {
console.log(e)
return reply("*Oops! 😅 Não consegui extrair o áudio do TikTok!* 💕🎵")
})
} catch (e) {
console.log(e)
return reply("*Aaaah! 😵 Ocorreu um erro ao processar o áudio!* 💖⚡")
}
break;

case 'tiktok_video':
case 'tiktokdl':
case 'tiktok_dl':
case 'tiktok_img': {
 if (!q) return reply(`Use assim: ${prefix+command} link do TikTok`)

 try {
  const resolved = await fetch(q, { redirect: 'follow' })
  const finalUrl = resolved.url

  const apiResp = await fetch('https://www.tikwm.com/api/', {
method: 'POST',
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
body: `url=${encodeURIComponent(finalUrl)}&hd=1`
  })

  const json = await apiResp.json()
  const data = json?.data
  if (!data) throw new Error('post não encontrado')

  if (data?.images?.length > 0) {
const total = data.images.length
const cards = []

for (let i = 0; i < total; i++) {
 const media = await prepareWAMessageMedia(
  { image: { url: data.images[i] } },
  { upload: conn.waUploadToServer }
 )

 cards.push({
  header: {
hasMediaAttachment: true,
imageMessage: media.imageMessage
  },
  headerType: 'IMAGE',
  body: { text: `${i + 1}/${total}` },
  footer: { text: '' },
  nativeFlowMessage: { buttons: [] }
 })
}

await conn.relayMessage(from, {
 interactiveMessage: {
  contextInfo: { participant: from },
  body: { text: '' },
  carouselMessage: { cards }
 }
}, {})

  } else {
const videoUrl = data?.hdplay || data?.play
if (!videoUrl) throw new Error('sem vídeo')
await conn.sendMessage(from, { video: { url: videoUrl }, mimetype: 'video/mp4' }, { quoted: info })
  }

 } catch (err) {
  console.error('[tiktok_video]', err)
  reply('Não consegui baixar. Tente novamente.')
 }

 break
}

case 'face_audio':
try {
  if (!q.includes("facebook") && !q.includes("fb.watch")) {
 return reply(`🎵 Exemplo: ${prefix + command} link do Facebook\n\n📝 Cole o link do vídeo do Facebook para extrair apenas o áudio.`)
  }

  const API_URL = `${API_KIMORI_URL}/api/download/facebook?url=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`
  const response = await fetch(API_URL)

  if (!response.ok) throw new Error(`Erro na API: ${response.status}`)

  const result = await response.json()

  if (!result.success || !result.data?.video) {
 throw new Error("Nenhum áudio disponível.")
  }

  await conn.sendMessage(from, {
 audio: { url: result.data.video },
 mimetype: "audio/mpeg",
 ptt: false
  }, { quoted: info })

} catch (e) {
  console.error("[FB Audio] Erro:", e.message)
  return reply("❌ Erro ao extrair áudio do Facebook.")
}
break

case 'spotify': {
if (!body.slice(body.indexOf(' ') + 1).trim()) return reply(`*Aaaah! 🤭 Use assim:* ${prefix}spotify <nome da música> 💖🎵`);

let query = body.slice(body.indexOf(' ') + 1).trim();

await reply(`*Eitaa! 😆 Estou procurando a música* ${query} *pra você!* 💞🎶`);

try {

// 1. Busca a música
let searchRes = await fetch(`https://zero-two-apis.com.br/api/spotify/search?q=${encodeURIComponent(query)}&apikey=${API_KEY_ZERO}`);
let searchData = await searchRes.json();

if (!searchData.status || !searchData.resultado?.length) {
return reply(`*Oops! 😅 Não encontrei nenhuma música com esse nome!* 💕🎧`);
}

// 2. Pega a URL do primeiro resultado
let musica = searchData.resultado[0];
let trackUrl = musica.url;
let nome = musica.name || musica.nome || 'Sem nome';
let artista = musica.trackArtist || 'Desconhecido';

await reply(Msg_SpotifyEncontrado
  .replace('#nome#', nome)
  .replace('#artista#', artista)
)

// 3. Baixa pelo link do track
let dlRes = await fetch(`https://zero-two-apis.com.br/api/dl/spotify?url=${encodeURIComponent(trackUrl)}&apikey=${API_KEY_ZERO}`);
let dlData = await dlRes.json();

if (!dlData.status || !dlData.resultado?.link) {
return reply(`*Aaaah! 😵 Não consegui baixar essa música, tenta novamente!* 💖⚡`);
}

let { titulo, artista: art, link, metadata } = dlData.resultado;

await client.sendMessage(from, {
audio: { url: link },
mimetype: 'audio/mpeg',
fileName: `${titulo} - ${art}.mp3`,
ptt: false
}, { quoted: info });

await reply(Msg_SpotifyEnviado
  .replace('#titulo#', titulo)
  .replace('#artista#', art)
  .replace('#duracao#', metadata.duration)
)

} catch (e) {

console.error('[spotify] erro:', e);

return reply(`*Oops! 😅 Ocorreu um erro ao buscar a música!* 💕🎶`);

}

break;
}

case 'ytvideo':
case 'youtube':
case 'ytv': {

if (!body.slice(body.indexOf(' ') + 1).trim()) return reply(`*Aaaah! 🤭 Use assim:* ${prefix}ytv <link do youtube> 💖📹`);

let url = body.slice(body.indexOf(' ') + 1).trim();

if (!url.includes('youtu')) return reply(`*Oops! 😅 Me manda um link válido do YouTube!* 💕📺`);

await reply(`*Eitaa! 😆 Estou baixando o vídeo pra você!* 💞`);

try {

let dlUrl = `${API_KIMORI_URL}/api/dl/ytvideo1?url=${encodeURIComponent(url)}&apikey=${APIKEY_KIMORI}`;

await conn.sendMessage(from, {
video: { url: dlUrl },
mimetype: 'video/mp4',
caption: `*Prontinho! 😊 Vídeo baixado com sucesso!* 💖`
}, { quoted: info });

} catch (e) {

console.error('[ytv] erro:', e);

return reply(`*Aaaah! 😵 Ocorreu um erro ao baixar o vídeo!* 💖⚡`);

}

break;
}

case 'yt_stalker':
case 'ytstalk': {
  if (!args[0]) return reply(`📺 *YT Stalk*\n\nUse: *${prefix}ytstalk @handle*\nExemplo: *${prefix}ytstalk @Otaku.mp4*`)

  await reagir(from, '✨️')

  let username = args[0].replace(/^@/, '')

  let res
  try {
    let r = await fetch(`https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(username)}`)
    res = await r.json()
  } catch {
    return reply('❌ Erro ao conectar com a API. Tente novamente.')
  }

  if (!res?.status || !res?.data?.channel) return reply('❌ Canal não encontrado ou inválido.')

  let { channel, latest_videos } = res.data
let videoDestaque = latest_videos?.[0]

let limparContagem = (txt) => txt ? txt.replace(/subscribers?|videos?/gi, '').trim() : 'N/A'

let extras = (channel.description ? `*🌸 Descrição:*\n${channel.description}\n` : '')
  + (videoDestaque?.title ? ` 📌 ${videoDestaque.title}\n 👁️ ${videoDestaque.viewCount || 'N/A'}\n 🔗 ${videoDestaque.videoUrl}\n\n` : '')

let txt = Msg_YtStalk
  .replace('#nome#', channel.name || channel.username || username)
  .replace('#handle#', channel.username || username)
  .replace('#inscritos#', limparContagem(channel.subscriberCount))
  .replace('#videos#', limparContagem(channel.videoCount))
  .replace('#pushname#', pushname)

  let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }

  let urls = [channel.avatarUrl, videoDestaque?.thumbnail].filter(Boolean)
  let enviou = false

  for (let url of urls) {
    try {
      let resp = await fetch(url, { headers })
      if (!resp.ok) continue
      let arrayBuf = await resp.arrayBuffer()
      let imgBuffer = Buffer.from(arrayBuf)

      await conn.sendMessage(from, {
        image: imgBuffer,
        caption: txt,
        mentions: [sender]
      }, { quoted: info })

      enviou = true
      break
    } catch (e) {
      console.log('ytstalk img falhou:', url, e?.message)
      continue
    }
  }

  if (!enviou) reply(txt)

  break
}

case 'yt_audio':
case 'youtube_audio':

try {
if (!q) return reply(`*Aaaah! 🤭 Use assim:* ${prefix+command} link do TikTok 💖🎵`)

reply("*Eitaa! 😆 Estou extraindo o áudio pra você!* 💞🎶");

conn.sendMessage(from, {
audio: {url: `${API_KIMORI_URL}/api/ytdl?url=${q}&type=audio&apikey=${APIKEY_KIMORI}`},
mimetype: "audio/mpeg"
}, {quoted: info}).catch(e => {

console.log(e)

return reply("*Oops! 😅 Não consegui extrair o áudio do TikTok!* 💕🎵")

})

} catch (e) {

console.log(e)

return reply("*Aaaah! 😵 Ocorreu um erro ao processar o áudio!* 💖⚡")

}

break;

case 'tiktok_stalker': {
  if (!args[0]) return reply(`• ✨️ *TikTok Stalker*\n\nUse: *${prefix}tiktok_stalker @usuario*\nExemplo: *${prefix}tiktok_stalker @charlidamelio*`)

  await reagir(from, '✨️')

  let username = args[0].replace('@', '').trim()

  let res
  try {
 let r = await fetch(`https://www.tikwm.com/api/user/info?unique_id=${encodeURIComponent(username)}`, {
headers: {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
 })
 res = await r.json()
  } catch {
 return reply(Res_ErroCmd)
  }

  if (res?.code !== 0 || !res?.data) return reply('❌ Usuário não encontrado ou inválido.')

  let u = res.data.user
  let s = res.data.stats

  let verificado = u.verified ? '✅' : '❌'
  let privado = u.privateAccount ? '✅️' : '❌️'

  // Formata números grandes
  let fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n)

let bio = u.signature ? `${u.signature}` : ''

let txt = Msg_TikTokStalker
  .replace('#nome#', u.nickname)
  .replace('#usuario#', u.uniqueId)
  .replace('#id#', u.id)
  .replace('#verificado#', verificado)
  .replace('#privado#', privado)
  .replace('#bio#', bio)
  .replace('#curtidas#', fmt(s.heartCount))
  .replace('#seguidores#', fmt(s.followerCount))
  .replace('#seguindo#', fmt(s.followingCount))
  .replace('#videos#', fmt(s.videoCount))
  .replace('#pushname#', pushname)

  // Avatar do TikTok
  let avatarUrl = u.avatarLarger || u.avatarMedium || u.avatarThumb

  if (avatarUrl) {
 try {
let resp = await fetch(avatarUrl, {
  headers: {
 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
 'Referer': 'https://www.tiktok.com/'
  }
})
if (resp.ok) {
  let arrayBuf = await resp.arrayBuffer()
  let imgBuffer = Buffer.from(arrayBuf)
  await conn.sendMessage(from, {
 image: imgBuffer,
 caption: txt,
 mentions: [sender]
  }, { quoted: info })
  break
}
 } catch (e) {
console.log('tiktok_stalker img erro:', e?.message)
 }
  }

  reply(txt)
  break
}

case 'infoanime':
case 'animeinfo': {
  if (!q) return reply(`Use: ${prefix + command} <nome do anime>`)

  await reagir('✨️')

  const dados = await fetchJson(`${API_KIMORI_URL}/api/search/anime2?q=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`).catch(() => null)

  if (!dados?.success || !dados?.resultados?.length) return reply('*😿 Nenhum anime encontrado.*')

  const a = dados.resultados[0]

  const texto = Msg_AnimeInfo
 .replace('#titulo#', a.titulo)
 .replace('#nota#', a.nota || 'N/A')
 .replace('#episodios#', a.episodios ?? 'N/A')
 .replace('#link#', a.link)
 .replace('#descricao#', a.descricao)

  const imgBuffer = a.imagem ? await getBuffer(a.imagem).catch(() => null) : null

  if (imgBuffer) {
 await conn.sendMessage(from, { image: imgBuffer, caption: texto }, { quoted: info })
  } else {
 await reply(texto)
  }

  break
}

case 'brasileirao': {
  await reagir(from, '⚽')

  const res = await fetch(`${API_KIMORI_URL}/api/brasileirao/tabela?apikey=${APIKEY_KIMORI}`)
 .then(r => r.json())
 .catch(() => null)

  if (!res?.tabela?.length) return reply('❌ Erro ao buscar a tabela do Brasileirão.')

  const medalhas = ['🥇', '🥈', '🥉']
  const top3 = res.tabela.slice(0, 3)

  const blocos = top3.map((t, i) => Msg_BrasileiraoBloco
 .replace('#medalha#', medalhas[i])
 .replace('#posicao#', t.posicao)
 .replace('#time#', t.time)
 .replace('#pontos#', t.pontos)
 .replace('#aproveitamento#', t.aproveitamento)
 .replace('#jogos#', t.jogos)
 .replace('#vitorias#', t.vitorias)
 .replace('#empates#', t.empates)
 .replace('#derrotas#', t.derrotas)
 .replace('#gols_pro#', t.gols_pro)
 .replace('#gols_contra#', t.gols_contra)
 .replace('#saldo#', `${t.saldo_gols > 0 ? '+' : ''}${t.saldo_gols}`)
 .replace('#amarelos#', t.cartoes_amarelos)
 .replace('#vermelhos#', t.cartoes_vermelhos)
  ).join('\n-\n━━━━━━━━━━━━━━━━━━━━\n-\n')

  const texto = Msg_BrasileiraoHeader.replace('#blocos#', blocos)

  await reply(texto)
  break
}

case 'playstore': {
  if (!q) return reply(`Use: ${prefix + command} <nome do app>`)

  await reagir('✨')

  let txt
  try {
 let r = await fetch(`${API_KIMORI_URL}/api/v2/search/playstore?q=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`)
 let res = await r.json()

 let a = res.resultado[0]

txt = Msg_PlayStore
  .replace('#nome#', a.nome)
  .replace('#desenvolvedor#', a.desenvolvedor)
  .replace('#estrelas#', a.estrelas)
  .replace('#link#', a.link)

 await conn.sendMessage(from, { caption: txt, image: { url: a.imagem }, mentions: [sender] }, { quoted: info })
  } catch (e) {
 if (txt) reply(txt)
 else reply(Res_ErroCmd);
  }

  break
}


case 'g1':
 case 'g1news': {
  await reagir(from, '✨')
let res
try {
 let r = await fetch(`${API_KIMORI_URL}/api/noticias/g1?apikey=${APIKEY_KIMORI}`);
 res = await r.json()
} catch (e) {
 console.log('g1 info erro:', e?.message)
 return reply('erro, de uma olhada na api')
}

let resultado = res.resultado[0]
let noticia = resultado.noticia || 'Sem descrição'
let link = resultado.link || 'Sem link'
let imagem = resultado.imagem || null
let postado = resultado.postado || 'Sem data de postagem'
  // G1
let txt = `✨• 𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚊 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊 』 ↴
-
 ➮ 𝙵𝚘𝚗𝚝𝚎: 📰
 ↳ 『 G1 』
-
 ➮ 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊: 📃
 ↳ 『 ${noticia} 』
-
 ➮ 𝙿𝚘𝚜𝚝𝚊𝚍𝚘 𝚎𝚖: 📅
 ↳ 『 ${postado} 』
-
 ➮ 𝙻𝚒𝚗𝚔: 📎
 ↳ 『 ${link} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`

if (!imagem) {
await conn.sendMessage(from, {
 caption: txt,
 image: { url: imagem },
 mentions: [sender]
})
} else { 
 await reply(txt)
  }
  break;
 }
 
 case 'cnn':
 case 'cnnb':
  case 'cnnbrasil':
case 'cnn_brasil': {
await reagir(from, '✨')

let res
try {
let r = await fetch(`${API_KIMORI_URL}/api/noticias/cnn?apikey=${APIKEY_KIMORI}`);
res = await r.json()
} catch (e) {
console.log('cnn info erro:', e?.message)
return reply('erro, de uma olhada na api')
}
let resultado = res.resultado[0]
let noticia = resultado.noticia || 'Sem descrição'
let link = resultado.link || 'Sem link'
let imagem = resultado.imagem || null
let postado = resultado.postado || 'Sem data de postagem'
// CNN Brasil
let txt = `✨• 𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚊 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊 』 ↴
-
 ➮ 𝙵𝚘𝚗𝚝𝚎: 📰
 ↳ 『 CNN Brasil 』
-
 ➮ 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊: 📃
 ↳ 『 ${noticia} 』
-
 ➮ 𝙿𝚘𝚜𝚝𝚊𝚍𝚘 𝚎𝚖: 📅
 ↳ 『 ${postado} 』
-
 ➮ 𝙻𝚒𝚗𝚔: 📎
 ↳ 『 ${link} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`
if (imagem) {
await conn.sendMessage(from, {
caption: txt,
image: { url: imagem },
mentions: [sender]
})
} else {
await reply(txt)
}
break;
}

case 'estadao': {
 await reagir(from, '✨')
 let res
 try {
  let r = await fetch(`${API_KIMORI_URL}/api/noticias/estadao?apikey=${APIKEY_KIMORI}`);
  res = await r.json()
 } catch (e) {
  console.log('estadao info erro:', e?.message)
  return reply('erro, de uma olhada na api')
 }
 let resultado = res.resultado[0]
 let noticia = resultado.noticia || 'Sem descrição'
 let link = resultado.link || 'Sem link'
 let imagem = resultado.imagem || null
 let postado = resultado.postado || 'Sem data de postagem'
// Estadão
let txt = `✨• 𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚊 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊 』 ↴
-
 ➮ 𝙵𝚘𝚗𝚝𝚎: 📰
 ↳ 『 Estadão 』
-
 ➮ 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊: 📃
 ↳ 『 ${noticia} 』
-
 ➮ 𝙿𝚘𝚜𝚝𝚊𝚍𝚘 𝚎𝚖: 📅
 ↳ 『 ${postado} 』
-
 ➮ 𝙻𝚒𝚗𝚔: 📎
 ↳ 『 ${link} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`

 if (imagem) {
  await conn.sendMessage(from, {
caption: txt,
image: { url: imagem },
mentions: [sender]
  })
 } else {
  await reply(txt)
 }
 break;
}

case 'poder360': {
 await reagir(from, '✨')
 let res
 try {
  let r = await fetch(`${API_KIMORI_URL}/api/noticias/poder360?apikey=${APIKEY_KIMORI}`);
  res = await r.json()
 } catch (e) {
  console.log('poder360 info erro:', e?.message)
  return reply('erro, de uma olhada na api')
 }
 let resultado = res.resultado[0]
 let noticia = resultado.noticia || 'Sem descrição'
 let link = resultado.link || 'Sem link'
 let imagem = resultado.imagem || null
 let postado = resultado.postado || 'Sem data de postagem'
// Poder360
let txt = `✨• 𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚊 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊 』 ↴
-
 ➮ 𝙵𝚘𝚗𝚝𝚎: 📰
 ↳ 『 Poder360 』
-
 ➮ 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊: 📃
 ↳ 『 ${noticia} 』
-
 ➮ 𝙿𝚘𝚜𝚝𝚊𝚍𝚘 𝚎𝚖: 📅
 ↳ 『 ${postado} 』
-
 ➮ 𝙻𝚒𝚗𝚔: 📎
 ↳ 『 ${link} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`

 if (imagem) {
  await conn.sendMessage(from, {
caption: txt,
image: { url: imagem },
mentions: [sender]
  })
 } else {
  await reply(txt)
 }
 break;
}

case 'jovempan': {
 await reagir(from, '✨')
 let res
 try {
  let r = await fetch(`${API_KIMORI_URL}/api/noticias/jovempan?apikey=${APIKEY_KIMORI}`);
  res = await r.json()
 } catch (e) {
  console.log('jovempan info erro:', e?.message)
  return reply('erro, de uma olhada na api')
 }
 let resultado = res.resultado[0]
 let noticia = resultado.noticia || 'Sem descrição'
 let link = resultado.link || 'Sem link'
 let imagem = resultado.imagem || null
 let postado = resultado.postado || 'Sem data de postagem'
// Jovem Pan
let txt = `✨• 𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚊 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊 』 ↴
-
 ➮ 𝙵𝚘𝚗𝚝𝚎: 📰
 ↳ 『 Jovem Pan 』
-
 ➮ 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊: 📃
 ↳ 『 ${noticia} 』
-
 ➮ 𝙿𝚘𝚜𝚝𝚊𝚍𝚘 𝚎𝚖: 📅
 ↳ 『 ${postado} 』
-
 ➮ 𝙻𝚒𝚗𝚔: 📎
 ↳ 『 ${link} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`
 if (imagem) {
  await conn.sendMessage(from, {
caption: txt,
image: { url: imagem },
mentions: [sender]
  })
 } else {
  await reply(txt)
 }
 break;
}

case 'uol': 
case 'uolnews':
 case 'uolnoticias':
  case 'uol_news': {
await reagir(from, '✨')
let res
try {
 let r = await fetch(`${API_KIMORI_URL}/api/noticias/uol?apikey=${APIKEY_KIMORI}`);
 res = await r.json()
} catch (e) {
 console.log('uol info erro:', e?.message)
 return reply('erro, de uma olhada na api')
}
let resultado = res.resultado[0]
let noticia = resultado.noticia || 'Sem descrição'
let link = resultado.link || 'Sem link'
let imagem = resultado.imagem || null
let postado = resultado.postado || 'Sem data de postagem'
// UOL Notícias
let txt = `✨• 𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚊 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊 』 ↴
-
 ➮ 𝙵𝚘𝚗𝚝𝚎: 📰
 ↳ 『 UOL Notícias 』
-
 ➮ 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊: 📃
 ↳ 『 ${noticia} 』
-
 ➮ 𝙿𝚘𝚜𝚝𝚊𝚍𝚘 𝚎𝚖: 📅
 ↳ 『 ${postado} 』
-
 ➮ 𝙻𝚒𝚗𝚔: 📎
 ↳ 『 ${link} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`
if (imagem) {
 await conn.sendMessage(from, {
  caption: txt,
  image: { url: imagem },
  mentions: [sender]
 })
} else {
 await reply(txt)
}
break;
  }

case 'cep': {
if (!args[0]) return reply(`use ${prefix + command} (cep) para a pesquisa`);

await reagir(from, '✨')

let res
try {
let r = await fetch(`${API_KIMORI_URL}/api/cep/${q}?apikey=${APIKEY_KIMORI}`);
res = await r.json()
} catch (e) {
console.log('cep info erro:', e?.message)
return reply('erro, de uma olhada na api')
}
if (!res?.cep) return reply('nenhum resultado encontrado ta chuchuzinho')
 txt = Msg_CEP
  .replace('#cep#', res.cep)
  .replace('#logradouro#', res.logradouro)
  .replace('#complemento#', res.complemento || 'N/A')
  .replace('#bairro#', res.bairro)
  .replace('#cidade#', res.cidade)
  .replace('#estado#', res.estado)
  .replace('#ddd#', res.ddd)


await conn.sendMessage(from, { 
text: txt,
mentions: [sender]
})
}
break;

case 'roblox_stalker': {
  if (!q) return reply(`Use: ${prefix + command} <username do Roblox>`)

  await reagir(from, '🎮')

  const res = await fetch(`${API_KIMORI_URL}/api/stalk/roblox?username=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`)
 .then(r => r.json())
 .catch(() => null)

  if (!res?.success) return reply('❌ Usuário não encontrado ou erro na API.')

  const criado = res.created ? new Date(res.created).toLocaleDateString('pt-BR') : 'N/A'
  const status = res.presence?.status || 'N/A'
  const ultimoLocal = res.presence?.lastLocation || 'N/A'
  const banido = res.isBanned ? '🔴 Sim' : '🟢 Não'
  const verificado = res.hasVerifiedBadge ? '✅ Sim' : '❌ Não'

const texto = Msg_RobloxStalker
  .replace('#username#', res.username)
  .replace('#displayName#', res.displayName)
  .replace('#id#', res.id)
  .replace('#descricao#', res.description || 'Sem descrição')
  .replace('#amigos#', res.stats.friends)
  .replace('#seguidores#', res.stats.followers)
  .replace('#seguindo#', res.stats.followings)
  .replace('#badges#', res.stats.badges)
  .replace('#grupos#', res.stats.groups)
  .replace('#jogos#', res.stats.favoriteGames)
  .replace('#status#', status)
  .replace('#local#', ultimoLocal)
  .replace('#criado#', criado)
  .replace('#dias#', res.ageDays)
  .replace('#banido#', banido)
  .replace('#verificado#', verificado)
  .replace('#perfil#', res.profileUrl)

  const imgBuffer = res.avatar?.headshot ? await getBuffer(res.avatar.headshot).catch(() => null) : null

  if (imgBuffer) {
 await conn.sendMessage(from, { image: imgBuffer, caption: texto }, { quoted: info })
  } else {
 await reply(texto)
  }

  break
}

case 'printsite': {
if (!args[0]) return reply(`use ${prefix + command} (url) para a pesquisa`);
await reagir(from, '✨')

try {
 let res = await fetch(`${API_KIMORI_URL}/api/screenshotweb?url=${q}&apikey=${APIKEY_KIMORI}`);
 const arrayBuffer = await res.arrayBuffer();
 const buffer = await Buffer.from(arrayBuffer);
 await conn.sendMessage(from, {
  image: buffer,
caption: Msg_PrintSite.replace('#url#', q)
})
} catch (e) {
 console.log('printsite info erro:', e?.message);
 return reply('erro, de uma olhada na api');
}
break; 
}

case 'dicionario': {
  if (!args[0]) return reply(`📖 *Dicionário*\n\nUse: *${prefix}dicionario palavra*\nExemplo: *${prefix}dicionario saudade*`)

  await reagir(from, '✨️')

  let palavra = args.join(' ').trim()

  // Traduz PT -> EN pra buscar no dicionário
  let palavraEN = palavra
  try {
 let tr = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(palavra)}&langpair=pt|en`)
 let trJson = await tr.json()
 palavraEN = trJson?.responseData?.translatedText || palavra
  } catch {}

  let res
  try {
 let r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(palavraEN)}`)
 res = await r.json()
  } catch (e) {
 return reply('❌ Erro ao conectar. Tente novamente.')
  }

  if (!Array.isArray(res) || !res.length) return reply(`❌ Palavra *"${palavra}"* não encontrada no dicionário.`)

  let entry = res[0]
  let phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || 'N/A'

let txt = `✨• 𝙳𝙸𝙲𝙸𝙾𝙽𝙰́𝚁𝙸𝙾 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚊 𝙿𝚊𝚕𝚊𝚟𝚛𝚊 』 ↴
-
 ➮ 𝙿𝚊𝚕𝚊𝚟𝚛𝚊: 🔤
 ↳ 『 ${palavra} 』
-
 ➮ 𝙴𝚖 𝙸𝚗𝚐𝚕𝚎̂𝚜: 🇺🇸
 ↳ 『 ${palavraEN} 』
-
 ➮ 𝙵𝚘𝚗𝚎́𝚝𝚒𝚌𝚊: 🌸
 ↳ 『 ${phonetic} 』
-
`

for (let meaning of entry.meanings.slice(0, 3)) {
  let classe = meaning.partOfSpeech || 'Indefinido'

  txt += `➮ 𝙲𝚕𝚊𝚜𝚜𝚎 𝙶𝚛𝚊𝚖𝚊𝚝𝚒𝚌𝚊𝚕: 💎
↳ 『 ${classe.toUpperCase()} 』
`

  for (let [i, def] of meaning.definitions.slice(0, 2).entries()) {
 let defPT = def.definition
 try {
let tr2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(def.definition)}&langpair=en|pt`)
let tr2Json = await tr2.json()
defPT = tr2Json?.responseData?.translatedText || def.definition
 } catch {}

 txt += `➮ 𝙳𝚎𝚏𝚒𝚗𝚒𝚌̧𝚊̃𝚘 ${i + 1}: 📖
↳ 『 ${defPT} 』
`

 if (def.example) {
let exPT = def.example
try {
  let tr3 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(def.example)}&langpair=en|pt`)
  let tr3Json = await tr3.json()
  exPT = tr3Json?.responseData?.translatedText || def.example
} catch {}

txt += `➮ 𝙴𝚡𝚎𝚖𝚙𝚕𝚘: ✍️
↳ 『 ${exPT} 』
`
 }
  }

  if (meaning.synonyms?.length) {
 txt += `➮ 𝚂𝚒𝚗𝚘̂𝚗𝚒𝚖𝚘𝚜: 🔁
↳ 『 ${meaning.synonyms.slice(0, 4).join(', ')} 』
`
  }

  txt += '-\n'
}

txt += `⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙
👤 𝙲𝚘𝚗𝚜𝚞𝚕𝚝𝚊𝚍𝚘 𝚙𝚘𝚛: ${pushname} 🔮`

  reply(txt)
  break
}

case 'noticias': {
  await reagir(from, '📰')

  let feeds = {
 'Geral':'https://g1.globo.com/rss/g1/',
 'Economia':'https://g1.globo.com/rss/g1/economia/',
 'Tecnologia': 'https://g1.globo.com/rss/g1/tecnologia/',
 'Esportes':'https://ge.globo.com/rss/',
 'Mundo':'https://g1.globo.com/rss/g1/mundo/',
 'Política':'https://g1.globo.com/rss/g1/politica/',
 'Saúde':'https://g1.globo.com/rss/g1/ciencia-e-saude/'
  }

  let categorias = Object.keys(feeds)
  let categoria = categorias[Math.floor(Math.random() * categorias.length)]
  let feedUrl = feeds[categoria]

  let xml
  try {
 let r = await fetch(feedUrl, {
headers: { 'User-Agent': 'Mozilla/5.0' }
 })
 xml = await r.text()
  } catch (e) {
 console.log('noticias erro:', e?.message)
 return reply('❌ Erro ao buscar notícias. Tente novamente.')
  }

  let items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 5)
  if (!items.length) return reply('❌ Nenhuma notícia encontrada.')

  let txt = `✨• 𝙻𝙸𝚂𝚃𝙰 𝙳𝙴 𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 •✨
-
  『 ${categoria} 』 ↴
-
`

  for (let [i, item] of items.entries()) {
 let raw = item[1]

 let title = raw.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
  || raw.match(/<title>(.*?)<\/title>/)?.[1]
  || 'Sem título'

 let link = raw.match(/<link>(.*?)<\/link>/)?.[1]
 || raw.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1]
 || ''

 let pubDate = raw.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
 let data = pubDate
? new Date(pubDate).toLocaleString('pt-BR', {
 timeZone: 'America/Sao_Paulo',
 day: '2-digit',
 month: '2-digit',
 hour: '2-digit',
 minute: '2-digit'
  })
: 'N/A'

 txt += `➮ 𝙽𝚘𝚝𝚒́𝚌𝚒𝚊 ${i + 1}: 📃
↳ 『 ${title.trim()} 』
`

 if (data) {
txt += `➮ 𝙳𝚊𝚝𝚊: 🕐
↳ 『 ${data} 』
`
 }

 if (link) {
txt += `➮ 𝙻𝚒𝚗𝚔: 📎
↳ 『 ${link.trim()} 』
`
 }

 txt += '-\n'
  }

  txt += `⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙
👤 𝙲𝚘𝚗𝚜𝚞𝚕𝚝𝚊𝚍𝚘 𝚙𝚘𝚛: ${pushname} 🔮`

  await reply(txt)
  break
}

case 'clima':
try {

if (!q) {
  return reply('Digite o nome da cidade para pesquisar o clima.')
}

const geocodingResponse = await axios.get(
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`,
  {
 timeout: 10000,
 headers: {
'User-Agent': 'Mozilla/5.0'
 }
  }
)

if (
  !geocodingResponse.data.results ||
  geocodingResponse.data.results.length === 0
) {
  return reply(`Cidade "${q}" não encontrada.`)
}

const {
  latitude,
  longitude,
  name,
  country
} = geocodingResponse.data.results[0]

const weatherResponse = await axios.get(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weathercode`,
  {
 timeout: 10000,
 headers: {
'User-Agent': 'Mozilla/5.0'
 }
  }
)

console.log(weatherResponse.data)

if (!weatherResponse.data.current) {
  return reply('Não foi possível obter os dados do clima.')
}

const {
  temperature_2m: temperature,
  relative_humidity_2m: relativehumidity,
  wind_speed_10m: windspeed,
  wind_direction_10m: winddirection,
  weathercode
} = weatherResponse.data.current

let weatherDescription

switch (weathercode) {
  case 0:
 weatherDescription = 'Céu limpo'
 break
  case 1:
 weatherDescription = 'Predominantemente limpo'
 break
  case 2:
 weatherDescription = 'Parcialmente nublado'
 break
  case 3:
 weatherDescription = 'Nublado'
 break
  case 45:
 weatherDescription = 'Nevoeiro'
 break
  case 48:
 weatherDescription = 'Nevoeiro com geada'
 break
  case 51:
 weatherDescription = 'Chuvisco leve'
 break
  case 53:
 weatherDescription = 'Chuvisco moderado'
 break
  case 55:
 weatherDescription = 'Chuvisco intenso'
 break
  case 61:
 weatherDescription = 'Chuva leve'
 break
  case 63:
 weatherDescription = 'Chuva moderada'
 break
  case 65:
 weatherDescription = 'Chuva intensa'
 break
  case 71:
 weatherDescription = 'Neve leve'
 break
  case 73:
 weatherDescription = 'Neve moderada'
 break
  case 75:
 weatherDescription = 'Neve intensa'
 break
  case 80:
 weatherDescription = 'Pancadas de chuva leve'
 break
  case 81:
 weatherDescription = 'Pancadas de chuva moderada'
 break
  case 82:
 weatherDescription = 'Pancadas de chuva intensa'
 break
  case 95:
 weatherDescription = 'Tempestade'
 break
  case 96:
  case 99:
 weatherDescription = 'Tempestade com granizo'
 break
  default:
 weatherDescription = 'Condição desconhecida'
}

let weatherEmoji

switch (weathercode) {
  case 0:
 weatherEmoji = '☀️'
 break

  case 1:
  case 2:
 weatherEmoji = '🌤️'
 break

  case 3:
 weatherEmoji = '☁️'
 break

  case 45:
  case 48:
 weatherEmoji = '🌫️'
 break

  case 51:
  case 53:
  case 55:
  case 61:
  case 63:
  case 65:
  case 80:
  case 81:
  case 82:
 weatherEmoji = '🌧️'
 break

  case 71:
  case 73:
  case 75:
 weatherEmoji = '❄️'
 break

  case 95:
  case 96:
  case 99:
 weatherEmoji = '⛈️'
 break

  default:
 weatherEmoji = '🌈'
}

let windDirectionEmoji

if (winddirection >= 337.5 || winddirection < 22.5) {
  windDirectionEmoji = '⬆️'
} else if (winddirection >= 22.5 && winddirection < 67.5) {
  windDirectionEmoji = '↗️'
} else if (winddirection >= 67.5 && winddirection < 112.5) {
  windDirectionEmoji = '➡️'
} else if (winddirection >= 112.5 && winddirection < 157.5) {
  windDirectionEmoji = '↘️'
} else if (winddirection >= 157.5 && winddirection < 202.5) {
  windDirectionEmoji = '⬇️'
} else if (winddirection >= 202.5 && winddirection < 247.5) {
  windDirectionEmoji = '↙️'
} else if (winddirection >= 247.5 && winddirection < 292.5) {
  windDirectionEmoji = '⬅️'
} else {
  windDirectionEmoji = '↖️'
}

const weatherInfo = Msg_ClimaCity
  .replace('#cidade#', name)
  .replace('#pais#', country ? `, ${country}` : '')
  .replace('#temperatura#', `${temperature}°C`)
  .replace('#umidade#', `${relativehumidity}%`)
  .replace('#vento#', `${windspeed} km/h ${windDirectionEmoji}`)
  .replace('#climaemoji#', weatherEmoji)
  .replace('#clima#', weatherDescription)

await reply(weatherInfo)

} catch (e) {

console.log(e.response?.data || e)

reply(
`${Res_ErroCmd}

📝 ${e.message}`
)

}
break

case 'livro': {
  if (!q) return reply(`📚✨ *Ops!* Você esqueceu de digitar o nome do livro.\n\n📌 Exemplo: *${prefix}livro A Seleção*`);

  await reagir(from, '🔍');

  try {
 const busca = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}`);
 const resultados = busca.data.docs;

 if (!resultados.length) return reply('❌ Nenhum livro fofo foi encontrado com esse nome!');

 const livro = resultados[0];
 const titulo = livro.title || 'Sem título';
 const autor = livro.author_name?.[0] || 'Desconhecido';
 const ano = livro.first_publish_year || 'Desconhecido';
 const capa = livro.cover_i 
? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg` 
: null;
 const workKey = livro.key;
 const link = `https://openlibrary.org${workKey}`;

 // puxar sinopse
 const detalhes = await axios.get(`https://openlibrary.org${workKey}.json`);
 const descricao = typeof detalhes.data.description === 'string' 
? detalhes.data.description 
: detalhes.data.description?.value || 'Nenhuma sinopse disponível... mas o livro deve ser mágico! 💫';

const legenda = `✨• 𝙻𝙸𝚅𝚁𝙾 𝙸𝙽𝙵𝙾 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚘 𝙻𝚒𝚟𝚛𝚘 』 ↴
-
 ➮ 𝚃í𝚝𝚞𝚕𝚘: 📖
 ↳ 『 ${titulo} 』
-
 ➮ 𝙰𝚞𝚝𝚘𝚛(𝚊): 👩‍💼
 ↳ 『 ${autor} 』
-
 ➮ 𝙰𝚗𝚘: 📅
 ↳ 『 ${ano} 』
-
 ➮ 𝙻𝚎𝚒𝚊 𝙼𝚊𝚒𝚜: 🔗
 ↳ 『 ${link} 』
-
 ➮ 𝚂𝚒𝚗𝚘𝚙𝚜𝚎: 💌
 ↳ 『 ${descricao.slice(0, 500)}${descricao.length > 500 ? '...' : ''} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`.trim();


 if (capa) {
conn.sendMessage(from, {
  image: { url: capa },
  caption: legenda
}, { quoted: info });
 } else {
reply(legenda);
 }

 await reagir(from, '📚');
  } catch (e) {
 console.error(e);
 reply('❌ Algo deu errado... tente outro livro, princesa!');
  }
}
break;

case 'movie': {
  if (!q) return reply(`💙 Oiie, digite o nome de um filme pra eu buscar pra você 💅\n\nEx: *${prefix}movie Barbie*`);

  await reagir(from, '🍿');

  try {
 const movieInfo = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=ddfcb99fae93e4723232e4de755d2423&query=${encodeURIComponent(q)}&language=pt`);

 if (movieInfo.data.results.length === 0) {
return reply(`✨ Nenhum filminho encontrado com o nome: *${q}* 😢`);
 }

 const movie = movieInfo.data.results[0];
 const imageUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
 const genres = movie.genre_ids.map(id => getGenreName(id)).join(', ');

 function getGenreName(id) {
const genres = {
  28: 'Ação 💥',
  12: 'Aventura 🗺️',
  16: 'Animação 🐰',
  35: 'Comédia 😂',
  80: 'Crime 🕵️‍♀️',
  99: 'Documentário 🎬',
  18: 'Drama 🎭',
  10751: 'Família 👨‍👩‍👧',
  14: 'Fantasia ✨',
  36: 'História 📖',
  27: 'Terror 👻',
  10402: 'Música 🎶',
  9648: 'Mistério 🔍',
  10749: 'Romance 💙',
  878: 'Ficção Científica 👽',
  10770: 'Cinema TV 📺',
  53: 'Suspense 😱',
  10752: 'Guerra 🔫',
  37: 'Faroeste 🤠'
};
return genres[id] || 'Desconhecido';
 }

const movieDetails = `✨• 𝙼𝙾𝚅𝙸𝙴 𝙸𝙽𝙵𝙾 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝚍𝚘 𝙵𝚒𝚕𝚖𝚎 』 ↴
-
 ➮ 𝚃í𝚝𝚞𝚕𝚘: 🎬
 ↳ 『 ${movie.title} 』
-
 ➮ 𝙾𝚛𝚒𝚐𝚒𝚗𝚊𝚕: 🌸
 ↳ 『 ${movie.original_title} 』
-
 ➮ 𝙻𝚊𝚗𝚌̧𝚊𝚖𝚎𝚗𝚝𝚘: 📆
 ↳ 『 ${movie.release_date} 』
-
 ➮ 𝙽𝚘𝚝𝚊: ⭐
 ↳ 『 ${movie.vote_average} / 10 (${movie.vote_count} votos) 』
-
 ➮ 𝙲𝚕𝚊𝚜𝚜𝚒𝚏𝚒𝚌𝚊𝚌̧𝚊̃𝚘: 🔞
 ↳ 『 ${movie.adult ? '🔞 +18' : '🌈 Livre'} 』
-
 ➮ 𝙶ê𝚗𝚎𝚛𝚘𝚜: 💙
 ↳ 『 ${genres} 』
-
 ➮ 𝚂𝚒𝚗𝚘𝚙𝚜𝚎: 📝
 ↳ 『 ${movie.overview || 'Sem sinopse disponível 😔'} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`


 conn.sendMessage(from, {
image: { url: imageUrl },
caption: movieDetails
 }, { quoted: info });

 await reagir(from, '✅');

  } catch (e) {
 console.error(e);
 return reply(`😿 Erro ao procurar o filminho. Tente novamente depois!`);
  }
}
break;

case 'uploadimage':
{
  let mediaType = null;
  let mediaMessage = null;

  if (isMedia) {
 if (info.message.imageMessage) {
mediaType = 'image';
mediaMessage = info.message.imageMessage;
 } else if (info.message.stickerMessage) {
mediaType = 'sticker';
mediaMessage = info.message.stickerMessage;
 }
  } else if (type === 'extendedTextMessage') {
 const quoted = info.message.extendedTextMessage.contextInfo?.quotedMessage;
 if (quoted?.imageMessage) {
mediaType = 'image';
mediaMessage = quoted.imageMessage;
 } else if (quoted?.stickerMessage) {
mediaType = 'sticker';
mediaMessage = quoted.stickerMessage;
 }
  }

  if (!mediaType || !mediaMessage) {
 reply('❌ Envie ou marque uma imagem ou figurinha com até 200MB.');
 return;
  }

  const sizeOk = mediaMessage.fileLength < 209715200;
  if (!sizeOk) {
 reagir(from, "❗");
 reply('❌ Mídia maior que 200MB.');
 return;
  }

  const buffer = await getFileBuffer(mediaMessage, mediaType);
  const base64 = buffer.toString('base64');
  const apiKey = '6d207e02198a847aa98d0a2a901485a5';

  reagir(from, "📤");

  try {
 const form = new URLSearchParams();
 form.append('key', apiKey);
 form.append('action', 'upload');
 form.append('format', 'json');
 form.append('source', base64);

 const res = await fetch('https://freeimage.host/api/1/upload', {
method: 'POST',
body: form,
headers: {
  'Content-Type': 'application/x-www-form-urlencoded'
}
 });

 const json = await res.json();

 if (json?.image?.medium?.url) {
const linkMd = json.image.medium.url;
reply(`✅ Link gerado com sucesso:\n\n🔗 ${linkMd}`);
 } else {
reply('❌ Falha ao gerar o link. Tente novamente.');
 }

  } catch (err) {
 console.error(err);
 reply('❌ Erro ao se conectar ao servidor de upload.');
  }
}
break;

case 'anime': {
  if (!q) return reply(`🌸 Oi linda! Me diga o nome do anime que você quer saber ✨\n\nExemplo: *${prefix}anime Naruto*`);

  await reagir(from, '🌸');

  try {
 const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`);

 if (!response.data || response.data.data.length === 0) {
return reply(`💔 Nenhum anime encontrado com o nome: *${q}*`);
 }

 const anime = response.data.data[0];
 const titulo = anime.title || 'Desconhecido';
 const titulo_japones = anime.title_japanese || 'Desconhecido';
 const episodios = anime.episodes || 'Desconhecido';
 const nota = anime.score || 'N/A';
 const status = anime.status || 'Desconhecido';
 const sinopse = anime.synopsis ? anime.synopsis.substring(0, 500) + '...' : 'Sem sinopse disponível 😢';
 const imagem = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null;
 const generos = anime.genres.map(g => g.name).join(', ') || 'Desconhecido';

const texto = `✨• 𝘼𝙉𝙄𝙈𝙀 𝙄𝙉𝙁𝙊 •✨
-
  『 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌̧𝚘̃𝚎𝚜 𝙳𝚘 𝙰𝚗𝚒𝚖𝚎 』 ↴
-
 ➮ 𝚃í𝚝𝚞𝚕𝚘: 📺
 ↳ 『 ${titulo} 』
-
 ➮ 𝚃í𝚝𝚞𝚕𝚘 𝙹𝚊𝚙𝚘𝚗ê𝚜: 🗾
 ↳ 『 ${titulo_japones} 』
-
 ➮ 𝙴𝚙𝚒𝚜ó𝚍𝚒𝚘𝚜: 🎞️
 ↳ 『 ${episodios} 』
-
 ➮ 𝙽𝚘𝚝𝚊: ⭐
 ↳ 『 ${nota} / 10 』
-
 ➮ 𝚂𝚝𝚊𝚝𝚞𝚜: 📡
 ↳ 『 ${status} 』
-
 ➮ 𝙶ê𝚗𝚎𝚛𝚘𝚜: 💙
 ↳ 『 ${generos} 』
-
 ➮ 𝚂𝚒𝚗𝚘𝚙𝚜𝚎: 📝
 ↳ 『 ${sinopse} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`;


 conn.sendMessage(from, {
image: { url: imagem },
caption: texto
 }, { quoted: info });

 await reagir(from, '✅');

  } catch (err) {
 console.error(err);
 return reply('❌ Ops, não consegui buscar esse anime. Tente novamente depois!');
  }
}
break;

case 'wikipedia':
case 'wiki': {
  await reagir(from, '🔎')
 if (!q) return reply(`use ${prefix + command} (termo) para a pesquisa`)
 let res
 try {
  let r = await fetch(`${API_KIMORI_URL}/api/wikipedia/pesquisa?q=${q}&apikey=${APIKEY_KIMORI}`)
  res = await r.json() 
 } catch (e) {
  console.log('wikipedia info erro:', e?.message)
  return reply('erro, de uma olhada na api')
 }
let resultado = res.resultados[0] 
let titulo = resultado.titulo
let descricao = resultado.descricao
let url = resultado.url

let txt = `✨• 𝚆𝙸𝙺𝙸𝙿𝙴𝙳𝙸𝙰 •✨
-
  『 ${titulo} 』 ↴
-
 ➮ 𝙳𝚎𝚜𝚌𝚛𝚒𝚌̧𝚊̃𝚘: 📖
 ↳ 『 ${descricao} 』
-
 ➮ 𝙻𝚎𝚒𝚊 𝙼𝚊𝚒𝚜: 🔗
 ↳ 『 ${url} 』
-
⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`


 await conn.sendMessage(from, {caption: txt, image: { url: 'https://i.ibb.co/60PJ3BRf/986b50b1e432.jpg' }, mentions: [sender]})
 break;
}

case 'insta_video':
case 'insta_foto':
case 'instagram': {
  if (q.length < 5)
    return reply(`✨️ Exemplo: ${prefix+command} link do Instagram\n\n💖 Cole o link completo do post/reel/foto do Instagram.`)
  reagir(from, "⏳️");
  try {
    const apiResp = await fetchJson(
      `${API_KIMORI_URL}/api/instagram/dl/video?url=${encodeURIComponent(q.trim())}&apikey=${APIKEY_KIMORI}`
    )

    if (!apiResp?.success) throw new Error('Falha na API')

    const midias = apiResp.imagens?.length > 0 ? apiResp.imagens : (apiResp.videos ?? [])
    if (!midias.length) throw new Error('Nenhuma mídia encontrada')

    // Detecta se é foto decodificando o JWT do snapcdn ou pela extensão direta
    function isImageUrl(url) {
      try {
        const token = new URL(url).searchParams.get('token')
        if (token) {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
          return /\.jpg|\.jpeg|\.png|\.webp/i.test(payload.filename ?? '')
        }
      } catch {}
      return /\.jpg|\.jpeg|\.png|\.webp/i.test(url)
    }

    const eFoto = isImageUrl(midias[0])

    if (eFoto) {
      // — CAROUSEL DE FOTOS (1 ou mais)
      const total = midias.length
      const cards = []

      for (let i = 0; i < total; i++) {
        const media = await prepareWAMessageMedia(
          { image: { url: midias[i] } },
          { upload: conn.waUploadToServer }
        )
        cards.push({
          header: {
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
          },
          headerType: 'IMAGE',
          body: { text: `${i + 1}/${total}` },
          footer: { text: '' },
          nativeFlowMessage: { buttons: [] }
        })
      }

      await conn.relayMessage(from, {
        interactiveMessage: {
          contextInfo: { participant: from },
          body: { text: '' },
          carouselMessage: { cards }
        }
      }, {})

    } else {
      // — VÍDEO/REEL
      await conn.sendMessage(from, {
        video: { url: midias[0] },
        mimetype: 'video/mp4'
      }, { quoted: info })
    }

  } catch {
    return reply('❌ Erro ao baixar do Instagram..')
  }
  break
}

case 'multidl':
case 'mdl': {
  if (q.length < 5)
    return reply(`✨️ Exemplo: ${prefix+command} link\n\n💖 Suporta TikTok, YouTube, Instagram e mais.`)
  reagir(from, "⏳️");
  try {
    const apiResp = await fetchJson(
      `${API_KIMORI_URL}/api/download/multi?url=${encodeURIComponent(q.trim())}&apikey=${APIKEY_KIMORI}`
    )

    if (!apiResp?.success || !apiResp.medias?.length) throw new Error('Nenhuma mídia encontrada')

    // Filtra só mp4 e m4a
    const videos = apiResp.medias.filter(m => m.extensao === 'mp4')
    const audio  = apiResp.medias.find(m => m.extensao === 'm4a' || m.extensao === 'mp3')

    // Pega o mp4 de maior qualidade (primeiro da lista)
    const melhor = videos[0] ?? audio

    if (!melhor) throw new Error('Nenhum formato disponível')

    const titulo = apiResp.title ?? ''
    const duracao = apiResp.duration ?? ''

    const isAudio = melhor.extensao === 'm4a' || melhor.extensao === 'mp3'

    if (isAudio) {
      await conn.sendMessage(from, {
        audio: { url: melhor.url },
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: info })
    } else {
      await conn.sendMessage(from, {
        video: { url: melhor.url },
        mimetype: 'video/mp4'
      }, { quoted: info })
    }

  } catch {
    return reply('❌ Erro ao baixar a mídia..')
  }
  break
}

case 'twitter_video':
case 'twitterdl':
case 'tvideo': {
  if (q.length < 5)
    return reply(`✨️ Exemplo: ${prefix+command} link do Twitter/X\n\n💖 Cole o link completo do post.`)
  reagir(from, "✨️");
  try {
    const apiResp = await fetchJson(
      `${API_KIMORI_URL}/api/download/twitter?url=${encodeURIComponent(q.trim())}&apikey=${APIKEY_KIMORI}`
    )

    if (!apiResp?.success || !apiResp.data?.video) throw new Error('Falha na API')

    const { video, titulo, descricao } = apiResp.data

    await conn.sendMessage(from, {
      video: { url: video },
      mimetype: 'video/mp4'
    }, { quoted: info })

  } catch {
    return reply('❌ Erro ao baixar o vídeo do Twitter/X..')
  }
  break
}

case 'insta_audio': {
  if (q.length < 5)
    return reply(`✨️ Exemplo: ${prefix+command} link do Instagram\n\n💖 Cole o link completo do reel/vídeo do Instagram.`)

  reagir(from, "⏳️");

  let videoPath, audioPath;

  try {
    const apiResp = await fetchJson(
      `${API_KIMORI_URL}/api/instagram/dl/video?url=${encodeURIComponent(q.trim())}&apikey=${APIKEY_KIMORI}`
    )

    if (!apiResp?.success) throw new Error('Falha na API')

    const midias = apiResp.videos ?? []
    if (!midias.length) throw new Error('Nenhum vídeo encontrado (link pode ser de foto)')

    const videoUrl = midias[0]

    // 📥 Baixa o vídeo em buffer
    const videoBuffer = Buffer.from(await (await fetch(videoUrl)).arrayBuffer())

    const tempDir = path.join(__dirname, 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const id = Date.now()
    videoPath = path.join(tempDir, `insta_${id}.mp4`)
    audioPath = path.join(tempDir, `insta_${id}.mp3`)

    fs.writeFileSync(videoPath, videoBuffer)

    // 🎧 Extrai só o áudio com ffmpeg
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${audioPath}"`, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })

    const audioBuffer = fs.readFileSync(audioPath)

    await conn.sendMessage(from, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg'
    }, { quoted: info })

  } catch (e) {
    console.log(e)
    return reply('❌ Erro ao extrair áudio do Instagram..')
  } finally {
    // 🧹 Limpa os temporários mesmo se der erro
    if (videoPath && fs.existsSync(videoPath)) fs.unlinkSync(videoPath)
    if (audioPath && fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
  }
  break
}

case "facebook": case 'facevideo': case 'face_video':
try {
  if (!q.includes("facebook") && !q.includes("fb.watch")) {
 return reply(`Exemplo: ${prefix + command} o link do Facebook`)
  }

  const API_URL = `${API_KIMORI_URL}/api/download/facebook?url=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`
  const response = await fetch(API_URL)

  if (!response.ok) throw new Error(`Erro na API: ${response.status}`)

  const result = await response.json()

  if (!result.success || !result.data?.video) {
 throw new Error("Nenhum vídeo disponível.")
  }

  await conn.sendMessage(from, {
 video: { url: result.data.video },
 caption: `*Vídeo Baixado com sucesso ✨️*`,
 mimetype: "video/mp4"
  }, { quoted: info })

} catch (e) {
  console.error("[FB] Erro:", e.message)
  return reply("Erro ao processar a solicitação.")
}
break

case 'kwai_video':
case 'kwaidl':
case 'kwai_dl': {
  if (!q) return reply(`Use assim: ${prefix + command} link do Kwai`)

  try {
 reagir(from, '✨️')

 const data = await fetchJson(`${API_KIMORI_URL}/api/download/kwai?url=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`)

 if (!data || !data.success || !data.data?.video) {
throw new Error('Vídeo não disponível')
 }

 await conn.sendMessage(from, {
video: { url: data.data.video },
mimetype: 'video/mp4',
 }, { quoted: info })

 reagir(from, '✅')

  } catch (err) {
 console.error('[kwai_dl]', err)
 reagir(from, '❌')
 reply('❌ Não consegui baixar o vídeo do Kwai. Verifique o link e tente novamente.')
  }

  break
}

case 'shota':
case 'shotinha':
case 'shotaimg': {
  const shotaImgs = [
 "https://i.imgur.com/xWLRytk.jpg",
 "https://i.imgur.com/gICpAkx.jpg",
 "https://i.imgur.com/zHHuZzj.jpg",
 "https://i.imgur.com/I8fIgu7.jpg",
 "https://i.imgur.com/MgC42tV.jpg",
 "https://i.imgur.com/X0ZvGdW.jpg",
 "https://i.imgur.com/bJo3mkS.jpg",
 "https://i.imgur.com/IRkpLr9.jpg",
 "https://i.imgur.com/5n84adz.jpg",
 "https://i.imgur.com/MdBK6om.jpg",
 "https://i.imgur.com/hSRuIFV.jpg",
 "https://i.imgur.com/76cPbZD.jpg",
 "https://i.imgur.com/LTS6OQ0.jpg",
 "https://i.imgur.com/kr27Udl.jpg",
 "https://i.imgur.com/Fn5YxHA.jpg",
 "https://i.imgur.com/2xrJum8.jpg",
 "https://i.imgur.com/e4NF7vU.jpg",
 "https://i.imgur.com/i60z60n.jpg",
 "https://i.imgur.com/Rv24BWh.jpg",
 "https://i.imgur.com/9K8lbP7.jpg",
 "https://i.imgur.com/A0Xn484.jpg",
 "https://i.imgur.com/FRBt8sM.jpg",
 "https://i.imgur.com/SEkiXd8.jpg",
 "https://i.imgur.com/ydNnAIa.jpg",
 "https://i.imgur.com/sCseKmP.jpg",
 "https://i.imgur.com/oI7HSC1.jpg",
 "https://i.imgur.com/QW7F4SS.jpg",
 "https://i.imgur.com/KtVjmLb.jpg",
 "https://i.imgur.com/Ckuu5lY.jpg",
 "https://i.imgur.com/VOxGOlf.png",
 "https://i.imgur.com/iQVOl1G.png",
 "https://i.imgur.com/C4DdBdp.jpg",
 "https://i.imgur.com/9zZLS24.jpg",
 "https://i.imgur.com/qIDaQ6Y.jpg",
 "https://i.imgur.com/vkP1ITN.jpg",
 "https://i.imgur.com/rbhZXH4.jpg",
 "https://i.imgur.com/qJaNVdh.jpg",
 "https://i.imgur.com/qSeB0ND.jpg",
 "https://i.imgur.com/HqZyZv9.jpg",
 "https://i.imgur.com/7bxpnuk.jpg",
 "https://i.imgur.com/SpeD3zj.jpg",
 "https://i.imgur.com/06lkman.jpg",
 "https://i.imgur.com/rkfLUAD.jpg",
 "https://i.imgur.com/cP9D1qw.jpg",
 "https://i.imgur.com/mJTvjIB.jpg",
 "https://i.imgur.com/zzsrDli.jpg",
 "https://i.imgur.com/KR99obZ.jpg",
 "https://i.imgur.com/i8fyDyp.jpg",
 "https://i.imgur.com/ux5zqrE.jpg",
 "https://i.imgur.com/gX3TwEW.jpg",
 "https://i.imgur.com/GPOjup6.jpg",
 "https://i.imgur.com/SdtQOKp.png",
 "https://i.imgur.com/qbcrDFx.jpg",
 "https://i.imgur.com/tZS8mwx.jpg",
 "https://i.imgur.com/AerUxCA.jpg",
 "https://i.imgur.com/a4yZAtr.jpg",
 "https://i.imgur.com/2BIThrs.jpg",
 "https://i.imgur.com/1xOusTv.jpg",
 "https://i.imgur.com/VNzqi6D.jpg",
 "https://i.imgur.com/0sKr3kn.jpg",
 "https://i.imgur.com/QMO20gA.jpg",
 "https://i.imgur.com/kNSiwEu.jpg",
 "https://i.imgur.com/GjxvCnQ.jpg",
 "https://i.imgur.com/OSPPHXP.jpg",
 "https://i.imgur.com/1HFcDNz.jpg",
 "https://i.imgur.com/EXpvJYX.jpg",
 "https://i.imgur.com/B0DmKZY.jpg",
 "https://i.imgur.com/kgmk6Tc.jpg",
 "https://i.imgur.com/ipmRYrR.jpg",
 "https://i.imgur.com/Q6bZ07Z.jpg",
 "https://i.imgur.com/7h7wnyl.jpg",
 "https://i.imgur.com/vFkSDT4.jpg",
 "https://i.imgur.com/bmDSBVV.jpg",
 "https://i.imgur.com/62kr0cc.jpg",
 "https://i.imgur.com/Pq3CRWX.jpg",
 "https://i.imgur.com/0ZrPefu.jpg",
 "https://i.imgur.com/neS9HqA.jpg",
 "https://i.imgur.com/4iOhu4A.jpg",
 "https://i.imgur.com/PXr8UX3.jpg",
 "https://i.imgur.com/0n2CLXn.jpg",
 "https://i.imgur.com/EW4kXLP.jpg",
 "https://i.imgur.com/svgWyuy.jpg",
 "https://i.imgur.com/7QoegNb.jpg",
 "https://i.imgur.com/eOzp2G0.jpg",
 "https://i.imgur.com/rUJ2nZ1.png",
 "https://i.imgur.com/kOvQmYs.jpg",
 "https://i.imgur.com/s8qE09p.jpg",
 "https://i.imgur.com/im9dVq5.jpg",
 "https://i.imgur.com/x7FlUrH.jpg",
 "https://i.imgur.com/Furcrg1.jpg",
 "https://i.imgur.com/sv5Mmw5.jpg",
 "https://i.imgur.com/euo6haO.jpg"
  ]

  const imgUrl = shotaImgs[Math.floor(Math.random() * shotaImgs.length)]

  const caption = global.msgs?.shota_caption
 ? global.msgs.shota_caption
 : `⏤͟͟͞͞𝑴𝒊𝒛𝒖𝒌𝒊𝑩𝒐𝒕-𝑴𝑫 🌙`

  await conn.sendMessage(from, {
 image: { url: imgUrl },
 caption: caption
  }, { quoted: info })

  break
}

case 'bc':
case 'bcgroup':
case 'transmitir':
case 'transmissao': {

if(!SoDono && !isnit && !issupre && !ischyt && !info.key.fromMe) 
return reply(Res_SoDono)

if(!q) 
return reply(`*Aaaah! 🤭 Cadê a mensagem da transmissão?* 💖📢\n\n*Exemplo:* ${prefix + command} oi pessoal ✨`)

let getGroups = await conn.groupFetchAllParticipating()

let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])

let anu = groups.map(v => v.id)

reply(`*Eitaa! 😆 Estou enviando a transmissão para todos os grupos!* 💞📨`)

for(i = 0; i < anu.length; i++) {

await sleep(1500)

let txt = `💖 *TRANSMISSÃO DO BOT* 💖\n\n${q}`

conn.sendMessage(anu[i], {text: txt})

}

reply(`*Prontinho! 😊 Transmissão enviada com sucesso!* 💕📢`)

}

break

case 'join':
case 'entrar':

if(!SoDono) return reply(Res_SoDono)

string = args.join(' ')

if(!string) 
return reply('*Aaaah! 🤭 Me manda um link de convite válido!* 💖🔗')

if(string.includes('chat.whatsapp.com/') || reply('*Oops! 😅 Verifica direitinho o link que você enviou!* 💕🔗')) {

link = string.split('app.com/')[1]

try {

conn.groupAcceptInvite(`${link}`)

reply('*Yaaay! 😆 Entrei no grupo com sucesso!* 💖✨')

} catch(erro) {

if(String(erro).includes('resource-limit')) {

reply('*Aaaah! 😵 O grupo já atingiu o limite máximo de membros!* 💖👥')

}

if(String(erro).includes('not-authorized')) {

reply('*Oops! 😅 Não consegui entrar no grupo!\n💔 Motivo: Fui banido do grupo.*')

}

}

}

break

case 'antiimg':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiImg) {
dataGp[0].antiimg = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antiimg = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antivideo':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiVid) {
dataGp[0].antivideo = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antivideo = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antiaudio':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiAudio) {
dataGp[0].antiaudio = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antiaudio = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antisticker':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiSticker) {
dataGp[0].antisticker = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antisticker = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antidocumento':
case 'antidoc':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(Antidoc) {
dataGp[0].antidoc = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antidoc = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antictt':
case 'anticontato':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiCtt) {
dataGp[0].antictt = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antictt = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antiloc':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
try {
if(Antiloc) {
dataGp[0].antiloc = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antiloc = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
} catch {
reply('Deu erro, tente novamente :/')
}
break


case 'antimencao':  case 'antistatus':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntimention) {
dataGp[0].antimention = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antimention = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antilinkgp':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntilinkgp) {
dataGp[0].antilinkgp = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antilinkgp = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antilinkhard':
case 'antilink':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiLinkHard) {
dataGp[0].antilinkhard = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antilinkhard = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break


case 'anticanal': {
 try {
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)

  if (!jsonGp) return reply('Erro ao carregar dados do grupo.')

if (jsonGp[0].anticanal === true) {
 jsonGp[0].anticanal = false
 fs.writeFileSync(`./banco de dados/grupos/${from}.json`, JSON.stringify(jsonGp, null, 2))
 reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
 jsonGp[0].anticanal = true
 fs.writeFileSync(`./banco de dados/grupos/${from}.json`, JSON.stringify(jsonGp, null, 2))
 reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}

 } catch (e) {
  console.log('Erro geral no anticanal:', e)
  reply(console.error)
 }
}
break

case 'modocoins':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)

if (isModoCoins) {
 dataGp[0].isModoCoins = false;
 setGp(dataGp);
 reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
 dataGp[0].isModoCoins = true;
 setGp(dataGp);
 reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break;

case 'antimetaia':
case 'antimeta': {
  if (!isGroupAdmins) return reply(Res_SoAdm);
  if (!isGroup) return reply('❌ Use em grupos.');

  const dbPath = './banco de dados/antimetaia.json';
  let db = {};

  try {
 db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
 db = {};
  }

  const status = db[from];

  if (status) {
 db[from] = false;
 fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
 reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
  } else {
 db[from] = true;
 fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
  }
  break;
}

case 'x9':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isx9) {
dataGp[0].x9 = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].x9 = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'visualizarmsg':
if(!SoDono) return reply(Res_SoDono)
if(isVisualizar) {
nescessario.visualizarmsg = false
setNes(nescessario)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
nescessario.visualizarmsg = true
setNes(nescessario)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'x9visuunica':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isX9VisuUnica) {
dataGp[0].visuUnica = false
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].visuUnica = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'so_adm':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(So_Adm) {
dataGp[0].soadm = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].soadm = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'odelete':
if(!isGroup) return reply(Res_SoGrupo)
if(!SoDono) return reply(Res_SoDono)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(IS_DELETE) {
nescessario.Odelete = false
setNes(nescessario)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
nescessario.Odelete = true
setNes(nescessario)
rreply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antifake':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if (isAntifake) {
  dataGp[0].antifake = false;
  setGp(dataGp);
  reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
  dataGp[0].antifake = true;
  setGp(dataGp);
  reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break;

case 'autorizar':
case 'aceitar':
case '✅': {
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  const pendentes = await conn.groupRequestParticipantsList(from);
  const total = pendentes?.length || 0;
  if (total === 0)
 return reply('*💁‍♂️ | Nao ha nenhuma solicitacao pendente no grupo. 🤷‍♂️*');
  for (const p of pendentes) {
 await conn.groupRequestParticipantsUpdate(from, [p.jid], 'approve');
  }
  reply(`*${total} solicitacoes foram aceitas com sucesso! 🙇‍♂️*`);
}
break;

case 'recusar':
case 'negar':
case '❌': {
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
  if (!isBotGroupAdmins) return reply(mess.onlyBotAdmin());
  const pendentes = await conn.groupRequestParticipantsList(from);
  const total = pendentes?.length || 0;

  if (total === 0)
 return reply('*Nao ha nenhuma solicitacao pendente para recusar. 🤷‍♂️*');
  for (const p of pendentes) {
 await conn.groupRequestParticipantsUpdate(from, [p.jid], 'reject');
  }

  reply(`*${total} solicitacoes foram recusadas com sucesso! 🙇‍♂️*`);
}
break;

case 'prefixos':
if(!isGroup) return reply(Res_SoGrupo)
if(dataGp[0].prefixos.length < 1) return reply("Não contem nenhum prefixo a + adicionado neste grupo.")
bla = `Lista de prefixos para uso do bot, no Grupo: ${groupName}\n\n`
for ( i of dataGp[0].prefixos) {
bla += `Prefixo: ${i}\n\n`
}
reply(bla)
break

case 'add_prefixo':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isMultiP) return reply(`Para usar este comando, você deve ativar o comando, multiprefix\nExemplo: ${prefix}multiprefixo 1`)
if(ANT_LTR_MD_EMJ(q)) return reply("Não pode letra modificada, nem emoji..")
if(!q.trim()) return reply("Determine o novo prefixo, não pode espaço vazio...")
if(q.trim() > 1) return reply(`Calma, o prefixo só pode ser um\nExemplo: ${prefix+command} _\nAe o bot vai passar á responder _ como prefixo do bot..`)
if(dataGp[0].prefixos.indexOf(q.trim()) >= 0) return reply(`Esse prefixo já se encontra incluso, procure ver na lista dos prefixos\nExemplo: ${prefix}prefixos`)
dataGp[0].prefixos.push(q.trim())
setGp(dataGp)
reply(`Prefixo ${q.trim()} Adicionado com sucesso na lista de prefixos para uso do bot, neste grupo...`)
break

case 'tirar_prefixo':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isMultiP) return reply(`Para usar este comando, você deve ativar o comando, multiprefix\nExemplo: ${prefix}multiprefixo 1`)  
if(ANT_LTR_MD_EMJ(q)) return reply("Não pode letra modificada, nem emoji..")
if(!q.trim()) return reply("Determine o prefixo que deseja tirar, não pode espaço vazio...")
if(q.trim() > 1) return reply(`Calma, o prefixo só pode ser tirado um por vez\nExemplo: ${prefix+command} _\nAe o bot não vai responder mais com _`)
if(dataGp[0].prefixos.indexOf(q.trim()) < 0) return reply(`Esse prefixo não está incluso, procure ver na lista dos prefixos\nExemplo: ${prefix}prefixos`)
if(dataGp[0].prefixos.length == 1) return reply("Adicione um prefixo para pode tirar este, tem que ter pelo menos 1 prefixo já incluso dentro do sistema para tirar outro.")
dataGp[0].prefixos.splice(dataGp[0].prefixos.indexOf(q.trim()), 1)
setGp(dataGp)
reply(`Prefixo ${q.trim()} tirado com sucesso da lista de prefixos de uso deste grupo..`)
break

case 'multiprefixo': case 'multiprefix':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins && !SoDono) return reply(Res_SoAdm)
if(isMultiP) {
dataGp[0].multiprefix = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].multiprefix = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antinotas':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiNotas) {
dataGp[0].antinotas = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antinotas = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'anticatalogo':
case 'anticatalg':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAnticatalogo) {
dataGp[0].anticatalogo = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].anticatalogo = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'Autodown':
case 'autodown':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(isAutodown) {
dataGp[0].autodown = false;
setGp(dataGp);
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].autodown = true;
setGp(dataGp);
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'bemvindo':
case 'welcome':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isWelkom) {
dataGp[0].wellcome[0].bemvindo1 = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].wellcome[0].bemvindo1 = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'bemvindo2':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(isWelkom2) {
dataGp[0].wellcome[1].bemvindo2 = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].wellcome[1].bemvindo2 = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'legendabv':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de boas-vindas*')
teks = body.slice(11)
if(isWelkom) {
dataGp[0].wellcome[0].legendabv = teks
setGp(dataGp)
reply('*Mensagem de boas vindas definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo 1`)
}
break

case 'legendasaiu':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de saída*')
teks = body.slice(13)
if(isWelkom) {
dataGp[0].wellcome[0].legendasaiu = teks
setGp(dataGp)
reply('*Mensagem de saída definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo 1`
)
}
break

case 'legendabv2':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de boas-vindas*')
teks = body.slice(12)
if(isWelkom2) {
dataGp[0].wellcome[1].legendabv = teks
setGp(dataGp)
reply('*Mensagem de boas vindas2 definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo2 1`)
}
break

case 'legendasaiu2':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de saída*')
teks = body.slice(14)
if(isWelkom2) {
dataGp[0].wellcome[1].legendasaiu = teks
setGp(dataGp)
reply('*Mensagem de saída2 definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo2 1`)
}
break

case 'legenda_estrangeiro':
case 'legenda_estrangeiros': 
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de remoção de estrangeiros*')
if(isAntifake) {
dataGp[0].legenda_estrangeiro = q
setGp(dataGp)
reply('*Mensagem de remoção de estrangeiros definida com sucesso!*')
} else {
reply(`Ative o antifake primeiro com ${prefix}antifake 1`)
}
break

case 'legenda_video': 
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de remoção de estrangeiros*')
dataGp[0].legenda_video = q
setGp(dataGp)
reply('*Mensagem de remoção de video definida com sucesso!*')
break

case 'legenda_imagem': 
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de remoção de estrangeiros*')
dataGp[0].legenda_imagem = q
setGp(dataGp)
reply('*Mensagem de remoção de imagem definida com sucesso!*')
break

case 'legenda_documento': 
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(args.length < 1) return reply('*Escreva a mensagem de remoção de estrangeiros*')
dataGp[0].legenda_documento = q
setGp(dataGp)
reply('*Mensagem de remoção de Documento definida com sucesso!*')
break

case 'autobang':
case 'listanegrag':
if(!SoDono) return reply(Res_SoDono)
if(!mrc_ou_numero) return reply("Marque a mensagem do usuário com o comando ou utilize o comando com o número do usuário que deseja adicionar na lista negra Global..")
if(listanegraG.includes(mrc_ou_numero)) return reply('*Esse Número ja esta incluso*')
listanegraG.push(mrc_ou_numero)
fs.writeFileSync('./dono/nescessario.json', JSON.stringify(nescessario, null, '\t'))
reply(`*Número adicionado a lista de autoban*`)
break

case 'tirardalistag':
if(!SoDono) return reply(Res_SoDono)
if(!mrc_ou_numero) return reply("Marque a mensagem do usuário com o comando ou utilize o comando com o número do usuário que deseja tirar da lista negra..")
if(!listanegraG.includes(mrc_ou_numero)) return reply('*Esse Número não esta incluso*')
var i = listanegraG.indexOf(mrc_ou_numero)
listanegraG.splice(i, 1)
fs.writeFileSync('./dono/nescessario.json', JSON.stringify(nescessario, null, '\t'))
reply(`*Número foi removido da lista negra*`)
break

case 'token_gpt':
if(!SoDono) return reply(Res_SoDono);
if(TOKEN_GPT.includes(q.trim())) return reply("Este token ja está armazenado..")
nescessario.TOKEN_GPT.push(q.trim())
TOKEN_GPT = nescessario.TOKEN_GPT
RND_TOKEN_GPT = q.trim()
setNes(nescessario)
reply("Token registrado com sucesso para o Chat Gpt, bom uso amigo(a)..")
break;

case 'autofigu': case 'autosticker':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAutofigu) {
dataGp[0].autosticker = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].autosticker = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'autorepo':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAutorepo) {
dataGp[0].autoresposta = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].autoresposta = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'modobrincadeira':
case 'modobrincadeiras':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isModobn) {
dataGp[0].jogos = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].jogos = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'bangp':
case 'unbangp': {
  if(!SoDono && !isnit && !info.key.fromMe) return reply(Res_SoDono)

  let arg = (q || '').trim()

  // bangp list
  if(arg.toLowerCase() === 'list') {
    var getGroups = await conn.groupFetchAllParticipating()
    var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
    var ingfoo = groups.map(v => v)
    ingfoo.sort((a, b) => (a[0] < b.length))

    let teks1 = `*LISTA DE GRUPOS*\n*Total de Grupos* : ${ingfoo.length}\n\n`
    for (let i = 0; i < ingfoo.length; i++){
      teks1 += `• *Grupo* : ${i}\n• *Nome* : ${ingfoo[i].subject}\n• *Id* : ${ingfoo[i].id}\n\n`
    }
    return reply(teks1)
  }

  // bangp <índice> -> grupo diferente do atual
  if(arg && !isNaN(arg)) {
    var getGroups = await conn.groupFetchAllParticipating()
    var groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
    let idx = parseInt(arg)
    if(!groups[idx]) return reply(`Grupo de índice *${idx}* não encontrado. Use *${usedPrefix + command} list* pra ver a lista.`)

    let targetId = groups[idx].id
    let dirTargetGp = `./banco de dados/grupos/${targetId}.json`
    let dataTargetGp
    try {
      dataTargetGp = fs.existsSync(dirTargetGp) ? readJSONCached(dirTargetGp) : JSON.parse(JSON.stringify(data_IDGP))
    } catch {
      dataTargetGp = JSON.parse(JSON.stringify(data_IDGP))
    }

    if(command == 'bangp') {
      if(dataTargetGp[0].bangp) return reply(`O grupo *${groups[idx].subject}* já está banido`)
      dataTargetGp[0].bangp = true
      fs.promises.writeFile(dirTargetGp, JSON.stringify(dataTargetGp, null, 2) + '\n').catch(console.error)
      return reply(`${Msg_BanGp}\n\n*Grupo* : ${groups[idx].subject}`)
    } else {
      if(!dataTargetGp[0].bangp) return reply(`O grupo *${groups[idx].subject}* não está mais banido`)
      dataTargetGp[0].bangp = false
      fs.promises.writeFile(dirTargetGp, JSON.stringify(dataTargetGp, null, 2) + '\n').catch(console.error)
      return reply(`${Msg_UnbanGp}\n\n*Grupo* : ${groups[idx].subject}`)
    }
  }

  // bangp sem argumento -> comportamento original, banir o grupo atual
  if(!isGroup) return reply(Res_SoGrupo)

  if(command == 'bangp') {
    if(dataGp[0].bangp) return reply(`Este grupo já está banido`)
    dataGp[0].bangp = true
    setGp(dataGp)
    reply(Msg_BanGp)
  } else {
    if(!dataGp[0].bangp) return reply(`Este grupo não está mais banido`)
    dataGp[0].bangp = false
    setGp(dataGp)
    reply(Msg_UnbanGp)
  }
  break
}

case 'boton':
case 'botoff':
if(!SoDono) return reply(Res_SoDono)
if(!isBotoff) {
nescessario.botoff = true
setNes(nescessario)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else if(isBotoff) {
nescessario.botoff = false
setNes(nescessario)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'modonsfw':
case 'nsfw':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(isNsfw) {
dataGp[0].nsfw = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].nsfw = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'antipalavrão':
case 'antipalavrao':  
case 'antipalavra': 
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isPalavrao) {
dataGp[0].antipalavrao.active = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].antipalavrao.active = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'limitecaracteres':
case 'limiteflood':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins) return reply(Res_SoAdm)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(isAntiFlood) {
dataGp[0].limitec.active = false
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ძᥱzᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
} else {
dataGp[0].limitec.active = true
setGp(dataGp)
reply('᥆ rᥱᥴᥙrs᥆ 𝖿᥆і ᥲ𝗍і᥎ᥲძ᥆ ᥴ᥆m sᥙᥴᥱss᥆ ✨')
}
break

case 'addpalavra':
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!isPalavrao) return reply('Anti palavrão desativado!')
if(args.length < 1) return reply( `Use assim : ${prefix + command} [palavrão]. exemplo ${prefix + command} puta`)
texto = args.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
if(isPalavras.includes(texto)) return reply('Já foi adicionada')
dataGp[0].antipalavrao.palavras.push(texto)
setGp(dataGp)
reply('Palavrão adicionado com sucesso!')
break

case 'delpalavra':
if(!SoDono  && !isnit && !issupre && !ischyt && !info.key.fromMe) return reply(Res_SoDono)
if(!isPalavrao) return reply('Anti palavrão desativado!')
if(args.length < 1) return reply( `Use assim : ${prefix + command} [palavrão]. exemplo ${prefix + command} puta`)
texto = args.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
if(!isPalavras.includes(texto)) return reply('Já foi removida')
var i = dataGp[0].antipalavrao.palavras.indexOf(texto)
dataGp[0].antipalavrao.palavras.splice(i, 1)
setGp(dataGp)
reply('Palavrão removido da lista com sucesso!')
break

case 'listapalavrão': case 'listapalavra':
case 'listpalavra':
if(!isPalavrao) return reply('Anti palavrão desativado!')
let lbw = `Esta é a lista de palavrão\nTotal : ${isPalavras.length}\n`
for (let i of isPalavras) {
lbw += `➸ ${i}\n`
}
await reply(lbw)
break

case 'limitec_global':
case 'limitec':
if(!SoDono && !isnit && !ischyt) return reply(Res_SoDono)
if(!isAntiFlood) return reply(`Ative este recurso primeiro ${prefix}limiteflood 1`)
if(!q) return reply(`Cade a quantidade? Ex: ${prefix + command} 5000`)
if(isNaN(q) == true) return reply('Digite apenas números')
if(command == 'limitec'){
dataGp[0].limitec.quantidade = q
setGp(dataGp)
reply(`Foi alterado o limite de caracteres para: ${q}`)
} else {
var data = { limitefl: q }
fs.writeFileSync('./arquivos/usuarios/flood.json', JSON.stringify(data, null, '\t'))
reply(`Foi adicionado um limite global de caracteres de: ${q}`)
}
break

case 'status':
if(!isGroup) return reply(Res_SoGrupo)
if(!isGroupAdmins && !SoDono && !isnit && !issupre && !ischyt &&
!info.key.fromMe) return reply(Res_SoAdm);
const on = '✅'
const off = '❌'

const db = getAntiMeta()
const logostt = `https://i.ibb.co/67f8hDy5/7367229c1831.jpg`
const statuszada2 = Msg_Status
  .replace('#antilink#', isAntiLinkHard ? on : off)
  .replace('#antinotas#', isAntiNotas ? on : off)
  .replace('#antiflood#', isAntiFlood ? on : off)
  .replace('#antifake#', isAntifake ? on : off)
  .replace('#anticatalogo#', isAnticatalogo ? on : off)
  .replace('#antiloc#', Antiloc ? on : off)
  .replace('#x9#', isx9 ? on : off)
  .replace('#modobn#', isModobn ? on : off)
  .replace('#antilinkgp#', isAntilinkgp ? on : off)
  .replace('#antimention#', isAntimention ? on : off)
  .replace('#welkom1#', isWelkom ? on : off)
  .replace('#welkom2#', isWelkom2 ? on : off)
  .replace('#antivid#', isAntiVid ? on : off)
  .replace('#antiimg#', isAntiImg ? on : off)
  .replace('#antiaudio#', isAntiAudio ? on : off)
  .replace('#antidoc#', Antidoc ? on : off)
  .replace('#antictt#', isAntiCtt ? on : off)
  .replace('#antisticker#', isAntiSticker ? on : off)
  .replace('#autofigu#', isAutofigu ? on : off)
  .replace('#autorepo#', isAutorepo ? on : off)
  .replace('#palavrao#', isPalavrao ? on : off)
  .replace('#antimeta#', db[from] === true ? on : off)
  .replace('#modocoins#', isModoCoins ? on : off)
  .replace('#modoia#', isModoIA ? on : off)
  .replace('#anticanal#', anticanalON ? on : off)
conn.sendMessage(from, {image: {url: logostt}, caption: statuszada2}, {quoted: selo})
break

case 'r':
case 'reiniciar':
if(!SoDono) return
setTimeout(async () => {
reply(`mᥱᥙ 𝗊ᥙᥱrіძ᥆ ძ᥆ᥒ᥆, ᥱs𝗍᥆ᥙ rᥱіᥒіᥴіᥲᥒძ᥆ ᥲgᥙᥲrძᥱ ᥙm mіᥒᥙ𝗍іᥒһ᥆ ᥆k?? ✨️🦋`)
setTimeout(async () => {
process.exit()
}, 1200)
}, 1000)
break

case 'reviver_qr':
case 'reviverqr':
case 'novoqr':
  if (!SoDono) return reply(Res_SoDono);
  reply("*Okay, irei reiniciar o qr, aguarde um momento... 🙇‍♂️*");
  setTimeout(async () => {
 try {
fs.rmSync('./banco de dados/qrcode', { recursive: true, force: true });
 } catch (e) {}
 setTimeout(() => {
const { spawn } = require('child_process');
const proc = spawn(process.execPath, process.argv.slice(1), {
  detached: true,
  stdio: 'inherit'
});
proc.unref();
process.exit(0);
 }, 1500);
  }, 1500);
break;

//==========(Sticker-Stickers)===========\\

case 'togif': 
if(!isQuotedSticker) return reply('Por favor, marque uma figurinha animada à mensagem.');
reagir(from, "✨️")
try {
if((isMedia && !info.message.videoMessage || isQuotedSticker) && !q.length <= 1) {
const { FiguMp4OuGif } = require('./arquivos/armor/sticker/togif.js');
getBufferWebP = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, "sticker");
fs.writeFileSync("./arquivos/convert.webp", getBufferWebP);
 outputFile = "./arquivos/convert.webp";
convertWebP = await FiguMp4OuGif(outputFile);
conn.sendMessage(from, {video: {url: convertWebP}, gifPlayback: true, fileName: 'sticker-sb.gif'}, {quoted: selo}).catch(async(error) => {
await reply(console.error()); // Notificar ao usuário que ocorreu um erro ao enviar o resultado da conversão do WebP para MP4.
await DLT_FL(outputFile); // Apagar o arquivo, caso ocorrer um erro na conversão entre eles.
console.log(error)
});
}
} catch(error) {
await reply(console.error()); // Notificar ao usuário que ocorreu um erro ao realizar a conversão do WebP para MP4.
console.log(error)
};
break

case 'rename':
case 'roubar':
if(!isQuotedSticker) 
return reply('*Aaaah! 🤭 Marque uma figurinha para eu renomear!* 💖✨')

var kls = q

var pack = kls.split("|")[0];

var author2 = kls.split("|")[1];

if(!q) 
return reply('*Oops! 😅 Você esqueceu de colocar o nome da figurinha!* 💕📝')

if(!pack) 
return replyr(`*Eitaa! 😵 Você precisa colocar um nome antes da barra ( | )!* 💖✨`)

renameContextSticker(
pack,
author2,
`💖 Figurinha renomeada com sucesso! ✨`,
info
)
.catch((err) => {

reply(`*Aaaah! 😢 Ocorreu um erro ao renomear a figurinha, tenta novamente mais tarde!* 💕⚡`);
})
break

case 'take':
reagir(from, "✨️")
i8 = rgtake.map(i => i.usuario).indexOf(sender)

if(i8 < 0) 
return reply(`*Aaaah! 😅 Você ainda não registrou uma marca d'água personalizada!* 💖✨

*Use o comando abaixo para registrar a sua:* 🤭💞

*rgtake Mizuki|Sattz*`)

renameContextSticker(
rgtake[i8].mcdagua1,
rgtake[i8].mcdagua2,
`💖 Figurinha renomeada com sucesso! ✨`,
info
)
.catch((err) => {

reply(`*Oops! 😵 Ocorreu um erro ao renomear a figurinha, tenta novamente mais tarde!* 💕⚡`);
})
break

case 'rgtake':
var [TP, TP2] = q.split("|")
rgtakergtake = []
for (i of rgtake) {rgtakergtake.push(i.usuario)}
if(rgtakergtake.indexOf(sender) >= 0) 
return reply(`*Eitaa! 🤭 Você já possui uma marca d'água registrada!* 💖✨

*Caso queira alterar, utilize:* ${prefix}rntake name|autor 😆💞`)

if(!q.includes("|")) 
return reply(`*Aaaah! 🤭 Use corretamente assim:* ${prefix + command} Mizuki|Sattz 💖📝`)

if(!TP) 
return reply(`*Oops! 😅 Você esqueceu de preencher o primeiro campo!* 💕✨

*Exemplo:* ${prefix + command} Mizuki|Bot`)

if(!TP2) 
return reply(`*Oops! 😅 Você esqueceu de preencher o segundo campo!* 💕✨

*Exemplo:* ${prefix + command} Mizuki|Bot`)

rgtake.push({
usuario: sender,
mcdagua1: TP,
mcdagua2: TP2
})

fs.writeFileSync("./arquivos/take.json", JSON.stringify(rgtake, null, 2))

reply(`*Prontinho! 😊 Sua marca d'água foi registrada com sucesso!* 💖✨

*Agora você já pode usar o comando:* ${prefix}take 🤭💞`)
break

case 'rntake':
i8 = rgtake.map(i => i.usuario).indexOf(sender)
if(i8 < 0) 
return enviar(`*Aaaah! 😅 Como você quer alterar uma marca d'água sem ter registrado uma antes?* 💖✨`)

if(!q.includes("|")) 
return reply(`*Oops! 🤭 Use corretamente assim:* ${prefix + command} Mizuki|Bot 💕📝`)

var [MARCAD1, MARCAD2] = q.split("|")

if(!MARCAD1) 
return reply(`*Eitaa! 😵 Você esqueceu de preencher o primeiro campo!* 💖✨

*Exemplo:* ${prefix + command} Mizuki|Bot`)

if(!MARCAD2) 
return reply(`*Eitaa! 😵 Você esqueceu de preencher o segundo campo!* 💖✨

*Exemplo:* ${prefix + command} Mizuki|Bot`)

rgtake[i8].mcdagua1 = MARCAD1
rgtake[i8].mcdagua2 = MARCAD2

fs.writeFileSync("./arquivos/take.json", JSON.stringify(rgtake, null, 2) + '\n')

reply(`*Prontinho! 😊 Sua marca d'água foi alterada com sucesso!* 💖✨

*Nova marca:* "${MARCAD1}|${MARCAD2}" 🤭💞`)
break

case 'fstiker':
case 'fsticker':
case 'f':
var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
var boij = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
var boij2 = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage  
if(boij) {
 var pack = `Criador (a) da Figurinha:\n• ↳ ${pushname} owner\n_ ${NomeDoBot} - ${NickDono}`
/* var author2 = `⚒${pushname}\n⚒${NomeDoBot}\n${NickDono}`*/
owgi = await getFileBuffer(boij, 'image')
let encmediaa = await sendImageAsSticker(conn, from, owgi, info, { packname:pack})
await DLT_FL(encmediaa)
} else if(boij2 && boij2?.seconds < 11) {
 var pack = `Criador (a) da Figurinha:\n• ↳ ${pushname} owner\n_ ${NomeDoBot} - ${NickDono}`
 /*var author2 = `⚒${pushname}\n⚒${NomeDoBot}\n${NickDono}`*/
owgi = await getFileBuffer(boij2, 'video')
let encmedia = await sendVideoAsSticker(conn, from, owgi, info, { packname:pack})
await DLT_FL(encmedia)
} else {
reply(`Enviar imagem / vídeo / gif com legenda \n${prefix}sticker (duração do adesivo de vídeo de 1 a 10 segundos)`)
}
break

case 'st':
case 'stk':
case 'sticker':
case 's':
 var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
 var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
 var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage

 if (boij2) {
  owgi = await getFileBuffer(boij2, 'image')
  let encmediaa = await sendImageAsSticker2(conn, from, owgi, selo, { 
packname: NomeDoBot, 
author: pushname
  })
  await DLT_FL(encmediaa)
 } else if (boij && boij.seconds < 11) {
  owgi = await getFileBuffer(boij, 'video')
  let encmedia = await sendVideoAsSticker2(conn, from, owgi, selo, { 
packname: NomeDoBot, 
author: pushname
  })
  await DLT_FL(encmedia)
 } else {
  reply('*Marque uma imagem ou vídeo com no máximo 9.9 segundos 🙇‍♂️*')
 }
break

case 'toimg':
if(!isQuotedSticker) return reply('Por favor, *mencione um sticker* para executar o comando.')
try {
reply(`*Transformando em imagem!!✨*`);
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
conn.sendMessage(from, {image: buff}, {quoted: selo}).catch(e => {
console.log(e);
reply('Ocorreu um erro ao converter o *sticker para imagem.*')
})
} catch {
reagir(from, "❌️")
}
break

//=============(LOGOS)=============\\

case 'metadinha': {
 try {
  const { data } = await axios.get(`${API_KIMORI_URL}/api/metadinha/random?apikey=${APIKEY_KIMORI}`, { timeout: 15000 });
  await conn.sendMessage(from, { image: { url: data.masculina } })
  await conn.sendMessage(from, { image: { url: data.feminina } })
 } catch (e) {
  return reply("erro")
 }
break;
}

//========(SORTEIO-VOTAR-CASES)=========\\

case 'substituir':
if(!SoDono && !isnit) return reply("Só dono..")
 if(isMedia && !info.message.videoMessage || isQuotedDocument) {
media = isQuotedDocument ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage : info.message.documentMessage
rane = getRandom('.'+await getExtension(media.mimetype))
doc = await getFileBuffer(media, 'document')
fs.writeFileSync(q, doc)
conn.sendMessage(from, {text:'Substituido com sucesso..'},{quoted: selo})
} else {
reply('Marque o documento ou arquivo..')
}
break

case 'index-bot':
if(!SoDono)return reply(Res_SoDono)
if(isMedia && !info.message.videoMessage || isQuotedDocument) {
media = isQuotedDocument ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage : info.message.documentMessage
rane = getRandom('.'+await getExtension(media.mimetype))
doc = await getFileBuffer(media, 'document')
fs.writeFileSync('./index.js', doc)
conn.sendMessage(from, {text:'Pronto novinha..'},{quoted: selo})
} else {
reply('Marque o documento ou o arquivo que deseja enviar pra determinar pasta ou substituir..')
}
break

case 'bann':
if(!SoDono) return reply(Res_SoDono)
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(!menc_os2 || menc_jid2[1]) return reply("Marque a mensagem do usuário ou marque o @ dele.., lembre de só marcar um usuário...")
if(!JSON.stringify(groupMembers).includes(menc_os2)) return reply("Este usuário já foi removido ou saiu do grupo.")
if(premium.includes(menc_os2)) return mentions(`@${menc_os2.split("@")[0]} a(o) @${sender.split("@")[0]} está querendo banir você, visualiza esse problema ae 😶`, [menc_os2], true)
if(groupAdmins.includes(menc_os2)) return mentions(`@${menc_os2.split("@")[0]} a(o) @${sender.split("@")[0]} está querendo banir você, visualiza esse problema ae 😶`, [menc_os2], true)
if(botNumber.includes(menc_os2)) return reply('Não sou besta de remover eu mesmo né 🙁, mas estou decepcionado com você')
if(numerodono.includes(menc_os2)) return reply('Não posso remover meu dono 🤧')
conn.sendMessage(from, {text: `@${menc_os2.split("@")[0]} Foi [ REMOVIDO(A) COM SUCESSO ] - (Por motivos ainda não esclarecidos) -`, mentions: [menc_os2]})
conn.groupParticipantsUpdate(from, [menc_os2], "remove")  
break

case 'nuke': case 'arquivargp':
if(!SoDono && !isnit) return reply("Só dono pode utilizar este comando...")
if(!isBotGroupAdmins) return reply(Res_BotADM)
if(info.key.fromMe) return 
blup = []
for ( i of groupMembers) {
if(!numerodono.includes(i.id)) blup.push(i.id)
}
blup.splice(blup.indexOf(botNumber), 1)
for ( i = 0; i < blup.length; i++) {
await sleep(500)
conn.groupParticipantsUpdate(from, [blup[i]], 'remove')
} 
break

//==========(TTPS/ATTP)============\\

case 'attp': case 'attp1': case 'attp2': case 'attp3': case 'attp4': 
case 'attp5': case 'attp6': case 'attp7': case 'attp8': case 'attp9': 
case 'attp10': case 'attp11': case 'attp12': case 'attp13': case 'attp14': case 'attp15':
if (!q) return reply("Ei, cadê o texto?")
try {// By: 𖧄 𝐋𝐔𝐂𝐀𝐒 𝐌𝐎𝐃 𝐃𝐎𝐌𝐈𝐍𝐀 𖧄
const tempDir = path.join(__dirname, 'temp')
if (!fs.existsSync(tempDir)) {
fs.mkdirSync(tempDir, { recursive: true })
}
const url = `${zerosite}/api/canvas/attps?type=${command}&texto=${encodeURIComponent(q)}&apikey=${API_KEY_ZERO}`
const response = await fetch(url)
if (!response.ok) {
console.error(`Erro na API: ${response.status} - ${response.statusText}`)
return reply("Houve um problema ao processar sua solicitação.")
}
const arrayBuffer = await response.arrayBuffer()
const gifBuffer = Buffer.from(arrayBuffer)
const filename = `attp_${Date.now()}`
const gifPath = path.join(tempDir, `${filename}.gif`)
const webpPath = path.join(tempDir, `${filename}.webp`)
fs.writeFileSync(gifPath, gifBuffer)
const ffmpegCmd = `ffmpeg -i ${gifPath} -vcodec libwebp -filter_complex "[0:v] scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -lossless 1 -loop 0 -an -vsync 0 ${webpPath}`
exec(ffmpegCmd, async (error) => {
if (error) {
console.error(`Erro na conversão FFMPEG: ${error.message}`)
if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath)
return reply("Erro ao processar a figurinha. Verifique o FFMPEG.")
}
const finalStickerBuffer = fs.readFileSync(webpPath)
await conn.sendMessage(from, { sticker: finalStickerBuffer }, { quoted: info })
if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath)
if (fs.existsSync(webpPath)) fs.unlinkSync(webpPath)
})
} catch (error) {
console.error("Erro no comando ATTP:", error)
reply("Erro ao gerar a figurinha.")
}
break


//======================================\\


//===(ZOUEIRAS/BRINCADEIRAS/HUMOR)===\\

case 'fazernick':
case 'gerarnick':
case 'nick': {
  try {

 if (!q?.trim()) return reply(`Exemplo: ${prefix + command} Nk Petrov`)

 reply("Aguarde um momento..")

 const url = `${API_KIMORI_URL}/api/fazernick?nome=${encodeURIComponent(q)}&apikey=${APIKEY_KIMORI}`
 const res = await fetch(url)
 const json = await res.json()

 if (!json.success || !Array.isArray(json.nicks) || !json.nicks.length)
return reply("Não foi possível gerar nicks.")

 let msg = "*✨ GERADOR DE NICKS ✨*\n\n"
 let lista = []

 json.nicks.forEach((nick, index) => {
msg += `(${index + 1}) ${nick}\n`
lista.push(nick)
 })

 ultimosNicks[sender] = lista

 msg += `\n> Envie o número do Nick que deseja copiar. 🐈‍⬛\n- *✨ Exemplo*: 10`

 reply(msg.trim())

  } catch (e) {
 console.log(e)
 reply("❌ Erro ao gerar nicks.")
  }
}
break

case 'gerarnick2': {
try {
 if (!args[0]) return reply(`use ${prefix + command} (nome) para gerar o nick`);
await reagir(from, '✨')

MZK = await fetchJson(`${API_KIMORI_URL}/api/fazernick?nome=${q}&apikey=${APIKEY_KIMORI}`)
const nicks = MZK.nicks
MZ = `Lista de nicks para ${q}:\n\n`
for (let i = 0; i < nicks.length; i++) {
MZ += `${i + 1}. ${nicks[i]}\n`
}
reply(MZ);
} catch (e) {
 console.log('gerarnick2 info erro:', e?.message);
 return reply('erro, de uma olhada na api');
}
break;
}

case 'chance':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)  
var avb = body.slice(7)
if(args.length < 1) return conn.sendMessage(from, {text: `Você precisa digitar da forma correta\nExemplo: ${prefix}chance do luuck ser gay`}, {quoted: selo})
random = `${Math.floor(Math.random() * 100)}`
hasil = `A chance ${body.slice(8)}\n\né de... ${random}%`
mention(hasil)
break

case 'nazista':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text: `${Res_Aguarde}`, mentions: [sender_ou_n]})
setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
conn.sendMessage(from, {image: {url: imgnazista}, caption: `O quanto você é nazista? \n\n「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱  nazista 卐`, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 

case 'gay':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text: `${Res_Aguarde}`, mentions: [sender_ou_n]})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
feio = random
boiola = random
if(boiola < 20 ) {var bo = 'hmm... você é hetero🥱'} else if(boiola == 21 ) {var bo = '+/- boiola'} else if(boiola == 23 ) {var bo = '+/- boiola'} else if(boiola == 24 ) {var bo = '+/- boiola'} else if(boiola == 25 ) {var bo = '+/- boiola'} else if(boiola == 26 ) {var bo = '+/- boiola'} else if(boiola == 27 ) {var bo = '+/- boiola'} else if(boiola == 2 ) {var bo = '+/- boiola'} else if(boiola == 29 ) {var bo = '+/- boiola'} else if(boiola == 30 ) {var bo = '+/- boiola'} else if(boiola == 31 ) {var bo = 'tenho minha desconfiança...😵'} else if(boiola == 32 ) {var bo = 'tenho minha desconfiança...😨'} else if(boiola == 33 ) {var bo = 'tenho minha desconfiança...😨'} else if(boiola == 34 ) {var bo = 'tenho minha desconfiança...😲'} else if(boiola == 35 ) {var bo = 'tenho minha desconfiança...😵'} else if(boiola == 36 ) {var bo = 'tenho minha desconfiança...🥱'} else if(boiola == 37 ) {var bo = 'tenho minha desconfiança...💙'} else if(boiola == 3 ) {var bo = 'tenho minha desconfiança...💙'} else if(boiola == 39 ) {var bo = 'tenho minha desconfiança...💙'} else if(boiola == 40 ) {var bo = 'tenho minha desconfiança...💙'} else if(boiola == 41 ) {var bo = 'você é né?💙'} else if(boiola == 42 ) {var bo = 'você é né?💙'} else if(boiola == 43 ) {var bo = 'você é né?💙'} else if(boiola == 44 ) {var bo = 'você é né?💙'} else if(boiola == 45 ) {var bo = 'você é né?💙'} else if(boiola == 46 ) {var bo = 'você é né?💙'} else if(boiola == 47 ) {var bo = 'você é né?💙'} else if(boiola == 4 ) {var bo = 'você é né?💙'} else if(boiola == 49 ) {var bo = 'você é né?💙'} else if(boiola == 50 ) {var bo = 'você é ou não?💙'} else if(boiola > 51) {var bo = 'você é gay🙈'
}
conn.sendMessage(from, {image: {url: imggay}, caption: `  O quanto você é gay? \n\n 「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱ gay 🏳️‍🌈\n\n${bo}`, mentions: [sender_ou_n], thumbnail:null}, {quoted: selo})
}, 7000)
break

case 'feio':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text: `${Res_Aguarde}`, mentions: [sender_ou_n]})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
feio = random
if(feio < 20 ) {var bo = 'É não é feio'} else if(feio == 21 ) {var bo = '+/- feio'} else if(feio == 23 ) {var bo = '+/- feio'} else if(feio == 24 ) {var bo = '+/- feio'} else if(feio == 25 ) {var bo = '+/- feio'} else if(feio == 26 ) {var bo = '+/- feio'} else if(feio == 27 ) {var bo = '+/- feio'} else if(feio == 2 ) {var bo = '+/- feio'} else if(feio == 29 ) {var bo = '+/- feio'} else if(feio == 30 ) {var bo = '+/- feio'} else if(feio == 31 ) {var bo = 'Ainda tá na média'} else if(feio == 32 ) {var bo = 'Da pra pegar umas(ns) novinha(o) ainda'} else if(feio == 33 ) {var bo = 'Da pra pegar umas(ns) novinha(o) ainda'} else if(feio == 34 ) {var bo = 'É fein, mas tem baum coração'} else if(feio == 35 ) {var bo = 'Tá na média, mas não deixa de ser feii'} else if(feio == 36 ) {var bo = 'Bonitin mas é feio com orgulho'} else if(feio == 37 ) {var bo = 'Feio e preguiçoso(a), vai se arrumar praga feia'} else if(feio == 3 ) {var bo = 'tenho '} else if(feio == 39 ) {var bo = 'Feio, mas um banho E se arrumar, deve resolver'} else if(feio == 40 ) {var bo = 'FeiN,  mas não existe gente feia, existe gente que não conhece os produtos jequity'} else if(feio == 41 ) {var bo = 'você é Feio, mas é legal, continue assim'} else if(feio == 42 ) {var bo = 'Nada que uma maquiagem e se arrumar, que não resolva 🥱'} else if(feio == 43 ) {var bo = 'Feio que dói de ver, compra uma máscara que melhora'} else if(feio == 44 ) {var bo = 'Feio mas nada que um saco na cabeça não resolva né!?'} else if(feio == 45 ) {var bo = 'você é feio, mas tem bom gosto'} else if(feio == 46 ) {var bo = 'Feio mas tem muitos amigos'} else if(feio == 47 ) {var bo = 'Feio mas tem lábia pra pegar várias novinha'} else if(feio == 4 ) {var bo = 'Feio e ainda não sabe se vestir, vixi'} else if(feio == 49 ) {var bo = 'Feiooo'} else if(feio == 50 ) {var bo = 'você é Feio, mas não se encherga 🥴'} else if(feio > 51) {var bo = 'você é Feio demais 🙈'} 

conn.sendMessage(from, {image: {url: imgfeio}, caption: `  O quanto você é feio? \n\n 「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱ feio 🙉\n\n${bo}`, mentions: [sender_ou_n], thumbnail:null}, {quoted: selo})
}, 7000)
break 

case 'corno':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text:` ${Res_Aguarde}`, mentions: [sender_ou_n]})
setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
conn.sendMessage(from, {image: {url: imgcorno}, caption: ` O quanto você é corno? \n\n 「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱  corno 🐃`, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break

case 'vesgo':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text:`${Res_Aguarde}`, mentions: [sender_ou_n]})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
conn.sendMessage(from, {image: {url: imgvesgo}, caption: `O quanto você é vesgo? \n\n「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱  Vesgo 🙄😆`, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 

case 'bebado':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text:`${Res_Aguarde}`, mentions: [sender_ou_n]})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
conn.sendMessage(from, {image: {url: imgbebado}, caption:`O quanto você é bebado? \n\n「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱ Bêbado 🤢🥵`, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 

case 'gado':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text:`${Res_Aguarde}`, mentions: [sender_ou_n]})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
conn.sendMessage(from, {image: {url: imggado}, caption: `O quanto você é gado? \n\n「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱  gado 🐂`, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 

case 'gostoso':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text:`${Res_Aguarde}`, mentions: [sender_ou_n]})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
conn.sendMessage(from, {image: {url: imggostoso}, caption: `O quanto você é gostoso? 🥵\n\n「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱ gostoso 😝`, gifPlayback: true, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break 

case 'gostosa':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
conn.sendMessage(from, {text:`${Res_Aguarde}`, mentions: [sender_ou_n]})
 setTimeout(async() => {
random = `${Math.floor(Math.random() * 110)}`
conn.sendMessage(from, {image: {url: imggostosa}, caption: `O quanto você é gostosa? 🥵\n\n「 @${sender_ou_n.split("@")[0]} 」Você é: ❰ ${random}% ❱ gostosa 😳`, mentions: [sender_ou_n]}, {quoted: selo})
}, 7000)
break

case 'matar':
case 'mata':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
if(!menc_os2 || menc_jid2[1]) return reply('marque o alvo que você quer matar, a mensagem ou o @')
conn.sendMessage(from, {video: {url: matarcmd}, gifPlayback: true, caption: `Você Acabou de matar o(a) @${menc_os2.split('@')[0]} 👹`, mentions: [menc_os2]}, {quoted: selo})
break 


case 'beijo':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
if(!menc_os2 || menc_jid2[1]) return reply('marque a pessoa que você quer beijar, a mensagem ou o @')
conn.sendMessage(from, {video: {url: beijocmd}, gifPlayback: true, caption: `Você deu um beijo gostoso na(o) @${menc_os2.split('@')[0]} ✨️` , mentions: [menc_os2]}, {quoted: selo})
break

case 'comer':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
if(!menc_os2 || menc_jid2[1]) return reply('marque a pessoa que você quer comer bem gostosinho🥵🥵, a mensagem ou o @')
conn.sendMessage(from, {video: {url: comercmd}, gifPlayback: true, caption: `Você comeu bem gostoso a(o) @${menc_os2.split('@')[0]} 🥵🍆` , mentions: [menc_os2]}, {quoted: selo})
break

case 'fuder':
  if(!isGroup) return reply(Res_SoGrupo)
  if(!isModobn) return reply(Res_SoModoBN)
  if(!menc_os2 || menc_jid2[1]) return reply('marque a pessoa que você quer fazer sexo gostoso, mensagem ou o @')

  conn.sendMessage(from, {
    image: {url: 'https://i.postimg.cc/Z5JkmqVh/4f860908915d71ff4c10ddcb8c9eb3fd-8.jpg'},
    caption: `Você Fudeu Gostoso com a(o) @${menc_os2.split("@")[0]} 😁👉👈❤`,
    mentions: [menc_os2]
  }, {quoted: selo})
break

case 'eununca':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
setTimeout(() => {reagir(from, "🙈")}, 100)
const pergunta_ = JSON.parse(fs.readFileSync('./arquivos/armor/funcoes/eununca.json', 'utf-8'));
const getRandomINever = pergunta_[Math.floor(Math.random() * pergunta_.length)]
sendPoll(conn, from, getRandomINever, ["Eu nunca", "Eu já"]).catch(console.error);
break

case 'biografia':
try {
var status = await conn.fetchStatus(marc_tds)  
} catch {
var status = "Privado ou inexistente. "
}
reply(status)
break

case 'tapa':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
if(!menc_os2 || menc_jid2[1]) return reply('marque o alvo que você quer da um tapa, a mensagem ou o @')
conn.sendMessage(from, {video: {url: tapacmd}, gifPlayback: true, caption: `Você Acabou de da um tapa na cara da💙 @${menc_os2.split('@')[0]} 🔥`, mentions: [menc_os2]}, {quoted: selo})
break

case 'chute':
case 'chutar':  
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
if(!menc_os2 || menc_jid2[1]) return reply('marque o alvo que você quer da um chute, a mensagem ou o @')
conn.sendMessage(from, {video: {url: chutecmd}, gifPlayback: true, caption: `Você Acabou de da um chute em @${menc_os2.split('@')[0]} 🤡`, mentions: [menc_os2]}, {quoted: selo})
break 

case 'dogolpe':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
if(!menc_os2 || menc_jid2[1]) return reply('Marque a mensagem com o comando ou marque o @ do usuário..')
random = `${Math.floor(Math.random() * 100)}`
conn.sendMessage(from, {text:`*GOLPISTA ENCONTRADO👉🏻*\n\n*GOLPISTA* : *@${menc_os2.split("@")[0]}*\n*PORCENTAGEM DO GOLPE* : ${random}%😂\n\nEle(a) gosta de ferir sentimentos 😢`, mentions: [menc_os2]})
break

case 'shipo':
if(!menc_jid2) return reply('Marque uma pessoa do grupo para encontrar o par dela')
mention(`*Hmmm.... Eu Shipo eles 2💘💘*\n\n1 = @${groupMembers[Math.floor(Math.random() * groupMembers.length)].id.split('@')[0]}\n && 2 = ${menc_jid2.split("@")[0]} com uma porcentagem de: ${Math.floor(Math.random() * 100)+"%"}`)
break

case 'casal':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
mention(`*Hmmm.... Eu Shipo eles 2💘💘*\n\n1= @${groupMembers[Math.floor(Math.random() * groupMembers.length)].id.split('@')[0]}\ne esse\n2= @${groupMembers[Math.floor(Math.random() * groupMembers.length)].id.split('@')[0]}\ncom uma porcentagem de: ${Math.floor(Math.random() * 100)+"%"}`)
break

case 'rankgay': case 'rankgays':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `*🤖RANK DOS 5 MAIS GAYS DO GRUPO [ ${groupName} ]🏳‍🌈*\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgay)
break;

case 'rankdev':
 if (!isGroup) {
  conn.sendMessage(info.key.remoteJid, { text: '❌ Este comando só funciona em grupos!' });
  break;
 }
 
 const participants1 = await conn.groupMetadata(info.key.remoteJid);
 
 const members1 = participants1.participants.map(p => p.id); 
 if (members1.length < 5) {
  conn.sendMessage(info.key.remoteJid, { text: '❌ O grupo precisa ter pelo menos 5 membros!' });
  break;
 }
 
 const selected1 = members1.sort(() => 0.5 - Math.random()).slice(0, 5);
 const medals1 = ['🥇', '🥈', '🥉', '🏅', '🏅']; 
 let text1 = '🏆 *TOP 5 PROGRAMADORES DO GRUPO* 🏆\n\n👨‍💻 Esses são os programadores mais fodas:\n\n';
 selected1.forEach((member, i) => {
  text1 += `${medals1[i]} *#${i + 1}* - @${member.split('@')[0]}\n`;
 });
 text1 += '\n💻 Vocês são foda demais! 🔥';
  conn.sendMessage(info.key.remoteJid, {
  image: { url: 'https://qu.ax/gjOhG.jpg' },
  caption: text1,
  mentions: selected1
 });
 break; 

case 'rankgado': case 'rankgados':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `RANK DOS 5 MAIS GADO DO GRUPO 🐂🐃\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgado);
break;

case 'rankcorno': case 'rankcornos':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `RANK DOS 5 MAIS CORNO DO GRUPO 🐂\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkcorno);
break;

case 'rankgostosos': case 'rankgostoso':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `RANK DOS 5 MAIS GOSTOSOS DO GRUPO 💙🔥\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgostoso);
break;

case 'rankgostosas': case 'rankgostosa':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `RANK DAS 5 MAIS GOSTOSAS DO GRUPO 💙🔥\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkgostosa);
break;

case 'ranknazista': case 'ranknazistas':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `*💂‍♂RANK DOS 5 MAIS NAZISTAS DO GRUPO 卐🤡*\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnknazista);
break;

case 'rankotaku': case 'rankotakus':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `*㊙ RANK DOS 5 MAIS OTAKU DO GRUPO ( ˶•̀ _•́ ˶)*\n\n`
for (var i = 0; i < 5; i++) {
ABC += `${Math.floor(Math.random() * 100)}% @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkotaku);
break;

case 'rankpau':
if(!isGroup) return reply(Res_SoGrupo)
if(!isModobn) return reply(Res_SoModoBN)
ABC = `*RANK DOS 5 PAU MAIOR DO GRUPO 🪻*\n\n`
TMPAU = ["Pequeno pra cact, se mata maluco 🤮", `Pequenininho chega ser até fofo 🤏🥹`, `Menor que meu dedo mindinho pequeno demais 😨`, `Até que dá sentir, tá na média 🥱`, `Grandinho 😲`, `Grande até 😳`, `Gigantesco igual meu braço 🥵`, `Enorme quase chega no útero 😵`, `Grandão demais em, e uii 🥴`, `Vara de pegar manga, grande demais, como sai na rua assim??`, "Que grandão em, nasceu metade animal 🍆🍆💀☠️"]
for (var i = 0; i < 5; i++) {
ABC += `${TMPAU[Math.floor(Math.random() * TMPAU.length)]} _- @${somembros[Math.floor(Math.random() * somembros.length)].split("@")[0]}\n\n`
}
mencionarIMG(ABC, rnkpau);
break;

case 'convite':
if(!budy.includes("chat.whatsapp.com")) return reply("Cadê o link do grupo que você deseja que eu entre?")  
cnvt = args.join(" ")
reply(`O convite para o bot entrar em seu grupo, foi enviado, espere o dono aceitar..`)
await sleep(1000)
reply(`Use ${prefix}entrar cnvt ou ${prefix}recusar ${sender}, alguem enviou convite para entrar no grupo dele.`)
break

case 'recusar':
if(!SoDono) return reply(Res_SoDono)
conn.sendMessage(q, {text: `Olá Amigo(a), sinto muito dizer, mas seu convite foi recusado 💙`})
break

case 'join': case 'entrar':
if(!SoDono) return reply(Res_SoDono)
string = args.join(' ')
if(!string) return reply('Insira um link de convite ao lado do comando.')
if(string.includes('chat.whatsapp.com/') || reply('Ops, verifique o link que você inseriu.') ) {
link = string.split('app.com/')[1]
try {
conn.groupAcceptInvite(`${link}`)
} catch(erro) {
if(String(erro).includes('resource-limit') ) {
reply('O grupo já está com o alcance de 257 membros.')
}
if(String(erro).includes('not-authorized') ) {
reply('Não foi possível entrar no grupo.\nMotivo: Banimento.')
}
}
}
break

case 'videoesquilo':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]atempo=0.7,asetrate=65100[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Esquilo\n*❒ For:* ffmpeg\n*❒ By:* Sattz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videocontrario':
if((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf reverse -af areverse ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if(err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Reversão\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo..")
}
break 

case 'videorapido':
if ((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "setpts=0.5*PTS" -af "atempo=2.0" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Aceleração\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videopretobranco':
if ((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "hue=s=0" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Preto e Branco\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videotext':
if(!q) return reply(`Adicione um Texto Para Ser Adicionado ao Seu Vídeo`)
if ((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "drawtext=text='${q}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)-10" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Texto\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videobordas':
if ((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "pad=iw+40:ih+40:20:20" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Bordas\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videoframes':
if ((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
const frameRate = 1 
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane;
const frameFolder = getRandom('frames') 
fs.mkdirSync(frameFolder)
exec(`ffmpeg -i ${media} -vf "fps=${frameRate}" ${frameFolder}/frame_%04d.png`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
const frames = fs.readdirSync(frameFolder).map(frame => fs.readFileSync(path.join(frameFolder, frame)))
const sendFrames = async (frames, index) => {
if (index < frames.length) {//By: Licht San
conn.sendMessage(from, {image: frames[index], caption: `*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Cortar Flames \n*❒ Flame:* ${index + 1}° Flame\n*❒ For:* ffmpeg\n*❒ By:* SattzModz`}, {quoted: info})
setTimeout(() => sendFrames(frames, index + 1), 1000) 
} else {
fs.rmdirSync(frameFolder, { recursive: true })
}
}
sendFrames(frames, 0)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videoespelhado':
if ((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "hflip" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Espelhamento\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videobrilho':
if(!q) return reply(`Escolha o Brilho\n\nex: 0.5 para escurecer, 1.5 para clarear`)
if ((isMedia && info.message.videoMessage || isQuotedVideo) && !q.length <= 1) { 
const brightness = parseFloat(q) 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "eq=brightness=${brightness}" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Brilho\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo e forneça o valor de brilho.")
}
break

case 'videoflip':
if(!q) return reply(`Escolha o Tipo de Virada\n\n${prefix+command} Vertical ou horizontal`)
if ((isMedia && info.message.videoMessage || isQuotedVideo) && !q.length <= 1) { 
const flipType = q // Tipo de virada: "horizontal" ou "vertical"
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
let vfFilter = flipType === 'horizontal' ? 'hflip' : 'vflip'
exec(`ffmpeg -i ${media} -vf "${vfFilter}" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Perspectiva\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo e forneça o tipo de virada: 'horizontal' ou 'vertical'.")
}
break

case 'videorotate':
if(!q) return reply(`Escolha o Ângulo de Rotação\n\n${prefix+command} 90`)
if ((isMedia && info.message.videoMessage || isQuotedVideo) && !q.length <= 1) { 
const angle = q 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "rotate=${angle}*PI/180" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Rotação\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo e forneça o ângulo de rotação.")
}
break

case 'videoreverseaudio':
if ((isMedia && info.message.videoMessage || isQuotedVideo) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -af areverse -c:v copy ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Reversão de Áudio\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videoareia':
if (!q) return reply(`Escolha a Porcentagem de Granulação\n\nExemplo: ${prefix}videoareia 30`)
const granulationPercentage = parseInt(q)
if (isNaN(granulationPercentage) || granulationPercentage < 10 || granulationPercentage > 100) {
return reply(`A porcentagem de granulação deve estar entre 10 e 100. \nExemplo: ${prefix}videoareia 30`)
}
if ((isMedia && info.message.videoMessage || isQuotedVideo)) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.' + await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "noise=alls=${granulationPercentage}:allf=t+u" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: Desculpe, Erro ao Processar o Vídeo`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Areia\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videodesfoque':
if (!q) return reply(`Escolha a Porcentagem de Desfoque\n\nExemplo: ${prefix}videodesfoque 3`)
const blurStrength = parseInt(q)
if (isNaN(blurStrength) || blurStrength < 1 || blurStrength > 10) {
return reply(`A porcentagem de desfoque deve estar entre 1 e 10. Exemplo: ${prefix}videodesfoque 3`)
}
if ((isMedia && info.message.videoMessage) || isQuotedVideo) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "boxblur=${blurStrength}" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Desfoque\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videolento':
if((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:v]setpts=2*PTS[v];[0:a]atempo=0.5[a]" -map "[v]" -map "[a]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if(err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Desaceleração\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo..")
}
break

case 'videograve':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]asetrate=44100*0.8,atempo=1.25,firequalizer=gain='if(lte(f,200),1.5,0)':zero_phase=on[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Aumento de Graves\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videovozmenino':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]atempo=1.06,asetrate=44100*1.25[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Voz de Menino\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videobass':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]equalizer=f=20:width_type=o:width=2:g=15[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Bass Boost\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videoestourado':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]equalizer=f=90:width_type=o:width=2:g=30[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Estouro\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videoreverb':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]aecho=0.8:0.88:60:0.4[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Reverb\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videotremolo':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]tremolo=f=10.0:d=0.5[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Tremolo\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videoeco':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:a]aecho=0.8:0.9:1000:0.3[audio]" -map 0:v -map "[audio]" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Eco\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videodistorcao':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video');
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -af "acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1" ${ran}`, (err) => {//By: Licht San
DLT_FL(media)
if (err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Distorsão\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} else {//By: Licht San
reply("Marque um vídeo.")
}
break

case 'videopixelizado':
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
try {
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.' + await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf "scale=iw/10:-1,scale=iw*10:ih*10:flags=neighbor" ${ran}`, async (err) => {//By: Licht San
DLT_FL(media)
if (err) {
console.log(err)
return reply(`Erro ao processar o vídeo.`)
}
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Pixelizado\n*❒ For:* ffmpeg\n*❒ By:* SattzModz', mimetype: 'video/mp4'}, {quoted: info})
DLT_FL(ran)
})
} catch (err) {//By: Licht San
console.log(err)
reply(`Erro interno ao processar o vídeo.`)
}
} else {
reply("Marque um vídeo.")
}
break

case 'videotodoc':
try {
if ((isMedia && info.message.videoMessage) || isQuotedVideo) {
reply(Res_Aguarde)
const encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
const rane = getRandom('.' + await getExtension(encmedia.mimetype))
const buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
const ran = getRandom('.mp4')
exec(`ffmpeg -i ${rane} ${ran}`, async (err) => {//By: Licht San
DLT_FL(rane)
if (err) {//By: Licht San
console.log(err)
return reply(`Erro ao processar o vídeo.`)
}
const buffer = fs.readFileSync(ran)
conn.sendMessage(from, { document: buffer, mimetype: 'video/mp4', filename: 'video_converted.mp4', caption: '*❯❯ MizukiBot-MD - EFECTS ❮❮*\n\n*❒ Efeito:* Conversão para Documento\n*❒ For:* ffmpeg\n*❒ By:* SattzModz' }, { quoted: info })
DLT_FL(ran) 
})
} else {
reply("Marque um vídeo para converter em documento.")
}
} catch (e) {//By: Licht San
console.log(e)
reply(`Ocorreu um erro ao tentar converter o vídeo em documento.`)
}
break

  case 'videocontrario':
case 'reversevid':
if((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) { 
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -vf reverse -af areverse ${ran}`, (err) => {
DLT_FL(media)
if(err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, mimetype: 'video/mp4'}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque um vídeo..")
}
break 

case 'videolento':
case 'slowvid':  
if((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) {
reply(Res_Aguarde) 
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:v]setpts=2*PTS[v];[0:a]atempo=0.5[a]" -map "[v]" -map "[a]" ${ran}`, (err) => {
DLT_FL(media)
if(err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, mimetype: 'video/mp4'}, {quoted: selo })
DLT_FL(ran)
})
} else {
reply("Marque um vídeo..")
}
break

case 'videorapido':
case 'fastvid':  
if((isMedia && info.message.videoMessage || !isQuotedImage) && !q.length <= 1) {
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2[a]" -map "[v]" -map "[a]" ${ran}`, (err) => {
DLT_FL(media)
if(err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {video: buffer453, mimetype: 'video/mp4'}, {quoted: selo })
DLT_FL(ran)
})	
} else {
reply("Marque o vídeo..")
}
break

case 'audiocontrario':
case 'audioreverse':
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
encmedia = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'audio')
fs.writeFileSync(rane, buffimg)
media = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${media} -vf reverse -af areverse ${ran}`, (err) => {
DLT_FL(media)
if(err) return reply(`Err: ${err}`)
buffer453 = fs.readFileSync(ran)
conn.sendMessage(from, {audio: buffer453, mimetype: 'audio/mpeg'}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque um audio..")
}
break 

case 'grave2':
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -filter:a "atempo=1.6,asetrate=22100" ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break

case 'grave':
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -filter:a "atempo=0.9,asetrate=44100" ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break

case 'adolesc':
case 'vozmenino':  
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -filter:a atempo=1.06,asetrate=44100*1.25 ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break  

case 'tomp3':
if((isMedia && !info.message.imageMessage || isQuotedVideo)) {
post = isQuotedImage ? JSON.parse(JSON.stringify(info).replace('quotedM','m')).message.extendedTextMessage.contextInfo.message.imageMessage : info.message.videoMessage
reply(Res_Aguarde)
encmedia = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : info.message.videoMessage
rane = getRandom('.'+await getExtension(encmedia.mimetype))
buffimg = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, buffimg)
media = rane 
ran = getRandom('.mp4')
exec(`ffmpeg -i ${media} ${ran}`, (err) => { 
DLT_FL(media)
if(err) return reply('❌ Falha ao converter vídeo para mp3 ❌')
buffer = fs.readFileSync(ran)
conn.sendMessage(from, {audio: buffer, mimetype: 'audio/mpeg'}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o vídeo para transformar em áudio por favor..")
}
break

case 'bass3':
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -af equalizer=f=20:width_type=o:width=2:g=15 ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break

case 'bass': 
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -af equalizer=f=20:width_type=o:width=2:g=15 ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break

case 'bass2': 
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -af equalizer=f=94:width_type=o:width=2:g=30 ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break

case 'estourar': 
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -af equalizer=f=90:width_type=o:width=2:g=30 ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break

case 'fast':
case 'audiorapido':  
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -filter:a "atempo=0.9,asetrate=95100" ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio...")
}
break

case 'esquilo':
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -filter:a "atempo=0.7,asetrate=65100" ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio...")
}
break

case 'audiolento': 
case 'slow':
if((isMedia && !info.message.imageMessage && !info.message.videoMessage || isQuotedAudio)) {
reply(Res_Aguarde)
muk = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : info.message.audioMessage
rane = getRandom('.'+await getExtension(muk.mimetype))
buffimg = await getFileBuffer(muk, 'audio')
fs.writeFileSync(rane, buffimg)
gem = rane
ran = getRandom('.mp3')
exec(`ffmpeg -i ${gem} -filter:a "atempo=0.9,asetrate=44100" ${ran}`, (err, stderr, stdout) => {
DLT_FL(gem)
if(err) return reply('Erro!')
hah = fs.readFileSync(ran)
conn.sendMessage(from, {audio: hah, mimetype: 'audio/mpeg', ptt:false}, {quoted: selo})
DLT_FL(ran)
})
} else {
reply("Marque o áudio..")
}
break

//INICIO DE COMANDOS DE LOGOS

case 'amongus':
case 'glitch':
case 'galaxy':
case 'glossy':
case 'dragonfire':
case 'comics':
case 'pubgavatar':
case 'emojimix':
case 'royal':
case 'mascotemetal':
case 'firework':
case 'summerbeach':
case 'cloudsky':
case 'techstyle':
case 'watercolor':
case 'ligatures':
case 'graffitistyle':
case 'frozen':
case 'colorful':
case 'balloon':
case 'multicolor':
case 'metal':
case 'doubleexposure':
case 'mascoteneon':
case 'eraser':
case 'america':
case 'snow':
case 'sunset':
case 'halloween':
case 'blood':
case 'hallobat':
case 'cemiterio':
case 'ffavatar':
case 'vintage3d':
case 'hollywood':
    try {
        if (!q.trim()) return reply(`Digite algo, Exemplo: ${prefix + command} mizuki`);
        reply("ᥲgᥙᥲrძᥱ ᥙm m᥆mᥱᥒ𝗍᥆.. 🦋✨");        
        const url = `https://vexapi.com.br/api/logos/${command}?query=${encodeURIComponent(q)}&apikey=${VEX_API_KEY}`;
        conn.sendMessage(from, { image: { url: url } }, { quoted: info }).catch(() => {
            return reply("Erro ao enviar a imagem..");
        });
    } catch (e) {
        return reply("Erro...");
    }
    break;

case 'pornhub':
case 'deadpool':
case 'avengers':
case 'marvel': {
    if (!q.trim() || !q.includes('|')) {
        return reply(`Digite os dois textos separados por *|*\nExemplo: ${prefix + command} texto1|texto2`);
    }

    const [text1, text2] = q.split('|').map(t => t.trim());

    if (!text1 || !text2) {
        return reply(`Digite os dois textos separados por *|*\nExemplo: ${prefix + command} texto1|texto2`);
    }

    reply("ᥲgᥙᥲrძᥱ ᥙm m᥆mᥱᥒ𝗍᥆.. 🦋✨");
   
    const url = `https://vexapi.com.br/api/duallogos/${command}?query=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&apikey=${VEX_API_KEY}`;

    conn.sendMessage(from, { image: { url } }, { quoted: info }).catch(() => {
        return reply(Res_ErroCmd);
    });
    break;
}

case 'hentaip': {
  if (!isPremium) return reply('❌ Este comando é apenas para usuários *Premium*!');

  await reagir(from, '🔞');

  const cheerio = require('cheerio');
  const page = Math.floor(Math.random() * 1153) + 1; 
  const url = `https://sfmcompile.club/page/${page}`;

  try {
 const { data } = await axios.get(url);
 const $ = cheerio.load(data);
 let resultados = [];

 $('.post').each((i, b) => {
if (i >= 6) return;
resultados.push({
  title: $(b).find('header > h2').text().trim(),
  link: $(b).find('header > h2 > a').attr('href'),
  category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
  share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
  views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
  type: $(b).find('source').attr('type') || 'image/jpeg',
  video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
  video_2: $(b).find('video > a').attr('href') || ''
});
 });

 if (resultados.length === 0) return reply('❌ Nenhum conteúdo encontrado.');

 let resposta = '🔞 *Resultados Encontrados:*\n\n';

 for (let item of resultados) {
resposta += `🏷️ *Título:* ${item.title}\n`;
resposta += `🗂️ *Categoria:* ${item.category}\n`;
resposta += `🔗 *Link:* ${item.link}\n`;
resposta += `📁 *Tipo:* ${item.type}\n`;
resposta += `👀 *Visualizações:* ${item.views_count}\n`;
resposta += `🔄 *Compartilhamentos:* ${item.share_count}\n`;
resposta += `🎥 *Vídeo:* ${item.video_1 || item.video_2}\n\n`;
 }

 conn.sendMessage(from, {
text: resposta.trim()
 }, { quoted: info });

 await reagir(from, '✅');

  } catch (e) {
 console.error(e);
 await reagir(from, '❌');
 reply('⚠️ Erro ao buscar dados. Tente novamente mais tarde.');
  }
}
break;

case 'naruto':
case 'sasuke':
case 'kakashi':
case 'jiraya':
case 'luffy':
case 'gojo':
case 'goku':
case 'vegeta':
case 'saitama':
case 'tanjiro':
case 'todoroki': {
if(!isPremium) return reply(Res_SoVip)
 const personagem = command;
 const imageUrl = `${API_KIMORI_URL}/api/yaoi/images/${personagem}/random?apikey=${APIKEY_KIMORI}`;

 try {
  await conn.sendMessage(sender, {
image: { url: imageUrl },
caption: `🎴 *${personagem.charAt(0).toUpperCase() + personagem.slice(1)}*`
  }, { quoted: info });

  reply(`📩 Imagem enviada no seu pv!`);

 } catch (e) {
  console.error(e);
  reply('❌ Erro ao buscar imagem.');
 }
 break;
}

 //==={HENTAIS}===\\\
  // hentai
  case 'plaq3':{
if(!isPremium) return reply(Res_SoVip)
 if (args.length < 1) return reply(`${prefix}plaq e digite o seu nome`)
 teks = body.slice(6)
 if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
 buffer =(`https://umethroo.sirv.com/bunda3.jpg?text.0.text=${teks}&text.0.position.gravity=center&text.0.position.x=-25%25&text.0.position.y=-17%25&text.0.size=17&text.0.color=000000&text.0.font.family=Architects%20Daughter&text.0.font.weight=700&text.0.font.style=italic`)
 conn.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
 conn.sendMessage(from, { react: { text: `🔞`, key: info.key }})
 }
 reply(`a plaquinha esta sendo enviado no seu privado...`)
 break
 
 case 'plaq8':{
if(!isPremium) return reply(Res_SoVip)
 if (args.length < 1) return reply(`${prefix}plaq e digite o seu nome`)
 teks = body.slice(6)
 if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
 buffer =(`https://raptibef.sirv.com/images%20(3).jpeg?text.0.text=${teks}&text.0.position.gravity=center&text.0.position.x=19%25&text.0.size=45&text.0.color=000000&text.0.opacity=55&text.0.font.family=Crimson%20Text&text.0.font.weight=300&text.0.font.style=italic&text.0.outline.opacity=21`)
 conn.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
 conn.sendMessage(from, { react: { text: `🔞`, key: info.key }})
 }
 reply(`a plaquinha esta sendo enviado no seu privado...`)
 break
 case 'plaq1':
try {
if(!isPremium) return reply('precisa ser vip')
reply('Estou fazendo...')
buffer = await getBuffer(`https://rsymenti.sirv.com/images%20(10).jpeg?text.0.text=${q}&text.0.position.gravity=south&text.0.position.x=4%25&text.0.position.y=-32%25&text.0.align=left&text.0.size=34&text.0.color=000000&text.0.opacity=78&text.0.background.opacity=78&text.0.outline.blur=72&text.0.outline.opacity=74`)
conn.sendMessage(sender, {image: buffer, caption: `Ola aqui esta sua plaquinha 😈`}, {quoted: info})
} catch {
reply(`Erro`)
} 
break


case 'plaq4':{
if(!isPremium) return reply(Res_SoVip)
 if (args.length < 1) return reply(`${prefix}plaq e digite o seu nome`)
 teks = body.slice(6)
 if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
 buffer =(`https://umethroo.sirv.com/peito1.jpg?text.0.text=${teks}&text.0.position.x=-48%25&text.0.position.y=-68%25&text.0.size=14&text.0.color=000000&text.0.font.family=Shadows%20Into%20Light&text.0.font.weight=700`)
 conn.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
 conn.sendMessage(from, { react: { text: `🔞`, key: info.key }})
 }
 reply(`a plaquinha esta sendo enviado no seu privado...`)
 break

case 'plaq5':{
if(!isPremium) return reply(Res_SoVip)
 if (args.length < 1) return reply(`${prefix}plaq e digite o seu nome`)
 teks = body.slice(6)
 if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
 buffer =(`https://umethroo.sirv.com/9152e7a9-7d49-48ef-b8ac-2e6149fda0b2.jpg?text.0.text=${teks}&text.0.position.x=-70%25&text.0.position.y=-23%25&text.0.size=17&text.0.color=000000&text.0.font.family=Architects%20Daughter&text.0.font.weight=300`)
 conn.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
 conn.sendMessage(from, { react: { text: `🔞`, key: info.key }})
 }
 reply(`a plaquinha esta sendo enviado no seu privado...`)
 break

case 'plaq6':{
if(!isPremium) return reply(Res_SoVip)
 if (args.length < 1) return reply(`${prefix}plaq e digite o seu nome`)
 teks = body.slice(6)
 if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
 buffer =(`https://clutamac.sirv.com/1011b781-bab1-49e3-89db-ee2c064868fa%20(1).jpg?text.0.text=${teks}&text.0.position.gravity=northwest&text.0.position.x=22%25&text.0.position.y=60%25&text.0.size=12&text.0.color=000000&text.0.opacity=47&text.0.font.family=Roboto%20Mono&text.0.font.style=italic`)
 conn.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
 conn.sendMessage(from, { react: { text: `🔞`, key: info.key }})
 }
 reply(`a plaquinha esta sendo enviado no seu privado...`)
 break

case 'plaq7':{
if(!isPremium) return reply(Res_SoVip)
 if (args.length < 1) return reply(`${prefix}plaq e digite o seu nome`)
 teks = body.slice(6)
 if (teks.length > 15) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
 buffer =(`https://umethroo.sirv.com/Torcedora-da-sele%C3%A7%C3%A3o-brasileira-nua-mostrando-a-bunda-236x300.jpg?text.0.text=${teks}&text.0.position.x=-64%25&text.0.position.y=-39%25&text.0.size=25&text.0.color=1b1a1a&text.0.font.family=Architects%20Daughter`)
 conn.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
 conn.sendMessage(from, { react: { text: `🔞`, key: info.key }})
 }
 reply(`a plaquinha esta sendo enviado no seu privado...`)
 break
 
 case 'plaq2':{
if(!isPremium) return reply(Res_SoVip)
 if (args.length < 1) return reply(`${prefix}plaq e digite o seu nome`)
 teks = body.slice(6)
 if (teks.length > 10) return reply('O texto é longo, até 15 caracteres') //maximo de caracteres
 buffer =(`https://umethroo.sirv.com/BUNDA1.jpg?text.0.text=${teks}&text.0.position.x=-20%25&text.0.position.y=-20%25&text.0.size=18&text.0.color=000000&text.0.font.family=Architects%20Daughter&text.0.font.weight=700&text.0.background.opacity=65`)
 conn.sendMessage(sender, {image: {url: buffer }, caption: ' *Plaquinha feita*'})
 conn.sendMessage(from, { react: { text: `🔞`, key: info.key }})
 }
 reply(`a plaquinha esta sendo enviado no seu privado...`)
 break
 case "loli":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { loli } = require("./banco de dados/Mizuki+18/nsfw/animes.js");
var totalnsfw = loli[Math.floor(Math.random() * loli.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "trap":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { trap } = require("./banco de dados/Mizuki+18/nsfw/animes.js");
var totalnsfw = trap[Math.floor(Math.random() * trap.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "ass":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { ass } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = ass[Math.floor(Math.random() * ass.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "ahegao":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { ahegao } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = ahegao[Math.floor(Math.random() * ahegao.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "bdsm":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { bdsm } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = bdsm[Math.floor(Math.random() * bdsm.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "blowjob":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { blowjob } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = blowjob[Math.floor(Math.random() * blowjob.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "cuckold":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { cuckold } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = cuckold[Math.floor(Math.random() * cuckold.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "cum":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { cum } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = cum[Math.floor(Math.random() * cum.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "ero":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { ero } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = ero[Math.floor(Math.random() * ero.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "femdom":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { femdom } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = femdom[Math.floor(Math.random() * femdom.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "foot":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { foot } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = foot[Math.floor(Math.random() * foot.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "gangbang":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { gangbang } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw =
  gangbang[Math.floor(Math.random() * gangbang.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "ganbganb":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { ganbganb } = require("./banco de dados/Mizuki+18/nsfw/animes.js");
var totalnsfw =
  ganbganb[Math.floor(Math.random() * ganbganb.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "glasses":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { glasses } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = glasses[Math.floor(Math.random() * glasses.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "hentai":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { hentai } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = hentai[Math.floor(Math.random() * hentai.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "hentai2":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { hentai2 } = require("./banco de dados/Mizuki+18/nsfw/animes.js");
var totalnsfw = hentai2[Math.floor(Math.random() * hentai2.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "nekos":
{
  if (isGroup)
 setTimeout(() => {
reagir(from, "😈");
 }, 300);
  reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
  const { neko2 } = require("./banco de dados/Mizuki+18/nsfw/animes.js");
  var totalnsfw = neko2[Math.floor(Math.random() * neko2.length)];
  conn.sendMessage(
 sender,
 {
image: { url: totalnsfw },
caption: `*Aqui está* ${pushname} 😳🔥`,
 },
 { quoted: selo }
  );
}
break;

 case "neko2":
{
  if (isGroup)
 setTimeout(() => {
reagir(from, "😈");
 }, 300);
  reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
  const { neko2 } = require("./banco de dados/Mizuki+18/nsfw/hentai.js");
  var totalnsfw = neko2[Math.floor(Math.random() * neko2.length)];
  conn.sendMessage(
 sender,
 {
image: { url: totalnsfw },
caption: `*Aqui está* ${pushname} 😳🔥`,
 },
 { quoted: selo }
  );
}
break;

 case "jahy":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { jahy } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = jahy[Math.floor(Math.random() * jahy.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "masturbation":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { masturbation } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw =
  masturbation[Math.floor(Math.random() * masturbation.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "orgy":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { orgy } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = orgy[Math.floor(Math.random() * orgy.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "panties":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { panties } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = panties[Math.floor(Math.random() * panties.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "pussy":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { pussy } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = pussy[Math.floor(Math.random() * pussy.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "boobs":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { boobs } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = boobs[Math.floor(Math.random() * boobs.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "tentacles":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { tentacles } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw =
  tentacles[Math.floor(Math.random() * tentacles.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "thighs":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { thighs } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = thighs[Math.floor(Math.random() * thighs.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "yuri":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { yuri } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = yuri[Math.floor(Math.random() * yuri.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "zettai":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { zettai } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw = zettai[Math.floor(Math.random() * zettai.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

 case "kasedaiki":
if (isGroup)
  setTimeout(() => {
 reagir(from, "😈");
  }, 300);
reply(`${isGroup ? "*Olha o pv...*" : "Enviando"} 😈`);
const { kasedaiki } = require("./banco de dados/Mizuki+18/nsfw/nsfw.js");
var totalnsfw =
  kasedaiki[Math.floor(Math.random() * kasedaiki.length)];
conn.sendMessage(
  sender,
  {
 image: { url: totalnsfw },
 caption: `*Aqui está* ${pushname} 😳🔥`,
  },
  { quoted: selo }
);
break;

  case "amador":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { amador } = require("./banco de dados/Mizuki+18/AmadorVideo/Amador.js");
var Mizuki18 = amador[Math.floor(Math.random() * amador.length)];
conn.sendMessage(
  sender,
  {
 video: { url: Mizuki18 },
 caption: `*🔞Vídeo Amador🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "porno":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { PornoVid } = require("./banco de dados/Mizuki+18/PornoVideo/PornoVid.js");
var Mizuki18 =
  PornoVid[Math.floor(Math.random() * PornoVid.length)];
conn.sendMessage(
  sender,
  {
 video: { url: Mizuki18 },
 caption: `*🔞Pornô Vídeo🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "egirlvideo":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { EgirlVid } = require("./banco de dados/Mizuki+18/EgirlVideo/EgirlVid.js");
var Mizuki18 =
  EgirlVid[Math.floor(Math.random() * EgirlVid.length)];
conn.sendMessage(
  sender,
  {
 video: { url: Mizuki18 },
 caption: `*🔞Egirl Vídeo🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "aline":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Aline } = require("./banco de dados/Mizuki+18/AlineFaria/Aline.js");
var Mizuki18 = Aline[Math.floor(Math.random() * Aline.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Aline Faria🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "alifox":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { AlineFx } = require("./banco de dados/Mizuki+18/AlineFox/AlineFx.js");
var Mizuki18 = AlineFx[Math.floor(Math.random() * AlineFx.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Aline Fox🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "alycia":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Alycia } = require("./banco de dados/Mizuki+18/AlyciaRibeiro/Alycia.js");
var Mizuki18 = Alycia[Math.floor(Math.random() * Alycia.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Alycia Ribeiro🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "amichan":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Amiichan } = require("./banco de dados/Mizuki+18/Amiichan/Amiichan.js");
var Mizuki18 =
  Amiichan[Math.floor(Math.random() * Amiichan.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Amiichan🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "aninha":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Aninha } = require("./banco de dados/Mizuki+18/AninhaLopes/Aninha.js");
var Mizuki18 = Aninha[Math.floor(Math.random() * Aninha.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Aninha Lopes🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "victoria":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const {
  Victoria,
} = require("./banco de dados/Mizuki+18/VictoriaMatoso/Victoria.js");
var Mizuki18 =
  Victoria[Math.floor(Math.random() * Victoria.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Victoria Matoso🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "belle":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Belle } = require("./banco de dados/Mizuki+18/BelleDelphine/Belle.js");
var Mizuki18 = Belle[Math.floor(Math.random() * Belle.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Belle Delphine🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "brenda":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Brenda } = require("./banco de dados/Mizuki+18/BrendaTrindade/Brenda.js");
var Mizuki18 = Brenda[Math.floor(Math.random() * Brenda.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Brenda Trindade🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "cami":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Cami } = require("./banco de dados/Mizuki+18/CamiBrito/Cami.js");
var Mizuki18 = Cami[Math.floor(Math.random() * Cami.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Cami Brito🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "clowniac":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Clowniac } = require("./banco de dados/Mizuki+18/Clowniac/Clowniac.js");
var Mizuki18 =
  Clowniac[Math.floor(Math.random() * Clowniac.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Clowniac🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "feh":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Feh } = require("./banco de dados/Mizuki+18/FehGalvao/Feh.js");
var Mizuki18 = Feh[Math.floor(Math.random() * Feh.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Feh Galvão🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "giovanna":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const {
  Giovanna,
} = require("./banco de dados/Mizuki+18/GiovannaCampomar/Giovanna.js");
var Mizuki18 =
  Giovanna[Math.floor(Math.random() * Giovanna.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Giovanna Campomar🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "isadora":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const {
  Isadora,
} = require("./banco de dados/Mizuki+18/IsadoraMartinez/Isadora.js");
var Mizuki18 = Isadora[Math.floor(Math.random() * Isadora.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Isadora Martinez🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "isa":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Isa } = require("./banco de dados/Mizuki+18/IsaWaifu/Isa.js");
var Mizuki18 = Isa[Math.floor(Math.random() * Isa.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Isa Waifu🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "lay":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Lay } = require("./banco de dados/Mizuki+18/LayMuniz/Lay.js");
var Mizuki18 = Lay[Math.floor(Math.random() * Lay.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Lay Muniz🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "leticia":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const {
  Leticia,
} = require("./banco de dados/Mizuki+18/LeticiaShirayuki/Leticia.js");
var Mizuki18 = Leticia[Math.floor(Math.random() * Leticia.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Letícia Shirayuki🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "marina":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { MaRina } = require("./banco de dados/Mizuki+18/MarinaMui/Mamizukijs");
var Mizuki18 = MaRina[Math.floor(Math.random() * Mamizukilength)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞MaRina Mui🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "maru":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Maru } = require("./banco de dados/Mizuki+18/MaruKarv/Maru.js");
var Mizuki18 = Maru[Math.floor(Math.random() * Maru.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Maru Karv🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "princesa":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Princesa } = require("./banco de dados/Mizuki+18/McPrincesa/Princesa.js");
var Mizuki18 =
  Princesa[Math.floor(Math.random() * Princesa.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Mc Princesa🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "meladinha":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Me1adinha } = require("./banco de dados/Mizuki+18/Meladinha/Meladinha.js");
var Mizuki18 =
  Me1adinha[Math.floor(Math.random() * Me1adinha.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Me1adinha🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "nath":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Nath } = require("./banco de dados/Mizuki+18/NathBister/Nath.js");
var Mizuki18 = Nath[Math.floor(Math.random() * Nath.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Nath🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "nega":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Nega } = require("./banco de dados/Mizuki+18/NegaBarbie/Nega.js");
var Mizuki18 = Nega[Math.floor(Math.random() * Nega.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Nega Barbie🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "polonesa":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const {
  Polonesa,
} = require("./banco de dados/Mizuki+18/PolonesaDoHype/Polonesa.js");
var Mizuki18 =
  Polonesa[Math.floor(Math.random() * Polonesa.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Polonesa Do Hype🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "rute":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Rute } = require("./banco de dados/Mizuki+18/RuteRocha/Rute.js");
var Mizuki18 = Rute[Math.floor(Math.random() * Rute.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Rute Rocha🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "celestine":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const {
  Celestine,
} = require("./banco de dados/Mizuki+18/VitaCelestine/Celestine.js");
var Mizuki18 =
  Celestine[Math.floor(Math.random() * Celestine.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Vita Celestine🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "carnie":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { Carniello } = require("./banco de dados/Mizuki+18/Carniello/Carniello.js");
var Mizuki18 =
  Carniello[Math.floor(Math.random() * Carniello.length)];
conn.sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Carniello🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

 case "gotica":
reagir(from, "😈");
if (!isPremium) return reply(Res_SoVip);
reply(`${isGroup ? "*ENVIANDO NO Privado...😈*" : "Enviando"} `);
const { GoticaFT } = require("./banco de dados/Mizuki+18/GoticaFoto/Gotica.js");
var Mizuki18 =
  GoticaFT[Math.floor(Math.random() * GoticaFT.length)];
mizuki=sendMessage(
  sender,
  {
 image: { url: Mizuki18 },
 caption: `*🔞Gótica Foto🔞*\n*Bot: ${NomeDoBot} Dono ${NickDono}*`,
  },
  { quoted: info }
);
break;

// ========== IMAGENS DE ANIMES VIA API KIMORI ==========

case 'toukachan':
case 'random_touka':
case 'img_touka': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/toukachan?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🌸 *Touka-chan*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'akira':
case 'random_akira':
case 'img_akira': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/akira?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⚡ *Akira*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'itori':
case 'random_itori':
case 'img_itori': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/itori?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🖤 *Itori*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'kurumi':
case 'random_kurumi':
case 'img_kurumi': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/kurumi?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⏰ *Kurumi Tokisaki*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'miku':
case 'random_miku':
case 'img_miku': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/miku?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `💙 *Hatsune Miku*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'pokemon':
case 'random_pokemon':
case 'img_pokemon': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/pokemon?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⚡ *Pokémon*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'ryujin':
case 'random_ryujin':
case 'img_ryujin': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/ryujin?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🐉 *Ryujin*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'rose':
case 'random_rose':
case 'img_rose': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/rose?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🌹 *Rose*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'kaori':
case 'random_kaori':
case 'img_kaori': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/kaori?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🎻 *Kaori Miyazono*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'shizuka':
case 'random_shizuka':
case 'img_shizuka': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/shizuka?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🌸 *Shizuka*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'kaga':
case 'random_kaga':
case 'img_kaga': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/kaga?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⚓ *Kaga*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'kotori':
case 'random_kotori':
case 'img_kotori': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/kotori?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🎀 *Kotori*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'mikasa':
case 'random_mikasa':
case 'img_mikasa': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/mikasa?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⚔️ *Mikasa Ackerman*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'akiyama':
case 'random_akiyama':
case 'img_akiyama': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/akiyama?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🃏 *Akiyama*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'gremory':
case 'random_gremory':
case 'img_gremory': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/gremory?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `👿 *Gremory*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'isuzu':
case 'random_isuzu':
case 'img_isuzu': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/isuzu?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🚛 *Isuzu*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'cosplay':
case 'random_cosplay':
case 'img_cosplay': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/cosplay?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `📸 *Cosplay*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'shina':
case 'random_shina':
case 'img_shina': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/shina?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🌸 *Shina*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'kagura':
case 'random_kagura':
case 'img_kagura': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/kagura?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `☂️ *Kagura*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'shinka':
case 'random_shinka':
case 'img_shinka': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/shinka?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `✨ *Shinka*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'eba':
case 'random_eba':
case 'img_eba': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/eba?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🎨 *Eba*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'deidara':
case 'random_deidara':
case 'img_deidara': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/deidara?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `💣 *Deidara*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'jeni':
case 'random_jeni':
case 'img_jeni': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/jeni?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `💎 *Jeni*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'itachi':
case 'random_itachi':
case 'img_itachi': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/itachi?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🍥 *Itachi Uchiha*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'madara':
case 'random_madara':
case 'img_madara': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/madara?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🍥 *Madara Uchiha*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'yuki':
case 'random_yuki':
case 'img_yuki': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/yuki?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `❄️ *Yuki*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'ayuzawa':
case 'random_ayuzawa':
case 'img_ayuzawa': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/ayuzawa?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `👑 *Ayuzawa*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'chitoge':
case 'random_chitoge':
case 'img_chitoge': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/chitoge?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🌸 *Chitoge*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'emilia':
case 'random_emilia':
case 'img_emilia': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/emilia?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `❄️ *Emilia*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'hestia':
case 'random_hestia':
case 'img_hestia': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/hestia?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🔥 *Hestia*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'inori':
case 'random_inori':
case 'img_inori': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/inori?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🎤 *Inori*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'ana':
case 'random_ana':
case 'img_ana': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/ana?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `👗 *Ana*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'boruto':
case 'random_boruto':
case 'img_boruto': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/boruto?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🍥 *Boruto Uzumaki*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'erza':
case 'random_erza':
case 'img_erza': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/erza?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⚔️ *Erza Scarlet*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'sagiri':
case 'random_sagiri':
case 'img_sagiri': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/sagiri?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🍳 *Sagiri*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'minato':
case 'random_minato':
case 'img_minato': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/minato?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⚡ *Minato Namikaze*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'naruto':
case 'random_naruto':
case 'img_naruto': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/naruto?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🍥 *Naruto Uzumaki*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'nezuko':
case 'random_nezuko':
case 'img_nezuko': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/nezuko?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🎀 *Nezuko Kamado*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'onepiece':
case 'random_onepiece':
case 'img_onepiece': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/onepiece?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🏴‍☠️ *One Piece*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'rize':
case 'random_rize':
case 'img_rize': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/rize?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🩸 *Rize Kamishiro*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'sakura':
case 'random_sakura':
case 'img_sakura': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/sakura?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🌸 *Sakura Haruno*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'sasuke':
case 'random_sasuke':
case 'img_sasuke': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/sasuke?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `⚡ *Sasuke Uchiha*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'tsunade':
case 'random_tsunade':
case 'img_tsunade': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/tsunade?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `💪 *Tsunade Senju*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'montor':
case 'random_montor':
case 'img_montor': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/montor?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🖥️ *Montor*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'mobil':
case 'random_mobil':
case 'img_mobil': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/mobil?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `📱 *Mobil*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'wallhp':
case 'random_wallhp':
case 'img_wallhp': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/wallhp?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🖼️ *Wallpaper HP*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'waifu':
case 'random_waifu':
case 'img_waifu': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/waifu?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `💕 *Waifu*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'hekel':
case 'random_hekel':
case 'img_hekel': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/hekel?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🐱 *Hekel*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}

case 'kucing':
case 'random_kucing':
case 'img_kucing': {
await reagir(from, "🎨");
try {
const url = `${API_KIMORI_URL}/api/random/kucing?apikey=${APIKEY_KIMORI}`;
const response = await axios.get(url, { responseType: 'arraybuffer' });
await conn.sendMessage(from, { image: response.data, caption: `🐈 *Kucing (Gato)*\n👤 Solicitado por: ${pushname}` }, { quoted: selo });
await reagir(from, "✅");
} catch (e) { reply("❌ Erro ao buscar imagem."); }
break;
}
// ========== FIM ANIMES VIA API KIMORI ==========

default:

if(isGroup && isBotGroupAdmins && !isGroupAdmins) {
if(isAntiCtt || Antiloc || isAnticatalogo) {
if(type === 'contactMessage' || type === 'contactsArrayMessage' || type === 'locationMessage' || type === 'productMessage') {
if(isGroupAdmins) return conn.sendMessage(from, {text: `Uma dessas opções estão ativada, mas por você ser ADM, não será removido(a) _(ANTI CONTATO - ANTI CATALOGO - ANTI LOCALIZAÇÃO)`}, {quoted: selo})
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return
conn.groupParticipantsUpdate(from, [sender], 'remove')
clear = `💙${"\n".repeat(255)}💙\n❲❗❳ *Lɪᴍᴘᴇᴢᴀ ᴅᴇ Cʜᴀᴛ Cᴏɴᴄʟᴜɪ́ᴅᴀ* 💙`
conn.sendMessage(from, {text: clear, contextInfo : { forwardingScore: 500, isForwarded:true}})
conn.sendMessage(from, {text: 'reporte aos adm o ocorrido ', mentions: groupAdmins})
}}}

if(isGroup && isAntiFlood && !SoDono && !isnit && isBotGroupAdmins && !isGroupAdmins && !isBot) { 
if(isLimitec == null){
var limitefl = limitefll.limitefl
} else {
var limitefl = isLimitec
}
if(budy.length >= limitefl){
setTimeout( () => {
return conn.sendMessage(from, {text: 'Muitas Caracteres enviadas, isto é contra as normas do grupo, por precaução, eu irei remover.'})
console.log(colors.red('Deram Spam de caracteres..'))
}, 100)
setTimeout(async () => {
if(IS_DELETE) {
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return  
conn.groupParticipantsUpdate(from, [sender], 'remove')
}, 1000)
}
}

//INICIO DE COMANDOS SEM PREFIXO
switch(testat){
}

const EnvAudio_SMP = async (direcao, nome1, nome2, nome3, nome4, nome5) => {
bla = [nome1, nome2, nome3, nome4, nome5]
for ( i of bla) {
if(i == undefined) return  
if(messagesC.includes(i)) {
conn.sendMessage(from, {audio: {url: direcao}, mimetype: "audio/mpeg", ptt:false})
}}}

const EnvAudio2_SMP = async (direcao, nome1, nome2, nome3, nome4, nome5) => {
bla = [nome1, nome2, nome3, nome4, nome5]
for ( i of bla) {
if(i == undefined) return  
if(messagesC.includes(i)) {
conn.sendMessage(from, {audio: {url: direcao}, mimetype: "audio/mpeg", ptt:false})
}}}

const EnvTXT_SMP = async (texto, nome1, nome2, nome3, nome4, nome5) => {
bla = [nome1, nome2, nome3, nome4, nome5]
for ( i of bla) {
if(i == undefined) return  
if(messagesC.includes(i)) {
conn.sendMessage(from, {text: texto})
}}}

var hora_sla = moment.tz('America/Sao_Paulo').format('HH:mm:ss');

if (budy2.toLowerCase() === "mizuki sair do grupo") {
if(isGroup && !SoDono && !info.key.fromMe) return reply("Este comando só o bot ou o dono pode executar..")
try {
conn.groupLeave(from)
} catch(erro) {
reply(String(erro))
}
}

if(['Prefixo', 'prefixo', 'mizu', 'Mizu'].includes(budy)) {
  reply(Msg_Prefixo.replace('#prefixo#', prefix))
} 

if (budy2 === "aceitar" || budy2 === "✅") {
 if(!isGroupAdmins) return reply(Res_SoAdm)
 if(!isBotGroupAdmins) return reply(Res_BotAdm)
 
 const verificarUsuario = async () => {
  try {
var listaParticipantes = await conn.groupRequestParticipantsList(from)

if (listaParticipantes.length >= 1) {
 for (var {jid: numero} of listaParticipantes) {
  await delay(1000)
  await conn.groupRequestParticipantsUpdate(from, [numero], "approve")
 }
 reply(`✅ ${listaParticipantes.length} usuário(s) aprovado(s) com sucesso!`)
} else {
 reply("Não há nenhum usuário na lista de aprovação.")
}
  } catch (error) {
console.error("Erro ao verificar usuários:", error)
reply("❌ Erro ao processar solicitações.")
  }
 }
 
 verificarUsuario()
}

// CORREÇÃO: Detectar o tipo correto da mensagem
let type = 'conversation';

if (info.message) {
 const msg = info.message;
 
 // Mensagens diretas
 if (msg.conversation) type = 'conversation';
 else if (msg.extendedTextMessage) type = 'extendedTextMessage';
 else if (msg.imageMessage) type = 'imageMessage';
 else if (msg.videoMessage) type = 'videoMessage';
 else if (msg.audioMessage) type = 'audioMessage';
 else if (msg.documentMessage) type = 'documentMessage';
 else if (msg.stickerMessage) type = 'stickerMessage';
 else if (msg.contactMessage) type = 'contactMessage';
 
 // Mensagens dentro de wrappers
 else if (msg.viewOnceMessage?.message?.stickerMessage) type = 'stickerMessage';
 else if (msg.ephemeralMessage?.message?.stickerMessage) type = 'stickerMessage';
 else if (msg.viewOnceMessageV2?.message?.stickerMessage) type = 'stickerMessage';
}



if(isAutorepo) {

if(budy === "bot") {

blars = [
"oii neném 😆💖",
"fala comigo amorzinho 🤭💕",
"oi vidaa 😳✨",
"cheguei meu bem 😅💞",
"oiee coisinha linda 😆🌸",
"oi amor 😚💖",
"fala princesa 😳👑",
"oioi lindinho 🤭💫",
"cheguei delícia 😅💕",
"oi meu xuxu 😆💖"
]

blarnd = blars[Math.floor(Math.random() * blars.length)]

reply(blarnd)

}

if(budy2.includes("adivinha meu celular") || budy2.includes("bot qual meu celular")){
conn.sendMessage(from, {text: adivinha}, {quoted: selo})
}

if(budy2.includes("bom dia")) {

const bomdia = [
"Bom diaaa 😆☀️",
"Bom dia meu bem 🤭💖",
"Oii, bom diaa 😅🌸",
"Bom dia vidinha 😳✨",
"Tenha um ótimo dia 😆💕",
"Bom diaa xuxu 🤭☀️"
]

const msgdia = bomdia[Math.floor(Math.random() * bomdia.length)]

await conn.sendMessage(from, {
react: {
text: "☀️",
key: info.key
}
})

reply(msgdia)

}

if(budy2.includes("boa tarde")) {

const boatarde = [
"Boa tardee 😆🌤️",
"Oi oi, boa tarde 🤭💖",
"Tenha uma ótima tarde 😅💕",
"Boa tarde meu bem 😳✨",
"Boa tardee vidinha 😆🌸",
"Oiee, boa tarde 🤭☕"
]

const msgtarde = boatarde[Math.floor(Math.random() * boatarde.length)]

await conn.sendMessage(from, {
react: {
text: "🌤️",
key: info.key
}
})

reply(msgtarde)

}

if(budy2.includes("boa noite")) {

const boanoite = [
"Boa noitee 😆🌙",
"Dorme bem viu 🤭💖",
"Boa noitee meu bem 😅✨",
"Tenha uma ótima noite 😳🌸",
"Boa noite vidinha 😆💕",
"Oii, boa noite 🤭🌙"
]

const msgnoite = boanoite[Math.floor(Math.random() * boanoite.length)]

await conn.sendMessage(from, {
react: {
text: "🌙",
key: info.key
}
})

reply(msgnoite)

}

EnvAudio2_SMP("./arquivos/audios/corno.mp3", "corno")

}

if(messagesC.includes('exec')) {
if(!SoDono && !isnit && !issupre && !ischyt) return
try{
paramsQuoted = info.message.extendedTextMessage.contextInfo.quotedMessage.conversation || info.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text;	
return eval(`${paramsQuoted}`)
console.log(`[EXEC]~> ${paramsQuoted}`)
}catch(e){
reply(e)
}
}

//==============(ANTILINK)===============\\

switch(ants){
} 

//=========[--ANTI PALAVRÃO --]==========\\
if(isGroup && isPalavrao && isBotGroupAdmins && !SoDono && !isGroupAdmins) {
 if(dataGp[0].antipalavrao.palavras.some(i => budy2.includes(i.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))) {
setTimeout( () => {
if(!groupMembers.some(p => p.id === sender || p.jid === sender)) return  
conn.groupParticipantsUpdate(from, [sender], 'remove')
setTimeout(() => {
conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}})
}, 500)
}, 2000)
conn.sendMessage(from, {text: `*「 - REMOVIDO POR UTILIZAR UMA PALAVRA PROIBIDA - 」*\nVocê será banido do gp, Na proxima veja as regras ao digitar qualquer palavra..!!`})
}
}

//============(AUTO DOWNLOAD)============\\

if(isAutodown) {
const dominioinsta = ["instagram.com/reel", "instagram.com/share/reel", "instagram.com/p/", "instagram.com/share/p/"];
const dominioTikTok = ["tiktok.com", "https://vm.tiktok.com", "www.tiktok.com"];
const dominioFacebook = ["https://facebook.com", "facebook.com", "fb.com", "www.facebook.com"];
const dominioKwai = ["kwai.com", "www.kwai.com", "s.kw.ai"];
const dominioYouTube = ["youtube.com", "www.youtube.com", "youtu.be"];
const dominioPinterest = ["https://pin.it", "pinterest.com", "pin.it"];

//
if(dominioinsta.some((domain) => budy.indexOf(domain) !== -1)) {
const baixarinsta = budy.indexOf("https://");
const reisdex = budy.indexOf(" ", baixarinsta) !== -1 ? budy.indexOf(" ", baixarinsta) : budy.length;
const instagramLink = budy.substring(baixarinsta, reisdex);

if(instagramLink) {
 try {
  reagir(from, '📽')
  const apiResp = await fetchJson(`${API_KIMORI_URL}/api/instagram/dl/video?url=${encodeURIComponent(instagramLink)}&apikey=${APIKEY_KIMORI}`)

  if (!apiResp?.success) throw new Error('Falha na API')

  const todasMidias = [...(apiResp.imagens ?? []), ...(apiResp.videos ?? [])]
  if (!todasMidias.length) throw new Error('Nenhuma mídia encontrada')

  // Detecta foto decodificando o JWT do snapcdn ou pela extensão direta na URL
  function isImageUrl(url) {
    try {
      const token = new URL(url).searchParams.get('token')
      if (token) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        return /\.jpg|\.jpeg|\.png|\.webp/i.test(payload.filename ?? '')
      }
    } catch {}
    return /\.jpg|\.jpeg|\.png|\.webp/i.test(url)
  }

  const fotos = todasMidias.filter(isImageUrl)
  const videos = todasMidias.filter(url => !isImageUrl(url))

  if (fotos.length) {
    const total = fotos.length
    const cards = []

    for (let i = 0; i < total; i++) {
      const media = await prepareWAMessageMedia(
        { image: { url: fotos[i] } },
        { upload: conn.waUploadToServer }
      )
      cards.push({
        header: {
          hasMediaAttachment: true,
          imageMessage: media.imageMessage
        },
        headerType: 'IMAGE',
        body: { text: `${i + 1}/${total}` },
        footer: { text: '' },
        nativeFlowMessage: { buttons: [] }
      })
    }

    await conn.relayMessage(from, {
      interactiveMessage: {
        contextInfo: { participant: from },
        body: { text: '' },
        carouselMessage: { cards }
      }
    }, {})
  }

  if (videos.length) {
    await conn.sendMessage(from, {
      video: { url: videos[0] },
      mimetype: 'video/mp4'
    }, { quoted: selo })
  }

  reagir(from, '✅')

 } catch (error) {
  console.error("Erro ao baixar mídia do Instagram:", error);
  reagir(from, '❌️')
  return reply("Ocorreu um erro ao processar o vídeo. Verifique se o link é válido e se o vídeo é público.");
 }
} else {
 reagir(from, '❌️')
 return reply("Por favor, forneça um link válido do Instagram.");
}
}
//
if (dominioTikTok.some((domain) => budy.includes(domain))) {
  const baixatiktok = budy.indexOf("https://");
  const reistiktok = budy.indexOf(" ", baixatiktok) !== -1
 ? budy.indexOf(" ", baixatiktok)
 : budy.length;

  const TikTokLink = budy.substring(baixatiktok, reistiktok);

  if (TikTokLink) {
 try {
reagir(from, '📽')

const resolved = await fetch(TikTokLink, { redirect: 'follow' })
const finalUrl = resolved.url

const apiResp = await fetch('https://www.tikwm.com/api/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `url=${encodeURIComponent(finalUrl)}&hd=1`
})

const json = await apiResp.json()
const data = json?.data
if (!data) throw new Error('post não encontrado')

if (data?.images?.length > 0) {
  const total = data.images.length
  const cards = []

  for (let i = 0; i < total; i++) {
 const media = await prepareWAMessageMedia(
{ image: { url: data.images[i] } },
{ upload: conn.waUploadToServer }
 )

 cards.push({
header: {
  hasMediaAttachment: true,
  imageMessage: media.imageMessage
},
headerType: 'IMAGE',
body: { text: `${i + 1}/${total}` },
footer: { text: '' },
nativeFlowMessage: { buttons: [] }
 })
  }

  await conn.relayMessage(from, {
 interactiveMessage: {
contextInfo: { participant: from },
body: { text: '' },
carouselMessage: { cards }
 }
  }, {})

} else {
  const videoUrl = data?.hdplay || data?.play
  if (!videoUrl) throw new Error('sem vídeo')

  await conn.sendMessage(from, {
 video: { url: videoUrl },
 mimetype: 'video/mp4',
 caption: '🎬 Vídeo do TikTok baixado com sucesso.'
  }, { quoted: selo })
}

reagir(from, '✅')

 } catch (error) {
console.error(error)
reagir(from, '❌')
return reply("❌ Ocorreu um erro ao processar o link do TikTok.")
 }
  } else {
 reagir(from, '❌')
 reply("❌ Link do TikTok inválido.")
  }
}
//
if (dominioPinterest.some((domain) => budy.includes(domain))) {
const baixapin = budy.indexOf("https://");
const reispin = budy.indexOf(" ", baixapin) !== -1
? budy.indexOf(" ", baixapin)
: budy.length;

const PinterestLink = budy.substring(baixapin, reispin);

if (PinterestLink) {
try {
reagir(from, '📌')

const data = await fetchJson(
`https://zero-two-apis.com.br/api/pinterest_mp4?url=${encodeURIComponent(PinterestLink)}&apikey=${API_KEY_ZERO}`
)

const imagem = data?.resultados?.thumbnail

if (!imagem) {
reagir(from, '❌')
return reply("❌ Não foi possível obter a imagem.")
}

await conn.sendMessage(from, {
image: { url: imagem },
caption: `• 🖼️ | *Imagem do Pinterest baixada!*`
}, { quoted: selo })

reagir(from, '✅')

} catch (error) {
console.log(error)
reagir(from, '❌')
reply("❌ Erro ao processar o Pinterest.")
}
} else {
reagir(from, '❌')
reply("❌ Link inválido.")
}
}
//
if(dominioFacebook.some((domain) => budy.indexOf(domain) !== -1)) {
 const baixarface = budy.indexOf("https://");
 const reisfacebook = budy.indexOf(" ", baixarface) !== -1 ? budy.indexOf(" ", baixarface) : budy.length;
 const FacebookLink = budy.substring(baixarface, reisfacebook);

 if(FacebookLink) {
  try {
reagir(from, '📽')

data = await fetchJson(`${API_KIMORI_URL}/api/download/facebook?url=${encodeURIComponent(FacebookLink)}&apikey=${APIKEY_KIMORI}`);

if (!data || !data.success || !data.data?.video) {
 return reply(`Erro ao obter o vídeo: Link inválido ou vídeo não disponível`);
}

conn.sendMessage(from, {
 video: { url: data.data.video },
 mimetype: "video/mp4"
}, { quoted: selo });

reagir(from, '✅')

  } catch (error) {
console.error("Erro ao baixar vídeo do Facebook:", error);
reagir(from, '❌️')
return reply("Ocorreu um erro ao processar o vídeo. Verifique se o link é válido.");
  }
 } else {
  reagir(from, '❌️')
  return reply("Por favor, forneça um link válido do Facebook.");
 }
}
//
if(dominioKwai.some((domain) => budy.indexOf(domain) !== -1)) {
 const baixakwai = budy.indexOf("https://");
 const reiskwai = budy.indexOf(" ", baixakwai) !== -1 ? budy.indexOf(" ", baixakwai) : budy.length;
 const KwaiLink = budy.substring(baixakwai, reiskwai);

 if(KwaiLink) {
  try {
reagir(from, '📽')

data = await fetchJson(`${API_KIMORI_URL}/api/download/kwai?url=${encodeURIComponent(KwaiLink)}&apikey=${APIKEY_KIMORI}`);

if (!data || !data.success || !data.data?.video) {
 return reply(`Erro ao obter o vídeo: Link inválido ou vídeo não disponível`);
}

conn.sendMessage(from, {
 video: { url: data.data.video },
 mimetype: "video/mp4",
 caption: data.data.descricao || ''
}, { quoted: selo });

reagir(from, '✅')

  } catch (error) {
console.error("Erro ao baixar vídeo do Kwai:", error);
reagir(from, '❌️')
return reply("Ocorreu um erro ao processar o vídeo. Verifique se o link é válido.");
  }
 } else {
  reagir(from, '❌️')
  return reply("Por favor, forneça um link válido do Kwai.");
 }
}
//
if(dominioYouTube.some((domain) => budy.indexOf(domain) !== -1)) {
  const baixayt = budy.indexOf("https://");
  const reisyt = budy.indexOf(" ", baixayt) !== -1
 ? budy.indexOf(" ", baixayt)
 : budy.length;

  const YoutubeLink = budy.substring(baixayt, reisyt);

  if (YoutubeLink) {
 try {
reagir(from, '🎵')

// Baixa vídeo
const videoUrl = `${API_KIMORI_URL}/api/dl/ytvideo1?url=${encodeURIComponent(YoutubeLink)}&apikey=${APIKEY_KIMORI}`
const videoRes = await fetch(videoUrl)
if (!videoRes.ok) throw new Error('Erro ao baixar vídeo')
const videoBuffer = Buffer.from(await videoRes.arrayBuffer())

if (!videoBuffer || videoBuffer.length < 1000) throw new Error('Vídeo vazio ou corrompido')

const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const tmpIn = `/tmp/yt_in_${Date.now()}.mp4`
const tmpOut = `/tmp/yt_out_${Date.now()}.mp4`

fs.writeFileSync(tmpIn, videoBuffer)

await new Promise((resolve, reject) => {
  ffmpeg(tmpIn)
 .outputOptions([
'-c:v libx264',
'-profile:v baseline',
'-level 3.0',
'-c:a aac',
'-b:a 128k',
'-movflags faststart',
'-preset ultrafast',
'-crf 32'
 ])
 .output(tmpOut)
 .on('end', resolve)
 .on('error', reject)
 .run()
})

const finalBuffer = fs.readFileSync(tmpOut)
fs.unlinkSync(tmpIn)
fs.unlinkSync(tmpOut)

// Envia vídeo
await conn.sendMessage(from, {
  video: finalBuffer,
  mimetype: 'video/mp4',
  fileName: 'video.mp4'
}, { quoted: selo })

reagir(from, '✅')

 } catch (error) {
console.error('[yt auto]', error)
reagir(from, '❌')
reply('❌ Erro ao processar o link do YouTube.')
 }
  } else {
 reagir(from, '❌')
 reply('❌ Link do YouTube inválido.')
  }
}
}

//========================================\\

hora2 = moment.tz('America/Sao_Paulo').format('HH:mm:ss');

if (isCmd) {
  const AB = similarityCmd(command)

  const notFoundMessage = Msg_NotFound
 .replace('#usuario#', `${sender.split("@")[0]}`)
 .replace('#prefix#', prefix)
 .replace('#hora#', horaSattz)
 .replace('#data#', dataSattz)
 .replace('#cmd#', prefix + command)
 .replace('#sugestao#', AB[0].comando)

  if (UseImage_NotFound) {
 await conn.sendMessage(from, {
image: { url: Link_NotFound },
caption: notFoundMessage,
mentions: [sender]
 }, { quoted: info })
  } else {
 await conn.sendMessage(from, {
text: notFoundMessage,
mentions: [sender]
 }, { quoted: info })
  }

  reagir(from, '❓️')
}
//========================================\\
}
}
}



//===== [Fim - Área de Atualizações] =====\\


module.exports = startbase;