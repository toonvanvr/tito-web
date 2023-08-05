import { html } from './lib/std/html.js'
import { std, tito } from './lib/symbols.js'

const global = globalThis as any

global.html = html
global.std = std
global.tito = tito
