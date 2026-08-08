const fs = require('fs');
const path = './banco de dados/parceiros.json';

function carregarParceiros() {
  if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function salvarParceiros(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function addParceiro(grupo, user, usos) {
  const db = carregarParceiros();
  if (!db[grupo]) db[grupo] = {};
  db[grupo][user] = { usos_restantes: parseInt(usos), usos_totais: parseInt(usos) };
  salvarParceiros(db);
}

function removerParceiro(grupo, user) {
  const db = carregarParceiros();
  if (db[grupo] && db[grupo][user]) {
    delete db[grupo][user];
    salvarParceiros(db);
    return true;
  }
  return false;
}

function atualizarParceiro(grupo, user, novoUsos) {
  const db = carregarParceiros();
  if (db[grupo] && db[grupo][user]) {
    db[grupo][user].usos_restantes = parseInt(novoUsos);
    db[grupo][user].usos_totais = parseInt(novoUsos);
    salvarParceiros(db);
    return true;
  }
  return false;
}

function isParceiro(grupo, user) {
  const db = carregarParceiros();
  return db[grupo] && db[grupo][user] && db[grupo][user].usos_restantes > 0;
}

function consumirUso(grupo, user) {
  const db = carregarParceiros();
  if (db[grupo] && db[grupo][user]) {
    db[grupo][user].usos_restantes -= 1;
    salvarParceiros(db);
    return db[grupo][user].usos_restantes;
  }
  return -1;
}

function getDadosParceiro(grupo, user) {
  const db = carregarParceiros();
  return db[grupo]?.[user] || null;
}

function listarParceiros(grupo) {
  const db = carregarParceiros();
  return db[grupo] || {};
}

module.exports = { addParceiro, removerParceiro, atualizarParceiro, isParceiro, consumirUso, getDadosParceiro, listarParceiros };