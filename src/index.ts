import { AxiosRequestConfig, AxiosStatic } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/util';
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';
import CancelToken from './cancel/CancelToken';
import Cancel, { isCancel } from './cancel/Cancel';

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);

  // 把 context 中的原型方法和实例方法全部拷贝到 instance 上，这样就实现了一个混合对象
  // instance 本身是一个函数，又拥有了 Axios 类的所有原型和实例属性
  extend(instance, context);

  return instance as AxiosStatic;
}

const axios = createInstance(defaults);

/**
 * axios 默认是一个单例，一旦我们修改了 axios 的默认配置，会影响所有的请求。
 * axios.create 的静态接口允许我们创建一个新的 axios 实例，同时允许我们传入新的配置和默认配置合并，并做为新的默认配置。
 */
axios.create = function(config) {
  return createInstance(mergeConfig(defaults, config));
}

axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;
axios.all = function(promises) {
  return Promise.all(promises);
}
axios.spread = function(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  }
}

export * from './types';

export default axios;