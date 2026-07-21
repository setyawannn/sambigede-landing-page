import handler from '@tanstack/react-start/server-entry'

type WorkerRuntimeEnv = Record<string, string | undefined>

export default {
  async fetch(
    request: Request,
    env: WorkerRuntimeEnv,
    ctx: ExecutionContext,
  ) {
    globalThis.__CF_RUNTIME_ENV__ = env
    return handler.fetch(request, env, ctx)
  },
}
