import TaggerAgent from '../src/agents/TaggerAgent.js'

const tagger = new TaggerAgent()

export default async function taggerRoute(req, res) {
  const { link, content } = req.body || {}
  const result = await tagger.run({ link, content })
  return res.json(result)
}
