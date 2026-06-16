import axios from 'axios'

const api = axios.create({
    baseURL: 'https://sisacad-enrollments-backend.vercel.app/restful',
})

export default api