class ParserTwitch{
    constructor(startedMsg){
        this.startedMsg=startedMsg;     //сообщение без парсинга
        this.badge_info=undefined;      //доп инфа для бейджика
        this.badges=undefined;          //значки пользователя
        this.client_nonce=undefined;    //уникальный айди клиента
        this.color=undefined;           //предпочитаемый цвет
        this.display_name=undefined;    //имя пользователя
        this.emotes=undefined;          //
        this.first_msg=0;               //первое ли сообщени епользователя
        this.flags=undefined;           //
        this.id=undefined;              //уникальный айди сообщения
        this.mod=0;                     // флаг модера
        this.returning_chatter=0;       //проверка довно ли пользователя небыло в чате
        this.room_id=undefined;         //айди комнаты чата стримера
        this.subscriber=0;              //флаг подписчика
        this.tmi_sent_ts=0;             //время отправки в милисекундах
        this.turbo=0;                   // турбо подписка
        this.user_id=0;                 // айди пользователя
        this.user_type=undefined;       // серверная отправка сообщения
        this.user_msg=undefined

        this.init()
    }

    init(){
        try{
            
            let parts = this.startedMsg.replace(/^@/, "").split(";");
            for(let part in parts){
                let [key,value]=parts[part].split("=")
                if (!key) continue;
                key = key.trim().replace(/-/g, "_");
                value = value == undefined ? "" : value;

                if(key in this){
                    if(typeof this[key]=="number"){
                        this[key]=isNaN(Number(value)) ? 0 : Number(value);
                    }else{
                        if(key=="badges"||key=="emotes"||key=="badge_info"){
                            this[key]=value.split(",")
                        }else{
                            this[key]=value
                        }
                        
                    }
                }
            }
            let usermsg=this.user_type.split(":")
            this.user_msg=usermsg[2]
        }
        catch(error){
            console.error(error)
        }
    }

    showData(){
        console.log("========{ new data }========\n")
        for(let key in this){
            console.log(key,"=",this[key])
        }
    }

    conversionDataToHtmlString(){
        const displayName =  this.display_name ? this.display_name.toLowerCase() : "anonymous";
        let color = this.color || getBrightColor(displayName);
        const message = this.user_msg || "";

        // --- ЗАМЕНА ССЫЛОК ---
        // Находим все URL (http:// или https://) и заменяем на "badLinkBlocked.exe"
        message.replace(/\bhttps?:\/\/\S+/g, 'badLinkBlocked.exe');


        if(this.badges && this.badges[0].startsWith("broadcaster/")){
            color="red"
        }else if(this.mod){
            color="lime"
        }

        let badgeUrl = "";
        if (this.badges && this.badges[0]) {
            const parts = this.badges[0].split('/');
            if (parts.length == 2) {
                const badgeName = parts[0];
                const badgeVersion = parts[1];
                badgeUrl = getTwitchBadgeURLTAG(badgeName,badgeVersion,getNameTheme(),getVersionTheme()) || "";
            }
        }

        if(message){
            //заменяем на безопасный вывод
            const safeDisplayName = escapeHtml(displayName);
            const safeMessage = escapeHtml(message);
            let TagP= `<p class="chat-user">${badgeUrl}<strong style="color:${color}">${safeDisplayName}</strong>: <span class="user-message">${safeMessage}</span></p>`;

            if(getNameTheme()=="minecraft" && getVersionTheme()==0){
                TagP= `<p class="chat-user">&lt;${badgeUrl}<strong style="color:${color}">${safeDisplayName}</strong>&gt;: <span class="user-message">${safeMessage}</span></p>`;
            }
            else if(getNameTheme()=="minecraft" && getVersionTheme()==1){
                TagP= `<p class="chat-user">${badgeUrl}[<strong style="color:${color}">${safeDisplayName}</strong>]: <span class="user-message">${safeMessage}</span></p>`;
            }

            return TagP
        }
        return null
    }

    
}

const BADGE_DB = {
    // Основные значки
    staff:      "d97c37bd-a6f5-4c38-8f57-4e4bef88af34",
    partner:    "d12a2e27-16f6-41d0-ab77-b780518f00a3",
    premium:    "bbbe0db0-a598-423e-86d0-f9fb98ca1933",
    broadcaster:"5527c58c-fb7d-422d-b71b-f309dcb85cc1",
    moderator:  "3267646d-33f0-4b17-b3df-f923a41db1d0",
    vip:        "b817aba4-fad8-49e2-b88a-7cc744dfa6ec",
    founder:    "511b78a9-ab37-472f-9569-457753bbe7d3",
    "artist-badge": "4300a897-03dc-4e83-8c0e-c332fee7057f",
    "no_audio": "aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0",
    "no_video": "199a0dba-58f3-494e-a7fc-1fa0a1001fb8",
    "subscriber": "5d9f2208-5dd8-11e7-8513-2ff4adfae661", // значок по умолчанию для подписчика
};

// функция для безопасного вывода текста в HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}


// получаем ссылку на бейджик по его имени и версии
function getTwitchBadgeURLTAG(badgeName, badgeVersion, themeName, themeVersion) {
    // Если задана локальная тема
    if (themeName && themeVersion !== undefined && themeName !== "default" && themeVersion != 0) {
        const localUrl = `assets/media/${themeName}/${themeVersion}/${badgeName}.png`;
        
        // Получаем стандартный URL (запасной вариант)
        const id = BADGE_DB[badgeName];
        const fallbackUrl = id 
            ? `https://static-cdn.jtvnw.net/badges/v1/${id}/${badgeVersion}`
            : '';

        // Возвращаем img с onerror – если локальный файл не загрузится, подставится fallback
        return `<img src="${localUrl}" alt="${badgeName}/${badgeVersion}" onerror="this.onerror=null; this.src='${fallbackUrl}'">`;
    }

    // Стандартный путь (если тема не задана или равна default/0)
    const id = BADGE_DB[badgeName];
    if (!id) {
        console.warn(`Бейджик ${badgeName} не найден в базе данных`);
        return null;
    }
    const url = `https://static-cdn.jtvnw.net/badges/v1/${id}/${badgeVersion}`;
    return `<img src="${url}" alt="${badgeName}/${badgeVersion}">`;
}