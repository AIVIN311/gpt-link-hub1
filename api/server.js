/* eslint-env node */
/* global process */
import express from 'express'
import validateMeta from './validate-meta.js'
import summarize from './summarizer.js'

const app = express()
app.use(express.json())

app.post('/api/validate-meta', validateMeta)
app.post('/api/agent/summarizer', summarize)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
