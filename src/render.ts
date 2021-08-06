import { Provide, ServerlessTrigger, ServerlessTriggerType, Inject } from '@midwayjs/decorator'
import { Context } from '@midwayjs/faas';
@Provide()
export class RenderService {

  @Inject()
  ctx!: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/callback'
  })
  async callback() {
    return 'Powered by Midway FaaS' + this.ctx.path;
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/*',
    middleware: ['rewrite', 'fmw:staticFile'],
  })
  async handler() {
    return 'Powered by Midway FaaS' + this.ctx.path;
  }
}
