import { isDate, isPlainObject } from './util';

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+') // 空格 转换成 +
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl (url: string, params?: any): string {
  if (!params) {
    return url;
  }

  // ['name=ls', 'age=22']
  const parts: string[] = [];

  Object.keys(params).forEach(key => {
    let val = params[key];
    if (val === null || typeof val === 'undefined') {
      return;
    }

    // 参数为数组时，foo: ['bar', 'baz'], url = /base/get?foo[]=bar&foo[]=baz
    let values: string[];
    if (Array.isArray(val)) {
      key += '[]';
      values = val;
    } else {
      values = [val];
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString();
      }
      if (isPlainObject(val)) {
        val = JSON.stringify(val);
      }
      parts.push(`${encode(key)}=${encode(val)}`);
    });
  });

  let serializedParams = parts.join('&');

  if (serializedParams) {
    let hashIndex = url.lastIndexOf('#');
    if (~hashIndex) {
      url = url.slice(0, hashIndex);
    }
    url += (url.lastIndexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}