import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';
import { isUrlSameOrigin } from '../helpers/url';
import cookie from '../helpers/cookie';
import { isFormData } from '../helpers/util';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const {
			data = null,
			url,
			method = 'get',
			headers,
			responseType,
			timeout,
			cancelToken,
			withCredentials,
			xsrfCookieName,
			xsrfHeaderName,
			onDownloadProgress,
			onUploadProgress,
			auth,
			validateStatus
		} = config;

		const request = new XMLHttpRequest();

		request.open(method.toUpperCase(), url!, true);

		configureRequest();

		addEvents();

		processHeaders();

		processCancel();

		request.send(data);

		function configureRequest(): void {
			// 如果服务端返回的数据和responseType不兼容，那么request.response变成null
			// 比如responseType是json，但是服务端返回的不是json字符串
			// 那么xhr就会解析错误，request.response的值是null
			if (responseType) {
				request.responseType = responseType;
			}

			// 设置超时时间
			if (timeout) {
				request.timeout = timeout;
			}

			// 跨域
			if (withCredentials) {
				request.withCredentials = true;
			}
		}

		function addEvents(): void {
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

			// 下载进度
			if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

			// 上传进度
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
		}

		function processHeaders(): void {
			// 让浏览器自动根据请求数据设置 Content-Type
			// 当通过 FormData 上传文件的时候，浏览器设置为 multipart/form-data
			if (isFormData(data)) {
        delete headers['Content-Type']
			}
			
			// csrf
			if ((withCredentials || isUrlSameOrigin(url!)) && xsrfCookieName) {
				const xsrfValue = cookie.read(xsrfCookieName);
				if (xsrfValue) {
					headers[xsrfHeaderName!] = xsrfValue;
				}
			}

			// HTTP授权
			if (auth) {
				headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password);
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
		}

		function processCancel(): void {
			// 取消
			if (cancelToken) {
				cancelToken.promise.then(reason => {
					request.abort();
					reject(reason);
				});
			}
		}

		// 处理非200响应状态码
		function handleResponse(response: AxiosResponse) {
			if (!validateStatus || validateStatus(response.status)) {
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
	});
}