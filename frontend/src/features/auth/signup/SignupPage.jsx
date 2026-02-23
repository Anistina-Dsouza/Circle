import AuthHero from '../components/AuthHero';
import SignupForm from './components/SignupForm';

const SignupPage = () => {
    return (
        <div className="flex min-h-screen bg-[#0a0118]">
            <AuthHero
                title={<>Reconnect with<br />what matters.</>}
                description="Join the time-based social network built for meaningful connections and mindful digital spaces."
            />
            <SignupForm />
        </div>
    );
};

export default SignupPage;
