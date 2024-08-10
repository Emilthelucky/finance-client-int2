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

const Accounts = () => {
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const [accounts, setAccounts] = useState([])
    const [selectedAccounts, setSelectedAccounts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingDelete, setLoadingDelete] = useState(false) // Initialize loading state as true

    const fetchAccounts = async () => {
        if (user?.username) {
            try {
                const response = await axios.get(
                    `${API_URL}/account/${user?.username}`
                )
                setAccounts(response.data.data)
            } catch (error) {
                console.error('Error fetching accounts:', error)
            } finally {
                setLoading(false) // Set loading to false after data is fetched
            }
        }
    }

    useEffect(() => {
        fetchAccounts()
    }, [user?.username])

    const handleSelectAccount = (accountId) => {
        setSelectedAccounts((prevSelected) =>
            prevSelected.includes(accountId)
                ? prevSelected.filter((id) => id !== accountId)
                : [...prevSelected, accountId]
        )
    }

    const handleDelete = async () => {
        setLoadingDelete(true)
        try {
            const response = await axios.post(`${API_URL}/account/delete`, {
                accounts: selectedAccounts,
            })
            if (response.status === 200) {
                toast({
                    title: 'Success!',
                    description: `Account deleted successfully.`,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top-right',
                })

                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }
            console.log(response)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingDelete(false)
        }
    }

    const handleSelectAll = () => {
        if (selectedAccounts.length === accounts.length) {
            setSelectedAccounts([]) // Deselect all
        } else {
            setSelectedAccounts(accounts.map((account) => account._id)) // Select all
        }
    }

    const isAllSelected =
        selectedAccounts.length === accounts.length && accounts.length > 0

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
                {accounts.length === 0 ? (
                    <Add
                        img="/images/accounts.png"
                        title="Add your first account"
                        paragraph="You can add your first account on this page"
                        button="Add account"
                        href="/dashboard/accounts/add"
                    />
                ) : (
                    <div className="add-account">
                        <Navigation
                            mainTitle="Financial Accounts"
                            href={'/dashboard/accounts/add'}
                            save={'Add'}
                        />
                        <div className="item-list margin-inline-auto flex flex-column gap-20 font-poppins">
                            <div className="my-products-search">
                                {selectedAccounts.length > 0 && (
                                    <div className="products-edit-delete">
                                        <div className="products-selected">
                                            Selected {selectedAccounts.length}{' '}
                                        </div>
                                        <button
                                            className="products-edit"
                                            onClick={openModal}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="products-delete"
                                            onClick={() => handleDelete()}
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
                                <div className="nav-item flex gap-20">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                    <p>Account</p>
                                </div>
                                <div className="nav-item">Created</div>
                                <div className="nav-item">Balance $</div>
                                <div className="nav-item display-none">
                                    Type
                                </div>
                            </div>
                            <div className="item-main flex flex-column">
                                {accounts.map((account) => (
                                    <div
                                        key={account._id}
                                        className="item-main-element flex aic between"
                                    >
                                        <div className="main-item flex gap-20">
                                            <input
                                                type="checkbox"
                                                checked={selectedAccounts.includes(
                                                    account._id
                                                )}
                                                onChange={() =>
                                                    handleSelectAccount(
                                                        account._id
                                                    )
                                                }
                                            />
                                            <p>{account.name}</p>
                                        </div>
                                        <div className="main-item">
                                            {new Date(
                                                account.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className="main-item">
                                            {account.balance}
                                        </div>
                                        <div className="main-item display-none">
                                            {account.type}
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
                    selectedItems={selectedAccounts}
                    options={accounts}
                    endPointType="accounts"
                    entityType="Accounts"
                    updateEndpoint={`account/update`}
                    deleteEndpoint={'account/delete'}
                />
            </div>
        </div>
    )
}

export default Accounts
