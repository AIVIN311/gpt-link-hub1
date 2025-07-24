import SummarizerAgent from '../src/agents/SummarizerAgent.js'

const summarizer = new SummarizerAgent()

export default async function summarize(req, res) {
  const { link, content } = req.body || {}
  const result = await summarizer.run({ link, content })
  return res.json(result)
}
