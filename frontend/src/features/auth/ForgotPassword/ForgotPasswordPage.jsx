import AuthHero from '../components/AuthHero';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
    return (
        <div className="flex min-h-screen bg-[#10002B]">
            <AuthHero
                title={<>Lost your way?<br />We've got you.</>}
                description="Don't worry, it happens to the best of us. Let's get you back into your Circle."
            />
            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPasswordPage;
