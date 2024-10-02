// 引入依赖
const express = require('express')
const cron = require('node-cron')
const mcstatus = require('mcstatus-util')
const fs = require("fs")
const Server = require('./server.js')

// 创建express实例
const app = express()

// 服务器配置信息
let serverList = []

// 读取配置文件
const configFile = fs.readFileSync("config.json", 'utf8')
const config = JSON.parse(configFile)
const hostname = config.api.hostname
const port = config.api.port
const platform = config.platform
const cache = config.cache
const cronExpression = config.cron
config.servers.forEach(server => {
    serverList.push(new Server(server.id, server.ip, server.port))
})

// 读取到的数据
let data = {}

if (cache) {
    const cacheFile = fs.readFileSync(".cache.json", 'utf8')
    data = JSON.parse(cacheFile)
}

// 每分钟执行一次定时任务
cron.schedule(cronExpression, updateData)

// 请求接口
app.get(`/${platform}/api/v1/get`, (req, res) => {
    let newData = {}
    const dataKeys = Object.keys(data)
    const dataValues = Object.values(data)
    if (req.query.count > 0) {
        const length = Object.keys(data).length
        for (let i = length - 1; i >= (length - req.query.count < 0 ? 0 : length - req.query.count); i--) {
            newData[dataKeys[i]] = dataValues[i]
        }
    } else {
        newData = data
    }
    res.send(newData)
})

// 启动!
app.listen(port, hostname, () => {
    console.log(`Server is running on port ${port}`)
})

process.on('SIGTERM', onShutDown);
process.on('SIGINT', onShutDown);

function onShutDown() {
    console.log('Shutting down server...');
    if (cache) {
        fs.writeFileSync(".cache.json", JSON.stringify(data), 'utf8')
    }
    process.exit(0);
}

async function updateData() {
    serverList.forEach(server => {
        console.log(`Request server: ${server.ip}:${server.port}`)
        const map = {}
        mcstatus.status(server.ip, server.port).then(status => {
            const serverData = {}
            serverData['online'] = status.players.online
            serverData['max'] = status.players.max
            serverData['motd'] = status.motd.clean
            serverData['ping'] = status.roundTripLatency
            map[server.id] = serverData
        }).catch(() => {})
        const date = new Date()
        data[date.toLocaleString()] = map
    })
}