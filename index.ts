import { serve } from "bun";
import { handleValidation } from "./utils/recallCrypto";

const server = serve({
    port: 8080,
    async fetch(req) {
        // 打印请求信息
        console.log("请求方法:", req.method);
        console.log("请求URL:", req.url);
        
        const botSecret = process.env.BOT_SECRET || "default_secret";
        
        // 如果是POST请求，处理请求
        if (req.method === "POST") {
            try {
                // 克隆请求以避免"Body already used"错误
                const reqClone = req.clone();
                
                // 处理验证请求
                const validationResponse = await handleValidation(reqClone, botSecret);
                
                // 返回验证结果
                return validationResponse;
            } catch (e: unknown) {
                console.error("处理请求失败:", e);
                return new Response(JSON.stringify({
                    error: "处理请求失败",
                    message: e instanceof Error ? e.message : String(e)
                }), { 
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        // 对于非POST请求，返回一个简单响应
        return new Response(JSON.stringify({
            message: "请使用POST方法发送请求"
        }), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    },
});

console.log(`服务器启动在 http://localhost:${server.port}`);