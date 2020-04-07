const JasmineCore = require('jasmine-core')
// @ts-ignore
// 为了让 jasmine-ajax 插件运行成功，我们需要手动添加全局的 getJasmineRequireObj 方法
global.getJasmineRequireObj = function() {
  return JasmineCore
}
require('jasmine-ajax')