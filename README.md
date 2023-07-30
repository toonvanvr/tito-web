# tito-web

> This is the ONE web framework you'll only ever want to use.
>
> An ironic take on the abundant world of web frameworks.
> Starting as a joke, it might end up becoming actually usable.

### Project Status
Sandbox - no functional library available

## Philosophy

Imagine a homogenous blob of TypeScript code for full stack web development.

~~Here it is!~~ Here it will be!

### Rulebook

- Everything must be written in TypeScript
- Everything must be strictly typed
- Everything must be reactive (it's a leaky abstraction, so let's leak it)
- Any build step can only be used to apply tree shaking for backend, frontend and modules
  - The build step must use TypeScript files for configuration
- Less is more: remain a relatively low level library which can be wrapped with abstraction layers and breathes through extensions

## Specification

### Proxies as only abstraction layer

The only thing which separates you from raw DOM components is a proxy object.

```typescript
// LIB

// Global objects provided from 'tito' are proxy-factories
const html = new Proxy(
  {},
  { 
    get(tag) {
      // They will attach or retrieve a persistent proxy
      return Tito.from(tag)
    }
  }
)

// CLIENT

const div: Tito<HTMLDivElement> =
  html.div                // This is the persistent proxy with
    .customThemeGreen     // extensible
    .customThemeBorder    // chainable
    .onClick(console.log) // methods
```

### Symbolism

No namespace collisions! Tito instances will be attached to native objects through symbols defined in this library. Extensions will always be scoped and retrievable through their own symbol.

```typescript
// LIB
const tito = Symbol('tito')

// CLIENT
const div: HTMLDivElement & { [tito]: Tito<HTMLDivElement> } = html.div
```

### Reactive

Everything is reactive, but assigning non-reactive values must be seamlessly supported.

If any logic supports reactive input, the output must always be reactive.

```typescript
// Just go to the RxJs website
```

### Lean and mean

Screen space is a limited commodity. All lib variables should strive to have only 4 or less characters.

```typescript
import { tito, html } from 'tito'
```

### Support multiple plugin sets

Extensions aren't applied to the global object to allow for endless forking of factories with plugins. Whenever you apply a plugin, it'll create a new factory.

```typescript
import { html, exit } from 'tito'
import { companyComponentsPlugin } from '@your-company/tito-components'

const base = html
const more = html[tito].plugin(companyComponentsPlugin)[exit]

html.companyLogo // Tito<HtmlElement>
base.companylogo // Tito<HtmlElement>
more.companyLogo // Tito<HTMLCompanyLogoElement>
```