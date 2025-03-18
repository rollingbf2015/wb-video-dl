import { serve } from "bun";
import { MessageHandle } from "./utils/MessageStatusHandle";

const server = serve({
    port: 8080,
    async fetch(req) {
        // 打印请求信息
        console.log("请求方法:", req.method);
        console.log("请求URL:", req.url);   
        // 如果是POST请求，处理请求
        if (req.method === "POST") {            
            // 尝试解析JSON                
            let payload = await req.json();
            console.log("解析后的payload:", payload); 
            //获取内部d字段
            let payloadData = payload.d                      
            // 处理验证请求
            const validationResponse = await MessageHandle(payload.op, payloadData);
            
            // 返回验证结果，如果为undefined则返回404
            return validationResponse || new Response(JSON.stringify({
                error: "未找到处理程序",
                message: `没有处理操作类型 ${payload.op} 的处理程序`
            }), { 
                status: 404,
                headers: { "Content-Type": "application/json" }
            });            
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