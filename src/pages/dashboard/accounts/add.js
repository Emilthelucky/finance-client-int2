import { useState } from 'react'
import axios from 'axios'
import PanelSidebar from '@/components/Sidebar/Sidebar'
import { Navigation } from '@/components/SecondaryNavigation/Navigation'
import { Select } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '@/pages/_app'

const API_URL = process.env.API_URL

const AddAccount = () => {
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const accountTypes = [
        'Bank Account',
        'Credit Card',
        'Investment Account',
        'Cash',
        'Savings Account',
        'Loan Account',
        'Retirement Account',
        'Expense Account',
        'Revenue Account',
        'Fixed Asset Account',
    ]

    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        type: '',
        description: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, selectedOptions } = e.target
        if (type === 'select-one') {
            setFormData((prev) => ({
                ...prev,
                [name]: selectedOptions[0].value,
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/account/create`, {
                name: formData.name,
                balance: formData.balance,
                type: formData.type,
                description: formData.description,
                userName: user?.username,
            })
            console.log(response)
            setFormData({
                name: '',
                balance: '',
                type: '',
                description: '',
            })
            toast({
                title: 'Success!',
                description: `Account added successfully.`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
        } catch (err) {
            toast({
                title: 'Error!',
                description: `${err.response.data.message}`,
                status: 'error',
                duration: 1000,
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
                    mainTitle={'Accounts'}
                    title={'Add Account'}
                    save={loading ? <Spinner /> : 'Save it'}
                    icoF={'/icons/to.png'}
                    icoS={'/icons/back.png'}
                    back={'/dashboard/accounts'}
                    click={handleSubmit}
                />
                <div className="add-account-container margin-inline-auto">
                    <h2 className="font-25 text-bolder font-poppins margin-bottom">
                        Create Account
                    </h2>
                    <div className="form-field-grid">
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-poppins">Account Name</label>
                            <input
                                className="password-input input"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-poppins">Balance</label>
                            <input
                                className="password-input input"
                                type="text"
                                name="balance"
                                value={formData.balance}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-inter">Description</label>
                            <textarea
                                className="password-poppins input password-input"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-inter">Account Type</label>
                            <Select
                                onChange={handleChange}
                                name="type"
                                placeholder="Select Option"
                                value={formData.type}
                            >
                                {accountTypes.map((account, index) => (
                                    <option key={index} value={account}>
                                        {account}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAccount
