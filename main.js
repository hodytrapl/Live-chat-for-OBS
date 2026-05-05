// получаем аргументы со ссылки
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

//let channelName = "tpabomah" //тестовый стример

let channelName = urlParams.get('channel');// чат стримера, который вы хотите мониторить
const theme = urlParams.get('theme'); //тема, для  модернизации чата твича
console.log("Channel:", channelName, "Theme:", theme);//дебаг сообщение

// Главная асинхронная функция инициализации
async function init() {
    let finalChannel = channelName;

    if (!finalChannel) {
        try {
            const response = await fetch('settings.json');
            const settings = await response.json();
            finalChannel = settings.user_settings.channel;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    // ⚡ СРАЗУ стартуем чат
    startChat(finalChannel);

    // ⚠️ проверка НЕ блокирует
    checkChannel(finalChannel).then(res => {
        if (!res.success) {
            console.warn("Канал не найден, но чат уже работает");
        }
    });
}

init();

