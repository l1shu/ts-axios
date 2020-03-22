import { isPlainObject } from './util';
import { head } from 'shelljs';

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

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }

  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':');
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    if (value) {
      value = value.trim();
    }
    parsed[key] = value;
  });

  return parsed;
}