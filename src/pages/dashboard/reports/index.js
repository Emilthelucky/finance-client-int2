import PanelSidebar from '@/components/Sidebar/Sidebar'
import { Add } from '@/components/Add/Add'
import Edit from '@/components/Edit/Edit'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Spinner, useToast } from '@chakra-ui/react'
import { Navigation } from '@/components/SecondaryNavigation/Navigation'
import { useContext } from 'react'
import { AuthContext } from '@/pages/_app'

const API_URL = process.env.API_URL

const Reports = () => {
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const [reports, setReports] = useState([])
    const [selectedReports, setSelectedReports] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [loadingSend, setLoadingSend] = useState({}) // Change to object

    useEffect(() => {
        if (user?.username) {
            fetchReports()
        }
    }, [user?.username])

    const fetchReports = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${API_URL}/report/${user?.username}`
            )
            setReports(response.data.data)
        } catch (error) {
            console.error('Error fetching reports:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectReport = (reportId) => {
        setSelectedReports((prevSelected) =>
            prevSelected.includes(reportId)
                ? prevSelected.filter((id) => id !== reportId)
                : [...prevSelected, reportId]
        )
    }

    const handleDelete = async () => {
        setLoadingDelete(true)
        try {
            const response = await axios.post(`${API_URL}/report/delete`, {
                reports: selectedReports,
            })
            if (response.status === 200) {
                toast({
                    title: 'Success!',
                    description: `Reports deleted successfully.`,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top-right',
                })

                setReports(
                    reports.filter(
                        (report) => !selectedReports.includes(report._id)
                    )
                )
                setSelectedReports([]) // Reset selection after deletion
            }
        } catch (error) {
            console.error('Error deleting reports:', error)
        } finally {
            setLoadingDelete(false)
        }
    }

    const handleSendReport = async (reportId) => {
        setLoadingSend((prev) => ({ ...prev, [reportId]: true })) // Set loading for specific report
        try {
            const response = await axios.post(
                `${API_URL}/report/send/${reportId}`
            )
            if (response.status === 200) {
                toast({
                    title: 'Success!',
                    description: `Report sent successfully.`,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top-right',
                })
                setReports(
                    reports.map((report) =>
                        report._id === reportId
                            ? { ...report, sent: true }
                            : report
                    )
                )
            }
        } catch (error) {
            console.error('Error sending report:', error)
            toast({
                title: 'Error!',
                description: `Error sending report`,
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setLoadingSend((prev) => ({ ...prev, [reportId]: false })) // Clear loading for specific report
        }
    }

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedReports([]) // Deselect all
        } else {
            setSelectedReports(reports.map((report) => report._id)) // Select all
        }
    }

    const isAllSelected =
        selectedReports.length === reports.length && reports.length > 0

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
                {reports.length === 0 ? (
                    <Add
                        img="/images/reports.png"
                        title="Add your first report"
                        paragraph="You can add your first report on this page"
                        button="Add report"
                        href="/dashboard/reports/add"
                    />
                ) : (
                    <div className="add-account">
                        <Navigation
                            mainTitle="Financial Reports"
                            href={'/dashboard/reports/add'}
                            save={'Add'}
                        />
                        <div className="item-list margin-inline-auto flex flex-column gap-20 font-poppins">
                            <div className="my-products-search">
                                {selectedReports.length > 0 && (
                                    <div className="products-edit-delete">
                                        <div className="products-selected">
                                            Selected {selectedReports.length}{' '}
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
                                <div className="nav-item flex gap-20">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                    <p>Report</p>
                                </div>
                                <div className="nav-item display-none">
                                    Created
                                </div>
                                <div className="nav-item display-none">
                                    Type
                                </div>
                                <div className="nav-item display-none">
                                    Title
                                </div>
                                <div className="nav-item">Email</div>
                                <div className="nav-item">Send to Email</div>
                            </div>
                            <div className="item-main flex flex-column">
                                {reports.map((report) => (
                                    <div
                                        key={report._id}
                                        className="item-main-element flex aic between"
                                    >
                                        <div className="main-item flex gap-20">
                                            <input
                                                type="checkbox"
                                                checked={selectedReports.includes(
                                                    report._id
                                                )}
                                                onChange={() =>
                                                    handleSelectReport(
                                                        report._id
                                                    )
                                                }
                                            />
                                            <p>{report.reportTitle}</p>
                                        </div>
                                        <div className="main-item display-none">
                                            {new Date(
                                                report.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className="main-item display-none">
                                            {report.reportType}
                                        </div>
                                        <div className="main-item display-none">
                                            {report.reportTitle}
                                        </div>
                                        <div className="main-item">
                                            {report.email}
                                        </div>
                                        <div className="main-item">
                                            {loadingSend[report._id] ? (
                                                <Spinner />
                                            ) : report.sent ? (
                                                <button
                                                    className="cursor-pointer disabled-btn already-sent"
                                                    disabled={true}
                                                >
                                                    Already Sent
                                                </button>
                                            ) : (
                                                <button
                                                    className="cursor-pointer disabled-btn"
                                                    onClick={() =>
                                                        handleSendReport(
                                                            report._id
                                                        )
                                                    }
                                                >
                                                    Send
                                                </button>
                                            )}
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
                    selectedItems={selectedReports}
                    options={reports}
                    endPointType="reports"
                    entityType="Reports"
                    updateEndpoint={`report/update`}
                    deleteEndpoint={'report/delete'}
                />
            </div>
        </div>
    )
}

export default Reports
