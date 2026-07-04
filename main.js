// получаем аргументы со ссылки
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

//let channelName = "tpabomah" //тестовый стример

let channelName = urlParams.get('channel');// чат стримера, который вы хотите мониторить
let theme = urlParams.get('theme'); //тема, для  модернизации чата твича
console.log("Channel:", channelName, "Theme:", theme);//дебаг сообщение

// Главная асинхронная функция инициализации
async function init() {
    let finalChannel = channelName;
    let finalTheme = theme;

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

    if (!finalTheme) {
        try {
            const response = await fetch('settings.json');
            const settings = await response.json();
            finalTheme = settings.user_settings.theme;
            setTheme(finalTheme);
            if (getTheme() != null) {
                console.warn("Theme was not set correctly. Please check the theme name.");
            }

            // Загружаем dev_settings.json для получения пути CSS
            try {
                const devResponse = await fetch('dev_settings.json');
                const devSettings = await devResponse.json();
                const themeData = devSettings.themes[nameTheme].versions[versionTheme];
                applyThemeToHead(themeData);
            } catch (e) {
                console.error("Failed to load dev_settings.json", e);
            }
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

