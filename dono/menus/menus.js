const fs = require('fs')
const colors = require('colors')
const path = require('path')
const chalk = require('chalk')

const menu = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {
return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔ.✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔ.໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┛

「💜」 𝐌𝐄𝐔𝐒 𝐌𝐄𝐍𝐔𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuDono 
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuAdm 
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}NoPrefix 
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}Brincadeiras 
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuCoins
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}Alteradores 
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuLogos
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuBaixar 
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuFig 
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuAnime
┃ ๋ ࣭ ⭑🌙𖦹 ${prefix}MenuHentai
┗֘━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛

「💜」 𝐏𝐄𝐒𝐐𝐔𝐈𝐒𝐀𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃┊｡˚✧ 🪷 ${prefix}Gemini "pesquisa"
┃┊｡˚✧ 🪷 ${prefix}Gpt "pesquisa"
┃┊｡˚✧ 🪷 ${prefix}Mizuki "pesquisa"
┃┊｡˚✧ 🪷 ${prefix}Ytstalk @usuario
┃┊｡˚✧ 🪷 ${prefix}Tiktok_Stalker @usuario
┃┊｡˚✧ 🪷 ${prefix}Roblox_Stalker @usuario
┃┊｡˚✧ 🪷 ${prefix}AnimeInfo "nome"
┃┊｡˚✧ 🪷 ${prefix}PlayStore "nome"
┃┊｡˚✧ 🪷 ${prefix}Pinterest "titulo"
┃┊｡˚✧ 🪷 ${prefix}Pinvid "título"
┃┊｡˚✧ 🪷 ${prefix}Tiktok "Tema"
┃┊｡˚✧ 🪷 ${prefix}Letras "musica"
┃┊｡˚✧ 🪷 ${prefix}Dicionário "Palavra"
┃┊｡˚✧ 🪷 ${prefix}Noticias 
┃┊｡˚✧ 🪷 ${prefix}Movie "filme"
┃┊｡˚✧ 🪷 ${prefix}Livro "nome"
┃┊｡˚✧ 🪷 ${prefix}Wikipedia "nome"
┃┊｡˚✧ 🪷 ${prefix}Anime "nome"
┃┊｡˚✧ 🪷 ${prefix}Clima "City"
┗֘━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Ping "velocidade"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Suporte "bot suporte"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Dono "meu dono"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Infobot "minhas info"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Criador "meu criador"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Avisos "aviso da bot"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}InfoBv "tutorial BemVindo"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}InfoListaNegra "tutorial ListaNegra"
┗֘━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐀𝐋𝐄𝐀𝐓𝐎́𝐑𝐈𝐎𝐒 「💜」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}GptVideo "tema"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}GerarLink "midia"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Perfil "informações"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Calcular "1 + 1"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Signo "leao"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Afk "texto"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}WasTalk "5599xxx"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}FazerNick "nome"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Signo "virgem"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Listavip
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Metadinha "imagens"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}PlayStore "app"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Alugar
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}PrintSite "link"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Cep "cep"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Admins "chama todos"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Tabela
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Brasileirao 
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Bug "relatar o erro"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Dono
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Sugestao "sugestão"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}TagMe
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Apr
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}QrCode "Marcar Imagem"
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Digit
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Papof
┃֪࣪𝆺𝅥🩵❆ິ̸𖥔 ${prefix}Hd "Marcar Imagem"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛`;
};

exports.menu = menu;

// MENU DE ADMINISTRADORES 

const adms = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => { 
 
// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

	return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔִ໋✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔִ໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━┛

「💜」 𝐁𝐀𝐍𝐈𝐌𝐄𝐍𝐓𝐎𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━━┓
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}ListaNegra "numero"
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}TirarDaLista "numero"
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}ListaNegraG "numero"
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}TirarDaListaG "numero"
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}Ban "(@)1/+Users"
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}Band "marcar"
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}ListBan "lista"
┃ ๋ ࣭ ⭑🕸️𖦹 ${prefix}Kick "remover"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛

「💜」 𝐆𝐄𝐑𝐄𝐍𝐂𝐈𝐀𝐑 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ ⊹♱ ${prefix}SoAdm "ignora"
┃ ⊹♱ ${prefix}Adv "marcar"
┃ ⊹♱ ${prefix}VerAdv "marcar"
┃ ⊹♱ ${prefix}RmAdv "marcar"
┃ ⊹♱ ${prefix}RemoveAllAdv "marcar"
┃ ⊹♱ ${prefix}Promover "marcar"
┃ ⊹♱ ${prefix}Rebaixar "marcar"
┃ ⊹♱ ${prefix}Mute "marcar"
┃ ⊹♱ ${prefix}DesMute "marcar"
┃ ⊹♱ ${prefix}ToTag "mencionar"
┃ ⊹♱ ${prefix}Marcar "marca todos"
┃ ⊹♱ ${prefix}HideTag "marcação"
┃ ⊹♱ ${prefix}Recrutar "número"
┃ ⊹♱ ${prefix}Grupo "f/a"
┃ ⊹♱ ${prefix}Atividades "grupo"
┃ ⊹♱ ${prefix}Status "infos"
┃ ⊹♱ ${prefix}Limpar "texto"
┃ ⊹♱ ${prefix}NomeGp "nome"
┃ ⊹♱ ${prefix}DescGp "descrição"
┃ ⊹♱ ${prefix}FotoGp "foto"
┃ ⊹♱ ${prefix}LinkGp "url"
┃ ⊹♱ ${prefix}GrupoInfo "infos"
┃ ⊹♱ ${prefix}CriarTabela "escreva"
┃ ⊹♱ ${prefix}TabelaGp "infos"
┃ ⊹♱ ${prefix}SetHorario "00:00 06:00"
┃ ⊹♱ ${prefix}DelHorario "deletar"
┃ ⊹♱ ${prefix}OnHorario "ativar"
┃ ⊹♱ ${prefix}OffHorario "desativar"
┃ ⊹♱ ${prefix}ListHorarios
┃ ⊹♱ ${prefix}RgFigu "cmd"
┃ ⊹♱ ${prefix}DelFigu "figu"
┃ ⊹♱ ${prefix}ListFigus
┃ ⊹♱ ${prefix}LegendaEstrangeiro "msg"
┃ ⊹♱ ${prefix}LegendaBv "digite-algo"
┃ ⊹♱ ${prefix}LegendaBv2 "digite-algo"
┃ ⊹♱ ${prefix}LegendaSaiu "digite-algo"
┃ ⊹♱ ${prefix}LegendaSaiu2 "digite-algo"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐀𝐓𝐈𝐕𝐀𝐂̧𝐎̃𝐄𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
│𖤐💜⃤ ${prefix}AntiLink "1 / 0"    
│𖤐💜⃤ ${prefix}AntiLinkGp "1 / 0"
│𖤐💜⃤ ${prefix}AntiMeta "1 / 0"
│𖤐💜⃤ ${prefix}AntiCanal " / "
│𖤐💜⃤ ${prefix}AntiSpam "1 / 0"
│𖤐💜⃤ ${prefix}AntiStatus "1 / 0"
│𖤐💜⃤ ${prefix}AntiSticker "1 / 0"
│𖤐💜⃤ ${prefix}AntiPalavra "1 / 0"
│𖤐💜⃤ ${prefix}AntiCtt "1 / 0"
│𖤐💜⃤ ${prefix}AntiVideo "1 / 0"
│𖤐💜⃤ ${prefix}AntiImg "1 / 0"
│𖤐💜⃤ ${prefix}AntiAudio "1 / 0"
│𖤐💜⃤ ${prefix}X9 "1 / 0"
│𖤐💜⃤ ${prefix}AutoRepo "1 / 0"
│𖤐💜⃤ ${prefix}BemVindo "1 / 0"
│𖤐💜⃤ ${prefix}BemVindo2 "1 / 0"
│𖤐💜⃤ ${prefix}ModoIA "1 / 0"
│𖤐💜⃤ ${prefix}AutoFigu "1 / 0"
│𖤐💜⃤ ${prefix}AntiPalavrão "1 / 0"
│𖤐💜⃤ ${prefix}antipagamento "1 / 0"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛`;
};

exports.adms = adms;

// MENU DE DONO

const menudono = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {
	
// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode alterar ele tod0, menos as definições, só se quiser apagar a definição completa. 	

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔִ໋✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔִ໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
│♛👑⃤ ${prefix}listagp "grupos"
│♛👑⃤ ${prefix}ativo "presente"
│♛👑⃤ ${prefix}ausente "fale-oq-faz"
│♛👑⃤ ${prefix}clonar "rouba ft"
│♛👑⃤ ${prefix}bcgp "tm-pv"
│♛👑⃤ ${prefix}transmissão "tm-gps"
│♛👑⃤ ${prefix}fotomenu "marcar-image"
│♛👑⃤ ${prefix}fotobot "foto do bot"
│♛👑⃤ ${prefix}descriçãogp "digite-algo"
│♛👑⃤ ${prefix}setprefix "prefixo-novo"
│♛👑⃤ ${prefix}setkey "info"
│♛👑⃤ ${prefix}setkeyinfo
│♛👑⃤ ${prefix}serpremium "recurso"
│♛👑⃤ ${prefix}addpremium "marcar"
┃♛👑⃤ ${prefix}delpremium "marcar"
│♛👑⃤ ${prefix}blockcmd "comandos"
│♛👑⃤ ${prefix}unblockcmd "comandos"
│♛👑⃤ ${prefix}rg_aluguel "30d / 24h"
│♛👑⃤ ${prefix}rm_aluguel
│♛👑⃤ ${prefix}renovar_aluguel
│♛👑⃤ ${prefix}lista_aluguel
│♛👑⃤ ${prefix}rgcmd "semprefixo cmdreal"
│♛👑⃤ ${prefix}delcmd "sem prefixo"
│♛👑⃤ ${prefix}noprefix
│♛👑⃤ ${prefix}dono1
│♛👑⃤ ${prefix}dono2
│♛👑⃤ ${prefix}dono3
│♛👑⃤ ${prefix}dono4
│♛👑⃤ ${prefix}dono5
│♛👑⃤ ${prefix}dono6
│♛👑⃤ ${prefix}configurar-bot 
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐀𝐓𝐈𝐕𝐀𝐂̧𝐎̃𝐄𝐒 「💜」 

━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃֪࣪💎⊹ ${prefix}antipalavrão "1 / 0"
┃֪࣪💎⊹ ${prefix}antiligar "1 / 0"
┃֪࣪💎⊹ ${prefix}addpalavra "palavrão"
┃֪࣪💎⊹ ${prefix}delpalavra "palavrão"
┃֪࣪💎⊹ ${prefix}antipv "1 / 0"
┃֪࣪💎⊹ ${prefix}antipv2 "1 / 0"
┃֪࣪💎⊹ ${prefix}antipv3 "1 / 0"
┃֪࣪💎⊹ ${prefix}bangp
┃֪࣪💎⊹ ${prefix}unbangp
┃֪࣪💎⊹ ${prefix}manutencao "1 / 0"
┃֪࣪💎⊹ ${prefix}console
┃֪࣪💎⊹ ${prefix}Aluguel 
┃֪࣪💎⊹ ${prefix}Aluguel_global "1 / 0"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛`;
};

exports.menudono = menudono;

// MENU DE ALTERAR ÁUDIOS E VÍDEOS

const alteradores = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔִ໋✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔִ໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐀𝐔𝐃𝐈𝐎𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃⏤͟͟͞͞🎧 ${prefix}videolento "marcar"
┃⏤͟͟͞͞🎧 ${prefix}videorapido "marcar"
┃⏤͟͟͞͞🎧 ${prefix}videocontrario "marcar"
┃⏤͟͟͞͞🎧 ${prefix}audiolento "marcar"
┃⏤͟͟͞͞🎧 ${prefix}audiorapido "marcar"
┃⏤͟͟͞͞🎧 ${prefix}grave "marcar"
┃⏤͟͟͞͞🎧 ${prefix}grave2 "marcar"
┃⏤͟͟͞͞🎧 ${prefix}esquilo "marcar"
┃⏤͟͟͞͞🎧 ${prefix}estourar "marcar"
┃⏤͟͟͞͞🎧 ${prefix}bass "marcar"
┃⏤͟͟͞͞🎧 ${prefix}bass2 "marcar"
┃⏤͟͟͞͞🎧 ${prefix}vozmenino "marcar"
┃⏤͟͟͞͞🎧 ${prefix}audioreverse "marcar"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐕𝐈𝐃𝐄𝐎𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃⏤͟͟͞͞📹 ${prefix}cortarvideo "marcar"
┃⏤͟͟͞͞📹 ${prefix}videotodoc "marcar"
┃⏤͟͟͞͞📹 ${prefix}videocontrario "marcar"
┃⏤͟͟͞͞📹 ${prefix}videorapido "marcar"
┃⏤͟͟͞͞📹 ${prefix}videopretobranco "marcar"
┃⏤͟͟͞͞📹 ${prefix}videotext "marcar"
┃⏤͟͟͞͞📹 ${prefix}videobordas "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoframes "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoespelhado "marcar"
┃⏤͟͟͞͞📹 ${prefix}videobrilho "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoflip "marcar"
┃⏤͟͟͞͞📹 ${prefix}videorotate "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoreverseaudio "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoareia "marcar"
┃⏤͟͟͞͞📹 ${prefix}videodesfoque "marcar"
┃⏤͟͟͞͞📹 ${prefix}videolento "marcar"
┃⏤͟͟͞͞📹 ${prefix}videograve "marcar"
┃⏤͟͟͞͞📹 ${prefix}videovozmenino "marcar"
┃⏤͟͟͞͞📹 ${prefix}videobass "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoestourado "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoesquilo "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoreverb "marcar"
┃⏤͟͟͞͞📹 ${prefix}videotremolo "marcar"
┃⏤͟͟͞͞📹 ${prefix}videoeco "marcar"
┃⏤͟͟͞͞📹 ${prefix}videodistorcao "marcar"
┃⏤͟͟͞͞📹 ${prefix}videopixelizado "marcar"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛`;
};

exports.alteradores = alteradores;

const brincadeiras = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔִ໋✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔִ໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐁𝐑𝐈𝐍𝐂𝐀𝐃𝐄𝐈𝐑𝐀𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ ⟡𖥔🎭 ${prefix}gay "marca (@)"
┃ ⟡𖥔🎭 ${prefix}feio "marca (@)"
┃ ⟡𖥔🎭 ${prefix}corno "marca (@)"
┃ ⟡𖥔🎭 ${prefix}vesgo "marca (@)"
┃ ⟡𖥔🎭 ${prefix}bebado "marca (@)"
┃ ⟡𖥔🎭 ${prefix}gostoso "marca (@)"
┃ ⟡𖥔🎭 ${prefix}gostosa "marca (@)"
┃ ⟡𖥔🎭 ${prefix}beijo "marca (@)"
┃ ⟡𖥔🎭 ${prefix}comer "marca (@)"
┃ ⟡𖥔🎭 ${prefix}fuder "marca (@)"
┃ ⟡𖥔🎭 ${prefix}matar "marca (@)"
┃ ⟡𖥔🎭 ${prefix}tapa "marca (@)"
┃ ⟡𖥔🎭 ${prefix}chute "marca (@)"
┃ ⟡𖥔🎭 ${prefix}dogolpe "marca (@)"
┃ ⟡𖥔🎭 ${prefix}nazista "marca (@)"
┃ ⟡𖥔🎭 ${prefix}chance (fale algo)
┃ ⟡𖥔🎭 ${prefix}casal "dupla"
┃ ⟡𖥔🎭 ${prefix}ppp
┃ ⟡𖥔🎭 ${prefix}ppt
┃ ⟡𖥔🎭 ${prefix}safado "marca (@)"
┃ ⟡𖥔🎭 ${prefix}abraco "marca (@)"
┃ ⟡𖥔🎭 ${prefix}carinho "marca (@)
┃ ⟡𖥔🎭 ${prefix}puta "marca (@)
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛

「💜」 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ ⌬₊˚💫 ${prefix}rankgay "melhores"
┃ ⌬₊˚💫 ${prefix}rankgado "melhores"
┃ ⌬₊˚💫 ${prefix}rankcorno "melhores"
┃ ⌬₊˚💫 ${prefix}rankgostoso "melhores"
┃ ⌬₊˚💫 ${prefix}rankgostosa "melhores"
┃ ⌬₊˚💫 ${prefix}ranknazista "melhores"
┃ ⌬₊˚💫 ${prefix}rankotakus "melhores"
┃ ⌬₊˚💫 ${prefix}rankpau "melhores"
┃ ⌬₊˚💫 ${prefix}rankdev "melhores"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛

「💜」 𝐖𝐄𝐁-𝐅𝐀𝐌𝐈𝐋𝐈𝐀 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}namorar
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}terminar
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}divórciar
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}cancelarpedido
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}minhadupla
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}dupla
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}criar_familia
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}deletar_familia
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}sair_familia
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}minha_familia
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}aceitar_adocao
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}adotar
┃ ⊰₊˚👨‍👩‍👧‍👦 ${prefix}expulsar_filho
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛`;
};

exports.brincadeiras = brincadeiras;


const menubaixar = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => { 

return `┏━━━ ༺💜༻ ━━━┓
┃ 💜 • 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐒 •【💜】
┗━━━ ༺💜༻ ━━━┛
╎
┏┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃֪࣪├ׁ̟̇❯►💫 ${prefix}play "nome / url"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}ytmp3 "nome / url"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}play_video "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}play_video2 "nome" 
┃֪࣪├ׁ̟̇❯►💫 ${prefix}play_doc "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}multidl "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}tiktok "tema/url"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}tiktok_audio "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}tiktok_video "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}tiktok_img "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}tiktokdl "link"   
┃֪࣪├ׁ̟̇❯►💫 ${prefix}Face_Video "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}Face_Audio "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}instagram "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}insta_video "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}insta_foto "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}Kwai_Video "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}letras "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}deezer "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}spotify "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}twitter_video "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}youtube "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}pinterest "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}pinterest2 "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}pinterest3 "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}pinterest_video "link"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}pinvid "nome"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}shazam "marcar audio"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}Gerarlink "Marcar vídeo"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}Qrcode "link/txt"
┃֪࣪├ׁ̟̇❯►💫 ${prefix}mediafire "link"
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛
`;
};

exports.menubaixar = menubaixar;

const menufig = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╔═══════ 🌸 ═══════╗
┃ ⚘️ • 𝐅𝐈𝐆𝐔𝐑𝐈𝐍𝐇𝐀𝐒 •【🌈】
╚═══════ 🌸 ═══════╝
╎
┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ ⊰✦⊱🧸𖦹 ${prefix}rename "sticker"
┃ ⊰✦⊱🧸𖦹 ${prefix}take "sticker"
┃ ⊰✦⊱🧸𖦹 ${prefix}rgtake "sticker"
┃ ⊰✦⊱🧸𖦹 ${prefix}rntake "sticker"
┃ ⊰✦⊱🧸𖦹 ${prefix}fsticker "marcar-foto"
┃ ⊰✦⊱🧸𖦹 ${prefix}sticker "marcar-foto"
┃ ⊰✦⊱🧸𖦹 ${prefix}toimg "sticker"
┃ ⊰✦⊱🧸𖦹 ${prefix}togif "sticker"
┃ ⊰✦⊱🧸𖦹 ${prefix}brat "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}qc "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}ttp "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp1 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp2 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp3 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp4 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp5 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp6 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp7 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp8 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp9 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp10 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp11 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp12 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp13 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp14 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}attp15 "texto"
┃ ⊰✦⊱🧸𖦹 ${prefix}figurinhas "1/10"
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_emoji
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_flork
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_coreana
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_bebe
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_animais
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_desenho
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_raiva
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_engracadas
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_roblox
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_anime
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_ale
┃ ⊰✦⊱🧸𖦹 ${prefix}figu_memes
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛
`;
};

exports.menufig = menufig;


const menucoins = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `┏━━━ ༺🩵༻ ━━━┓
┃ 🩵 • 𝐂𝐎𝐈𝐍𝐒 •【💰】
┗━━━ ༺🩵༻ ━━━┛
╎
┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ ⋆｡˚✧💸𖦹 ${prefix}Sorteiocoins 
┃ ⋆｡˚✧💸𖦹 ${prefix}Sortcoins 
┃ ⋆｡˚✧💸𖦹 ${prefix}Whatmusic 
┃ ⋆｡˚✧💸𖦹 ${prefix}Gartic 
┃ ⋆｡˚✧💸𖦹 ${prefix}Quizfutebol 
┃ ⋆｡˚✧💸𖦹 ${prefix}Quizanimais 
┃ ⋆｡˚✧💸𖦹 ${prefix}Anagrama 
┃ ⋆｡˚✧💸𖦹 ${prefix}Enigma 
┃ ⋆｡˚✧💸𖦹 ${prefix}Minerar 
┃ ⋆｡˚✧💸𖦹 ${prefix}Minerarcoins 
┃ ⋆｡˚✧💸𖦹 ${prefix}Coins
┃ ⋆｡˚✧💸𖦹 ${prefix}Estatisticas 
┃ ⋆｡˚✧💸𖦹 ${prefix}Cassino 
┃ ⋆｡˚✧💸𖦹 ${prefix}Dadoapostado 
┃ ⋆｡˚✧💸𖦹 ${prefix}Slot
┃ ⋆｡˚✧💸𖦹 ${prefix}Rankcoins
┃ ⋆｡˚✧💸𖦹 ${prefix}duelo
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛`;
};

exports.menucoins = menucoins;

const menulogo = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `
╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔִ໋✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔִ໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛

「💜」 𝐃𝐔𝐀𝐋 𝐋𝐎𝐆𝐎𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ ❖₊˚🌷𖦹 ${prefix}deadpool
┃ ❖₊˚🌷𖦹 ${prefix}pornhub
┃ ❖₊˚🌷𖦹 ${prefix}avengers
┃ ❖₊˚🌷𖦹 ${prefix}marvel
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「💜」 𝐋𝐎𝐆𝐎𝐒 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ ❖₊˚🌷𖦹 ${prefix}amongus
┃ ❖₊˚🌷𖦹 ${prefix}glitch
┃ ❖₊˚🌷𖦹 ${prefix}galaxy
┃ ❖₊˚🌷𖦹 ${prefix}glossy
┃ ❖₊˚🌷𖦹 ${prefix}dragonfire
┃ ❖₊˚🌷𖦹 ${prefix}comics
┃ ❖₊˚🌷𖦹 ${prefix}pubgavatar
┃ ❖₊˚🌷𖦹 ${prefix}emojimix
┃ ❖₊˚🌷𖦹 ${prefix}royal
┃ ❖₊˚🌷𖦹 ${prefix}mascotemetal
┃ ❖₊˚🌷𖦹 ${prefix}firework
┃ ❖₊˚🌷𖦹 ${prefix}summerbeach
┃ ❖₊˚🌷𖦹 ${prefix}cloudsky
┃ ❖₊˚🌷𖦹 ${prefix}techstyle
┃ ❖₊˚🌷𖦹 ${prefix}watercolor
┃ ❖₊˚🌷𖦹 ${prefix}ligatures
┃ ❖₊˚🌷𖦹 ${prefix}graffitistyle
┃ ❖₊˚🌷𖦹 ${prefix}frozen
┃ ❖₊˚🌷𖦹 ${prefix}colorful
┃ ❖₊˚🌷𖦹 ${prefix}balloon
┃ ❖₊˚🌷𖦹 ${prefix}multicolor
┃ ❖₊˚🌷𖦹 ${prefix}metal
┃ ❖₊˚🌷𖦹 ${prefix}doubleexposure
┃ ❖₊˚🌷𖦹 ${prefix}mascoteneon
┃ ❖₊˚🌷𖦹 ${prefix}eraser
┃ ❖₊˚🌷𖦹 ${prefix}america
┃ ❖₊˚🌷𖦹 ${prefix}snow
┃ ❖₊˚🌷𖦹 ${prefix}sunset
┃ ❖₊˚🌷𖦹 ${prefix}halloween
┃ ❖₊˚🌷𖦹 ${prefix}blood
┃ ❖₊˚🌷𖦹 ${prefix}hallobat
┃ ❖₊˚🌷𖦹 ${prefix}cemiterio
┃ ❖₊˚🌷𖦹 ${prefix}ffavatar
┃ ❖₊˚🌷𖦹 ${prefix}vintage3d
┃ ❖₊˚🌷𖦹 ${prefix}hollywood
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛`;
};

exports.menulogo = menulogo;

const menuanime = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔִ໋✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔִ໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┛

「🪻」 𝐌𝐄𝐍𝐔 𝐀𝐍𝐈𝐌𝐄𝐒 「🪻」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ ⊹₊˚🌌𖦹 ${prefix}akira
┃ ⊹₊˚🌌𖦹 ${prefix}ana
┃ ⊹₊˚🌌𖦹 ${prefix}ayuzawa
┃ ⊹₊˚🌌𖦹 ${prefix}boruto
┃ ⊹₊˚🌌𖦹 ${prefix}chitoge
┃ ⊹₊˚🌌𖦹 ${prefix}cosplay
┃ ⊹₊˚🌌𖦹 ${prefix}deidara
┃ ⊹₊˚🌌𖦹 ${prefix}eba
┃ ⊹₊˚🌌𖦹 ${prefix}emilia
┃ ⊹₊˚🌌𖦹 ${prefix}erza
┃ ⊹₊˚🌌𖦹 ${prefix}gremory
┃ ⊹₊˚🌌𖦹 ${prefix}hekel
┃ ⊹₊˚🌌𖦹 ${prefix}hestia
┃ ⊹₊˚🌌𖦹 ${prefix}inori
┃ ⊹₊˚🌌𖦹 ${prefix}isuzu
┃ ⊹₊˚🌌𖦹 ${prefix}itachi
┃ ⊹₊˚🌌𖦹 ${prefix}itori
┃ ⊹₊˚🌌𖦹 ${prefix}jeni
┃ ⊹₊˚🌌𖦹 ${prefix}kaga
┃ ⊹₊˚🌌𖦹 ${prefix}kagura
┃ ⊹₊˚🌌𖦹 ${prefix}kaori
┃ ⊹₊˚🌌𖦹 ${prefix}kotori
┃ ⊹₊˚🌌𖦹 ${prefix}kucing
┃ ⊹₊˚🌌𖦹 ${prefix}kurumi
┃ ⊹₊˚🌌𖦹 ${prefix}madara
┃ ⊹₊˚🌌𖦹 ${prefix}mikasa
┃ ⊹₊˚🌌𖦹 ${prefix}miku
┃ ⊹₊˚🌌𖦹 ${prefix}minato
┃ ⊹₊˚🌌𖦹 ${prefix}mobil
┃ ⊹₊˚🌌𖦹 ${prefix}montor
┃ ⊹₊˚🌌𖦹 ${prefix}naruto
┃ ⊹₊˚🌌𖦹 ${prefix}nezuko
┃ ⊹₊˚🌌𖦹 ${prefix}onepiece
┃ ⊹₊˚🌌𖦹 ${prefix}pokemon
┃ ⊹₊˚🌌𖦹 ${prefix}rize
┃ ⊹₊˚🌌𖦹 ${prefix}rose
┃ ⊹₊˚🌌𖦹 ${prefix}ryujin
┃ ⊹₊˚🌌𖦹 ${prefix}sagiri
┃ ⊹₊˚🌌𖦹 ${prefix}sakura
┃ ⊹₊˚🌌𖦹 ${prefix}sasuke
┃ ⊹₊˚🌌𖦹 ${prefix}shina
┃ ⊹₊˚🌌𖦹 ${prefix}shinka
┃ ⊹₊˚🌌𖦹 ${prefix}shizuka
┃ ⊹₊˚🌌𖦹 ${prefix}tanjiro
┃ ⊹₊˚🌌𖦹 ${prefix}toukachan
┃ ⊹₊˚🌌𖦹 ${prefix}tsunade
┃ ⊹₊˚🌌𖦹 ${prefix}waifu
┃ ⊹₊˚🌌𖦹 ${prefix}wallhp
┃ ⊹₊˚🌌𖦹 ${prefix}yuki
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛`;
};

exports.menuanime = menuanime;

const menu18 = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「💜」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「💜」 

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃ᰔִ໋✨˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃ᰔִ໋✨˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃ᰔִ໋✨˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃ᰔִ໋✨˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃ᰔִ໋✨˚ *᥎ᥱrsᥲ̃᥆:* v7.0.0-Open-Beta
┃ᰔִ໋✨˚ *һ᥆rᥲ:* ${horaSattz}
┃ᰔִ໋✨˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃ᰔִ໋✨˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃ᰔִ໋✨˚ *⍴іᥒg:* ${pingVelo}
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

꧁༺🏳️‍🌈 𝐘𝐀𝐎𝐈 🏳️‍🌈༻꧂

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┓
┃ ⊰✦⊱🔞𖦹 ${prefix}naruto
┃ ⊰✦⊱🔞𖦹 ${prefix}sasuke
┃ ⊰✦⊱🔞𖦹 ${prefix}kakashi
┃ ⊰✦⊱🔞𖦹 ${prefix}jiraya
┃ ⊰✦⊱🔞𖦹 ${prefix}luffy
┃ ⊰✦⊱🔞𖦹 ${prefix}gojo
┃ ⊰✦⊱🔞𖦹 ${prefix}goku
┃ ⊰✦⊱🔞𖦹 ${prefix}vegeta
┃ ⊰✦⊱🔞𖦹 ${prefix}saitama
┃ ⊰✦⊱🔞𖦹 ${prefix}tanjiro
┃ ⊰✦⊱🔞𖦹 ${prefix}todoroki
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「🌙」 𝐇𝐄𝐍𝐓𝐀𝐈 「🌙」

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━━┓
┃ ⊰✦⊱🔞𖦹 ${prefix}trap
┃ ⊰✦⊱🔞𖦹 ${prefix}ass
┃ ⊰✦⊱🔞𖦹 ${prefix}blowjob
┃ ⊰✦⊱🔞𖦹 ${prefix}cuckold
┃ ⊰✦⊱🔞𖦹 ${prefix}gangbang
┃ ⊰✦⊱🔞𖦹 ${prefix}ganbganb
┃ ⊰✦⊱🔞𖦹 ${prefix}nekos
┃ ⊰✦⊱🔞𖦹 ${prefix}masturbation
┃ ⊰✦⊱🔞𖦹 ${prefix}pussy
┃ ⊰✦⊱🔞𖦹 ${prefix}boobs
┃ ⊰✦⊱🔞𖦹 ${prefix}yuri
┃ ⊰✦⊱🔞𖦹 ${prefix}zettai
┃ ⊰✦⊱🔞𖦹 ${prefix}kasedaiki
┃ ⊰✦⊱🔞𖦹 ${prefix}hentaip
┃ ⊰✦⊱🔞𖦹 ${prefix}rule34 "tema"
┗֘┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┛

「⛓️」 𝐏𝐎𝐑𝐍𝐎 「⛓️」

┏━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━━┓
┃ ⊰✦⊱🔞𖦹 ${prefix}amador  
┃ ⊰✦⊱🔞𖦹 ${prefix}porno  
┃ ⊰✦⊱🔞𖦹 ${prefix}egirlvideo
┃ ⊰✦⊱🔞𖦹 ${prefix}aline  
┃ ⊰✦⊱🔞𖦹 ${prefix}carne  
┃ ⊰✦⊱🔞𖦹 ${prefix}celestino  
┃ ⊰✦⊱🔞𖦹 ${prefix}rute  
┃ ⊰✦⊱🔞𖦹 ${prefix}polonesa  
┃ ⊰✦⊱🔞𖦹 ${prefix}nega  
┃ ⊰✦⊱🔞𖦹 ${prefix}nath  
┃ ⊰✦⊱🔞𖦹 ${prefix}meladinha  
┃ ⊰✦⊱🔞𖦹 ${prefix}princesa  
┃ ⊰✦⊱🔞𖦹 ${prefix}maru  
┃ ⊰✦⊱🔞𖦹 ${prefix}marina  
┃ ⊰✦⊱🔞𖦹 ${prefix}leticia  
┃ ⊰✦⊱🔞𖦹 ${prefix}lay  
┃ ⊰✦⊱🔞𖦹 ${prefix}isa  
┃ ⊰✦⊱🔞𖦹 ${prefix}isadora  
┃ ⊰✦⊱🔞𖦹 ${prefix}giovanna  
┃ ⊰✦⊱🔞𖦹 ${prefix}feh  
┃ ⊰✦⊱🔞𖦹 ${prefix}clowniac  
┃ ⊰✦⊱🔞𖦹 ${prefix}cami  
┃ ⊰✦⊱🔞𖦹 ${prefix}brenda  
┃ ⊰✦⊱🔞𖦹 ${prefix}belle  
┃ ⊰✦⊱🔞𖦹 ${prefix}victoria  
┃ ⊰✦⊱🔞𖦹 ${prefix}aninha  
┃ ⊰✦⊱🔞𖦹 ${prefix}amicham  
┃ ⊰✦⊱🔞𖦹 ${prefix}alycia  
┃ ⊰✦⊱🔞𖦹 ${prefix}alifox
┗֘━━━━━•°✧°•| ⊰🪷⊱ |•°✧°•━━┛`;
};

exports.menu18 = menu18;




let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(colors.blue(`Modificação detectada: '.${__filename}' - Arquivo Atualizado os Menu.`))
    delete require.cache[file]
    require(file)
})


