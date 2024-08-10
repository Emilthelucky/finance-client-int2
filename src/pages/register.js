import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const API_URL = process.env.API_URL

console.log(API_URL)

const Register = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
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
        setSuccess(null)
        setError(null)
        setLoading(true)
        try {
            const response = await axios.post(
                `${API_URL}/user/register`,
                formData
            )
            setSuccess(response.data.data)
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            setTimeout(() => {
                setError(null)
                setSuccess(null)
            }, 2000)
            setLoading(false)
        }
    }

    return (
        <div className="area flex aic jcc padding-top-100">
            {error ? (
                <p className="error text-center font-20">{error}</p>
            ) : null}
            {success ? (
                <p className="success text-center font-20">{success}</p>
            ) : null}
            <div className="register-container flex aic jcc">
                <div className="form-field flex flex-column gap-20 register">
                    <div className="email-field flex flex-column gap-10">
                        <label className="font-inter">Email</label>
                        <input
                            className="email-input register-input"
                            value={formData.email}
                            name="email"
                            onChange={(e) => handleChange(e)}
                            type="email"
                        />
                    </div>
                    <div className="username-field flex flex-column gap-10">
                        <label className="font-inter">Username</label>
                        <input
                            className="username-input register-input"
                            value={formData.username}
                            name="username"
                            onChange={(e) => handleChange(e)}
                            type="text"
                        />
                    </div>
                    <div className="password-field flex flex-column gap-10">
                        <label className="font-inter">Password</label>
                        <input
                            className="password-input register-input"
                            value={formData.password}
                            name="password"
                            onChange={(e) => handleChange(e)}
                            type="password"
                        />
                    </div>
                    <div className="register-button-container flex flex-column gap-10">
                        <button
                            className="register-button font-inter"
                            onClick={() => handleClick()}
                        >
                            {loading ? <Spinner /> : 'Register'}
                        </button>
                        <Link className="font-inter underline" href="login">
                            Already have an account?
                        </Link>
                    </div>
                </div>
                <img
                    className="register-image display-image-none"
                    src="/images/finance-main.webp"
                />
            </div>
        </div>
    )
}

export default Register
