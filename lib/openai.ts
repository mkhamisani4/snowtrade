import OpenAI from 'openai'

// Lazy initialization - only create client when actually needed
let _openai: OpenAI | null = null

// Check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

// Export a getter that creates client only when needed
export function getOpenAIClient(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }
    _openai = new OpenAI({
      apiKey,
    })
  }
  return _openai
}


