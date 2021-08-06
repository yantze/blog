---
title: 分析并实现一个简单 Electron 的 remote obj
urlname: vvgmty
date: '2021-01-23 14:54:02 +0800'
tags: []
categories: []
---

刚开始接触 Electron 的时候，很好奇有一个 remote 模块，能很方便地实现跨进程的操作，比如数据共享和方法调用。最近抽空研究了一下，所以成文。
实现的一个示例 demo: [https://github.com/yantze/demo-electron-remote](https://github.com/yantze/demo-electron-remote) 。

默认的 ipc 协议是可以传送可以结构化的数据。remote 需要完成的事情是，对不能结构化的数据，用元信息(meta) 记录，然后 remote 需要被调用的时候，发起 ipc 请求到主进程或者 server 进程，远程调用方法。这里是实现一个简单的 remote 调用机制的流程，方便了解 remote 的整个调用流程。

![image.png](https://cdn.nlark.com/yuque/0/2021/png/120091/1611385116701-f1ab46f1-7d44-4e70-a1d7-a2ecca8123a5.png#align=left&display=inline&height=216&margin=%5Bobject%20Object%5D&name=image.png&originHeight=432&originWidth=1018&size=37371&status=done&style=none&width=509)

## 分析流程

下面分析从一个简单的结构开始，逐渐到复杂结构体，来实现跨进程的传送。

### 可结构化的对象

```javascript
// server.js
const cp = require("child_process");
const clientProcess = cp.fork("./client.js");
const remoteObj = {
  normal: "dddd",
  num: 2,
};
clientProcess.on("message", (commandId) => {
  if (commandId === "GET_OBJ") {
    clientProcess.send(remoteObj);
  }
});

// client.js
process.send("GET_OBJ");
process.on("message", (obj) => {
  console.log("Receive obj:", obj);
});
```

这里实现一个相当简单的进程间传送数据的例子，当 server 进程 fork 一个 child 进程后，child 发送一个请求，然后 server 接受数据后，发送给 child 一个自身的对象，然后 child 就接受到了这个数据对象。

但一旦这个 remoteObj 对象中包含了一个方法，或者 Promise 这些不可结构化的数据，那么对应的数据就会丢失。

### 对象中包含方法时处理

其实实现的方式也还好，就是判断这里面是否有 function, 如果有，就使用元信息包裹一下这个 function，记录方法名。因为当 client 进程调用对应的方法的时候，需要向 server 进程发起请求，server 接到请求后，需要找到对应的 remoteObj, 并且定位到方法名，就可以 `remoteObj[functionName]()` 实现远程方法调用了。

既然需要记录方法名等额外数据，就需要 meta 去包裹方法，这里 server 需要需要一个新的方法 valueToMeta，而 client 需要一个解释 meta 的方法， metaToValue。

```javascript
// server.js
const valueToMeta = function (value) {
  // Determine the type of value.
  let type = typeof value;
  if (type === "object" || type === "function") {
    return {
      type,
      name: value.constructor ? value.constructor.name : "",
      id: objectsRegistry.add(value),
      members: parseMembers(value),
    };
  }
};

// client.js
async function metaToValue(meta) {
  if (meta.type === "function") {
    const remoteFunction = async function (...args) {
      const commandId = "ELECTRON_BROWSER_FUNCTION_CALL";
      const obj = await getRemoteValue(commandId, { id: meta.id });
      return await metaToValue(obj);
    };
    ret = remoteFunction;
  } else {
    ret = {};
  }
}
```

这里可以看到，判断为 function 后，valueToMeta 会把将 function 解析后变成 4 个数据字段返回，id 和 members 可以可以暂时不管，因为暂时不考虑 class 类。然后 client 进程就能通过 metaToValue 解析并且还原 remoteObj 的结构。

### 对象中包含子对象，并且还包含方法

这个时候，就要开始复杂的嵌套分析和解析了。其实也是在上一小节里面，再加上一个嵌套，就是如果分析到一个新的对象，那就把这个子对象存起来，当子对象的方法需要被调用的时候，就需要通过 id 找到子对象，并且通过方法名调用子对象的方法。

这时需要用到上面代码中出现的 parseMembers 方法了，这个方法能解析 object 中的所有自有对象，并且把子对象再次放进 valueToMeta 中，做递归循环。

```javascript
function parseMembers(value) {
  const members = Object.getOwnPropertyNames(value);
  return members
    .map((name) => {
      if (IGNORE_FUNCTION_MEMBERS.includes(name)) return false;

      const meta = valueToMeta(value[name]);
      if (meta.type === "function") {
        return {
          ...meta,
          name,
          type: "method",
        };
      }
      return {
        ...meta,
        name,
      };
    })
    .filter(Boolean);
}
```

不过这里会忽略一些属性，在 `IGNORE_FUNCTION_MEMBERS` 中有声明，比如 arguments 这个 function 的自有属性。之所以把 type 改为了 method ，是因为这个一个对象的方法，需要使用 id 去寻找方法的上层对象。

### 小节

其实通过上面的介绍，已经基本清楚整个 remote 的调用流程了，如果不明白可以直接访问我新建的一个 demo 仓库，里面可以完整地运行一个简单的 remote 调用。

### 如何使用仓库的内容

1. 在启动 server.js 后，可以在 Chrome 浏览器的地址栏打开 `chrome://inspect`
1. 在里面的 Remote Target 中选择 `./client.js`
1. 跳转到 Console 面板中，执行 `const obj = await require('./client.js').getRemoteObj()`
1. 返回了 server 进程的 remoteObj

试试，应该还挺好玩的 :P。

## 其它

1. Electron API 说明中有说实现机制类似 Java 的 [RMI](https://en.wikipedia.org/wiki/Java_remote_method_invocation)，然后试了一下，的确有些相似。
1. 在 server.js 代码中有一个 ipc 参数:

```javascript
clientProcess = cp.spawn("node", ["--inspect=9230", "./client.js"], {
  stdio: ["inherit", "inherit", "inherit", "ipc"],
});
```

2. 这里的 ipc 参数，能让 nodejs 在 spawn 子进程的时候，加上一个 ipc socket 隧道，默认是没有加的，那样将不能使用 process.send 方法。之所以 child_process.fork 方法可以使用 ipc，是因为 fork 其实是 spawn 的一个封装方法，里面有加上 ipc 这个参数。
3. 比如 Date 或者 Promise 等非结构化数据，暂时没有实现，这个库只是作一个简单的示例说明。
4. electron 也有类似的代码，里面有完整地实现，可以参看 `./electron/lib/browser/remote/server.ts` 和 `./electron/lib/renderer/api/remote.js`

## 参考

- Java 的 [RMI](https://en.wikipedia.org/wiki/Java_remote_method_invocation)
- [https://github.com/electron/electron](https://github.com/electron/electron)
- [https://nodejs.org/docs/latest/api/child_process.html](https://nodejs.org/docs/latest/api/child_process.html)
