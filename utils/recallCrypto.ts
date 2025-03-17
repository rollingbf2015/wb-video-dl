import { createHash, createPrivateKey, generateKeyPairSync, sign } from "crypto";
import { TextEncoder } from "util";

interface ValidationRequest {
    event_ts: string;
    plain_token: string;
}
interface ValidationResponse {
    plain_token: string;
    signature: string;
}

async function handleValidation(req:Request, botSecret:string | undefined): Promise<Response> {
    try {
        // 读取请求体为文本
        const httpBody = await req.text();
        console.log("收到的请求体:", httpBody);
        
        // 检查请求体是否为空
        if (!httpBody || httpBody.trim() === '') {
            console.error("请求体为空");
            return new Response(JSON.stringify({ error: "请求体为空" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 尝试解析JSON
        let payload: any;
        try {
            payload = JSON.parse(httpBody);
            console.log("解析后的payload:", payload);
        } catch (e) {
            console.error("JSON解析失败:", e);
            return new Response(JSON.stringify({ error: "无效的JSON格式" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 检查payload.d是否存在
        if (!payload.d) {
            console.error("缺少d字段:", payload);
            return new Response(JSON.stringify({ error: "请求缺少d字段" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 解析内部d字段
        let validationPayload: ValidationRequest;
        try {
            // 检查data是否已经是对象
            if (typeof payload.d === 'object') {
                validationPayload = payload.d as ValidationRequest;
            } else {
                validationPayload = JSON.parse(payload.d) as ValidationRequest;
            }
            console.log("解析后的validationPayload:", validationPayload);
        } catch (e) {
            console.error("d字段解析失败:", e);
            return new Response(JSON.stringify({ error: "无效的d字段格式" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 检查必要字段
        if (!validationPayload.event_ts || !validationPayload.plain_token) {
            console.error("缺少必要字段:", validationPayload);
            return new Response(JSON.stringify({ error: "缺少必要字段 event_ts 或 plain_token" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 确保botSecret不为undefined
        if (!botSecret) {
            console.error("缺少BOT_SECRET环境变量");
            return new Response(JSON.stringify({ error: "服务器配置错误" }), { 
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        let seed = botSecret;
        while (seed.length < 32) { // ed25519.SeedSize = 32
            seed = seed.repeat(2);
        }
        seed = seed.slice(0, 32);
        console.log("使用的种子:", seed, "长度:", seed.length);
        
        // 使用确定性种子生成密钥对
        // 注意：这里我们需要确保与Golang的实现完全一致
        const keyPair = generateKeyPairSync('ed25519', { 
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
            seed: Buffer.from(seed, 'utf-8') 
        });
        
        const msg = validationPayload.event_ts + validationPayload.plain_token;
        console.log("签名的消息:", msg);
        
        // 使用私钥对消息进行签名
        const signature = sign(null, Buffer.from(msg, 'utf-8'), keyPair.privateKey).toString('hex');
        console.log("生成的签名:", signature);
        
        const rsp: ValidationResponse = {
            plain_token: validationPayload.plain_token,
            signature: signature
        };
        const rspBody = {
            body:rsp
        }
        console.log("生成的响应:", rsp);
        
        return new Response(JSON.stringify(rspBody), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("handle validation failed:", error);
        return new Response(JSON.stringify({ 
            error: "验证处理失败", 
            message: error instanceof Error ? error.message : String(error)
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export { handleValidation }