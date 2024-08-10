import { useRouter } from 'next/router'

export const Navigation = () => {
    const router = useRouter()
    return (
        <div className="navigation-container flex between margin-inline-auto">
            <div
                className="navigation-logo aic jcc flex font-poppins cursor-pointer text-center font-25 font-kalina"
                onClick={() => router.push('/')}
            >
                Finance Management
            </div>
            <div className="navigation-links aic jcc flex between gap-30">
                <div
                    className="font-poppins font-20 black text-bold cursor-pointer"
                    onClick={() => router.push('/login')}
                >
                    Login
                </div>
                <div
                    className="display-none font-poppins font-20 black text-bold cursor-pointer green-background"
                    onClick={() => router.push('/register')}
                >
                    Manage Your Finance
                </div>
            </div>
        </div>
    )
}
