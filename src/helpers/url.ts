import { isDate, isPlainObject, isUrlSearchParams } from './util';

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

export function buildUrl (url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url;
  }

  let serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isUrlSearchParams(params)) {
    serializedParams = params;
  } else {
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

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    let hashIndex = url.lastIndexOf('#');
    if (~hashIndex) {
      url = url.slice(0, hashIndex);
    }
    url += (url.lastIndexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

// 判断请求的url和当前页面的url是否同域
export function isUrlSameOrigin(requestUrl: string): boolean {
  interface UrlOrigin {
    protocol: string;
    host: string;
  }

  function resolveUrl(url: string): UrlOrigin {
    const a = document.createElement('a'); // 利用a标签
    a.setAttribute('href', url);
    const { protocol, host } = a;
  
    return {
      protocol,
      host
    }
  }

  const currentOrigin = resolveUrl(window.location.href);
  const parsedOrigin = resolveUrl(requestUrl);

  return parsedOrigin.host === currentOrigin.host && parsedOrigin.protocol === currentOrigin.protocol;
  
}

// 判断url是否是绝对url
export function isAbsoluteUrl(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

// 拼接baseUrl和相对url
export function combineUrl(baseUrl: string, relativeUrl?: string): string {
  return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl;
}