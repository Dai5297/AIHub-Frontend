import axios from 'axios'

//  创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 5000000
})

//  request拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('Authorization')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }

)

//  response拦截器
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default request
