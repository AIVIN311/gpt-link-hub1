import ValidatorAgent from '../src/agents/ValidatorAgent.js'
import MetaAgent from '../src/agents/MetaAgent.js'

const validator = new ValidatorAgent()
const meta = new MetaAgent()

export default function validateMeta(req, res) {
  const { link } = req.body || {}
  const validation = validator.run(link)
  if (!validation.valid) {
    return res.status(400).json(validation)
  }
  const metadata = meta.run(link)
  return res.json({ ...validation, ...metadata })
}
