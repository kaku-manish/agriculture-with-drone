import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import bgImage from '../assets/drone_bg.png';
import LanguageSelector from '../components/LanguageSelector';

const Login = () => {
    // Removed specific role state, defaulting to generic login
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send only username and password, let backend determine role
            const res = await axios.post('http://localhost:3000/auth/login', {
                ...formData
            });

            const user = res.data.user;

            // Save user to local storage
            localStorage.setItem('user', JSON.stringify(user));

            // Dynamic redirect based on the role returned from backend
            if (user.role === 'admin') {
                navigate('/dashboard?role=admin');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex overflow-hidden font-sans bg-[#f8f9fc]">

            {/* Left Side - Image (Full Height) */}
            <div className="hidden md:block w-1/2 h-screen relative">
                <img
                    src={bgImage}
                    alt="Farm"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center p-8">
                    <h1 className="text-6xl font-bold text-white tracking-wide drop-shadow-lg leading-tight">
                        Smart Agri Dashboard
                    </h1>
                </div>
            </div>

            {/* Right Side - Login Content (Full Height) */}
            <div className="w-full md:w-1/2 h-screen flex items-center justify-center relative overflow-y-auto bg-white">

                {/* Login Card (Floating effect within the right side) */}
                <div className="w-full max-w-3xl bg-white rounded-[30px] p-12 mx-auto relative">

                    {/* Top Navigation */}
                    <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-4">
                        <div className="flex items-center space-x-8 text-lg font-medium text-gray-500 whitespace-nowrap">
                            <Link to="/about" className="hover:text-blue-600 transition">About Us</Link>
                        </div>

                        {/* Language Dropdown Area */}
                        <div className="flex items-center ml-8 shrink-0">
                            <div className="scale-100 origin-right">
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>

                    {/* Login Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">Sign In</h2>
                        <p className="text-gray-500 text-lg">Login to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Username Field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full pl-14 pr-6 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full pl-14 pr-6 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link to="#" className="text-base text-blue-600 font-semibold hover:text-blue-800">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-5 rounded-xl shadow-xl shadow-blue-500/20 transform transition hover:scale-[1.01] text-xl"
                            >
                                {loading ? 'Signing in...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-base">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                                Register Here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-12 text-center text-sm text-gray-300">
                        © 2024 Smart Agri Dashboard. All rights reserved.
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
