const tito = Symbol('tito')

type TitoFactory = {
  [Tag in keyof HTMLElementTagNameMap]: Tito<HTMLElementTagNameMap[Tag]>
} & {
  [Tag in keyof HTMLElementDeprecatedTagNameMap]: Tito<
    HTMLElementDeprecatedTagNameMap[Tag]
  >
} & {
  [Tag: string]: Tito<HTMLElement>
}

type Tito<HE extends HTMLElement> = {}

type TitoFactoryConfiguration = {}

class Engine<HE extends HTMLElement> {
  private readonly he: HE & { [tito]: Engine<HE> }

  static from<HE extends HTMLElement>(he: HE & { [tito]?: Engine<HE> }) {
    return he[tito] ?? new Engine(he)
  }

  constructor(he: HE & { [tito]?: Engine<HE> }) {
    this.he = Object.assign(he, { [tito]: this })
  }
}

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
