const fs = require('fs')
const colors = require('colors')
const path = require('path')
const chalk = require('chalk')

const menu = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {
return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* v6.0.0-Open-Beta
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐌𝐄𝐔𝐒 𝐌𝐄𝐍𝐔𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
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
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐏𝐄𝐒𝐐𝐔𝐈𝐒𝐀𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Gemini "pesquisa"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Gpt "pesquisa"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Mizuki "pesquisa"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Ytstalk @usuario
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Tiktok_Stalker @usuario
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Roblox_Stalker @usuario
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}AnimeInfo "nome"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}PlayStore "nome"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Pinterest "titulo"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Pinvid "título"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Tiktok "Tema"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Letras "musica"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Dicionário "Palavra"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Noticias 
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Movie "filme"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Livro "nome"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Wikipedia "nome"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Anime "nome"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Clima "City"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Ping "velocidade"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Suporte "bot suporte"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Dono "meu dono"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Infobot "minhas info"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Criador "meu criador"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}Avisos "aviso da bot"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}InfoBv "tutorial BemVindo"
┃ ๋ ࣭ ⭑⚘️𖦹 ${prefix}InfoListaNegra "tutorial ListaNegra"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐀𝐋𝐄𝐀𝐓𝐎́𝐑𝐈𝐎𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}GptVideo "tema"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}GerarLink "midia"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Perfil "informações"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Calcular "1 + 1"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Signo "leao"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Afk "texto"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}WasTalk "5599xxx"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}FazerNick "nome"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Signo "virgem"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Listavip
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Metadinha "imagens"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}PlayStore "app"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Alugar
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}PrintSite "link"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Cep "cep"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Admins "chama todos"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Tabela
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Brasileirao 
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Bug "relatar o erro"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Dono
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Sugestao "sugestão"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}TagMe
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Apr
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}QrCode "Marcar Imagem"
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Digit
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Papof
┃ ๋ ࣭ ⭑🥥𖦹 ${prefix}Hd "Marcar Imagem"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.menu = menu;

// MENU DE ADMINISTRADORES 

const adms = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => { 
 
// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

	return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* v6.0.0-Open-Beta
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐁𝐀𝐍𝐈𝐌𝐄𝐍𝐓𝐎𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}ListaNegra "numero"
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}TirarDaLista "numero"
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}ListaNegraG "numero"
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}TirarDaListaG "numero"
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}Ban "(@)1/+Users"
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}Band "marcar"
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}ListBan "lista"
┃ ๋ ࣭ ⭑⛓️𖦹 ${prefix}Kick "remover"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐆𝐄𝐑𝐄𝐍𝐂𝐈𝐀𝐑 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}SoAdm "ignora"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Adv "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}VerAdv "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}RmAdv "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}RemoveAllAdv "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Promover "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Rebaixar "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Mute "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}DesMute "marcar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}ToTag "mencionar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Marcar "marca todos"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}HideTag "marcação"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Recrutar "número"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Grupo "f/a"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Atividades "grupo"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Status "infos"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}Limpar "texto"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}NomeGp "nome"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}DescGp "descrição"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}FotoGp "foto"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}LinkGp "url"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}GrupoInfo "infos"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}CriarTabela "escreva"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}TabelaGp "infos"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}SetHorario "00:00 06:00"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}DelHorario "deletar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}OnHorario "ativar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}OffHorario "desativar"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}ListHorarios
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}RgFigu "cmd"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}DelFigu "figu"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}ListFigus
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}LegendaEstrangeiro "msg"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}LegendaBv "digite-algo"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}LegendaBv2 "digite-algo"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}LegendaSaiu "digite-algo"
┃ ๋ ࣭ ⭑🛡️𖦹 ${prefix}LegendaSaiu2 "digite-algo"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐀𝐓𝐈𝐕𝐀𝐂̧𝐎̃𝐄𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiLink "1 / 0"    
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiLinkGp "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiMeta "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiCanal " / "
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiSpam "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiStatus "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiSticker "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiPalavra "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiCtt "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiVideo "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiImg "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiAudio "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}X9 "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AutoRepo "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}BemVindo "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}BemVindo2 "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}ModoIA "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AutoFigu "1 / 0"
┃ ๋ ࣭ ⭑🧿𖦹 ${prefix}AntiPalavrão "1 / 0"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.adms = adms;

// MENU DE DONO

const menudono = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {
	
// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode alterar ele tod0, menos as definições, só se quiser apagar a definição completa. 	

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* v6.0.0-Open-Beta
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}listagp "grupos"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}ativo "presente"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}ausente "fale-oq-faz"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}clonar "rouba ft"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}bcgp "tm-pv"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}transmissão "tm-gps"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}fotomenu "marcar-image"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}fotobot "foto do bot"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}descriçãogp "digite-algo"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}setprefix "prefixo-novo"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}setkey "info"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}setkeyinfo
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}serpremium "recurso"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}addpremium "marcar"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}delpremium "marcar"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}blockcmd "comandos"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}unblockcmd "comandos"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}rg_aluguel "30d / 24h"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}rm_aluguel
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}renovar_aluguel
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}lista_aluguel
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}rgcmd "semprefixo cmdreal"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}delcmd "sem prefixo"
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}noprefix
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}dono1
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}dono2
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}dono3
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}dono4
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}dono5
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}dono6
┃ ๋ ࣭ ⭑👑𖦹 ${prefix}configurar-bot 
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐀𝐓𝐈𝐕𝐀𝐂̧𝐎̃𝐄𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}antipalavrão "1 / 0"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}antiligar "1 / 0"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}addpalavra "palavrão"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}delpalavra "palavrão"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}antipv "1 / 0"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}antipv2 "1 / 0"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}antipv3 "1 / 0"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}bangp
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}unbangp
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}manutencao "1 / 0"
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}console
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Aluguel 
┃ ๋ ࣭ ⭑🔮𖦹 ${prefix}Aluguel_global "1 / 0"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.menudono = menudono;

// MENU DE ALTERAR ÁUDIOS E VÍDEOS

const alteradores = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* v6.0.0-Open-Beta
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐀𝐔𝐃𝐈𝐎𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}videolento "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}videorapido "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}videocontrario "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}audiolento "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}audiorapido "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}grave "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}grave2 "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}esquilo "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}estourar "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}bass "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}bass2 "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}vozmenino "marcar"
┃ ๋ ࣭ ⭑📼𖦹 ${prefix}audioreverse "marcar"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐕𝐈𝐃𝐄𝐎𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}cortarvideo "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videotodoc "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videocontrario "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videorapido "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videopretobranco "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videotext "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videobordas "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoframes "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoespelhado "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videobrilho "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoflip "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videorotate "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoreverseaudio "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoareia "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videodesfoque "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videolento "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videograve "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videovozmenino "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videobass "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoestourado "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoesquilo "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoreverb "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videotremolo "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videoeco "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videodistorcao "marcar"
┃ ๋ ࣭ ⭑🎬𖦹 ${prefix}videopixelizado "marcar"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.alteradores = alteradores;

const brincadeiras = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* v6.0.0-Open-Beta
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐁𝐑𝐈𝐍𝐂𝐀𝐃𝐄𝐈𝐑𝐀𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}gay "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}feio "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}corno "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}vesgo "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}bebado "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}gostoso "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}gostosa "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}beijo "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}comer "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}fuder "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}matar "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}tapa "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}chute "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}dogolpe "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}nazista "marca (@)"
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}chance (fale algo)
┃ ๋ ࣭ ⭑🎭𖦹 ${prefix}casal "dupla"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankgay "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankgado "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankcorno "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankgostoso "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankgostosa "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}ranknazista "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankotakus "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankpau "melhores"
┃ ๋ ࣭ ⭑💫𖦹 ${prefix}rankdev "melhores"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐖𝐄𝐁-𝐅𝐀𝐌𝐈𝐋𝐈𝐀 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}namorar
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}terminar
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}divórciar
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}cancelarpedido
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}minhadupla
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}dupla
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}criar_familia
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}deletar_familia
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}sair_familia
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}minha_familia
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}aceitar_adocao
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}adotar
┃ ๋ ࣭ ⭑👨‍👩‍👧𖦹 ${prefix}expulsar_filho
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.brincadeiras = brincadeiras;


const menubaixar = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => { 

return `┏*. : ｡✿ * ﾟ * .: ｡ ✿ * ﾟ  * . : ｡ ✿ *┓
┃ 🎀 • 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐒 •【🍸】
┗֘*. : ｡✿ * ﾟ * .: ｡ ✿ * ﾟ  * . : ｡ ✿ *໋┛
╎
┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}play "nome / url"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}ytmp3 "nome / url"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}play_video "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}play_video2 "nome" 
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}play_doc "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}multidl "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}tiktok "tema/url"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}tiktok_audio "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}tiktok_video "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}tiktok_img "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}tiktokdl "link"   
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}Face_Video "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}Face_Audio "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}instagram "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}insta_video "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}insta_foto "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}Kwai_Video "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}letras "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}deezer "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}spotify "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}twitter_video "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}youtube "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}pinterest "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}pinterest2 "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}pinterest3 "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}pinterest_video "link"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}pinvid "nome"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}shazam "marcar audio"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}Gerarlink "Marcar vídeo"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}Qrcode "link/txt"
┃ ๋ ࣭ ⭑✨️𖦹 ${prefix}mediafire "link"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛
`;
};

exports.menubaixar = menubaixar;

const menufig = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `┏*. : ｡✿ * ﾟ * .: ｡ ✿ * ﾟ  * . : ｡ ✿ *┓
┃ ⚘️ • 𝐅𝐈𝐆𝐔𝐑𝐈𝐍𝐇𝐀𝐒 •【🌈】
┗֘*. : ｡✿ * ﾟ * .: ｡ ✿ * ﾟ  * . : ｡ ✿ *໋┛
╎
┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}rename "sticker"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}take "sticker"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}rgtake "sticker"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}rntake "sticker"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}fsticker "marcar-foto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}sticker "marcar-foto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}toimg "sticker"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}togif "sticker"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}brat "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}qc "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}ttp "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp1 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp2 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp3 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp4 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp5 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp6 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp7 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp8 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp9 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp10 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp11 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp12 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp13 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp14 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}attp15 "texto"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figurinhas "1/10"
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_emoji
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_flork
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_coreana
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_bebe
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_animais
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_desenho
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_raiva
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_engracadas
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_roblox
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_anime
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_ale
┃ ๋ ࣭ ⭑🪄𖦹 ${prefix}figu_memes
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛
`;
};

exports.menufig = menufig;


const menucoins = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `┏*. : ｡✿ * ﾟ * .: ｡ ✿ * ﾟ  * . : ｡ ✿ *┓
┃ 🩵 • 𝐂𝐎𝐈𝐍𝐒 •【💰】
┗֘*. : ｡✿ * ﾟ * .: ｡ ✿ * ﾟ  * . : ｡ ✿ *໋┛
╎
┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Sorteiocoins 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Sortcoins 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Whatmusic 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Gartic 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Quizfutebol 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Quizanimais 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Anagrama 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Enigma 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Minerar 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Minerarcoins 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Coins
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Estatisticas 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Cassino 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Dadoapostado 
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Slot
┃ ๋ ࣭ ⭑💲𖦹 ${prefix}Rankcoins
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.menucoins = menucoins;

const menulogo = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `
╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* v6.0.0-Open-Beta
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐃𝐔𝐀𝐋 𝐋𝐎𝐆𝐎𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}deadpool
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}pornhub
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}avengers
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}marvel
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐋𝐎𝐆𝐎𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}amongus
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}glitch
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}galaxy
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}glossy
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}dragonfire
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}comics
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}pubgavatar
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}emojimix
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}royal
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}mascotemetal
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}firework
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}summerbeach
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}cloudsky
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}techstyle
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}watercolor
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}ligatures
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}graffitistyle
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}frozen
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}colorful
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}balloon
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}multicolor
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}metal
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}doubleexposure
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}mascoteneon
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}eraser
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}america
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}snow
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}sunset
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}halloween
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}blood
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}hallobat
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}cemiterio
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}ffavatar
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}vintage3d
┃ ๋ ࣭ ⭑🌻𖦹 ${prefix}hollywood
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.menulogo = menulogo;

const menuanime = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* v6.0.0-Open-Beta
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🪻」 𝐌𝐄𝐍𝐔 𝐀𝐍𝐈𝐌𝐄𝐒 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}akira
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}ana
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}ayuzawa
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}boruto
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}chitoge
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}cosplay
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}deidara
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}eba
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}emilia
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}erza
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}gremory
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}hekel
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}hestia
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}inori
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}isuzu
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}itachi
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}itori
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}jeni
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}kaga
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}kagura
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}kaori
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}kotori
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}kucing
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}kurumi
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}madara
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}mikasa
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}miku
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}minato
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}mobil
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}montor
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}naruto
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}nezuko
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}onepiece
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}pokemon
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}rize
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}rose
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}ryujin
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}sagiri
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}sakura
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}sasuke
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}shina
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}shinka
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}shizuka
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}tanjiro
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}toukachan
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}tsunade
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}waifu
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}wallhp
┃ ๋ ࣭ ⭑🌃𖦹 ${prefix}yuki
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.menuanime = menuanime;

const menu18 = (NomeDoBot, pushname, pingVelo, versionBaileys, uptimeBot, time2, prefix, dataSattz, NickDono, horaSattz, sender) => {

// NÃO APAGUE ESSE ${prefix}, não coloque nada ${dentro assim} ISSO SÃO DEFINIÇÕES QUE ESTÁ PUXANDO DO settings.json, da pasta dono, só pode altera a base de tudo, menos as definições, só se quiser apagar a definição completa. 

return `╎〔  𝐘𝐮𝐦𝐞𝐦𝐢𝐳𝐮𝐤𝐢 夢月  〕
   ૮ ˶ᵔ ᵕ ᵔ˶ ა • 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 
「🪻」 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐃𝐎𝐍𝐎 「🪻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ *Oiê ${pushname} ${time2} 𝜗𝜚*
┃˚˖𓍢ִ໋🦢˚ *ᑲ᥆𝗍:* ${NomeDoBot}
┃˚˖𓍢ִ໋🦢˚ *ᥙsᥱr:* @${sender.split("@")[0]}
┃˚˖𓍢ִ໋🦢˚ *ძ᥆ᥒ᥆:* ${NickDono}
┃˚˖𓍢ִ໋🦢˚ *⍴rᥱ𝖿і᥊᥆:* ${prefix}
┃˚˖𓍢ִ໋🦢˚ *᥎ᥱrsᥲ̃᥆:* ᥎6.0.0
┃˚˖𓍢ִ໋🦢˚ *һ᥆rᥲ:* ${horaSattz}
┃˚˖𓍢ִ໋🦢˚ *ᥙ⍴𝗍іmᥱ:* ${uptimeBot}
┃˚˖𓍢ִ໋🦢˚ *ᑲᥲіᥣᥱᥡs ᥎ᥱrsі᥆ᥒ:* ${versionBaileys}
┃˚˖𓍢ִ໋🦢˚ *⍴іᥒg:* ${pingVelo}
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🏳️‍🌈」 𝐘𝐀𝐎𝐈 「🏳️‍🌈」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}naruto
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}sasuke
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}kakashi
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}jiraya
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}luffy
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}gojo
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}goku
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}vegeta
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}saitama
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}tanjiro
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}todoroki
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「🌃」 𝐇𝐄𝐍𝐓𝐀𝐈 「🌃」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}trap
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}ass
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}blowjob
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}cuckold
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}gangbang
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}ganbganb
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}nekos
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}masturbation
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}pussy
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}boobs
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}yuri
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}zettai
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}kasedaiki
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}hentaip
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}rule34 "tema"
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛

「😻」 𝐏𝐎𝐑𝐍𝐎 「😻」 

┏═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┓
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}amador  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}porno  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}egirlvideo
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}aline  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}carne  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}celestino  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}rute  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}polonesa  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}nega  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}nath  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}meladinha  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}princesa  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}maru  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}marina  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}leticia  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}lay  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}isa  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}isadora  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}giovanna  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}feh  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}clowniac  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}cami  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}brenda  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}belle  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}victoria  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}aninha  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}amicham  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}alycia  
┃ ๋ ࣭ ⭑🔞𖦹 ${prefix}alifox
┗֘═•❀･ﾟ✦*･ﾟ| ⊰🌙⊱ |ﾟ･*✦ﾟ･❀•═┛`;
};

exports.menu18 = menu18;




let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(colors.blue(`Modificação detectada: '.${__filename}' - Arquivo Atualizado os Menu.`))
    delete require.cache[file]
    require(file)
})


