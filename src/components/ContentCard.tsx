import { Twitter } from "../assets/twitter";
import { Video } from "../assets/video";
import { Article } from "../assets/Article";
import { Document } from "../assets/document";
import { ShareIcon } from "../assets/Shareicon";
import { Delete } from "../assets/delete";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useState } from "react";
import api from "../utils/axios";

interface ContentCardProps {
    id: number;
    title: string;
    type: string;
    link: string;
    tags: { title: string }[];
    createdAt: string;
    onDelete?: (id: number) => void;
}

export const ContentCard = ({ id, title, type, link, tags, createdAt, onDelete }: ContentCardProps) => {
    const { addError } = useErrorHandler();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const getIcon = () => {
        switch(type.toLowerCase()) {
            case 'youtube':
                return <Video />;
            case 'twitter':
                return <Twitter />;
            case 'article':
                return <Article />;
            case 'document':
                return <Document />;
            default:
                return <Article />;
        }
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const created = new Date(date);
        const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    };
    

    const handleShare = async () => {
        try {
            await navigator.share({
                title: title,
                url: link
            });
            addError("Link shared successfully!", "success");
        } catch (err) {
            try {
                await navigator.clipboard.writeText(link);
                addError("Link copied to clipboard!", "success");
            } catch (clipboardErr) {
                console.error('Error copying to clipboard:', clipboardErr);
                addError("Couldn't copy link to clipboard", "error");
            }
            console.error('Error sharing:', err);
        }
    };

    const handleCardClick = () => {
        window.open(link, '_blank');
    };
    
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await api.delete(`/content/${id}`);
            addError('Content deleted successfully', 'success');
            if (onDelete) {
                onDelete(id);
            }
        } catch (error) {
            console.error('Error deleting content:', error);
            addError('Failed to delete content', 'error');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    const getTypeColor = () => {
        switch(type.toLowerCase()) {
            case 'youtube':
                return 'from-red-500 to-red-700';
            case 'twitter':
                return 'from-blue-400 to-blue-600';
            case 'article':
                return 'from-green-500 to-green-700';
            case 'document':
                return 'from-purple-500 to-purple-700';
            default:
                return 'from-gray-500 to-gray-700';
        }
    };

    return (
        <div 
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] cursor-pointer border border-gray-700 group"
            onClick={handleCardClick}
        >
            {/* Gradient accent bar at the top */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${getTypeColor()}`}></div>
            
            <div className="p-4 sm:p-5">
                {/* Content type and time */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span className={`text-${type.toLowerCase() === 'youtube' ? 'red' : type.toLowerCase() === 'twitter' ? 'blue' : type.toLowerCase() === 'article' ? 'green' : 'purple'}-500`}>
                            {getIcon()}
                        </span>
                        <span className="font-medium">{type}</span>
                    </div>
                    <span className="text-xs text-gray-500">{getTimeAgo(createdAt)}</span>
                </div>

                {/* Title */}
                <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4 line-clamp-2 hover:text-purple-400 transition-colors">
                    {title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span 
                            key={index}
                            className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600 transition-colors"
                        >
                            {tag.title}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                            +{tags.length - 3} more
                        </span>
                    )}
                </div>

                {/* Link preview */}
                <div className="text-xs text-gray-500 truncate mb-4">
                    {link}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-2">
                    {showConfirm ? (
                        <div className="flex items-center space-x-2 bg-gray-700 p-1 rounded-lg">
                            <span className="text-xs text-gray-300">Delete?</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="text-green-500 hover:text-green-400 p-1 rounded-full hover:bg-gray-600 transition-all duration-200"
                                disabled={isDeleting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConfirm(false);
                                }}
                                className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-gray-600 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConfirm(true);
                                }}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-700 transition-all duration-200"
                                aria-label="Delete"
                            >
                                <Delete />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare();
                                }}
                                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-200"
                                aria-label="Share"
                            >
                                <ShareIcon size="md" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}; 