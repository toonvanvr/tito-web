export interface TrueProxyConstructor {
  revocable<Interface, Target extends object>(
    target: Target,
    handler: ProxyHandler<Target>,
  ): { proxy: Interface; revoke: () => void }

  new <Interface, Target extends object>(
    target: Target,
    handler: ProxyHandler<Target>,
  ): Interface
}

export const TrueProxy = Proxy as TrueProxyConstructor

export function getTypedSymbolKeys<O>(object: O) {
  return Object.getOwnPropertySymbols(object) as (symbol & keyof O)[]
}
