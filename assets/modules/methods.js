window.checkChannelTwitch = async (channelName) => {
    if (!channelName || typeof channelName !== 'string') return false;

    const proxy = 'https://corsproxy.io/';
    const gql = 'https://gql.twitch.tv/gql';
    const clientId = 'kimne78kx3ncx6brgo4mv6wki5h1ko';

    const query = {
        query: `query($login: String!) { user(login: $login) { id } }`,
        variables: { login: channelName }
    };

    try {
        const response = await fetch(proxy + '?url=' + encodeURIComponent(gql), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': clientId
            },
            body: JSON.stringify(query)
        });
        const data = await response.json();
        return !!data?.data?.user;
    } catch (error) {
        console.warn('Ошибка проверки канала:', error.message);
        return false;
    }
};

function getBrightColor(nickname) {
        const hash = Array.from(nickname).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        
        const r = 128 + (hash * 37) % 128; // 128..255
        const g = 128 + (hash * 53) % 128;
        const b = 128 + (hash * 97) % 128;
        
        return `rgb(${r}, ${g}, ${b})`;
    }