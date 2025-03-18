import { handleValidation } from "./recallCrypto";

interface Payload {
    event_ts?: string,
    plain_token?: string,
    id?: string,
    content?:string,
    timestamp?:string,
    author?:{
        id: string,
        user_openid?: string,
        union_openid?: string
    }
}

async function ToRecallCrypto(payloadData: Payload): Promise<Response> {
    if (!payloadData.event_ts || !payloadData.plain_token) {
        console.error("缺少必要字段:", payloadData);
        return new Response(JSON.stringify({ error: "缺少必要字段 event_ts 或 plain_token" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    
    const validationData = {
        event_ts: payloadData.event_ts,
        plain_token: payloadData.plain_token
    };
    
    const botSecret = process.env.BOT_SECRET || "default_secret";
    return await handleValidation(validationData, botSecret);
}

async function ToReplayMessage(payloadData:Payload):Promise<Response>{
    return new Response("OK",{
        status:200,
        headers: { "Content-Type": "application/json" }
    });

    Promise.resolve().then()
}

export { ToRecallCrypto };

