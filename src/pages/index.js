import { Navigation } from '@/components/Navigation/Navigation'
import { useRouter } from 'next/router'

const Home = () => {
    const router = useRouter()

    return (
        <div className="area">
            <Navigation />
            <div className="home-container flex aic jcc gap-30 flex-column">
                <div className="home-title-container flex flex-column">
                    <p className="home-title font-50 font-poppins text-center text-bolder">
                        Manage Your
                    </p>
                    <p className="home-title font-50 font-poppins text-center text-bolder">
                        Finance Right Now
                    </p>
                </div>
                <div className="home-paragraph-container flex aic jcc">
                    <p className="home-paragraph text-center font-poppins font-20">
                        You can manage your financial account as you wish
                        without any limits{' '}
                    </p>
                </div>
                <button
                    className="home-create-account-button text-bold font-poppins cursor-pointer"
                    onClick={() => router.push('/register')}
                >
                    Create Trial Account
                </button>
            </div>
        </div>
    )
}

export default Home
