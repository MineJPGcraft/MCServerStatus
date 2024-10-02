const express = require('express');
const cron = require('node-cron');
const mcstatus = require('mcstatus-util');
const Server = require('./server.js');
const app = express()

const data = {}

let serverList = [
    new Server(1, '127.0.0.1', 25565),
]

// 每分钟执行一次定时任务
cron.schedule('* * * * *', () => {
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
});

app.get('/', (req, res) => {
    res.send(data)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});