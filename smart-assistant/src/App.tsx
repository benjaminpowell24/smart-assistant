import './App.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AnimatedText from './components/AnimateText'
import {
  generateSessionId,
  getAllChatSessions,
  saveChatSession,
} from './helpers/helpers'
import { useEffect, useRef, useState } from 'react'
import UserMessage from './components/UserMessage'
import AIMessage from './components/AIMessage'
import { Microphone2, StopCircle } from 'iconsax-react'
import { chatgptFetch } from './utils'
import RegenerateResponse from './components/RegenerateResponse'
import dayjs from 'dayjs'

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  citations?: string[];
}

function App() {
  const [userInput, setUserInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [isTyping, setIsTyping] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isError, setIsError] = useState(false)
  const messagesRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current?.lastElementChild?.scrollIntoView({
        //@ts-ignore 
        top: -100,
        behavior: 'smooth',
      })
    }
  }, [chatMessages])

  // Initialize SpeechRecognition object (cross-browser compatibility)
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()

  recognition.lang = 'en-US'

  // When speech recognition starts
  recognition.onstart = () => {
    setIsListening(true)
  }

  // When speech is detected and recognized
  recognition.onresult = (event) => {
    const speechTranscript = event.results[0][0].transcript
    setUserInput(speechTranscript)
  }

  // When speech recognition ends
  recognition.onend = () => {
    setIsListening(false)
  }

  // Function to start listening
  const handleStartListening = () => {
    recognition.start()
  }

  const handlePrompt = async () => {
    setChatMessages((prev) => {
      saveChatSession(sessionId, [
        ...prev,
        { content: userInput, role: 'user' },
      ])

      return [...prev, { content: userInput, role: 'user' }]
    })
    setIsDisabled(true)
    setIsTyping(true)
    setUserInput('')

    try {
      let backendPath = '/conversation'

      if (userInput.startsWith('/j')) {
        backendPath = '/jira'
      } else if (userInput.startsWith('/g')) {
        backendPath = '/github'
      }

      const filteredMessages = chatMessages.map(
        ({ citations, ...rest }) => rest
      )
      const response = await chatgptFetch.post(backendPath, {
        messages: [...filteredMessages, { content: userInput, role: 'user' }],
      })

      const { content, citations } = response.data

      setChatMessages((prev) => {
        saveChatSession(sessionId, [
          ...prev,
          { content: content, role: 'assistant', citations: citations },
        ])
        return [
          ...prev,
          { content: content, role: 'assistant', citations: citations },
        ]
      })
    } catch (error) {
      console.error('Error:', error)
      setIsError(true)
    } finally {
      setIsTyping(false)
      setIsDisabled(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleSessionRestore = (sessionId, messages) => {
    setSessionId(sessionId)
    setChatMessages(messages)
  }

  const createNewSession = () => {
    const sessionId = generateSessionId().toString()
    setIsError(false)
    setSessionId(sessionId)
    setChatMessages([])
  }

  const handleRegenerateResponse = async () => {
    setIsError(false)
    setIsDisabled(true)
    setIsTyping(true)

    try {
      let backendPath = '/conversation'

      if (userInput.startsWith('/j')) {
        backendPath = '/jira'
      } else if (userInput.startsWith('/g')) {
        backendPath = '/github'
      }

      const filteredMessages = chatMessages.map(
        ({ citations, ...rest }) => rest
      )
      const response = await chatgptFetch.post(backendPath, {
        messages: [
          ...filteredMessages,
          {
            content: chatMessages[chatMessages.length - 1].content,
            role: 'user',
          },
        ],
      })

      const { content, citations } = response.data

      setChatMessages((prev) => {
        saveChatSession(sessionId, [
          ...prev,
          { content: content, role: 'assistant', citations: citations },
        ])
        return [
          ...prev,
          { content: content, role: 'assistant', citations: citations },
        ]
      })
    } catch (error) {
      console.error('Error:', error)
      setIsError(true)
    } finally {
      setIsTyping(false)
      setIsDisabled(false)
    }
  }

  useEffect(() => {
    const savedChatSessions = getAllChatSessions()

    if (savedChatSessions.length === 0) {
      createNewSession()
      return
    }

    const lastSession = savedChatSessions[savedChatSessions.length - 1]
    handleSessionRestore(lastSession.id, lastSession.messages)
  }, [])

  return (
    <div className='p-2 h-screen flex gap-2'>
      <Sidebar handleSessionRestore={handleSessionRestore} />
      <div className='flex flex-col justify-between w-full pt-6 px-10 gap-4'>
        <Topbar createNewSession={createNewSession} />
        <main className='flex-1 overflow-y-auto w-full flex flex-col justify-between gap-2 mt-10 mb-2'>
          {chatMessages.length ? (
            <div className='h-full overflow-y-auto'>
              <ul
                ref={messagesRef}
                className='flex flex-col items-center w-full gap-4'
              >
                {chatMessages.map((message, index) =>
                  message.role === 'user' ? (
                    <UserMessage key={index} text={message.content} />
                  ) : (
                    <AIMessage
                      key={index}
                      text={message.content}
                      citation={message.citations}
                      isOld={index !== chatMessages.length - 1}
                    />
                  )
                )}
                {isError && (
                  <RegenerateResponse
                    handleRegenerateResponse={handleRegenerateResponse}
                  />
                )}
              </ul>
              <div className='flex flex-col items-center w-1/2 mt-4 ml-40'>
                {isTyping && (
                  <div className='typing-indicator self-start'>
                    Smart Assistant is typing...
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='w-full flex-1 flex flex-col items-center justify-center gap-8 rounded-2xl'>
              <h1 className='animate-[bounce_2s_ease-in-out_infinite] text-4xl'>Hi, how can I help you today?</h1>
              <AnimatedText text='Enter a prompt to start or click the button at the top right to create a new chat.' />
            </div>
          )}

          <div className='flex gap-4 justify-center'>
            <div className='relative w-1/2'>
              <input
                type='text'
                placeholder='Send a message'
                className='w-full p-4 border rounded-full'
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !isDisabled &&
                    userInput &&
                    !isError
                  ) {
                    handlePrompt()
                  }
                }}
              />
              <button
                className='absolute top-4 right-5 cursor-pointer flex'
                onClick={handleStartListening}
              >
                {isListening ? (
                  <StopCircle size='28' variant='Bulk' color='#e01111' />
                ) : (
                  <Microphone2 size='28' variant='Bulk' color='#4F2682' />
                )}
              </button>
            </div>
            <button
              className={`bg-[#4F2682] text-white py-4 px-12 rounded-full drop-shadow-[0_10px_8px_rgb(79 38 130 / 0.04))] shadow-[#4F2682] transition-all duration-300 ease-in-out hover:bg-[#391b5d] ${isDisabled || !userInput
                ? 'disabled:bg-[#4F2682]/75 hover:cursor-not-allowed'
                : 'hover:cursor-pointer'
                }`}
              onClick={handlePrompt}
              disabled={isDisabled || !userInput || isError}
            >
              {'Submit'}
            </button>
          </div>
        </main>
        <footer>
          <p className='text-gray-400 text-sm'>
            {`${dayjs().year()} Smart Assistant can make mistakes. Please verify the information provided.`}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
