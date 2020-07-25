import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_API
})

service.postForm = function (url, data) {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    // const value = data[key]
    // if (typeof value === 'object') {
    //   formData.append(key, JSON.stringify(value))
    // } else {
    //   formData.append(key, data[key])
    // }
    formData.append(key, data[key])
  })
  return service.post(url, formData)
}

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
