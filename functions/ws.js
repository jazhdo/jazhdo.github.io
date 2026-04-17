export async function onRequest(context) {
    const upgradeHeader =  context.request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
        return context.next();
    }

    const target = "ws://jzd.ddns.net:3000";

    const request = new Request(target, {
        headers: context.request.headers,
        method: context.request.method
    })

    let response;
    try {
        response = await fetch(request);
    } catch (err) {
        return new Response(`Failed to connect to backend: ${err.message}`, {
            status: 502
        });
    }

    if (response.status !== 101) {
        return new Response(
            `Backend did not upgrade: got HTTP ${response.status}`,
            { status: 502 }
        )
    }

    return response;
}