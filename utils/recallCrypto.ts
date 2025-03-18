import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha512';
import { concatBytes } from '@noble/hashes/utils';

// 设置库需要的 SHA-512 函数
ed.etc.sha512Sync = (...m) => sha512(concatBytes(...m));

interface ValidationRequest {
    event_ts: string;
    plain_token: string;
}
interface ValidationResponse {
    plain_token: string;
    signature: string;
}
//req:Request
async function handleValidation(validationPayload:ValidationRequest, botSecret:string | undefined): Promise<Response> {
    try { 
        // 确保botSecret不为undefined
        if (!botSecret) {
            console.error("缺少BOT_SECRET环境变量");
            return new Response(JSON.stringify({ error: "服务器配置错误" }), { 
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        } 
        
        // 设定种子为机器人密码
        let seed = botSecret;        
        // 将种子转换为私钥
        // @noble/ed25519要求私钥是32字节的Uint8Array
        const privateKeyBytes = new TextEncoder().encode(seed);
        console.log("私钥字节:", [...privateKeyBytes], "长度:", privateKeyBytes.length);
        
        // 构建消息
        const msg = validationPayload.event_ts + validationPayload.plain_token;
        const msgBytes = new TextEncoder().encode(msg);
        
        // 使用@noble/ed25519库签名
        const signatureBytes = ed.sign(msgBytes, privateKeyBytes);
        
        // 将签名转换为十六进制字符串
        const signatureHex = Array.from(signatureBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        
        console.log("生成的签名:", signatureHex);
        
        // 构建响应
        const rsp: ValidationResponse = {
            plain_token: validationPayload.plain_token,
            signature: signatureHex
        };
        
        console.log("生成的响应:", rsp);
        
        return new Response(JSON.stringify(rsp), {
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

// 测试代码
/* const validationPayload = {
    event_ts: "1725442341",
    plain_token: "Arq0D5A61EgUu4OxUvOp"
}
const secret = "DG5g3B4j9X2KOErG"
const testResult = await handleValidation(validationPayload, secret)
const target = '87befc99c42c651b3aac0278e71ada338433ae26fcb24307bdc5ad38c1adc2d01bcfcadc0842edac85e85205028a1132afe09280305f13aa6909ffc2d652c706'
const testjson = await testResult.json()
console.log(testjson,testjson.signature===target) */

export { handleValidation }

