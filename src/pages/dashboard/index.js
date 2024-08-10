import React, { useEffect, useState } from 'react'
import { Line, Pie } from 'react-chartjs-2'
import axios from 'axios'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { Spinner } from '@chakra-ui/react'
import PanelSidebar from '@/components/Sidebar/Sidebar'

const API_URL = process.env.API_URL

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

const AccountChart = ({ userName }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    })

    const [pieData, setPieData] = useState({
        labels: [],
        datasets: [],
    })

    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState('today')
    const [todaysTransactions, setTodaysTransactions] = useState([])

    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        return `rgba(${r}, ${g}, ${b}`
    }

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`
    }

    const getDateRange = (range) => {
        const now = new Date()
        let startDate = new Date()
        switch (range) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0))
                break
            case 'week':
                startDate.setDate(now.getDate() - now.getDay())
                startDate.setHours(0, 0, 0, 0)
                break
            case 'month':
                startDate.setDate(1)
                startDate.setHours(0, 0, 0, 0)
                break
            case 'year':
                startDate.setMonth(0, 1)
                startDate.setHours(0, 0, 0, 0)
                break
            default:
                break
        }
        return {
            startDate,
            endDate: new Date(),
        }
    }

    const fetchData = async () => {
        try {
            const { startDate, endDate } = getDateRange(dateRange)
            const response = await axios.get(
                `${API_URL}/transaction/sillyemill`,
                {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                    },
                }
            )
            const transactions = response.data.data

            const accountData = {}
            const transactionTypeCounts = {}

            transactions.forEach((transaction) => {
                const accountName = transaction.account.name
                const transactionType = transaction.transactionType

                if (!accountData[accountName]) {
                    accountData[accountName] = {
                        labels: [],
                        data: [],
                        balance: transaction.account.balance,
                    }
                }

                let updatedBalance = accountData[accountName].balance
                if (
                    transaction.transactionType === 'Payment' ||
                    transaction.transactionType === 'Withdrawal' ||
                    transaction.transactionType === 'Transfer'
                ) {
                    updatedBalance -= transaction.amount
                } else if (
                    transaction.transactionType === 'Deposit' ||
                    transaction.transactionType === 'Refund'
                ) {
                    updatedBalance += transaction.amount
                }

                accountData[accountName].balance = updatedBalance
                accountData[accountName].labels.push(
                    formatDateTime(transaction.date)
                )
                accountData[accountName].data.push(updatedBalance)

                if (!transactionTypeCounts[transactionType]) {
                    transactionTypeCounts[transactionType] = 0
                }
                transactionTypeCounts[transactionType] += 1
            })

            const datasets = Object.keys(accountData).map((accountName) => {
                const borderColor = generateRandomColor() + ', 1)'
                const backgroundColor = generateRandomColor() + ', 0.5)'

                return {
                    label: accountName,
                    data: accountData[accountName].data,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: borderColor,
                }
            })

            setChartData({
                labels: Object.values(accountData)[0]?.labels || [],
                datasets: datasets,
            })

            const pieLabels = Object.keys(transactionTypeCounts)
            const pieValues = Object.values(transactionTypeCounts)
            const pieColors = pieLabels.map(
                () => generateRandomColor() + ', 0.8)'
            )

            setPieData({
                labels: pieLabels,
                datasets: [
                    {
                        data: pieValues,
                        backgroundColor: pieColors,
                    },
                ],
            })

            const todaysTransactions = transactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date)
                const today = new Date()
                return (
                    transactionDate.getDate() === today.getDate() &&
                    transactionDate.getMonth() === today.getMonth() &&
                    transactionDate.getFullYear() === today.getFullYear()
                )
            })

            setTodaysTransactions(todaysTransactions)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching transaction data:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [userName, dateRange])

    if (loading) {
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
        <div className="gird-white">
            <PanelSidebar />
            <div className="charts-area">
                <div className="my-products-navigation">
                    <div className="my-products-first">
                        <button className="manage">Manage</button>
                    </div>
                    <div className="my-products-second">
                        <button
                            className="date-button"
                            onClick={() => setDateRange('today')}
                        >
                            Today
                        </button>
                        <button
                            className="date-button"
                            onClick={() => setDateRange('week')}
                        >
                            This Week
                        </button>
                        <button
                            className="date-button"
                            onClick={() => setDateRange('month')}
                        >
                            This Month
                        </button>
                        <button
                            className="date-button"
                            onClick={() => setDateRange('year')}
                        >
                            This Year
                        </button>
                    </div>
                </div>

                <div className="charts-container">
                    <div className="line">
                        <h2>Account Balances Over Time</h2>
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                layout: {
                                    padding: {
                                        top: 10,
                                        bottom: 10,
                                    },
                                },
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            usePointStyle: true,
                                            pointStyle: 'circle',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="pie-container">
                        <div className="pie">
                            <h2>Transaction Types Distribution</h2>
                            <Pie
                                data={pieData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div className="transactions-based-time">
                            <h2>Today's Transactions</h2>
                            <div className="ts-nav">
                                <div className="ts-tab">Account</div>
                                <div className="ts-tab">Type</div>
                                <div className="ts-tab">Amount</div>
                            </div>
                            <div className="ts-main">
                                {todaysTransactions.length > 0 ? (
                                    todaysTransactions.map(
                                        (transaction, index) => (
                                            <div key={index} className="ts-row">
                                                <div className="ts-cell">
                                                    {transaction.account.name}
                                                </div>
                                                <div className="ts-cell">
                                                    {
                                                        transaction.transactionType
                                                    }
                                                </div>
                                                <div
                                                    className={
                                                        transaction.transactionType ==
                                                            'Withdrawal' ||
                                                        transaction.transactionType ==
                                                            'Payment' ||
                                                        transaction.transactionType ==
                                                            'Transfer'
                                                            ? 'lost'
                                                            : 'gained'
                                                    }
                                                >
                                                    $
                                                    {transaction.amount.toFixed(
                                                        2
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="no-data">
                                        No transactions today
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountChart
