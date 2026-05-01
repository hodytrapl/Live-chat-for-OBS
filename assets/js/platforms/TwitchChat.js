const channel=window.sharedChannel
// анонимный ник и пароль для подключения к Twitch IRC
const nick = "justinfan" + Math.floor(Math.random() * 100000);
const pass = "SCHMOOPIIE";

const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");// подключаемся к Twitch IRC через WebSocket

ws.onopen = () => { // при открытии соединения отправляем команды для авторизации и подключения к каналу
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
  if (msg) {
    let parserTwitch = new ParserTwitch(msg)
    parserTwitch.showData()
    let htmlMessage=parserTwitch.conversionDataToHtmlString();
    if(htmlMessage!=null){
      const container = document.getElementById("chat-container");
      container.insertAdjacentHTML('beforeend', htmlMessage);
      container.scrollTop = container.scrollHeight;
    }
  }
};