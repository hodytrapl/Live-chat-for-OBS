export default {
  async fetch(request) {

    // CORS preflight (важно!)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    const url = "https://gql.twitch.tv/gql";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko"
        },
        body: await request.text()
      });

      return new Response(res.body, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};