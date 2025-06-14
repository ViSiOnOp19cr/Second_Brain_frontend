import { Twitter } from "../assets/twitter";
import { Video } from "../assets/video";
import { Article } from "../assets/Article";
import { Document } from "../assets/document";
import { ShareIcon } from "../assets/Shareicon";
import { useState } from "react";

interface ContentCardProps {
    title: string;
    type: string;
    link: string;
    tags: { title: string }[];
    createdAt: string;
}

export const ContentCard = ({ title, type, link, tags, createdAt }: ContentCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    
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
    const handleCardClick = () => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: title,
                url: link
            });
        } catch (err) {
            navigator.clipboard.writeText(link);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div 
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-200 cursor-pointer relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >

            <button
                onClick={handleShare}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-700 rounded-lg"
            >
                <ShareIcon />
            </button>

            
            <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
                <span className="text-red-500">
                    {getIcon()}
                </span>
                <span>{getTimeAgo(createdAt)}</span>
            </div>

            
            <h3 className="text-white font-medium text-lg mb-3 line-clamp-2">
                {title}
            </h3>

            
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span 
                        key={index}
                        className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                    >
                        {tag.title}
                    </span>
                ))}
            </div>
        </div>
    );
}; 