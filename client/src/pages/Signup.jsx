import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import bgImage from '../assets/drone_bg.png';
import LanguageSelector from '../components/LanguageSelector';

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: 'Male',
        field_size: '',
        location: '',
        role: 'farmer'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Location autocomplete states
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const locationTimeoutRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Trigger location search when typing in location field
        if (name === 'location') {
            handleLocationSearch(value);
        }
    };

    const handleLocationSearch = (query) => {
        // Clear previous timeout
        if (locationTimeoutRef.current) {
            clearTimeout(locationTimeoutRef.current);
        }

        if (query.length < 3) {
            setLocationSuggestions([]);
            setShowLocationDropdown(false);
            return;
        }

        setLocationLoading(true);

        // Debounce the API call
        locationTimeoutRef.current = setTimeout(async () => {
            try {
                // Using Nominatim API (OpenStreetMap's free geocoding service)
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: query,
                        format: 'json',
                        addressdetails: 1,
                        limit: 5,
                        countrycodes: 'in' // Restrict to India for agriculture context
                    },
                    headers: {
                        'User-Agent': 'SmartAgriDashboard/1.0'
                    }
                });

                const suggestions = response.data.map(item => ({
                    display_name: item.display_name,
                    lat: item.lat,
                    lon: item.lon,
                    address: item.address
                }));

                setLocationSuggestions(suggestions);
                setShowLocationDropdown(suggestions.length > 0);
                setLocationLoading(false);
            } catch (err) {
                console.error('Location search error:', err);
                setLocationLoading(false);
            }
        }, 500); // 500ms debounce
    };

    const handleLocationSelect = (suggestion) => {
        setFormData({ ...formData, location: suggestion.display_name });
        setShowLocationDropdown(false);
        setLocationSuggestions([]);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:3000/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
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

            {/* Right Side - Signup Content (Full Height) */}
            <div className="w-full md:w-1/2 h-screen flex items-center justify-center relative overflow-y-auto bg-white">

                {/* Signup Card */}
                <div className="w-full max-w-3xl bg-white rounded-[30px] p-8 md:p-12 mx-auto relative">

                    {/* Top Navigation */}
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
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

                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500 text-lg">Join our Smart Agriculture community today</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input
                                name="full_name"
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                required
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                name="phone"
                                type="text"
                                placeholder="Phone Number"
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                required
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Location Input with Autocomplete */}
                        <div className="relative">
                            <input
                                name="location"
                                type="text"
                                placeholder="Location (e.g., Guntur, Andhra Pradesh)"
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                value={formData.location}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            {locationLoading && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                </div>
                            )}

                            {/* Autocomplete Dropdown */}
                            {showLocationDropdown && locationSuggestions.length > 0 && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {locationSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleLocationSelect(suggestion)}
                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex items-start space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">{suggestion.display_name}</p>
                                                    {suggestion.address && (
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {suggestion.address.state || suggestion.address.county || ''}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Gender Radio */}
                        <div className="flex items-center space-x-8 mt-4 pl-2">
                            <span className="text-gray-500 font-medium">Gender:</span>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-700 transition">Male</span>
                            </label>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-700 transition">Female</span>
                            </label>
                        </div>

                        {/* Field Size Input */}
                        {formData.role === 'farmer' && (
                            <div className="mt-4">
                                <label className="block text-gray-500 font-medium mb-2 pl-2">
                                    How many acres of field do you have?
                                </label>
                                <input
                                    name="field_size"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="e.g. 5.5"
                                    required={formData.role === 'farmer'}
                                    className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 transition-colors text-lg"
                                    value={formData.field_size}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-5 rounded-xl shadow-xl shadow-blue-500/20 transform transition hover:scale-[1.01] text-xl"
                            >
                                {loading ? 'Registering...' : 'Register Now'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-base">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                                    Login Here
                                </Link>
                            </p>
                        </div>

                        <div className="mt-8 text-center text-sm text-gray-300">
                            © 2024 Smart Agri Dashboard. All rights reserved.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
