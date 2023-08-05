import { createTito } from '../core/tito.js'
import { std } from '../symbols.js'

// Implementation details
export const html = createTito({
  [std]: {
    initializeState() {
      return {}
    },
    // TODO: convert to proxy
    methods: {
      div(state) {
        return 'HELLO WORLD'
      },
    },
  },
})
