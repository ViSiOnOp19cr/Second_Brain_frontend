// this is the hook for fetching content from backend
import { useState, useEffect } from "react";
import api from "../utils/axios";
import { useErrorHandler, handleApiError } from "./useErrorHandler";

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
    const { addError } = useErrorHandler();
    
    const fetchContent = async () => {
        if (!localStorage.getItem('token')) {
            setError('Please login to view content');
            addError('Authentication required. Please login.', 'warning');
            return;
        }
        
        try {
            setLoading(true);
            const response = await api.get('/content');
            
            if (response.data.data && Array.isArray(response.data.data)) {
                setContent(response.data.data);
            } else if (response.data.formatted && Array.isArray(response.data.formatted)) {
                // For backward compatibility
                setContent(response.data.formatted);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (e) {
            handleApiError(e, addError);
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