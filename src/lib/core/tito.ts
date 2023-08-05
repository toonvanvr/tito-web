import { std, tito } from '../symbols.js'
import { TrueProxy, getTypedSymbolKeys } from './utils.js'

// Constraints
type _PluginState = Record<string, any>
type _PluginStateFactory<PluginState extends _PluginState> = () => PluginState
type _PluginMethod<State extends _PluginState = _PluginState> = (
  state: State,
) => any
type _PluginMethodMap<PluginState extends _PluginState = _PluginState> = Record<
  string,
  _PluginMethod<PluginState>
>
type _PluginFactoryMap = Record<symbol, PluginFactory>
type _PluginMap = Record<symbol, Plugin>

// Types
type PluginFactory<
  PluginState extends _PluginState = _PluginState,
  PluginMethodMap extends _PluginMethodMap<PluginState> = _PluginMethodMap<PluginState>,
> = {
  initializeState: _PluginStateFactory<PluginState>
  methods: PluginMethodMap
}
type Plugin<
  PluginState extends _PluginState = _PluginState,
  PluginMethodMap extends _PluginMethodMap<PluginState> = _PluginMethodMap<PluginState>,
> = {
  state: PluginState
  methods: PluginMethodMap
}
type TitoTarget<PluginMap extends _PluginMap> = (() => void) & {
  [tito]: PluginMap
}
type Tito<PluginMap extends _PluginMap> = {
  [PluginId in keyof PluginMap]: PluginMap[PluginId]
}

// Type functions
type ToPluginMap<PluginFactoryMap extends _PluginFactoryMap> = {
  [PluginId in keyof PluginFactoryMap]: PluginFactoryMap[PluginId] extends PluginFactory<
    infer PluginState extends _PluginState,
    infer PluginMethodMap extends _PluginMethodMap<infer PluginState>
  >
    ? Plugin<PluginState, PluginMethodMap>
    : never
}

// Implementation
export function createTito<PluginFactoryMap extends _PluginFactoryMap>(
  pluginFactories: PluginFactoryMap,
) {
  type PluginMap = ToPluginMap<PluginFactoryMap>

  const pluginMap = {} as PluginMap
  for (const pluginId of getTypedSymbolKeys(pluginFactories)) {
    const pluginFactory = pluginFactories[pluginId]
    Object.assign(pluginMap, {
      [pluginId]: {
        state: pluginFactory.initializeState(),
        methods: pluginFactory.methods,
      },
    })
  }
  const target: TitoTarget<PluginMap> = Object.assign(() => {}, {
    [tito]: pluginMap,
  })

  return new TrueProxy<Tito<PluginMap>, TitoTarget<PluginMap>>(target, {
    get(_, prop) {
      if (prop in pluginMap) {
        return pluginMap[prop as keyof PluginMap].methods
      } else if (std in pluginMap) {
        if (prop in pluginMap[std].methods) {
          return pluginMap[std].methods[prop as any].bind(pluginMap[std].state) // :(
        } else {
          throw new Error(`Unknown method: ${prop.toString()} in std plugin`)
        }
      } else {
        throw new Error(`Unknown plugin: ${prop.toString()}`)
      }
    },
  })
}
