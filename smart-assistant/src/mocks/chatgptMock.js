const chatgptMock = (userMessage) => {
  console.log('User message:', userMessage)
  const message = 'Hello, how can I help you today? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hello, how can I help you today? Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  return new Promise((resolve, reject) => {
    if (!userMessage) {
      reject('No message provided')
    } else {
      setTimeout(() => {
        resolve(message)
      }, 2000)
    }
  })
}

export const getAIresponse = async (userMessage) => {
  try {
    const response = await chatgptMock(userMessage)
    return response
  } catch (error) {
    console.error('Error:', error)
  }
}
