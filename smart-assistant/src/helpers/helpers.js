export const generateSessionId = () => {
  return Date.now()
}

export const saveChatSession = (sessionId, messages) => {
  const allChatSessions =
    JSON.parse(localStorage.getItem('allChatSessions')) || []

  const chatSession = allChatSessions.find(
    (session) => session.id === sessionId
  )

  if (chatSession) {
    chatSession.messages = messages
    localStorage.setItem('allChatSessions', JSON.stringify(allChatSessions))
  } else {
    let newChatSession = {
      id: sessionId,
      messages: messages,
    }

    allChatSessions.push(newChatSession)

    localStorage.setItem('allChatSessions', JSON.stringify(allChatSessions))
  }
}

export const getAllChatSessions = () => {
  let allChatSessions =
    JSON.parse(localStorage.getItem('allChatSessions')) || []
  return allChatSessions
}

export const getChatSessionById = (sessionId) => {
  let allChatSessions =
    JSON.parse(localStorage.getItem('allChatSessions')) || []
  return allChatSessions.find((session) => session.id === sessionId)
}
