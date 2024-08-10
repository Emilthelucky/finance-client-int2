import { useState } from 'react'
import axios from 'axios'
import PanelSidebar from '@/components/Sidebar/Sidebar'
import { Navigation } from '@/components/SecondaryNavigation/Navigation'
import { Select, Spinner, useToast } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '@/pages/_app'

const API_URL = process.env.API_URL

const AddTransaction = () => {
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const transactionTypes = [
        'Deposit',
        'Withdrawal',
        'Transfer',
        'Payment',
        'Refund',
    ]

    const [formData, setFormData] = useState({
        accountName: '',
        amount: '',
        transactionType: '',
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
            const response = await axios.post(`${API_URL}/transaction/create`, {
                accountName: formData.accountName,
                amount: Number(formData.amount),
                transactionType: formData.transactionType,
                description: formData.description,
                userName: user?.username,
            })
            console.log(response)
            setFormData({
                accountName: '',
                amount: '',
                transactionType: '',
                description: '',
            })
            toast({
                title: 'Success!',
                description: `Transaction added successfully.`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
        } catch (err) {
            console.log(err)
            toast({
                title: 'Error!',
                description: `${err.response?.data?.message || err.message}`,
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
                    mainTitle={'Transactions'}
                    title={'Add Transaction'}
                    save={loading ? <Spinner /> : 'Save'}
                    icoF={'/icons/to.png'}
                    icoS={'/icons/back.png'}
                    back={'/dashboard/transactions'}
                    click={handleSubmit}
                />
                <div className="add-account-container margin-inline-auto">
                    <h2 className="font-25 text-bolder font-poppins margin-bottom">
                        Create Transaction
                    </h2>
                    <div className="form-field-grid">
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-poppins">Account Name</label>
                            <input
                                className="password-input input"
                                type="text"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-poppins">Amount</label>
                            <input
                                className="password-input input"
                                type="text"
                                name="amount"
                                value={formData.amount}
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
                            <label className="font-inter">
                                Transaction Type
                            </label>
                            <Select
                                onChange={handleChange}
                                name="transactionType"
                                placeholder="Select Option"
                                value={formData.transactionType}
                            >
                                {transactionTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
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

export default AddTransaction
