import axios from 'axios'
import store from './store'
import { loadUser, logout } from './actions/auth'
const host = process.env.REACT_APP_HOST_API || 'http://localhost:4000'
export const FILES_URL =
	(process.env.REACT_APP_HOST_API || 'http://localhost:4000') + '/api/storage/'
const instance = axios.create({
	baseURL: host + '/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

instance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers['Authorization'] = 'bearer ' + token
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

instance.interceptors.response.use(
	res => {
		return res
	},
	async err => {
		const originalConfig = err.config

		if (err.response) {
			// Access Token was expired
			if (err.response.status === 403 && !originalConfig._retry) {
				originalConfig._retry = true
				try {
					const user = JSON.parse(localStorage.getItem('user'))
					const rs = await instance.post('/users/refresh', {
						user: user.id,
						refreshToken: localStorage.getItem('refresh'),
					})
					const { accessToken, user_ } = rs.data
					localStorage.setItem('token', accessToken)
					localStorage.setItem('user', JSON.stringify(user_))
					store.dispatch(loadUser())
					return instance(originalConfig)
				} catch (_error) {
					return Promise.reject(_error)
				}
			} else if (err.response.status === 401) {
				store.dispatch(logout())
			}
		}

		return Promise.reject(err)
	}
)

export default instance
