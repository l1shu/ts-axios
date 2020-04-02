import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken
    } = config;

    const request = new XMLHttpRequest();

    request.open(method.toUpperCase(), url!, true);
    
    // MDN说responseType要在open之后send之前设置，虽然试过放在open之前也是可以的。。
    if (responseType) {
      request.responseType = responseType;
    }

    // 设置超时时间
    if (timeout) {
      request.timeout = timeout;
    }

    // 设置响应成功的回调
    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 0) {
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
      handleResponse(response);
    };

    // 处理非200响应状态码
    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(createError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          request,
          response
        ));
      }
    }

    // 设置异常回调
    request.onerror = function () {
      reject(createError(
        'Network Error',
        config,
        null,
        request
      ));
    }

    // 超时回调
    request.ontimeout = function () {
      reject(createError(
        `Timeout of ${config.timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        request
      ));
    }

    // 设置请求头
    Object.keys(headers).forEach(key => {

      // 当我们传入的 data 为空的时候，请求 header 配置 Content-Type 是没有意义的，于是我们把它删除。
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[name];
      } else {
        request.setRequestHeader(key, headers[key]);
      }
    });

    // 取消
    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort();
        reject(reason);
      });
    }

    request.send(data);
  });
}