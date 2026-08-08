/*
🤖 COMO INICIAR O BOT NO TERMUX (GUIA SIMPLES)

Olá! 👋
Se você nunca usou Termux ou não entende muito de programação, não tem problema.
Basta seguir os passos abaixo com calma que tudo irá funcionar. ✅

---

📂 1️⃣ PRIMEIRO PASSO

🔓 Permitir que o Termux acesse os arquivos do celular

Antes de tudo, precisamos permitir que o Termux acesse os arquivos do seu celular.

Digite este comando:

termux-setup-storage

📌 O que vai acontecer:
Vai aparecer uma mensagem pedindo permissão para acessar os arquivos.

➡️ Basta tocar em Permitir / Allow.

---

🔄 2️⃣ SEGUNDO PASSO

⚠️ Atualizar o Termux

Agora vamos atualizar o sistema do Termux para evitar erros.

Digite:

pkg upgrade -y && pkg update -y

⚠️ IMPORTANTE:
Se aparecer algo assim:

(Y/I/N/O/D/Z) [default=N] ?

✔️ Digite:

Y

Depois aperte Enter no teclado.

---

📦 3️⃣ TERCEIRO PASSO

🛠️ Instalar os programas necessários

Agora vamos instalar alguns programas que o bot precisa para funcionar.

Digite:

pkg install -y ffmpeg nodejs-lts wget tesseract git

📌 Esses programas ajudam o bot a funcionar corretamente.

Pode demorar um pouco dependendo da internet, então tenha paciência ⏳

---

📁 4️⃣ QUARTO PASSO

📍 Entrar na pasta onde está o bot

Agora você precisa entrar na pasta onde o bot está salvo no seu celular.

Digite o comando abaixo trocando pelo caminho da pasta:

cd /sdcard/CAMINHO_AONDE_O_BOT_ESTÁ

💡 Exemplo:

cd /sdcard/download/MizukiBot-MD

⚠️ Se a pasta tiver outro nome, basta usar o nome correto.

---

▶️ 5️⃣ QUINTO PASSO

🤖 Iniciar o bot

Agora é só iniciar o bot com este comando:

npm start

📌 Esse comando funciona tanto no Termux quanto em hospedagens (host).

---

✅ PRONTO!

🎉 Depois de fazer todos os passos acima, o bot já pode funcionar normalmente.

Se tudo estiver certo, ele irá iniciar automaticamente no terminal.

---

💡 DICA IMPORTANTE

Sempre que quiser ligar o bot novamente:

1️⃣ Abra o Termux
2️⃣ Entre na pasta do bot novamente
3️⃣ Digite:

npm start

E pronto! 🚀

---

☁️ PARA QUEM USA HOSPEDAGEM (HOST)

Se você estiver usando uma hospedagem/VPS/painel, normalmente não é necessário fazer todos os passos do Termux.

Na maioria das hospedagens basta definir o comando de inicialização (Startup Command) como:

npm start

📌 Assim o bot irá ligar automaticamente quando a hospedagem iniciar.

---

✨ BY: Sattz Skirov
*/