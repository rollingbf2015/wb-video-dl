import axios from "axios";
import playwright from 'playwright'
const cookie = 'XSRF-TOKEN=h1cQI2O8igYsvvCHTczhSvak; SUB=_2AkMQ4dtUf8NxqwFRmfAVyGrjbIV2zAHEieKmvSqPJRMxHRl-yT9yqlI4tRB6O2H1u5OPrzW6nmFwiLjL3W-GxTrAmQPu; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFwIU_IsvPjl6vBYFh4-HAR; WBPSESS=fhlE7lUFBip5iXsQIeNCGH6oz2vG1Kz4pcJvBF8MZAZIqel3PEyrz18dVhwSg_EijAiZ_y59xs7EhseNZA-6vOJuXBm3ZvPgK69YKwoJlJj87G3rTrfr8NfQgbCUMQXqSyuBSGgQVbsRVLCcJGjVXlSAiKliayVNV4opZsqBjLQ=; PC_TOKEN=c6f56df802'
const baseUrl = 'https://weibo.com/7744864619/5143654482313306?wm=3333_2001&from=10F1293010&sourcetype=qq&s_trans=2644135652_5143654482313306&s_channel=6'
const testUrl = 'https://h5.sinaimg.cn/m/weibo-pro/js/chunk-19528590.00c753f4.js'
const targetSelector = '#wbpv_video_403_html5_api'
async function getWeiboContent(url:string , selector:string) {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    await page.route('**/*',async(route)=>{
        await route.continue({
            headers:{
                ...route.request().headers(),
                "Referer":"https://weibo.com/",
                "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            }
        })
    })
    await page.goto(url);

    await page.waitForSelector(selector);

    const element = await page.$(selector)
    const content = await element?.getAttribute('src')
    await browser.close();
    return content;
}
getWeiboContent(baseUrl,targetSelector)
    .then(content=>{
        console.log('获取到的内容:',content)
    })
    .catch(err=>{
        console.log('报错信息:',err)
    })




/* axios({
    url:baseUrl,
    headers:{
        "Referer":"https://weibo.com/",
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Cookie":cookie
    }
}).then(res=>{
    console.log(res.data)
}) */




