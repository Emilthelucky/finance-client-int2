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

            // Group transactions by account and sort by date
            const accountData = {}
            const transactionTypeCounts = {}

            transactions.sort((a, b) => new Date(a.date) - new Date(b.date))

            transactions.forEach((transaction) => {
                const accountName = transaction.account.name
                const transactionType = transaction.transactionType
                const transactionDate = formatDateTime(transaction.date)

                if (!accountData[accountName]) {
                    // Ensure createdAt is a valid date before formatting
                    const accountCreatedAt = new Date(
                        transaction.account.createdAt
                    )
                    const formattedCreatedAt = isNaN(accountCreatedAt.getTime())
                        ? 'Unknown Date'
                        : formatDateTime(accountCreatedAt)

                    // Initialize account data with initial balance
                    accountData[accountName] = {
                        labels: [formattedCreatedAt],
                        data: [
                            transaction.account.initialBalance ||
                                transaction.account.balance ||
                                0,
                        ],
                    }
                }

                // Update balance based on transaction type
                let updatedBalance =
                    accountData[accountName].data[
                        accountData[accountName].data.length - 1
                    ]

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

                // Check if the date already exists in the labels
                if (accountData[accountName].labels.includes(transactionDate)) {
                    // Update the balance for the existing date
                    const index =
                        accountData[accountName].labels.indexOf(transactionDate)
                    accountData[accountName].data[index] = updatedBalance
                } else {
                    // Add new data point for the updated balance
                    accountData[accountName].labels.push(transactionDate)
                    accountData[accountName].data.push(updatedBalance)
                }

                // Handle transaction type counts for pie chart
                if (!transactionTypeCounts[transaction.transactionType]) {
                    transactionTypeCounts[transaction.transactionType] = 0
                }
                transactionTypeCounts[transaction.transactionType] += 1
            })

            // Synchronize labels across all accounts
            const allDates = new Set()
            Object.values(accountData).forEach((account) => {
                account.labels.forEach((date) => allDates.add(date))
            })
            const sortedDates = Array.from(allDates).sort(
                (a, b) => new Date(a) - new Date(b)
            )

            Object.keys(accountData).forEach((accountName) => {
                const account = accountData[accountName]
                let lastBalance = account.data[0]

                sortedDates.forEach((date) => {
                    if (!account.labels.includes(date)) {
                        account.labels.push(date)
                        account.data.push(lastBalance)
                    } else {
                        lastBalance = account.data[account.labels.indexOf(date)]
                    }
                })

                account.labels.sort((a, b) => new Date(a) - new Date(b))
                account.data = account.labels.map(
                    (label) => account.data[account.labels.indexOf(label)]
                )
            })

            // Prepare datasets for line chart
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
                labels: sortedDates,
                datasets: datasets,
            })

            // Prepare data for pie chart
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

            // Filter today's transactions
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
