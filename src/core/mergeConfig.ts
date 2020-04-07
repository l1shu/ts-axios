import { AxiosRequestConfig } from '../types';
import { deepMerge, isPlainObject } from '../helpers/util';

const valueFromConfig2Keys = ['url', 'method', 'data', 'params']; // 只接受自定义的设置, 默认配置没有意义
const mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy']; // axios源码把params放到这个数组, 不合理
const defaultToConfig2Keys = [
  'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
  'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
  'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
  'maxContentLength', 'maxBodyLength', 'validateStatus', 'maxRedirects', 'httpAgent',
  'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
];

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  config2 = config2 || {};
  
  const config = Object.create(null);

  valueFromConfig2Keys.forEach(key => {
    if (typeof config2![key] !== 'undefined') {
      config[key] = config2![key];
    }
  });

  mergeDeepPropertiesKeys.forEach(key => {
    if (isPlainObject(config2![key])) {
      config[key] = deepMerge(config1[key], config2![key]);
    } else if (typeof config2![key] !== 'undefined') {
      config[key] = config2![key];
    } else if (isPlainObject(config1[key])) {
      config[key] = deepMerge(config1[key]);
    } else if (typeof config1[key] !== 'undefined') {
      config[key] = config1[key];
    }
  });

  defaultToConfig2Keys.forEach(key => {
    if (typeof config2![key] !== 'undefined') {
      config[key] = config2![key];
    } else if (typeof config1[key] !== 'undefined') {
      config[key] = config1[key];
    }
  });

  const axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys);

  let otherKeys = Object.keys(config2).filter(key => axiosKeys.indexOf(key) === -1);

  otherKeys.forEach(key => {
    if (typeof config2![key] !== 'undefined') {
      config[key] = config2![key];
    } else if (typeof config1[key] !== 'undefined') {
      config[key] = config1[key];
    }
  });

  return config;
}