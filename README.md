使用 typescript-library-starter 初始化我们的项目

# 命令
## 开发:
```
node ./examples/server.js
```

## 文档:
```
npm run docs
```

## 打包
```
npm run build
```
tips: 根据npm规则 运行build时会先执行'npm run prebuild'

## 测试
```
npm run test
```

## 发布
```
npm run pub
```
tips: 根据npm规则 运行build时会先执行'npm run prepub'

当我们运行 npm run pub 的时候，会优先执行 prepub 脚本，在 prepub 中我们运行了 test:prod 和 build 2 个脚本。&& 符号表示前面一个命令执行成功后才会执行后面的任务。

npm run test:prod 实际上运行了 npm run lint && npm run test -- --no-cache。 先运行 lint 去校验我们的源码和测试文件是否遵循 tslint 规范，再运行 test 去跑测试。

npm run build 实际上运行了 tsc --module commonjs、rollup -c rollup.config.ts 和 typedoc --out docs --target es6 --theme minimal --mode file src。先运行 tsc 去编译我们的 TypeScript 文件，dist/lib 和 dist/types 下的文件就是该命令产生的，然后运行 rollup 去构建 axios.umd.js 及 axios.es.js，最后运行 typedoc 去构建项目的文档。

运行完 prepub 后就会再运行 pub 命令，实际上执行了 sh release.sh 命令

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