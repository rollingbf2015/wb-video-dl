import axios from "axios";

async function getQQAccessToken(appId:string, clientSecret:string){
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

const test = await getQQAccessToken('102730570','5rdPCzmZM9wkYMAymaOD2rgVK9zpfVLB')
console.log(test)