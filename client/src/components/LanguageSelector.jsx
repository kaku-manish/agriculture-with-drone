import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center bg-gray-100 rounded-full p-1 space-x-1">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${i18n.language.startsWith('en')
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
            >
                English
            </button>
            <button
                onClick={() => changeLanguage('te')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${i18n.language.startsWith('te')
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
            >
                తెలుగు
            </button>
        </div>
    );
};

export default LanguageSelector;
