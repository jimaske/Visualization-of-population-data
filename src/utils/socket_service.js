export default class SocketService {
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }
    ws = null

    // 存储回调函数
    callBackMapping = {}
        //标识是否连接成功
    connected = false
        //重新连接的次数
    connectRetryCount = 0
    connect() {
        if (!window.WebSocket) {
            return console.log('浏览器不支持websocket');
        }
        this.ws = new WebSocket('ws://localhost:9998')
        this.ws.onopen = () => {
                console.log('连接服务器成功');
                this.connected = true;
                this.connectRetryCount = 0;
            }
            //1.当服务器连接成功
            //2.当连接成功后，服务器关闭
        this.ws.onclose = () => {
            console.log('连接服务器失败');
            this.connected = false;
            this.connectRetryCount++;
            setTimeout(() => {
                this.connect()
            }, 500 * this.connectRetryCount)
        }
        this.ws.onmessage = msg => {
            console.log('接收到从服务器发送过来的数据了');
            const recvData = JSON.parse(msg.data);
            const socketType = recvData.socketType;
            if (this.callBackMapping[socketType]) {
                const action = recvData.action
                if (action === "getData") {
                    const realData = JSON.parse(recvData.data)
                    this.callBackMapping[socketType].call(this, realData)
                } else if (action === 'fullScreen') {
                    this.callBackMapping[socketType].call(this, recvData)
                } else if (action === 'themeChange') {
                    this.callBackMapping[socketType].call(this, recvData)
                }
            }

        }
    }
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack;
    }
    unRegisterCallBack(socketType) {
        this.callBackMapping[socketType] = null
    }

    send(data) {
        if (this.connected) {
            this.ws.send(JSON.stringify(data))
        } else {
            setTimeout(() => {
                this.send(data) //这里data为啥不用JSON.stringify()
            }, 500);
        }

    }
}