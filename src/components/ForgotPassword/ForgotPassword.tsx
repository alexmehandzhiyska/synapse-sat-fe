import { useState } from 'react';

import RequestCodeStep from './RequestCodeStep/RequestCodeStep';
import VerifyCodeStep from './VerifyCodeStep/VerifyCodeStep';
import NewPasswordStep from './NewPasswordStep/NewPasswordStep';

type Step = 'request' | 'verify' | 'reset' | 'success';

const ForgotPassword = () => {
    const [step, setStep] = useState<Step>('request');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const handleRequestSuccess = (submittedEmail: string) => {
        setEmail(submittedEmail);
        setStep('verify');
    };

    const handleVerifySuccess = (verifiedCode: string) => {
        setCode(verifiedCode);
        setStep('reset');
    };

    const handleResetSuccess = () => {
        setStep('success');
    };

    return (
        <section className="flex min-h-[calc(100vh-97px)] w-full items-center bg-white px-8 py-10 sm:px-10 lg:px-16 lg:py-12 xl:px-20">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.95fr] xl:gap-14">
                <div>
                    <div className="mb-4 inline-flex items-center rounded-4xl bg-blue-100 px-4 py-2">
                        <span className="mr-5 h-1.25 w-1.25 rounded-[50%] bg-blue-900"></span>
                        <p className="text-sm text-blue-900">Continue your smarter SAT prep</p>
                    </div>

                    <h1 className="mb-4 font-['Space_Grotesk'] text-3xl font-extrabold leading-tight text-[#13385A] xl:text-5xl">
                        Reset Your Password
                    </h1>

                    <p className="max-w-xl text-base font-medium leading-7 text-[#5A6B7B]">
                        We'll email you a verification code so you can get back into your account.
                    </p>
                </div>

                <div className="w-full max-w-150 justify-self-center rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_24px_70px_rgba(19,56,90,0.12)] sm:p-10 lg:justify-self-end xl:p-12">
                    <div className="mb-8">
                        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                            Forgot password
                        </p>
                        <h2 className="font-['Space_Grotesk'] text-3xl font-extrabold text-[#1b1b1f]">
                            Reset your password
                        </h2>
                    </div>

                    {step === 'request' && <RequestCodeStep onSuccess={handleRequestSuccess} />}
                    {step === 'verify' && <VerifyCodeStep email={email} onSuccess={handleVerifySuccess} />}
                    {step === 'reset' && <NewPasswordStep email={email} code={code} onSuccess={handleResetSuccess} />}
                    {step === 'success' && (
                        <p className="text-sm font-semibold text-[#5A6B7B]">
                            Your password has been reset. You can now{' '}
                            <a href="/login" className="font-extrabold text-[#2f61c9] hover:text-[#244fa8]">
                                log in
                            </a>{' '}
                            with your new password.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;