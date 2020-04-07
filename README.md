使用 typescript-library-starter 初始化我们的项目

# 命令
开发:
node ./examples/server.js

文档:
npm run docs

打包
npm run build

测试
npm run test

# 概念
## webpack-hot-middleware & webpack-dev-middleware
两者配套使用，可参考https://juejin.im/post/5cf8a80df265da1bb67a0894

## responseType 和 response
在 xhr.ts 中 
```
const responseData = responseType && responseType === 'text' ? request.responseText : request.response;
```
根据设置的responseType来获取响应体：
1. 普通的文本（text/plain），就是编码好的字串，这两个接口上（responseType 和 response）都可以直接读取。

2. json（application/json）,传输时候，其实是序列化后的json字串，传输时候是按照字串传输的。前端接收到的时候，其实可以直接在responseText上，手动JSON.parse。也可以手动指定responseType为json，直接在response上获取解析好的json对象。

3. document（text/html），如果指定好了responseType, responseText可以获取到html文本，response却可以获取到解析好的DOM对象

4. 对于其他数据，比如媒体类型（视频，音频），普通二进制流，如果你去responseText获取，那肯定就是乱码了，因为这种二进制肯定没法按照
DOMString解析。但是你却可以指定好responseType为blob，在response上获取到Blob对象，然后再通过对应的工具进行处理解析。