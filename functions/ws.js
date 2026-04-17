export async function onRequest(context) {
    const upgradeHeader = context.request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return context.next();
    }

    const request = new Request("https://jzd.ddns.net:3000", {
        headers: {
            Upgrade: "websocket"
        }
    });

    let reps;
    try {
        reps = await fetch(request);
    } catch (err) {
        return new Response(`Failed to connect to backend: ${err.message}`, {
            status: 502
        });
    }

    const ws = reps.webSocket;
    if (!ws) {
        return new Response("Backend did not accept WebSocket", { status: 502 });
    }

    ws.accept();

    return new Response(null, {
        status: 101,
        webSocket: ws
    })
}