import { useState } from 'react';
import axios from 'axios';

const AdminDroneAnalysis = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [reportSent, setReportSent] = useState(false);

    // Simulate Bluetooth Connection Success
    const handleConnectDrone = () => {
        setIsConnecting(true);

        // Simulate a 2-second handshake
        setTimeout(() => {
            setIsConnecting(false);
            setIsConnected(true);
        }, 2000);
    };

    const handleGenerateReport = async () => {
        setGeneratingPdf(true);
        try {
            await axios.post('http://localhost:3000/reports/create', {
                farm_id: 1, // Default/Mock ID or pass as prop
                title: `Drone Analysis Report - ${new Date().toLocaleDateString()}`,
                type: 'pdf'
            });
            setReportSent(true);
            setTimeout(() => setReportSent(false), 3000); // Reset after 3s
        } catch (err) {
            console.error("Failed to generate report", err);
            alert("Failed to send report");
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="space-y-6 min-h-[80vh]">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Live Drone Analysis</h2>
                        <p className="text-sm text-gray-500">Real-time agricultural intelligence via Bluetooth link</p>
                    </div>
                </div>

                {/* Connection Portal */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in h-[60vh]">
                    <div className="relative">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-all duration-500 ${isConnecting ? 'bg-blue-50 animate-pulse scale-110' : 'bg-gray-50'}`}>
                            {isConnecting ? '📡' : '🛸'}
                        </div>
                        {isConnecting && (
                            <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="max-w-md space-y-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                            {isConnecting ? 'Establishing Uplink...' : 'Ready for Connection'}
                        </h3>
                        <p className="text-gray-500 italic">
                            {isConnecting ? 'Syncing telemetry and imaging data...' : 'Switch on your drone and click the button below to establish a live data link.'}
                        </p>
                    </div>

                    <button
                        onClick={handleConnectDrone}
                        disabled={isConnecting}
                        className={`group relative flex items-center space-x-3 px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg ${isConnecting ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 shadow-blue-500/25'
                            }`}
                    >
                        <span className="text-xl">{isConnecting ? '🔍' : '🛰️'}</span>
                        <span>{isConnecting ? 'Scanning...' : 'Connect Drone via Bluetooth'}</span>
                    </button>

                    <div className="flex items-center space-x-6 pt-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] opacity-50">
                        <span className="flex items-center"><span className="w-2 h-2 bg-gray-200 rounded-full mr-2"></span> No GPS Signal</span>
                        <span className="flex items-center"><span className="w-2 h-2 bg-gray-200 rounded-full mr-2"></span> BT Ready</span>
                    </div>
                </div>
            </div>
        );
    }

    // Connected View - The Dashboard
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Drone Analysis Overview</h2>
                <button
                    onClick={() => setIsConnected(false)}
                    className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors uppercase tracking-widest"
                >
                    Disconnect
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="space-y-6">
                    {/* Drone Mission Card */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-white/50">
                        <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center uppercase tracking-widest">
                            <span className="text-lg mr-2">🚁</span> Drone Mission
                        </h3>

                        <div className="space-y-4 text-sm">
                            <MissionItem icon="🛸" label="Model" value="DJI AGRAS T10" />
                            <MissionItem icon="📅" label="Date" value="28 April 2024" />
                            <MissionItem icon="⛳" label="Area Covered" value="3 Acres" />
                            <MissionItem icon="⏱️" label="Flight Duration" value="25 min" />
                            <MissionItem icon="🛫" label="Starting Time" value="4:30 PM" />
                            <MissionItem icon="🛬" label="Ending Time" value="4:55 PM" />
                        </div>
                    </div>

                    {/* Likely Causes Card */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-green-500/5 border border-white/50 relative overflow-hidden">
                        <h3 className="text-sm font-bold text-green-700 mb-6 flex items-center uppercase tracking-widest">
                            <span className="text-lg mr-2">⚠️</span> Likely Causes
                        </h3>

                        <div className="space-y-3 mb-8">
                            <CauseItem text="Waterlogged soil" />
                            <CauseItem text="Stem borer infestation" />
                            <CauseItem text="Poor drainage in field" />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleGenerateReport}
                                disabled={generatingPdf || reportSent}
                                className={`flex items-center text-xs font-bold px-4 py-2 rounded-full transition-all uppercase tracking-wider ${reportSent
                                        ? 'bg-green-100 text-green-600 cursor-default'
                                        : 'text-red-400 bg-red-50 hover:bg-red-100'
                                    }`}
                            >
                                {generatingPdf ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Generating...
                                    </>
                                ) : reportSent ? (
                                    <>
                                        <span className="mr-1">✓</span> Sent to User
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-1">📄</span> Convert to PDF &gt;
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Spans 2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Detected Disease Card */}
                    <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-[2rem] shadow-xl shadow-pink-500/5 border border-white relative overflow-hidden">
                        {/* Background Image Effect */}
                        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none">
                            <img src="/placeholder-crop.jpg" className="w-full h-full object-cover mask-image-gradient" alt="" />
                        </div>

                        <h3 className="text-sm font-black text-pink-600 mb-2 flex items-center uppercase tracking-widest relative z-10">
                            <span className="text-lg mr-2">🦠</span> AI Detected Disease
                        </h3>

                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">YOLOV8-BASED AI Analysis</p>

                        <div className="flex flex-col md:flex-row gap-8 relative z-10">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-6">
                                    <span className="text-3xl text-pink-500">🛡️</span>
                                    <span className="text-4xl font-black text-slate-800 tracking-tight">Dead Heart</span>
                                </div>

                                <div className="bg-white/80 p-5 rounded-2xl border border-pink-100 shadow-sm backdrop-blur-sm mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Confidence 98.9%</span>
                                        <span className="bg-gradient-to-r from-red-400 to-pink-500 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg shadow-pink-500/30 uppercase tracking-widest">HIGH</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-50 mr-1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">SEVERITY : <span className="text-red-600">HIGH</span></span>
                                </div>
                            </div>

                            {/* Visual Representation (Mock) */}
                            <div className="w-full md:w-64 h-32 md:h-auto rounded-2xl overflow-hidden shadow-lg border-2 border-white relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1625246333195-af92c30623d5?q=80&w=1000&auto=format&fit=crop"
                                    alt="Field Analysis"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay spots simulating detection */}
                                <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-red-500/40 rounded-full blur-md animate-pulse"></div>
                                <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-red-500/40 rounded-full blur-md animate-pulse delay-75"></div>

                                <button className="absolute bottom-3 right-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-lg shadow-emerald-600/20 transition-all uppercase tracking-wide">
                                    Generate PDF Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Action & Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Recommended Action */}
                        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-white/50">
                            <h3 className="text-sm font-bold text-blue-700 mb-6 flex items-center uppercase tracking-widest">
                                <span className="text-lg mr-2">📋</span> Recommended Action
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-0.5">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Apply Chlorantraniliprole 18.5% SC <span className="text-slate-400 font-medium">(Dosage: 150ml/acre)</span></p>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-0.5">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Improve water drainage by creating furrows</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary of Disease */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-[2rem] shadow-xl shadow-indigo-500/5 border border-white/50">
                            <h3 className="text-sm font-bold text-indigo-700 mb-4 flex items-center uppercase tracking-widest">
                                Summary of Disease & Affected Area
                            </h3>
                            <div className="flex gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1594291882068-1af1066c0d6e?q=80&w=200&auto=format&fit=crop"
                                    alt="Thumbnail"
                                    className="w-20 h-20 rounded-xl object-cover shadow-sm"
                                />
                                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                                    The <strong className="text-red-500">Dead Heart</strong> disease was identified in the paddy field, affecting approximately <strong className="text-indigo-600">0.23 acres</strong> (7.67% of total area) with high severity. Swift treatment is recommended.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Components for Cleaner JSX
const MissionItem = ({ icon, label, value }) => (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
        <div className="flex items-center text-slate-500">
            <span className="w-6 text-center mr-2 opacity-70">{icon}</span>
            <span className="font-medium text-xs uppercase tracking-wide">{label}:</span>
        </div>
        <span className="font-bold text-slate-700">{value}</span>
    </div>
);

const CauseItem = ({ text }) => (
    <div className="flex items-center bg-green-50/50 p-3 rounded-xl border border-green-50">
        <div className="bg-green-500 text-white rounded-full p-0.5 mr-3">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <span className="text-sm font-semibold text-slate-700">{text}</span>
    </div>
);

export default AdminDroneAnalysis;
