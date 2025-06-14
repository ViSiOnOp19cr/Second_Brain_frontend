// this is the hook for fetching content from backend
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Tag {
    id: number;
    title: string;
}

interface ContentItem {
    id: number;
    title: string;
    type: string;
    link: string;
    createdAt?: string;
    tags: string[] | { tag: Tag }[]; 
}

export const useContent = () => {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const fetchContent = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login to view content');
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.get(BACKEND_URL + '/content', {
                headers: {
                    Authorization: token
                }
            });
            
             if (response.data.formatted && Array.isArray(response.data.formatted)) {
                setContent(response.data.formatted);
            }  
        } catch (e) {
            console.error('Error fetching content:', e);
            setError('Failed to fetch content');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchContent();
    }, []);
    
    return { content, loading, fetchContent, error };
};