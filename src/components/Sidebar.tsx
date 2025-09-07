import { Sidebaritem } from "./Sidebaritems";
import { Twitter } from "../assets/twitter";
import { Video } from "../assets/video";
import { Brainicon } from "../assets/brain";
import { Article } from "../assets/Article";
import { Home } from "../assets/home";
import { Plusicon } from "../assets/Plusicon";
import { Document } from "../assets/document";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    onAddNew: () => void;
    onFilterChange: (filter: string) => void;
    currentFilter: string;
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
}

export function Sidebar({ onAddNew, onFilterChange, currentFilter, isMobileOpen, onCloseMobile }: SidebarProps) {
    const navigate = useNavigate();
    
    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <div className={`h-screen bg-gray-800 border-r border-gray-700 fixed top-0 flex flex-col z-30 transition-all duration-300 ease-in-out ${isMobileOpen ? 'left-0 w-full sm:w-64' : '-left-full sm:left-0 sm:w-64'}`}>
            <div className="p-6">
                <div className="flex items-center justify-between text-xl font-semibold text-white mb-8">
                    <div className="flex items-center gap-3">
                        <div className="text-purple-500">
                            <Brainicon/>
                        </div>
                        SecondBrain
                    </div>
                    <button 
                        onClick={onCloseMobile} 
                        className="text-gray-400 hover:text-white sm:hidden"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="space-y-2">
                    <Sidebaritem 
                        text="All Links" 
                        icon={<Home/>} 
                        onClick={() => {
                            onFilterChange('all');
                            if (onCloseMobile) onCloseMobile();
                        }}
                        isActive={currentFilter === 'all'}
                    />
                </div>

                <div className="mt-8 space-y-2">
                    <h3 className="text-gray-400 text-sm font-medium mb-3">Types</h3>
                    <Sidebaritem 
                        text="YouTube" 
                        icon={<Video/>} 
                        onClick={() => {
                            onFilterChange('youtube');
                            if (onCloseMobile) onCloseMobile();
                        }}
                        isActive={currentFilter === 'youtube'}
                    />
                    <Sidebaritem 
                        text="Twitter/X" 
                        icon={<Twitter/>} 
                        onClick={() => {
                            onFilterChange('twitter');
                            if (onCloseMobile) onCloseMobile();
                        }}
                        isActive={currentFilter === 'twitter'}
                    />
                    <Sidebaritem 
                        text="Articles" 
                        icon={<Article/>} 
                        onClick={() => {
                            onFilterChange('article');
                            if (onCloseMobile) onCloseMobile();
                        }}
                        isActive={currentFilter === 'article'}
                    />
                    <Sidebaritem 
                        text="Document"
                        icon={<Document/>}
                        onClick={() => {
                            onFilterChange('document');
                            if (onCloseMobile) onCloseMobile();
                        }}
                        isActive={currentFilter === 'document'}
                    />
                </div>

                <button
                    onClick={() => {
                        onAddNew();
                        if (onCloseMobile) onCloseMobile();
                    }}
                    className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <Plusicon />
                    Add New Link
                </button>
            </div>

            
            <div className="mt-auto p-6 border-t border-gray-700">
                <button
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}