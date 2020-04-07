import { isPlainObject, deepMerge } from './util';
import { Method } from '../types';

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return;
  }

  Object.keys(headers).forEach(key => {
    if (key !== normalizedName && key.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[key];
      delete headers[key];
    }
  });
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type');

  // 当我们传入的 data 为普通对象的时候，headers 如果没有配置 Content-Type 属性，需要自动设置请求 header 的 Content-Type 字段
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }
  }

  return headers;
}

/**
 * 将响应的字符串headers解析成对象
 * @param headers 响应头的headers
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }

  headers.split('\r\n').forEach(line => {
    // 需要考虑value也包含：的场景，比如 Date: Tue, 21 May 2019 09:23:44 GMT
    let [key, ...vals] = line.split(':');
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    let value = vals.join(':').trim();
    parsed[key] = value;
  });

  return parsed;
}

/**
 * 将复杂对象 headers 中的 common、post、get 等属性压成一级
 * @param headers 
 * @param method 
 */
export function flattenHeaders(headers: any, method: Method) {
  if (!headers) {
    return;
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers);

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
  methodsToDelete.forEach(method => {
    if (headers[method]) {
      delete headers[method];
    }
  });

  return headers;
}