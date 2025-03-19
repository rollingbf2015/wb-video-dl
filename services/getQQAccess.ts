import axios from "axios";
//临时性导入根目录.env，后续在index链式调用时可删除
    import * as dotenv from "dotenv";
    import { dirname, resolve } from "path";
    import { fileURLToPath } from "url";

    // 获取当前文件的目录
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // 加载环境变量 - 传入项目根目录的路径
    dotenv.config({ path: resolve(__dirname, '..', '.env') }); 

async function getQQAccessToken(){
    const appId = process.env.APP_ID || "default_appId"
    const clientSecret = process.env.BOT_SECRET || "default_secret"
    console.log("当前项目appId:", appId)
    const result = await axios({
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        url:'https://bots.qq.com/app/getAppAccessToken',
        data:{
            appId:appId,
            clientSecret:clientSecret
        }
    });
    if(result.data){
        return result.data;
    }
}

export { getQQAccessToken }