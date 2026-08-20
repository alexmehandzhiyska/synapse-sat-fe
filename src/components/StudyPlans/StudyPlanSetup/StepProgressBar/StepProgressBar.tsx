type StepProgressBarProps = {
    currentStep: number;
    totalSteps: number;
};

const StepProgressBar = ({ currentStep, totalSteps }: StepProgressBarProps) => {
    return (
        <div className="flex flex-1 gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                        index < currentStep ? 'bg-[#2f61c9]' : 'bg-gray-100'
                    }`}
                />
            ))}
        </div>
    );
};

export default StepProgressBar;