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
const cronExpression = config.cron
config.servers.forEach(server => {
    serverList.push(new Server(server.id, server.ip, server.port))
})

// 读取到的数据
const data = {}

// 每分钟执行一次定时任务
cron.schedule(cronExpression, () => {
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
})

app.get('/', (req, res) => {
    res.send(data)
})

app.listen(port, hostname, () => {
    console.log(`Server is running on port ${port}`)
})