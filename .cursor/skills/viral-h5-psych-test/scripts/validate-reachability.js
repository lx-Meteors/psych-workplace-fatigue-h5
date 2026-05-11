#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

function readJson(filePath) {
  const abs = path.resolve(process.cwd(), filePath)
  return JSON.parse(fs.readFileSync(abs, 'utf8'))
}

function usage() {
  console.error(
    'Usage: node scripts/validate-reachability.js <questions.json> <results.json|id1,id2,id3>'
  )
  process.exit(1)
}

function extractResultIds(resultInput) {
  if (resultInput.endsWith('.json')) {
    const data = readJson(resultInput)
    if (!Array.isArray(data)) throw new Error('results.json must be an array')
    return data.map((r) => r.id).filter(Boolean)
  }
  return resultInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function scorePath(pathOptions, questions, resultIds) {
  const score = Object.fromEntries(resultIds.map((id) => [id, 0]))
  pathOptions.forEach((optIdx, qIdx) => {
    const option = questions[qIdx].options[optIdx]
    if (option.scores && typeof option.scores === 'object') {
      Object.entries(option.scores).forEach(([id, val]) => {
        if (id in score) score[id] += Number(val) || 0
      })
    } else if (option.resultId && option.resultId in score) {
      score[option.resultId] += 1
    }
  })

  let winner = resultIds[0]
  for (const id of resultIds) {
    if (score[id] > score[winner]) winner = id
  }
  return winner
}

function cartesianCheck(questions, resultIds, hardLimit = 200000) {
  const optionCounts = questions.map((q) => q.options.length)
  const total = optionCounts.reduce((acc, n) => acc * n, 1)
  if (total > hardLimit) return null

  const reached = new Set()
  const indices = Array(questions.length).fill(0)
  let done = false

  while (!done) {
    reached.add(scorePath(indices, questions, resultIds))

    for (let i = indices.length - 1; i >= 0; i -= 1) {
      indices[i] += 1
      if (indices[i] < optionCounts[i]) break
      indices[i] = 0
      if (i === 0) done = true
    }
  }
  return reached
}

function randomCheck(questions, resultIds, samples = 50000) {
  const reached = new Set()
  for (let i = 0; i < samples; i += 1) {
    const picks = questions.map((q) => Math.floor(Math.random() * q.options.length))
    reached.add(scorePath(picks, questions, resultIds))
  }
  return reached
}

function main() {
  const [questionsPath, resultInput] = process.argv.slice(2)
  if (!questionsPath || !resultInput) usage()

  const questions = readJson(questionsPath)
  if (!Array.isArray(questions)) throw new Error('questions.json must be an array')
  questions.forEach((q, idx) => {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Question ${idx + 1} has invalid options`)
    }
  })

  const resultIds = extractResultIds(resultInput)
  if (resultIds.length === 0) throw new Error('No result ids provided')

  let reached = cartesianCheck(questions, resultIds)
  let method = 'exhaustive'
  if (!reached) {
    reached = randomCheck(questions, resultIds)
    method = 'sampling'
  }

  const missing = resultIds.filter((id) => !reached.has(id))
  console.log(`Method: ${method}`)
  console.log(`Reached: ${Array.from(reached).join(', ') || '(none)'}`)

  if (missing.length > 0) {
    console.error(`Missing result types: ${missing.join(', ')}`)
    process.exit(2)
  }
  console.log('Reachability check passed.')
}

main()
