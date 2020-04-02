import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types/index';
import xhr from './xhr';
import { buildUrl } from '../helpers/url';
import { flattenHeaders } from '../helpers/headers';
import transform from './transform';

export default function dispatchRequest (config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config);
  processConfig(config);
  return xhr(config).then(res => {
    return transformResponseData(res);
  });
}

// 处理config
function processConfig (config: AxiosRequestConfig): void {
  config.url = transformUrl(config);
  config.data = transform(config.data, config.headers, config.transformRequest);
  config.headers = flattenHeaders(config.headers, config.method!);
}

// 处理 url 参数
function transformUrl (config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildUrl(url!, params);
}

// 处理响应data
function transformResponseData (res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}

// 请求携带的 cancelToken 如果被使用过，则抛出异常
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}