import OpenAI from 'openai'
import { CONFIG } from '../utils/config.js'

const openai = new OpenAI()

export const conversation = async (messages) => {
  const assistant = await openai.beta.assistants.retrieve(CONFIG.ASSISTANT_ID)

  const thread = await openai.beta.threads.create({
    messages: messages,
  })

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  })

  const response = await openai.beta.threads.messages.list(thread.id, {
    run_id: run.id,
  })

  const message = response.data[0]

  if (message.content[0].type === 'text') {
    const { text } = message.content[0]
    const { annotations } = text

    const citationsData = []
    let index = 0
    let lastCitation = { index: 0, file_id: '' }

    for (let annotation of annotations) {
      if (
        lastCitation.index === annotation.start_index &&
        lastCitation.file_id === annotation.file_citation.file_id
      ) {
        console.error('Duplicate citation')
        text.value = text.value.replace(annotation.text, '')
        continue
      }

      lastCitation.index = annotation.end_index
      lastCitation.file_id = annotation.file_citation.file_id

      text.value = text.value.replace(annotation.text, ' [' + index + ']')

      const { file_citation } = annotation

      if (file_citation) {
        const citedFile = await openai.files.retrieve(file_citation.file_id)
        citationsData.push({ index: index, filename: citedFile.filename })
      }

      index++
    }

    const uniqueCitationFiles = [
      ...new Set(citationsData.map((citation) => citation.filename)),
    ]

    const citationsArray = uniqueCitationFiles.map((citationFileName) => {
      let citationIndixes = []
      for (const citation of citationsData) {
        if (citation.filename === citationFileName) {
          citationIndixes.push(`[${citation.index}]`)
        }
      }
      return { indixes: citationIndixes, filename: citationFileName }
    })

    const textValue = text.value
    const citations = citationsArray.map(
      (citation) => `${citation.indixes.join(', ')} ${citation.filename}`
    )

    const response = { content: textValue, citations: citations }
    return response
  }
}
