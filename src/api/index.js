import axios from 'axios'

const api = axios.create({
    baseURL: '/api/restful',
})

export default api