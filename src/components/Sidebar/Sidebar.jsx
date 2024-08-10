import { useState, useEffect } from 'react'
import SidebarItem from './SidebarItem'
import SidebarUser from './SidebarUser'

export default function PanelSidebar() {
    const [collapsed, setCollapsed] = useState(false)

    // Automatically collapse the sidebar when the window width is 550px or less
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 550) {
                setCollapsed(true)
            } else {
                setCollapsed(false)
            }
        }

        // Initial check
        handleResize()

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Cleanup event listener on unmount
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="grid">
            <div
                className={
                    collapsed
                        ? 'sidebar-collapsed transition'
                        : 'sidebar transition'
                }
            >
                <div className="sidebar-top">
                    <div className="logo-area">
                        <div
                            className={
                                collapsed
                                    ? 'display-none transition'
                                    : 'logo-sidebar font-kalina font-30 transition'
                            }
                        >
                            Finance
                        </div>
                        <div
                            className={
                                collapsed
                                    ? 'icon-margin cursor-pointer transition'
                                    : 'sidebar-expanse cursor-pointer transition'
                            }
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {!collapsed ? (
                                <img
                                    className="sidebar-top-icon"
                                    src="/icons/open-close.png"
                                ></img>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="sidebar-area">
                    <div className="sidebar-items">
                        <SidebarItem
                            icon={'/icons/home.png'}
                            href="/dashboard"
                            collapsed={collapsed}
                        >
                            Manage
                        </SidebarItem>

                        <SidebarItem
                            icon={'/icons/accounts.png'}
                            href="/dashboard/accounts"
                            collapsed={collapsed}
                        >
                            Accounts
                        </SidebarItem>

                        <SidebarItem
                            icon={'/icons/transactions.png'}
                            href="/dashboard/transactions"
                            collapsed={collapsed}
                        >
                            Transactions
                        </SidebarItem>

                        <SidebarItem
                            icon={'/icons/reports.png'}
                            href="/dashboard/reports"
                            collapsed={collapsed}
                        >
                            Reports
                        </SidebarItem>
                    </div>
                </div>
                <div className="sidebar-bottom">
                    <SidebarItem
                        icon={'/icons/settings.png'}
                        collapsed={collapsed}
                        href="/dashboard/settings"
                    >
                        Ayarlar
                    </SidebarItem>
                    <hr className="sidedbar-line"></hr>
                    <SidebarUser collapsed={collapsed} />
                </div>
            </div>
        </div>
    )
}
