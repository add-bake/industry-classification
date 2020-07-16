import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_API
})

// response interceptor
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log('request error：', error)
    if (axios.isCancel(error)) {
      console.log('request cancel')
    } else {
      const { response } = error
      return response ? response.data : Promise.reject(error)
    }
  }
)

export { service }
