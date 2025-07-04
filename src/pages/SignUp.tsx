import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const SignUp = () => {
    const [form, setForm] = useState({
        username: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!form.username || !form.password) {
            alert("Both fields are required");
            return;
        }
        
        setIsLoading(true);
        try {
            await axios.post(BACKEND_URL + '/signup', {
                username: form.username,
                password: form.password
            })
            navigate('/signin');
        } catch (error) {
            alert("signup failed try again");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome to Second Brain
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Create your account to get started
                    </p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-white">
                                Email Address
                            </label>
                            <input
                                id="username"
                                type="email"
                                placeholder="Enter your email"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-white">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !form.username || !form.password}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate('/signin')}
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}