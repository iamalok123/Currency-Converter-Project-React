import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHistory, FaTrash } from 'react-icons/fa';
import localforage from 'localforage';

const FavoriteCurrencies = ({ onSelectPair, currentFrom, currentTo }) => {
    const [favorites, setFavorites] = useState([]);
    const [recentConversions, setRecentConversions] = useState([]);
    const [activeTab, setActiveTab] = useState('favorites');

    useEffect(() => {
        // Load favorites and recent conversions from local storage
        localforage.getItem('favoritePairs').then((data) => {
            if (data) setFavorites(data);
        });
        localforage.getItem('recentConversions').then((data) => {
            if (data) setRecentConversions(data);
        });
    }, []);

    const addToFavorites = () => {
        const newPair = { from: currentFrom, to: currentTo };
        if (!favorites.some(pair => pair.from === currentFrom && pair.to === currentTo)) {
            const updatedFavorites = [...favorites, newPair];
            setFavorites(updatedFavorites);
            localforage.setItem('favoritePairs', updatedFavorites);
        }
    };

    const removeFromFavorites = (index) => {
        const updatedFavorites = favorites.filter((_, i) => i !== index);
        setFavorites(updatedFavorites);
        localforage.setItem('favoritePairs', updatedFavorites);
    };

    const addToRecent = () => {
        const newConversion = { from: currentFrom, to: currentTo, timestamp: new Date() };
        const updatedRecent = [newConversion, ...recentConversions.slice(0, 4)];
        setRecentConversions(updatedRecent);
        localforage.setItem('recentConversions', updatedRecent);
    };

    useEffect(() => {
        if (currentFrom && currentTo) {
            addToRecent();
        }
    }, [currentFrom, currentTo]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/30 backdrop-blur-sm rounded-lg p-4 mt-4"
        >
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        activeTab === 'favorites'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <FaStar />
                    Favorites
                </button>
                <button
                    onClick={() => setActiveTab('recent')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        activeTab === 'recent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <FaHistory />
                    Recent
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'favorites' ? (
                    <motion.div
                        key="favorites"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                    >
                        {favorites.map((pair, index) => (
                            <motion.div
                                key={`${pair.from}-${pair.to}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center justify-between bg-white/50 p-3 rounded-lg"
                            >
                                <button
                                    onClick={() => onSelectPair(pair.from, pair.to)}
                                    className="flex-1 text-left"
                                >
                                    {pair.from.toUpperCase()} → {pair.to.toUpperCase()}
                                </button>
                                <button
                                    onClick={() => removeFromFavorites(index)}
                                    className="text-red-500 hover:text-red-600 p-2"
                                >
                                    <FaTrash />
                                </button>
                            </motion.div>
                        ))}
                        {favorites.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                No favorite pairs yet. Add some using the star button!
                            </p>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="recent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                    >
                        {recentConversions.map((conversion, index) => (
                            <motion.div
                                key={`${conversion.from}-${conversion.to}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center justify-between bg-white/50 p-3 rounded-lg"
                            >
                                <button
                                    onClick={() => onSelectPair(conversion.from, conversion.to)}
                                    className="flex-1 text-left"
                                >
                                    {conversion.from.toUpperCase()} → {conversion.to.toUpperCase()}
                                </button>
                                <span className="text-sm text-gray-500">
                                    {new Date(conversion.timestamp).toLocaleTimeString()}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {activeTab === 'favorites' && (
                <button
                    onClick={addToFavorites}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaStar />
                    Add Current Pair to Favorites
                </button>
            )}
        </motion.div>
    );
};

export default FavoriteCurrencies; 