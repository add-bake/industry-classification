import { service } from '@/request'

export default {
  getMenus () {
    return service.get('/menus/getMenus')
  },
  updateMenu (payload) {
    return service.post('/menus/updateMenu', payload)
  },
  addMenu (payload) {
    return service.post('/menus/addMenu', payload)
  },
  deleteMenu (id) {
    return service.post('/menus/deleteMenu', { id })
  }
}
