# MCServerStatus

该项目可定时向服务器发送请求来获取人数等数据，提供HTTP REST API接口供开发者调用获取

## 部署项目
在安装好 `git` 和 `node` (即 NodeJS) 的基础上, 执行以下命令即可部署:

```bash
git clone https://github.com/MineJPGcraft/MCServerStatus.git
cd MCServerStatus
node app.js
```

## 文件配置

该项目的配置文件为 `config.json` , 可参考下面有注释配置文件的进行配置:

```jsonc
{
  "api": {
    // API接口开放的主机地址 (对公网开放可填0.0.0.0)
    "hostname": "localhost",
    // API接口开放的端口
    "port": 1145
  },
  // 多久请求一次服务器数据
  "cron": "* * * * *",
  // 可获取的服务器列表
  "servers": [
    {
      "id": 1, // id
      "ip": "localhost", // 服务器地址
      "port": 25565 // 服务器端口
    }
  ],
  "platform": "mcss", // 请求地址第一个文件夹
  "cache": true, // 是否保存定时请求的数据到本地
  "dataCount": 20 // 最大的定时请求数据量
}
```

## 开放接口

### 参数解释
- `${platform}`: 配置文件里配置的 `platform` 即请求地址第一个文件夹
- `${id}`: 配置文件里的服务器的 `id`
- `${type}`: 可使用 `online`, `max`, `motd` 和 `ping`

### GET /${platform}/api/v1/get

获取所有请求（时间）所对应的所有服务器的数据

#### 返回样例

```json
{
    "2024/10/19 15:37:00": {},
    "2024/10/19 15:38:00": {
        "1": {
            "online": 1,
            "max": 30,
            "motd": "椰子ddddd的服务器 | 二周目 | 1.18.2+欢迎各位玩家前来游玩!",
            "ping": 6
        }
    },
    "2024/10/19 15:39:00": {},
    "2024/10/19 15:40:00": {
        "1": {
            "online": 1,
            "max": 30,
            "motd": "椰子ddddd的服务器 | 二周目 | 1.18.2+欢迎各位玩家前来游玩!",
            "ping": 10
        }
    }
}
```

### GET /${platform}/api/v1/get/${id}

获取所有请求（时间）所对应的指定ID的服务器的数据

#### 返回样例

```json
{
    "2025/2/7 21:29:00": {
        "online": 4,
        "max": 20,
        "motd": "RSHI服务器",
        "ping": 53
    },
    "2024/10/19 15:40:00": {
        "online": 1,
        "max": 30,
        "motd": "椰子ddddd的服务器 | 二周目 | 1.18.2+欢迎各位玩家前来游玩!",
        "ping": 10
    }
}
```

### GET /${platform}/api/v1/get/${id}/${type}

获取所有请求（时间）所对应的指定ID的服务器的指定数据种类

#### 返回样例

```json
{
    "2025/2/7 21:40:00": 20,
    "2025/2/7 21:38:00": 20
}
```

### GET /${platform}/api/v1/get/${id}/${type}/img

获取**最新请求**所对应的指定ID的服务器的指定数据种类的图片

#### 可用参数

- `name`: 图片左边参数文字 (默认为日期)
- `color`: 图片右边颜色 (默认为 `0F76B0`, 传入时无需加 `#` 与 ` 号)

#### 返回样例

无 (图片)

