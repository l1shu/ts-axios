import { CancelExecutor, CancelTokenSource, Canceler } from '../types';
import Cancel from './Cancel';

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  
  constructor (executor: CancelExecutor) {
    let resolvePromise: ResolvePromise;
    
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve;
    });

    // 执行外部传入构造函数的executor函数，并传入cancel函数
    // cancel函数内部会把Promise对象变为resolved状态
    // 外部调用这个cancel函数就能取消请求
    executor(message => {
      if (this.reason) {
        return;
      }
      this.reason = new Cancel(message);
      resolvePromise(this.reason);
    });
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason;
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler;
    
    const token = new CancelToken(c => {
      cancel = c;
    });

    return {
      token,
      cancel
    }
  }
}