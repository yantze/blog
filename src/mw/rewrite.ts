import { Provide, ScopeEnum, Scope } from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { IMidwayWebNext } from '@midwayjs/web';
@Provide('rewrite')
@Scope(ScopeEnum.Singleton)
export class Rewrite {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const orig = ctx.path
      if (/\/$/.test(orig)) {
        ctx.originEvent.path = orig + 'index.html';
        await next()
        ctx.originEvent.path = orig
        return;
      }
      return next()
    };
  }
}