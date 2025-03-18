import { ToRecallCrypto } from "./MessagePayloadHandle";

interface Payload {
    event_ts?: string,
    plain_token?: string,
    id?: string,
    content?:string,
    timestamp?:string,
    author?:{
        id: string,
        user_openid?: string,
        union_openid?: string
    }
}

type StatusType = 0 | 1 | 2 | 6 | 7 | 9 | 10 | 11 | 12 | 13

type HandleFunction = (payload:Payload) => Promise<Response>

type StatusHandleMap = {
    [key in StatusType]?: HandleFunction;
};

async function MessageHandle(status:StatusType, payload: Payload): Promise<Response | undefined> {
    const statusHandles: StatusHandleMap = {
        13: (payload) => ToRecallCrypto(payload)
    };
    
    const handler = statusHandles[status];
    return handler ? await handler(payload) : undefined;
}

export { MessageHandle };