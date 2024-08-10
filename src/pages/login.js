import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { AuthContext } from './_app'

const API_URL = process.env.API_URL

const Login = () => {
    const { setToken } = useContext(AuthContext)
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e) => {
        setFormData((prevValues) => ({
            ...prevValues,
            [e.target.name]: e.target.value,
        }))
    }

    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleClick = async () => {
        setError(null)
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/user/login`, formData)
            const accessToken = response.data.data.accessToken
            setToken(accessToken)
            localStorage.setItem('token', accessToken)
            localStorage.setItem('exp', response.data.data.user.expiryDate)
            localStorage.setItem(
                'refresh',
                response.data.data.user.refreshToken
            )
            setSuccess('User logged in successfully')
            setTimeout(() => {
                setSuccess(null)
                router.push('/dashboard')
            }, [2000])
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="area flex aic jcc padding-top-85">
            {error ? (
                <p className="error text-center font-20">{error}</p>
            ) : null}
            {success ? (
                <p className="success text-center font-20">{success}</p>
            ) : null}
            <div className="login-container flex aic jcc">
                <div className="form-field flex flex-column gap-20 login">
                    <div className="username-field flex flex-column gap-10">
                        <label className="font-inter">Username</label>
                        <input
                            className="username-input login-input"
                            value={formData.username}
                            name="username"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="password-field flex flex-column gap-10">
                        <label className="font-inter">Password</label>
                        <input
                            className="password-input login-input"
                            type="password"
                            value={formData.password}
                            name="password"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="login-button-container flex flex-column gap-10">
                        <button
                            className="login-button font-inter flex aic jcc"
                            onClick={() => handleClick()}
                        >
                            {loading ? <Spinner /> : 'Login'}
                        </button>
                        <Link className="font-inter underline" href="/register">
                            Don't have an account?
                        </Link>
                    </div>
                </div>
                <img
                    className="login-image display-image-none"
                    src="/images/finance.webp"
                />
            </div>
        </div>
    )
}

export default Login
