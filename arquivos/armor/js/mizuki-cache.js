/**
 * mizuki-cache.js
 * Cache com TTL, auto limpeza e limite de tamanho
 * Sem vazamento de memória — seguro pra grupos com alto volume
 */

'use strict'

class MizukiCache {
  /**
   * @param {object} opts
   * @param {number} opts.ttl        - Tempo de vida padrão em ms (default: 5 min)
   * @param {number} opts.maxSize    - Máximo de entradas (default: 2000)
   * @param {number} opts.cleanEvery - Intervalo do GC em ms (default: 2 min)
   */
  constructor({ ttl = 5 * 60 * 1000, maxSize = 2000, cleanEvery = 2 * 60 * 1000 } = {}) {
    this.ttl = ttl
    this.maxSize = maxSize
    /** @type {Map<string, { value: any, expiresAt: number }>} */
    this._store = new Map()

    // GC periódico — limpa entradas expiradas sem precisar de acesso
    this._gcTimer = setInterval(() => this._gc(), cleanEvery)

    // Não segura o processo Node se for o único timer ativo
    if (this._gcTimer.unref) this._gcTimer.unref()
  }

  // ─── Leitura ───────────────────────────────────────────────────────────────

  /**
   * Retorna o valor ou undefined se ausente/expirado
   * @param {string} key
   */
  get(key) {
    const entry = this._store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key)
      return undefined
    }
    return entry.value
  }

  has(key) {
    return this.get(key) !== undefined
  }

  // ─── Escrita ───────────────────────────────────────────────────────────────

  /**
   * Armazena um valor
   * @param {string} key
   * @param {*}      value
   * @param {number} [ttl] - TTL específico em ms (opcional, usa o padrão se omitido)
   */
  set(key, value, ttl = this.ttl) {
    // Se já está no limite e é chave nova, remove a mais antiga (LRU simples)
    if (!this._store.has(key) && this._store.size >= this.maxSize) {
      const oldest = this._store.keys().next().value
      this._store.delete(oldest)
    }
    this._store.set(key, { value, expiresAt: Date.now() + ttl })
    return this
  }

  // ─── Remoção ───────────────────────────────────────────────────────────────

  delete(key) {
    return this._store.delete(key)
  }

  /** Remove todas as entradas cujo prefixo bate */
  deleteByPrefix(prefix) {
    let count = 0
    for (const key of this._store.keys()) {
      if (key.startsWith(prefix)) { this._store.delete(key); count++ }
    }
    return count
  }

  clear() {
    this._store.clear()
  }

  // ─── Utilitários ──────────────────────────────────────────────────────────

  get size() { return this._store.size }

  stats() {
    const now = Date.now()
    let alive = 0, expired = 0
    for (const entry of this._store.values()) {
      now <= entry.expiresAt ? alive++ : expired++
    }
    return { total: this._store.size, alive, expired, maxSize: this.maxSize }
  }

  /**
   * Destrói o cache e para o GC — OBRIGATÓRIO ao desligar o bot
   * para não vazar o setInterval
   */
  destroy() {
    clearInterval(this._gcTimer)
    this._store.clear()
  }

  // ─── GC interno ───────────────────────────────────────────────────────────

  _gc() {
    const now = Date.now()
    for (const [key, entry] of this._store) {
      if (now > entry.expiresAt) this._store.delete(key)
    }
  }
}

// ─── Instâncias prontas pra usar em todo o bot ────────────────────────────────

const cache = {
  /** Dados de grupo (metadata, admins) — TTL longo */
  group: new MizukiCache({ ttl: 10 * 60 * 1000, maxSize: 500,  cleanEvery: 3 * 60 * 1000 }),

  /** Anti-spam / cooldown de comandos por sender */
  cooldown: new MizukiCache({ ttl: 30 * 1000,        maxSize: 5000, cleanEvery: 60 * 1000 }),

  /** Anti-flood de mensagens idênticas */
  flood: new MizukiCache({ ttl: 10 * 1000,        maxSize: 3000, cleanEvery: 30 * 1000 }),

  /** Respostas de API (play, ping, etc.) */
  api: new MizukiCache({ ttl: 2 * 60 * 1000,  maxSize: 200,  cleanEvery: 60 * 1000 }),

  /** Genérico — para qualquer outro uso */
  misc: new MizukiCache({ ttl: 5 * 60 * 1000,  maxSize: 1000, cleanEvery: 2 * 60 * 1000 }),
}

module.exports = { MizukiCache, cache }
