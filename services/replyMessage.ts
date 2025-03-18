import axios from "axios";
import { storeToRefs } from "pinia";
import { getQQAccessToken } from "./getQQAccess";
import { useAccessStore } from "../store/qqStore";

interface Payload {    
    id: string,
    content:string,
    timestamp:string,
    author:{
        id: string,
        user_openid?: string,
        union_openid?: string
    }
}

const store = useAccessStore()
const { accessToken, expireTime} = storeToRefs(store)
const { updateAccessToken } = store

async function ReplyMessage(payload:Payload){
    const messageTimeStamp = new Date(payload.timestamp).getDate();
    console.log(messageTimeStamp)
}

//测试数据
const testPayload = {
    id: "ROBOT1.0_SsowHSsB-n.8b2BGhfbzY3280425q-noid36l23LsDWu8g4K3onKUeQVXqiEianhZlKA1uS-aRmylASDPZ6xeg!!",
    content: "测试",
    timestamp: "2025-03-18T14:10:34+08:00",
    author: {
        id: "B860DAC9F714249828395EE0369BDB96",
        user_openid: "B860DAC9F714249828395EE0369BDB96",
        union_openid: "B860DAC9F714249828395EE0369BDB96"
    },
}
ReplyMessage(testPayload);