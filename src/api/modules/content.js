import { service } from '@/request'

export default {
  getContentById (classifyId) {
    return service.get('/getContentById', {
      params: { classifyId }
    })
  }
}
