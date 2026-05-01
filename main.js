// получаем аргументы со ссылки
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const channelName = urlParams.get('channel');// чат стримера, который вы хотите мониторить
const theme = urlParams.get('theme'); //тема, для  модернизации чата твича
console.log("Channel:", channelName, "Theme:", theme);//дебаг сообщение

//глобальная переменная
(async () => {
    const exists = await window.checkChannelTwitch(channelName);
    console.log(exists); // true или false
    if(!exists){
      console.error("канал не был введён или не был найден");
      document.getElementById("chat-container").classList.add("systemerror");
      document.getElementById("chat-container").innerHTML += `<p>Ошибка, указан неверный канал в URL, например: ?channel=streamer_name</p>`;
      return false;
    }
})();

window.sharedChannel = channelName; 
// тема, если есть, то добавляем
if(theme){
  document.getElementById("chat-container").classList.add(theme);
}
