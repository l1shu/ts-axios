import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config;

    const request = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType;
    }

    request.open(method.toUpperCase(), url, true);

    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return;
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData = responseType && responseType === 'text' ? request.responseText : request.response;
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response);
    };

    Object.keys(headers).forEach(key => {

      // 当我们传入的 data 为空的时候，请求 header 配置 Content-Type 是没有意义的，于是我们把它删除。
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[name];
      } else {
        request.setRequestHeader(key, headers[key]);
      }
    });

    request.send(data);
  });
}