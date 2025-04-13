# 个人博客

## 数据配置

数据源端：
* 配置语雀的环境变量
* 从语雀获取知识库的 token
* 设置 SECRET_ID 以及 SECRET_KEY 和下面的 accessKeyId 以及 accessKeySecret 相同
* 说明文档 https://github.com/x-cold/yuque-hexo

数据处理端：
* _config.yml
  * 增加网站域名信息

* _config.[theme].yml
  * 填充准确的信息

数据发布端：
* 配置阿里云 oss 账号，在 _config.yml 的 deploy 部分中配置 accessKeyId 以及 accessKeySecret
* 配置对应的 bucket 名称
* 说明文档 https://github.com/huzhanfei/hexo-deployer-ali-oss-extend

## 本地预览

### 配置运行环境
* 安装 node.js 运行环境
```shell
# 进入项目目录
cd blog
# 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
nvm install 20
# 安装依赖
npm i -g pnpm@latest
pnpm i
```

### 同步数据源
```shell
YUQUE_TOKEN=xx SECRET_ID=xx SECRET_KEY=xx npm run sync
```

### 本地服务开启
```shell
npm run server
```
会在命令中提示打开 http://localhost:4000

### 本地直接发布
配置阿里云 oss 账号
```shell
npm run deploy
```
