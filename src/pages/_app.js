import '@/styles/globals.css'
import { Providers } from '@/chakra ui/Provider'
import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const API_URL = process.env.API_URL

export const AuthContext = createContext()

export default function App({ Component, pageProps }) {
    const router = useRouter()
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)

    console.log(user)

    const checkRefreshTokenExpTime = (expirationDate) => {
        if (expirationDate) {
            const expiryDate = new Date(expirationDate)
            const currentTime = new Date()
            return currentTime < expiryDate
        }
        return false
    }

    const regenerateToken = async (refreshToken) => {
        try {
            const response = await axios.post(
                `${API_URL}/user/regenerateToken`,
                { refreshToken: refreshToken }
            )
            const newAccessToken = response.data.data
            localStorage.setItem('token', newAccessToken)
            setToken(newAccessToken)
            return newAccessToken
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const verifyAccessToken = async (token) => {
        try {
            const response = await axios.post(`${API_URL}/user/verifyToken`, {
                token,
            })
            return response.data.data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const mounted = async () => {
        const accessToken = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refresh')
        const expirationDate = localStorage.getItem('exp')

        if (accessToken) {
            if (
                refreshToken &&
                expirationDate &&
                checkRefreshTokenExpTime(expirationDate)
            ) {
                const verifiedUser = await verifyAccessToken(accessToken)
                if (verifiedUser) {
                    setUser(verifiedUser)
                    setToken(accessToken)
                    if (router.pathname.startsWith('/login')) {
                        router.push('/dashboard')
                    }
                } else {
                    const newAccessToken = await regenerateToken(refreshToken)
                    if (newAccessToken) {
                        localStorage.setItem('token', newAccessToken)
                        const newUser = await verifyAccessToken(newAccessToken)
                        if (newUser) {
                            setUser(newUser)
                            setToken(newAccessToken)
                            if (router.pathname.startsWith('/login')) {
                                router.push('/dashboard')
                            }
                        } else {
                            localStorage.removeItem('token')
                            localStorage.removeItem('refresh')
                            localStorage.removeItem('exp')
                            if (router.pathname.startsWith('/dashboard')) {
                                router.push('/login')
                            }
                        }
                    } else {
                        localStorage.removeItem('token')
                        localStorage.removeItem('refresh')
                        localStorage.removeItem('exp')
                        if (router.pathname.startsWith('/dashboard')) {
                            router.push('/login')
                        }
                    }
                }
            } else {
                if (router.pathname.startsWith('/dashboard')) {
                    router.push('/login')
                }
            }
        } else {
            if (router.pathname.startsWith('/dashboard')) {
                router.push('/login')
            }
        }
    }

    useEffect(() => {
        mounted()
    }, [router])

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            <Providers>
                <Component {...pageProps} />
            </Providers>
        </AuthContext.Provider>
    )
}
