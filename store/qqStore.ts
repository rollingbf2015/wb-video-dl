import { defineStore } from "pinia";
import { ref } from '@vue/reactivity'

//存储accessToken以及超时
export const useAccessStore = defineStore('accessToken', ()=>{
    const accessToken = ref('');
    const expireTime = ref('')
    function updateAccessToken( newToken:string, newTime:string ){
        accessToken.value = newToken;
        expireTime.value = newTime;
    }
    return { accessToken, expireTime, updateAccessToken }
})