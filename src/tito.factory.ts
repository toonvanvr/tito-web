import { Engine, Tito } from './tito'

export type TitoFactory = {
  [Tag in keyof HTMLElementTagNameMap]: Tito<HTMLElementTagNameMap[Tag]>
} & {
  [Tag in keyof HTMLElementDeprecatedTagNameMap]: Tito<
    HTMLElementDeprecatedTagNameMap[Tag]
  >
} & {
  [Tag: string]: Tito<HTMLElement>
}

export type TitoFactoryConfiguration = {}

export const html = new Proxy<TitoFactory>(
  {} satisfies TitoFactoryConfiguration as any as TitoFactory,
  {
    get(
      _: any,
      tag: Exclude<keyof TitoFactory, number | symbol> | string | symbol
    ) {
      // TODO: subset of symbols!
      if (typeof tag === 'symbol') {
        throw new Error('TODO: support symbols')
      } else {
        return new Proxy(
          Engine.from(document.createElement(tag)),
          {} // Tito<HE>
        )
      }
    },
  }
)
