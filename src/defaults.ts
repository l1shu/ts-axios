import { AxiosRequestConfig } from './types';
import { transformRequest, transformResponse } from './helpers/data';
import { processHeaders } from './helpers/headers';

const defaults: AxiosRequestConfig = {
  // A timeout in milliseconds to abort a request. If set to 0 (default) a timeout is not created.
  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  // 默认的转换请求数据函数
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data);
      return transformRequest(data);
    }
  ],

  // 默认的转换响应数据函数
  transformResponse: [
    function(data: any): any {
      return transformResponse(data);
    }
  ],

  // 默认状态码规则
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300;
  }
}

const methodsNoData = ['delete', 'get', 'head', 'options'];

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
});

const methodsWithData = ['post', 'put', 'patch'];

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

export default defaults;