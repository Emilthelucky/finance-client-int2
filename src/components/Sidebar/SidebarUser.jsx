import { useContext } from 'react'
import { AuthContext } from '@/pages/_app'

export default function SidebarUser({ collapsed }) {
    const { user } = useContext(AuthContext)

    return (
        <div className="sidebar-user">
            <img
                src="/icons/profile.png"
                className={
                    collapsed
                        ? 'sidebar-icon icon-margin transition'
                        : 'sidebar-icon transition'
                }
            ></img>
            <div
                className={
                    collapsed
                        ? 'display-none transition'
                        : 'sidebar-user-area transition'
                }
            >
                <div className="sidebar-text font-poppins">
                    {user?.username}
                </div>
                <div className="sidebar-text font-13 text-muted font-poppins">
                    {user?.email}
                </div>
            </div>
        </div>
    )
}
