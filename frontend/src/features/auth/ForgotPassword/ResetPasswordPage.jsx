import AuthHero from '../components/AuthHero';
import ResetPasswordForm from './components/ResetPasswordForm';

const ResetPasswordPage = () => {
    return (
        <div className="flex min-h-screen bg-[#10002B]">
            <AuthHero
                title={<>A new<br />beginning.</>}
                description="Your security is our priority. Enter a strong new password to re-secure your Circle account."
            />
            <ResetPasswordForm />
        </div>
    );
};

export default ResetPasswordPage;
