import PanelSidebar from '@/components/Sidebar/Sidebar'
import { Add } from '@/components/Add/Add'
import Edit from '@/components/Edit/Edit'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Spinner } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Navigation } from '@/components/SecondaryNavigation/Navigation'
import { useContext } from 'react'
import { AuthContext } from '@/pages/_app'

const API_URL = process.env.API_URL

const Transactions = () => {
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const [transactions, setTransactions] = useState([])
    const [selectedTransactions, setSelectedTransactions] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${API_URL}/transaction/${user?.username}`
            )
            setTransactions(response.data.data)
        } catch (error) {
            console.log('Error fetching transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.username) {
            fetchTransactions()
        }
    }, [user?.username])

    const handleSelectTransaction = (transactionId) => {
        setSelectedTransactions((prevSelected) =>
            prevSelected.includes(transactionId)
                ? prevSelected.filter((id) => id !== transactionId)
                : [...prevSelected, transactionId]
        )
    }

    const handleDelete = async () => {
        setLoadingDelete(true)
        try {
            const response = await axios.post(`${API_URL}/transaction/delete`, {
                transactions: selectedTransactions,
            })
            if (response.status === 200) {
                toast({
                    title: 'Success!',
                    description: `Transaction deleted successfully.`,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top-right',
                })

                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingDelete(false)
        }
    }

    const handleSelectAll = () => {
        if (selectedTransactions.length === transactions.length) {
            setSelectedTransactions([]) // Deselect all
        } else {
            setSelectedTransactions(
                transactions.map((transaction) => transaction._id)
            ) // Select all
        }
    }

    const isAllSelected =
        selectedTransactions.length === transactions.length &&
        transactions.length > 0

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    if (loading) {
        return (
            <div className="gird-white">
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
        <div className="gird-white">
            <PanelSidebar />
            <div className="add-account">
                {!loading && transactions.length === 0 ? (
                    <Add
                        img="/images/transactions.png"
                        title="Add your first transaction"
                        paragraph="You can add your first transaction on this page"
                        button="Add transaction"
                        href="/dashboard/transactions/add"
                    />
                ) : (
                    <div className="add-account">
                        <Navigation
                            mainTitle="Financial Transactions"
                            href={'/dashboard/transactions/add'}
                            save={'Add'}
                        />
                        <div className="item-list margin-inline-auto flex flex-column gap-20 font-poppins">
                            <div className="my-products-search">
                                {selectedTransactions.length > 0 && (
                                    <div className="products-edit-delete">
                                        <div className="products-selected">
                                            Selected{' '}
                                            {selectedTransactions.length}{' '}
                                        </div>
                                        <button
                                            className="products-edit"
                                            onClick={openModal}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="products-delete"
                                            onClick={handleDelete}
                                        >
                                            {loadingDelete ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                'Delete'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="item-navigation flex aic between">
                                <div className="nav-item flex gap-20 low">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                    <p>ID</p>
                                </div>
                                <div className="nav-item display-none low">
                                    Created
                                </div>
                                <div className="nav-item low">Amount $</div>
                                <div className="nav-item display-none low">
                                    Type
                                </div>
                                <div className="nav-item low">Left</div>
                                <div className="nav-item low">Account</div>
                            </div>
                            <div className="item-main flex flex-column">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction._id}
                                        className="item-main-element flex aic between"
                                    >
                                        <div className="main-item flex gap-20 low">
                                            <input
                                                type="checkbox"
                                                checked={selectedTransactions.includes(
                                                    transaction._id
                                                )}
                                                onChange={() =>
                                                    handleSelectTransaction(
                                                        transaction._id
                                                    )
                                                }
                                            />
                                            <p>
                                                {transaction.transactionNumber}
                                            </p>
                                        </div>
                                        <div className="main-item display-none low">
                                            {new Date(
                                                transaction.date
                                            ).toLocaleDateString()}
                                        </div>
                                        <div
                                            className={
                                                transaction.transactionType ===
                                                    'Deposit' ||
                                                transaction.transactionType ===
                                                    'Refund'
                                                    ? 'main-item gained low'
                                                    : 'main-item lost low'
                                            }
                                        >
                                            {transaction.transactionType ===
                                                'Deposit' ||
                                            transaction.transactionType ===
                                                'Refund'
                                                ? `+${transaction.amount}`
                                                : `-${transaction.amount}`}
                                        </div>
                                        <div className="main-item display-none low">
                                            {transaction.transactionType}
                                        </div>
                                        <div className="main-item low">
                                            {transaction.account.balance}
                                        </div>
                                        <div className="main-item low">
                                            {transaction.account.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <Edit
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    selectedItems={selectedTransactions}
                    options={transactions}
                    endPointType="transactions"
                    entityType="Transactions"
                    updateEndpoint={`transaction/update`}
                    deleteEndpoint={'transaction/delete'}
                />
            </div>
        </div>
    )
}

export default Transactions
