export async function onRequest(context) {
    const upgradeHeader = context.request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
        return context.next();
    }

    const [client, server] = new WebSocketPair();
    const backend = new WebSocket("wss://jzd.ddns.net:3000");

    function close() {
        server.close();
        backend.close();
    }

    function pipe(a, b) {
        a.addEventListener('message', ({ data }) => b.readyState === WebSocket.OPEN && b.send(data));
    }

    server.accept();
    server.onerror = server.onclose = backend.onerror = backend.onclose = close;

    pipe(server, backend);
    pipe(backend, server);

    return new Response(null, {
        status: 101,
        webSocket: client
    })
}