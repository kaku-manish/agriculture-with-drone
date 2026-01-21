import { useTranslation } from 'react-i18next';

const ActionPlan = ({ recommendation, setActiveTab, resetAnalysis }) => {
    const { t } = useTranslation();

    if (!recommendation) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center py-10 text-gray-400">
                <p>{t('no_recommendations')}</p>
                <p className="text-xs mt-2">{t('status_waiting')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-emerald-700 flex items-center">
                    <span className="mr-2">📢</span> {t('action_plan')}
                </h3>
                {recommendation.disease_detected && recommendation.disease_detected !== "None" && (
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setActiveTab('Cost Estimation')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm"
                        >
                            <span className="mr-2">💰</span> Check Treatment Cost
                        </button>
                        <button
                            onClick={resetAnalysis}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center border border-gray-300"
                        >
                            <span>✓ Finish & Clear</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
                {/* Status Check if Healthy */}
                {(!recommendation.disease_detected || recommendation.disease_detected === "None") ? (
                    <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
                        <div className="text-5xl mb-4">🌿</div>
                        <h4 className="text-xl font-bold text-green-700 uppercase mb-2">{t('status_healthy')}</h4>
                        <p className="text-green-800">Your crop is looking great! No diseases detected.</p>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="bg-white p-3 rounded border border-green-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('crop_advice')}</h4>
                                <p className="text-sm text-gray-800">
                                    {recommendation.crop_suggestion.includes('Recommended:') ?
                                        `${t('recommended')}: ${recommendation.crop_suggestion.split(':')[1]}` :
                                        `${t('current_crop')}: ${recommendation.crop_suggestion.split(':')[1] || 'Paddy'}`}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded border border-green-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('water_management')}</h4>
                                <p className="text-sm text-gray-800">{t(recommendation.water_advice)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Disease Detected State
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('identified_disease')}</h4>
                                <p className="text-lg font-bold text-red-600">
                                    {recommendation.disease_detected}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('water_management')}</h4>
                                <p className="text-sm text-gray-800">{t(recommendation.water_advice)}</p>
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 rounded-lg border border-red-100 shadow-sm">
                            <h4 className="text-lg font-bold text-red-700 uppercase mb-4 flex items-center border-b border-red-200 pb-2">
                                <span className="mr-2">💊</span> Treatment Protocol
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <span className="text-xs text-red-500 font-semibold block mb-1 uppercase tracking-wider">{t('primary_medicine')}</span>
                                    <p className="font-bold text-gray-900 text-lg">{recommendation.medicine_suggestion}</p>
                                    <div className="mt-2 bg-white/50 p-2 rounded text-sm text-gray-700">
                                        <span className="font-semibold">{t('dosage')}:</span> {recommendation.dosage}
                                    </div>
                                </div>
                                {recommendation.medicine_secondary && recommendation.medicine_secondary !== "None" && (
                                    <div className="border-l border-red-200 pl-4">
                                        <span className="text-xs text-orange-600 font-semibold block mb-1 uppercase tracking-wider">{t('alternative_option')}</span>
                                        <p className="font-semibold text-gray-800">{recommendation.medicine_secondary}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendation.timeline && recommendation.timeline !== "None" && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">📅 {t('action_timeline')}</h4>
                                    <p className="text-sm text-blue-900 leading-relaxed">{recommendation.timeline}</p>
                                </div>
                            )}
                            {recommendation.preventive_measures && recommendation.preventive_measures !== "None" && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h4 className="text-xs font-bold text-green-700 uppercase mb-2">🛡️ {t('preventive_measures')}</h4>
                                    <p className="text-sm text-green-900 leading-relaxed">{recommendation.preventive_measures}</p>
                                </div>
                            )}
                        </div>

                        {/* Large action button at the bottom too */}
                    </>
                )}
            </div>
        </div>
    );
};

export default ActionPlan;
