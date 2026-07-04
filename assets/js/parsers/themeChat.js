let currentTheme = "default/0";
let nameTheme = "default";
let versionTheme = 0;
function setTheme(theme) {
    currentTheme = theme;
    nameTheme = theme.split("/")[0];
    versionTheme = parseInt(theme.split("/")[1]);
}

function getTheme() {
    return currentTheme;
}

function getNameTheme() {
    return nameTheme;
}
function getVersionTheme() {
    return versionTheme;
}

function applyThemeToHead(themeData) {
    if (!themeData) {
        console.warn("No theme data provided");
        return;
    }
    const head = document.querySelector('head');
    const existingLink = head.querySelector('link[data-theme]');
    let themePath = "assets/css/themes/"+themeData.css_file;
    if (existingLink) {
        existingLink.href = themePath;
        // или
        existingLink.setAttribute('href', themePath);
    } else {
        // Если элемента нет — создаём новый
        const newLink = document.createElement('link');
        newLink.setAttribute('data-theme', 'true');
        newLink.rel = 'stylesheet';
        newLink.href = themePath;
        document.head.appendChild(newLink);
    }
    console.log("Theme applied:", themePath);
}
