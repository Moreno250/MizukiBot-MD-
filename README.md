<div align="center">

<img src="https://i.ibb.co/kgpx5psw/7921fd838252.jpg" width="320" alt="MizukiBot-MD Logo">

<br>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&duration=3000&pause=800&color=B084F7&center=true&vCenter=true&width=500&lines=𝐌𝐢𝐳𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃+✿;Baileys+%7C+Node.js+%7C+CJS;%2B950+comandos+e+contando...)](https://git.io/typing-svg)

![Version](https://img.shields.io/badge/vers%C3%A3o-6.0.0--Open--Beta-blueviolet?style=flat-square)
![Open Source](https://img.shields.io/badge/Open%20Source-✔-brightgreen?style=flat-square)
![Commands](https://img.shields.io/badge/comandos-%2B950-ff69b4?style=flat-square)
![Host](https://img.shields.io/badge/host-Termux-2ea44f?style=flat-square)

Criador: **Sattz** — [WhatsApp](https://wa.me/5527992870575)

Se o projeto te ajudou de alguma forma, deixa uma ⭐ no repo. Não custa nada pra você e ajuda bastante o projeto a crescer.

</div>

---

## ✨ Sobre

**MizukiBot-MD** é meu bot pra WhatsApp feito em cima do **Baileys** (Node.js, CJS), **Open Source** e com mais de **950 comandos** já implementados. Tema todo em cima de lua/anime, com interface decorada e nada de menu genérico igual todo bot por aí.

Roda liso tanto no **Termux** (direto do celular) quanto em host tipo **Pterodactyl**, se você preferir deixar 24h no ar.

---

## 🧩 Sistemas

| Sistema | Descrição |
|---|---|
| 🎮 **Dinheiro** | Sistema completo trabalho e vida comercial com jogos |
| 👨‍👩‍👧 **Família** | Sistema de casamento, adoção e relações entre usuários |
| 🥵 **Hentai** | Comandos gosotosos para se divertir |
| 🛡️ **Moderação** | anti-link, detecção de IA da Meta, banimentos automáticos, Horarios Grupo |
| 🖼️ **NoPrefix CmdFig** | Sistema aonde pode gerar comandos sem prefixos e/ou executalos com figurinhas |
| ✨️ **Auto-Download** | Downloads de videos de redes sociais, Tiktok, Instagram, facebook etc |
| ⚙️ **Utilidades** | Downloads, stickers, buscas, ferramentas de grupo e admin |

Dentro do bot, manda `/menu` que ele te mostra tudo organizado por categoria.

---

## 📲 Como Configurar (Termux)

### 1. Instale as dependências no Termux

```bash
pkg update && pkg upgrade -y
pkg install nodejs-lts git ffmpeg -y
```

### 2. Clone o repositório

```bash
git clone https://github.com/SattzModz/MizukiBot-MD.git
cd MizukiBot-MD
```

### 3. Instale os pacotes do bot

```bash
npm install
```

### 4. Configure o bot

Abra `./dono/settings.json` e edite com seus dados:

```json
{
  "prefix": "/",
  "NomeDoBot": "𝐌𝐢𝐳𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃 ✿",
  "NickDono": "𝑺𝒂𝒕𝒕𝒛 𝑻🌙𝑴𝒐𝒐𝒏",
  "numerodono": "5527992870575",
  "nomecanal": ".",
  "newscanal": "000000@g.us",
  "API_KEY_BRONXYS": "MIYUKI_ULT_26@",
  "API_KEY_ZERO": "SANDRO_MD_2005",
  "BronxysSite": "https://api.bronxyshost.com.br",
  "zerosite": "https://zero-two-apis.store",
  "API_KIMORI_URL": "https://beta-api.orbitalcode.online",
  "APIKEY_KIMORI": "Sua-Key"
}
```

| Campo | O que é |
|---|---|
| `prefix` | Prefixo dos comandos (ex: `/`, `!`, `.`) |
| `NomeDoBot` | Nome que aparece nas respostas do bot |
| `NickDono` | Seu nick, usado em menus e créditos |
| `numerodono` | Seu número, no formato `55DDD9XXXXXXXX` (sem `+` e sem espaço) |
| `nomecanal` / `newscanal` | Canal de avisos do bot (JID do canal, termina em `@g.us`) |
| `API_KEY_BRONXYS` / `API_KEY_ZERO` | Chaves das APIs auxiliares (Bronxys e Zero-Two) |
| `BronxysSite` / `zerosite` | Endpoints base dessas APIs |
| `API_KIMORI_URL` | Endpoint da Kimori API (não mexe, já vem certo) |
| `APIKEY_KIMORI` | Sua chave da Kimori API — **veja abaixo** |

> ⚠️ **Nunca suba esse arquivo público num repositório** com suas chaves reais preenchidas. Se for postar em algum lugar, use placeholder tipo `"Sua-Key"`.

#### 🔑 Sobre a Kimori API

Boa parte dos comandos do bot (downloads, buscas, ferramentas, etc.) depende da **Kimori API** (`https://beta-api.orbitalcode.online`) pra funcionar. Ela **não é gratuita** — sem a `APIKEY_KIMORI` preenchida com uma chave válida, esses comandos simplesmente não vão rodar.

Pra adquirir sua key, chama no WhatsApp: **[+55 38 9116-4328](https://wa.me/5538911164328)**

### 5. Inicie o bot

```bash
npm start
```

Na primeira execução, escaneie o **QR Code** (ou use o método de **código de pareamento**, se disponível) com o WhatsApp do número que será conectado ao bot.

> 💡 Dica: use `pkg install tmux` ou similar para manter o bot rodando em segundo plano no Termux sem cair a conexão.

---

## 🖥️ Hospedagem Alternativa (Pterodactyl)

O MizukiBot-MD também é compatível com deploy via **Pterodactyl**, através do egg próprio do projeto — ideal para quem quer rodar o bot 24h sem depender do celular ligado.

---

## 📄 Licença

Projeto distribuído como **Open Source**. Sinta-se livre para estudar, modificar e contribuir — apenas mantenha os créditos ao criador original.

---

## 👤 Créditos

**Desenvolvido por:** Sattz  
**WhatsApp:** [+55 27 99287-0575](https://wa.me/5527992870575)

<div align="center">

### ⭐ Não esquece de deixar sua estrelinha no repositório! ⭐

</div>
