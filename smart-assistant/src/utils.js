import axios from 'axios'

export const chatgptFetch = axios.create({
  baseURL: '/v1/smart-assistant',
})
