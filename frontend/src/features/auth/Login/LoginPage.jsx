import AuthHero from '../components/AuthHero';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
    return (
        <div className="flex min-h-screen bg-[#10002B]">
            <AuthHero
                title={<>Welcome back to<br />your Circle.</>}
                description="Pick up where you left off. Connect, share, and grow with your community."
            />
            <LoginForm />
        </div>
    );
};

export default LoginPage;
