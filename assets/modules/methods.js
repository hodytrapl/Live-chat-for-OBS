// проверка канала Cloudflare Worker
async function checkChannel(channelName){
    // проверяем, что канал указан
    if (!channelName) {
        showError("Не указан канал в URL (?channel=...)");
        return;
    }

    // проверяем, что канал существует
    try {
        const response = await fetch("https://livechatobs.kostik290820077.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `query($login: String!) { user(login: $login) { id } }`,
                variables: { login: channelName }
            })
        });

        const data = await response.json();
        console.log(data);

        const exists = (data?.data?.user)!= null;

        if (!exists) {
            return { success: false, error: false };
        }

        window.sharedChannel = channelName;
        return { success: true, channelName: channelName, error: false }

    } catch (error) {
        console.error("Ошибка запроса:", error);
        showError("Ошибка соединения с сервером");
        return { success: false, error: true }
    }
}

// функция ошибки
function showError(text) {
    document.getElementById("chat-container").innerHTML += `<p>${text}</p>`;
}

// функция для получения яркого цвета на основе ника
function getBrightColor(nickname) {
        const hash = Array.from(nickname).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        
        const r = 128 + (hash * 37) % 128; // 128..255
        const g = 128 + (hash * 53) % 128;
        const b = 128 + (hash * 97) % 128;
        
        return `rgb(${r}, ${g}, ${b})`;
    }