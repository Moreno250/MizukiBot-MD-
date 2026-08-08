'use stric';
/* Função de registro de comando sem prefixo ou figurinhas.
/* @Nk Petrøv que fez.*/

const fs = require('fs')
const pathPrefix = './banco de dados/func/noprefix.json'


if (!fs.existsSync(pathPrefix)) fs.writeFileSync(pathPrefix, JSON.stringify([]))
function registrarNoPrefix(cmdSemPrefixo, comandoOriginal) {
  const lista = JSON.parse(fs.readFileSync(pathPrefix))
  const existente = lista.find(x => x.cmdSemPrefixo === cmdSemPrefixo)
  if (existente) {
    existente.comandoOriginal = comandoOriginal
  } else {
    lista.push({ cmdSemPrefixo, comandoOriginal })
  }
  fs.writeFileSync(pathPrefix, JSON.stringify(lista, null, 2))
  return true
}

function removerNoPrefix(cmdSemPrefixo) {
  const lista = JSON.parse(fs.readFileSync(pathPrefix))
  const novaLista = lista.filter(x => x.cmdSemPrefixo !== cmdSemPrefixo)
  fs.writeFileSync(pathPrefix, JSON.stringify(novaLista, null, 2))
  return lista.length !== novaLista.length
}

function getComandoNoPrefix(cmdSemPrefixo) {
  const lista = JSON.parse(fs.readFileSync(pathPrefix))
  const achado = lista.find(x => x.cmdSemPrefixo === cmdSemPrefixo)
  return achado ? achado.comandoOriginal : null
}

function listarNoPrefix() {
  const lista = JSON.parse(fs.readFileSync(pathPrefix))
  return lista
}



module.exports = { registrarNoPrefix, removerNoPrefix, getComandoNoPrefix, listarNoPrefix }
