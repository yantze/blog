import { Provide, Func, Inject } from '@midwayjs/decorator'
@Provide()
export class RenderService {

  @Inject()
  ctx;

  @Func('render.handler', { middleware: [ 'rewrite', 'fmw:staticFile' ]})
  async handler() {
    return 'Powered by Midway FaaS' + this.ctx.path;
  }
}
