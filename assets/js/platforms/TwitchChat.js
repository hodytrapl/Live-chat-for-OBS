function startChat(channel) {
  const nick = "justinfan" + Math.floor(Math.random() * 100000);
  const pass = "SCHMOOPIIE";

  const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

  //отдаем данные для авторизации и подписываемся на канал
  ws.onopen = () => {
      ws.send(`PASS ${pass}`);
      ws.send(`NICK ${nick}`);
      ws.send(`JOIN #${channel}`);

      ws.send('CAP REQ :twitch.tv/membership');
      ws.send('CAP REQ :twitch.tv/tags');
      ws.send('CAP REQ :twitch.tv/commands');
  };

  // приход сообщений в реалтайм
  ws.onmessage = (event) => {
    const msg = event.data;

    // пинг чтобы получить ответ
    if (msg.includes("PING")) {
      ws.send("PONG :tmi.twitch.tv");
      return;
    }

    
    
    // отправка сообщение и её парсинг
    if (!shouldIgnoreMessage(msg)) {
      let parserTwitch = new ParserTwitch(msg)
      parserTwitch.showData()
      let htmlMessage=parserTwitch.conversionDataToHtmlString();
      if(htmlMessage!=null){
        const container = document.getElementById("chat-container");
        container.insertAdjacentHTML('beforeend', htmlMessage);
        const MAX_MESSAGES = 25;
        
        // Удаляем лишние старые сообщения
        while (container.children.length > MAX_MESSAGES) {
            container.removeChild(container.firstChild);
        }

        // Прокручиваем вниз (уже есть)
        container.scrollTop = container.scrollHeight;
      }
    }
  };
}

// Функция для проверки, нужно ли игнорировать сообщение
function shouldIgnoreMessage(msg) {
  // Шаблоны для игнорируемых сообщений
  const ignorePatterns = [
    /^:tmi\.twitch\.tv CAP \* ACK :twitch\.tv\/(membership|tags|commands)/,
    /^:[^ ]+\.tmi\.twitch\.tv 353 /,          // NAMES list
    /^:[^ ]+\.tmi\.twitch\.tv 366 /,          // End of NAMES
    /^:[^!]+![^@]+@[^ ]+ JOIN /,              // JOIN сообщение
    /^:tmi\.twitch\.tv 001 /,                 // Welcome
    /^:tmi\.twitch\.tv 002 /,                 // Your host
    /^:tmi\.twitch\.tv 003 /,                 // This server
    /^:tmi\.twitch\.tv 004 /,                 // Server info
    /^:tmi\.twitch\.tv 375 /,                 // MOTD start
    /^:tmi\.twitch\.tv 372 /,                 // MOTD line
    /^:tmi\.twitch\.tv 376 /                  // End of MOTD
  ];

  // Если сообщение подходит под любой шаблон – игнорируем
  return ignorePatterns.some(pattern => pattern.test(msg));
}