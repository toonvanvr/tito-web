import { tito } from './symbols'

export type Tito<HE extends HTMLElement> = {}

export class Engine<HE extends HTMLElement> {
  private readonly he: HE & { [tito]: Engine<HE> }

  static from<HE extends HTMLElement>(he: HE & { [tito]?: Engine<HE> }) {
    return he[tito] ?? new Engine(he)
  }

  constructor(he: HE & { [tito]?: Engine<HE> }) {
    this.he = Object.assign(he, { [tito]: this })
  }
}
