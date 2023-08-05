import { tito } from './symbols.js'
import { AnyFunction } from './types.js'

export type Plugin = Record<string | symbol, any>
export type PluginCollection = Record<symbol, Plugin>
// Note: Layer 2 might be the same type as layer 1 & 3

/**
 * This is the "target" of the 2nd layer of proxies
 *
 * In the tito-web (=frontend lib) case, this would be:
 * ```
 * const layer2 = html.div
 * ```
 */
export type Layer2Target = AnyFunction & {
  [tito]: PluginCollection
}

export function getPlugins(target: Layer2Target): PluginCollection {
  return target[tito]
}

export function getPlugin(plugins: PluginCollection, pluginId: symbol): Plugin {
  if (pluginId in plugins) {
    return plugins[pluginId]
  } else {
    throw new Error(`Plugin ${pluginId.toString()} is not present`)
  }
}

/**
 * Create a Layer 3 Proxy
 *
 * TODO: type me!!!
 */
export function enterPlugin(plugin: Plugin, parent: Layer2Target): any {
  return new Proxy(
    {},
    {
      get(target: any, key: string | symbol) {
        const parentPlugins = getPlugins(parent)
        if (key in parentPlugins) {
          const nextPlugin = parentPlugins[key as keyof typeof parentPlugins] // weird that this is required
          return enterPlugin(nextPlugin, parent)
        } else if (key in plugin) {
          return plugin[key as keyof typeof plugin] // this is a function or the return value of calling a getter called key
        } else {
          throw new Error(
            'Property not found in plugin scope or as key of plugins',
          )
        }
      },
    },
  )
}
