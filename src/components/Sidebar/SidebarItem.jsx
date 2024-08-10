import Link from 'next/link'

export default function SidebarItem({ icon, href, children, collapsed }) {
    return (
        <Link href={href || '#'} className="sidebar-item">
            <img className="sidebar-icon icon-margin" src={icon}></img>
            <div
                className={
                    collapsed
                        ? 'display-none transition'
                        : 'sidebar-text font-poppins transition'
                }
            >
                {children}
            </div>
        </Link>
    )
}
