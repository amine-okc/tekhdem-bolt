const PrimaryButton = ({ children, onClick, disabled, type = "button", className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-4 py-2 
                bg-primary-500
                hover:bg-primary-600
                dark:bg-dark-primary-700
                dark:hover:bg-primary-800
                text-white 
                font-semibold 
                rounded-lg 
                transition-colors 
                duration-200
                disabled:opacity-50 
                disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;