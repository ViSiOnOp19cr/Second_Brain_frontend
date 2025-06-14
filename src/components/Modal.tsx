import { type ReactNode } from "react";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            
            
            <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md z-10">

                {title && (
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                

                {children}
            </div>
        </div>
    );
}; 