const getUsername = (lastMessage) => {
  if (lastMessage.content.startsWith('/')) {
    const parts = lastMessage.content.split(' ')
    if (parts.length > 0) {
      const username = parts[0].split(':')[1]
      return username
    }
  }

  return null
}

exports.getUsername = getUsername
