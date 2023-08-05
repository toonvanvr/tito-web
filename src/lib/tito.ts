// Let's start at the end of the code, skipping the `html` factory on the first level
// We're now creating a proxy around a HTMLElement

import {
  Layer2Target,
  PluginCollection,
  enterPlugin,
  getPlugin,
  getPlugins,
} from './plugin.utils.js'
import { tito } from './symbols.js'

// MOCK DATA
export const myPlugin = Symbol('mocked')

const defaultPlugins = {
  [myPlugin]: {
    a: 10,
    b: 20,
  },
}

// .. this may take a while to figure out, although I've made attempts at it before ..

// Simplifications:
// - no inheritance of the `html` factory plugin configuration
// - no inner/attached tito state of this element
// - We're assuming this function is called to wrap around a HTMLInputElement

// TODO: this needs to be wrapped in a function @ layer 1
function createTarget() {
  const target = (() => {
    // THIS IS FOR DEMO PURPOSES ONLY
  }) as Layer2Target

  target[tito] = defaultPlugins
  return target
}

/** Layer 2 proxy */
export const myInput = new Proxy(
  // To allow proxying the apply (= function call), the target NEEDS to be a function
  // If we had passed an empty object, null or whatever else, you'd get a runtime error
  // when trying to implement `.apply()`, which will be used to append children
  createTarget(), // TODO: pass param which inherits plugins from layer 1 + their config
  {
    // Provide a symbol to enter a plugin scope
    get(target: any, pluginId: string | symbol) {
      if (typeof pluginId === 'string') {
        // We don't support indexing with strings yet
        // It might be useful later to expose methods from all plugins
        throw new Error('You must provide a symbol')
      } else {
        // We will retrieve the plugin here.
        // Let's skip this logic for now and assume a given set of functions
        // Here, we return the 3rd layer of proxies

        console.group(`LAYER 2: get [${pluginId.toString()}]`)
        console.log('target', target)
        const plugins = getPlugins(target)
        console.log('plugins', plugins)
        const plugin = getPlugin(plugins, pluginId)
        console.log('plugin', plugin)
        const pluginScope = enterPlugin(plugin, target)
        console.log('pluginScope', pluginScope)
        console.groupEnd()
        return pluginScope
      }
    },
  },
)
