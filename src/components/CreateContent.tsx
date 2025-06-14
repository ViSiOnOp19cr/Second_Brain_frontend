import { useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"

interface CreateContentProps {
    onSuccess: () => void;
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

    if (!token) {
        return <div className="text-red-500">Please login to create content</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setContent({ ...content, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        try {
            if (!content.title || !content.link || !content.type) {
                alert("Title, link and type are required");
                return;
            }
            setLoading(true);
            
            const tagsArray = content.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            await axios.post(BACKEND_URL + '/content', {
                ...content,
                tags: tagsArray
            }, {
                headers: {
                    Authorization: token
                }
            });
            
            onSuccess();
            setContent({
                title: "",
                link: "",
                type: "",
                tags: ""
            });
        } catch (e) {
            console.error(e);
            alert("Failed to create content");
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
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter content title"
                />
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
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://..."
                />
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
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                    <option value="">Select type</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
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