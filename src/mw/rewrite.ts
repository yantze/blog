import { Provide, ScopeEnum, Scope } from '@midwayjs/decorator';
@Provide('rewrite')
@Scope(ScopeEnum.Singleton)
export class Rewrite {
  resolve() {
    return function (ctx, next) {
      const orig = ctx.path
      if (/\/$/.test(orig)) {
        ctx.originEvent.path = orig + 'index.html';
        return next().then(() => {
          ctx.originEvent.path = orig
        })
      }
      return next()
    };
  }
}