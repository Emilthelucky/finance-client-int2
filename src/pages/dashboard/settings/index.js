import { useState } from 'react'
import axios from 'axios'
import PanelSidebar from '@/components/Sidebar/Sidebar'
import { Navigation } from '@/components/SecondaryNavigation/Navigation'
import { Spinner, useToast, Input } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '@/pages/_app'

const API_URL = process.env.API_URL

const AccountSettings = () => {
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.put(`${API_URL}/user/update`, {
                ...formData,
                userId: user?._id,
            })
            console.log(response)
            toast({
                title: 'Success!',
                description: 'Account settings updated successfully.',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
            if (formData.newPassword) {
                localStorage.removeItem('refresh')
                localStorage.removeItem('token')
                localStorage.removeItem('exp')

                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            } else {
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (err) {
            console.log(err)
            toast({
                title: 'Error!',
                description: err.response?.data?.message || err.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid">
            <PanelSidebar />
            <div className="add-account">
                <Navigation
                    mainTitle={'Account Settings'}
                    title={'Update Account'}
                    save={loading ? <Spinner /> : 'Save'}
                    icoF={'/icons/to.png'}
                    icoS={'/icons/back.png'}
                    back={'/dashboard'}
                    click={handleSubmit}
                />
                <div className="add-account-container">
                    <h2 className="font-25 text-bolder font-poppins margin-bottom">
                        Update Your Account
                    </h2>
                    <div className="form-field-grid">
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-poppins">Username</label>
                            <input
                                className="password-input input"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-poppins">Email</label>
                            <input
                                className="password-input input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-inter">
                                Current Password
                            </label>
                            <input
                                className="password-input input"
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-inter">New Password</label>
                            <input
                                className="password-input input"
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings
