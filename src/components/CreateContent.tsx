import { useState } from "react"
import { useErrorHandler, handleApiError } from "../hooks/useErrorHandler"
import api from "../utils/axios"
import { isNotEmpty, isValidUrl } from "../utils/validation"

interface CreateContentProps {
    onSuccess: () => void;
}
interface ApiError {
    response?: {
      data?: {
        message?: string;
      } & Record<string, unknown>;
      status?: number;
    };
    request?: unknown;
    message?: string;
  }

export const CreateContent = ({ onSuccess }: CreateContentProps) => {
    const [content, setContent] = useState({
        title: "",
        link: "",
        type: "",
        tags: ""
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const options = ["Youtube", "Twitter", "Article", "Document"];
    const { addError } = useErrorHandler();
    const [formErrors, setFormErrors] = useState({
        title: "",
        link: "",
        type: ""
    });

    if (!token) {
        return <div className="text-red-500">Please login to create content</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        let isValid = true;
        const errors = {
            title: "",
            link: "",
            type: ""
        };

        if (!isNotEmpty(content.title)) {
            errors.title = "Title is required";
            isValid = false;
        }

        if (!isNotEmpty(content.link)) {
            errors.link = "Link is required";
            isValid = false;
        } else if (!isValidUrl(content.link)) {
            errors.link = "Please enter a valid URL starting with http:// or https://";
            isValid = false;
        }

        if (!isNotEmpty(content.type)) {
            errors.type = "Please select a content type";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const tagsArray = content.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            await api.post('/content', {
                ...content,
                tags: tagsArray
            });
            
            addError("Content created successfully!", "success");
            onSuccess();
            setContent({
                title: "",
                link: "",
                type: "",
                tags: ""
            });
        } catch (e) {
            handleApiError(e as ApiError, addError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={content.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.title ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="Enter content title"
                />
                {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                )}
            </div>

            <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
                    Link
                </label>
                <input
                    type="text"
                    id="link"
                    name="link"
                    value={content.link}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.link ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="https://..."
                />
                {formErrors.link && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.link}</p>
                )}
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                </label>
                <select
                    id="type"
                    name="type"
                    value={content.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.type ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                    <option value="">Select type</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                {formErrors.type && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.type}</p>
                )}
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                    Tags (comma separated)
                </label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={content.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="productivity, knowledge, notes"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
                {loading ? 'Creating...' : 'Create Content'}
            </button>
        </div>
    )
}