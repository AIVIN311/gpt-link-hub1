/**
 * Validates that a link is a public ChatGPT share URL
 */

export default class ValidatorAgent {
  constructor(options = {}) {
    this.options = options
  }

  run(link) {
    const pattern = /^https?:\/\/(chat\.openai\.com|chatgpt\.com)\/share\/[a-zA-Z0-9-]+$/
    return { link, valid: pattern.test(link) }
  }
}

