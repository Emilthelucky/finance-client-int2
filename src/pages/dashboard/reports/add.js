import { useState, useEffect } from 'react'
import axios from 'axios'
import PanelSidebar from '@/components/Sidebar/Sidebar'
import { Navigation } from '@/components/SecondaryNavigation/Navigation'
import { Select, Spinner, useToast } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '@/pages/_app'

const API_URL = process.env.API_URL

const AddReports = () => {
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const reportTypes = ['Monthly', 'Quarterly', 'Annual', 'Custom']

    const [formData, setFormData] = useState({
        reportTitle: '',
        reportType: '',
        details: '',
        selectedTransaction: '',
        selectedAccount: '',
        sent: false,
        email: '',
    })
    const [transactions, setTransactions] = useState([])
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch transactions
                const transactionsResponse = await axios.get(
                    `${API_URL}/transaction/${user?.username}`
                )
                setTransactions(transactionsResponse.data.data)

                // Fetch accounts
                const accountsResponse = await axios.get(
                    `${API_URL}/account/${user?.username}`
                )
                console.log(accountsResponse)
                setAccounts(accountsResponse.data.data)

                setLoadingData(false)
            } catch (error) {
                console.log('Error fetching data:', error)
                setLoadingData(false)
            }
        }

        if (user?.username) {
            fetchInitialData()
        }
    }, [user?.username])

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
            const response = await axios.post(`${API_URL}/report/create`, {
                reportTitle: formData.reportTitle,
                reportType: formData.reportType,
                details: formData.details,
                transactionId: formData.selectedTransaction,
                userName: user?.username,
                email: formData.email,
                sent: formData.sent,
            })
            console.log(response)
            setFormData({
                reportTitle: '',
                reportType: '',
                details: '',
                selectedTransaction: '',
                selectedAccount: '',
                email: '',
            })
            toast({
                title: 'Success!',
                description: `Report created successfully.`,
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

    if (loadingData) {
        return (
            <div className="grid">
                <PanelSidebar />
                <div className="spinner-center">
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="grid">
            <PanelSidebar />
            <div className="add-account">
                <Navigation
                    mainTitle={'Reports'}
                    title={'Add Report'}
                    save={loading ? <Spinner /> : 'Save it'}
                    icoF={'/icons/to.png'}
                    icoS={'/icons/back.png'}
                    back={'/dashboard/reports'}
                    click={handleSubmit}
                />
                <div className="add-account-container margin-inline-auto">
                    <h2 className="font-25 text-bolder font-poppins margin-bottom">
                        Create Report
                    </h2>
                    <div className="form-field-grid">
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
                            <label className="font-poppins">Report Title</label>
                            <input
                                className="password-input input"
                                type="text"
                                name="reportTitle"
                                value={formData.reportTitle}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-inter">Report Type</label>
                            <Select
                                onChange={handleChange}
                                name="reportType"
                                placeholder="Select Report Type"
                                value={formData.reportType}
                            >
                                {reportTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-inter">
                                Select Transaction
                            </label>
                            <Select
                                onChange={handleChange}
                                name="selectedTransaction"
                                placeholder="Select Transaction"
                                value={formData.selectedTransaction}
                            >
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <option
                                            key={transaction._id}
                                            value={transaction._id}
                                        >
                                            {transaction.transactionNumber}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">
                                        No transactions available
                                    </option>
                                )}
                            </Select>
                        </div>
                        <div className="password-field flex flex-column gap-10">
                            <label className="font-inter">Details</label>
                            <textarea
                                className="password-poppins input password-input"
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddReports
