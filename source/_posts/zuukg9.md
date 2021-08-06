---
title: asar 解析
urlname: zuukg9
date: '2021-01-23 12:52:39 +0800'
tags: []
categories: []
---

这是一个在 Electron 中常用于把多个文件打包到一个 asar 文件的文件归档格式。缩写简单可以理解为 A Simple Archive，类似于 tar 或者 zip 这种格式。asar 文件简单的包含三个部分，第一部分占 8 bytes 描述文件头的长度，第二部分是一个 json 文件格式，描述包含了哪些文件，第三部分是文件二进制的排列。

下面是一个 asar 文件头的 json 文件信息，通过这种格式信息，能完整的分析出有哪些文件和文件的目录结构:

```json
{
  "header": {
    "files": {
      "child-dir": {
        "files": {
          "index.js": {
            "size": 27,
            "offset": "0"
          }
        }
      },
      "README.md": {
        "size": 13,
        "offset": "27"
      }
    }
  },
  "headerSize": 120
}
```

下面来分析一个如何从 asar 中读取一个文件。

## 前置环境

做出一个类似这样的文件结构：

```
└── project
    ├── README.md
    └── child-dir
        └── index.js
```

然后执行，就会产生一个 project.asar 的包

```bash
npm install asar -g
asar pack project project.asar
```

## 文件头信息

可以通过一个 nodejs 脚本代码来获取文件信息：

```javascript
const fs = require("fs");

const sizeBuf = Buffer.alloc(8);
const fd = fs.openSync("./project.asar");

fs.readSync(fd, sizeBuf, 0, 8, null);
// fs.readSync(fd, buffer, offset, length, position)
// position 指定从那个地方开始读，如果是 null，就会从文件内置的 position 中读取，并且更新 更新 position

// sizeBuff 保存了文件头的大小，需要通过 chromium-pickle-js 读取前 32 位无符号整型
const pickle = require("chromium-pickle-js");

const sizePickle = pickle.createFromBuffer(sizeBuf);
const headerSize = sizePickle.createIterator().readUInt32();
// headerSize: 120

const headerBuf = Buffer.alloc(headerSize);
// headerBuf.length: 120

fs.readSync(fd, headerBuf, 0, headerSize, null);
const headerPickle = pickle.createFromBuffer(headerBuf);
const header = headerPickle.createIterator().readString();
fs.closeSync(fd);

const headInfo = {
  header: JSON.parse(header),
  headerSize,
};
console.log(JSON.stringify(headInfo, null, 2));
```

最后就会生成跟上面一样的文件结构：

```json
{
  "header": {
    "files": {
      "child-dir": {
        "files": {
          "index.js": {
            "size": 27,
            "offset": "0"
          }
        }
      },
      "README.md": {
        "size": 13,
        "offset": "27"
      }
    }
  },
  "headerSize": 120
}
```

## 文件读取

下面来试试读取其中的 `index.js` 文件，先指定一个路径 `child-dir/index.js`。定位到文件大小 27bytes，偏移量为 0。

```javascript
const fileInfo = {
  size: 27,
  offset: 0,
};

const buffer = Buffer.alloc(fileInfo.size);
const fd2 = fs.openSync("./project.asar", "r");
const offset = 8 + headInfo.headerSize + parseInt(fileInfo.offset); // offset: 120
fs.readSync(fd2, buffer, 0, fileInfo.size, offset);
fs.closeSync(fd2);

console.log("file content:", buffer.toString("utf8"));
// file content: console.log('hello world')
```

看来可以读取到文件内容了。

## 结束

其实可以直接通过编辑器打开 project.asar 文件，里面基本就是没有压缩的文件，是一个很简单的单文件档案。

## 参考

文件中的代码都是改编自 asar 原来的代码，有兴趣也可以看看：

- [https://github.com/electron/asar](https://github.com/electron/asar)
