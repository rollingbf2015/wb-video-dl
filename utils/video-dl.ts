import axios from "axios";
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';

const streamPipeLine = promisify(pipeline);

async function downloadVideo(videoSrc:string , outputPath:string) {
    try{
        const response = await axios({
            method:'GET',
            url: videoSrc,
            responseType:'stream',
            headers:{
                "Referer":"https://weibo.com/",
                "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            }
        });
        
        const writeStream = fs.createWriteStream(outputPath);
        await streamPipeLine(response.data, writeStream);

        console.log('Video downloaded to:', outputPath);
        return outputPath
    }catch(err){
        console.log('Download fail:',err)
        return null;
    }
    
}
const videoUrl = 'https://f.video.weibocdn.com/o0/kZZ4PHxulx08mDrZRhKw01041200yoSx0E010.mp4?label=mp4_720p&template=720x1280.24.0&media_id=5143653769740292&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=4&ot=v&lp=000027TCbz&ps=mZ6WB&uid=zx9f7hR&ab=,15568-g4,8013-g0,3601-g36,3601-g38,3601-g32,3601-g38&Expires=1741936638&ssig=id7qeeDq05&KID=unistore,video';
const outputPath = '../temp/temp.mp4';
downloadVideo(videoUrl,outputPath)