import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types/index';
import xhr from './xhr';
import { buildUrl } from './helpers/url';
import { transformRequest, transformResponse } from './helpers/data';
import { processHeaders } from './helpers/headers';

function axios (config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then(res => {
    return transformResponseData(res);
  });
}

// 处理config
function processConfig (config: AxiosRequestConfig): void {
  config.url = transformUrl(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
}

// 处理 url 参数
function transformUrl (config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildUrl(url, params);
}

// 处理 headers
function transformHeaders (config: AxiosRequestConfig): any {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

// 处理 body 数据
function transformRequestData (config: AxiosRequestConfig): any {
  return transformRequest(config.data);
}

// 处理响应data
function transformResponseData (res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data);
  return res;
}

export default axios;