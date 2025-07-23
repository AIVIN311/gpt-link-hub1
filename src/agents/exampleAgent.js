/**
 * Basic no-op agent used as a template for new agents.
 * It simply echoes whatever input it receives.
 */

export default class ExampleAgent {
  constructor(options = {}) {
    this.options = options
  }

  run(input) {
    return { input, output: input }
  }
}
