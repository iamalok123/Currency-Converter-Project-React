import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';

const MultiCurrencyConverter = ({ currencyInfo, baseAmount, baseCurrency }) => {
    const [targetCurrencies, setTargetCurrencies] = useState(['inr', 'eur']);
    const [splitAmounts, setSplitAmounts] = useState({});

    const addCurrency = () => {
        const availableCurrencies = Object.keys(currencyInfo).filter(
            currency => !targetCurrencies.includes(currency) && currency !== baseCurrency
        );
        if (availableCurrencies.length > 0) {
            setTargetCurrencies([...targetCurrencies, availableCurrencies[0]]);
        }
    };

    const removeCurrency = (currency) => {
        setTargetCurrencies(targetCurrencies.filter(c => c !== currency));
        const newSplitAmounts = { ...splitAmounts };
        delete newSplitAmounts[currency];
        setSplitAmounts(newSplitAmounts);
    };

    const updateSplitAmount = (currency, amount) => {
        setSplitAmounts({ ...splitAmounts, [currency]: amount });
    };

    const calculateTotal = () => {
        return Object.values(splitAmounts).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    };

    const getConvertedAmount = (currency) => {
        return baseAmount * currencyInfo[currency];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/30 backdrop-blur-sm rounded-lg p-4 mt-4"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Multiple Currency Conversion</h3>
                <button
                    onClick={addCurrency}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <FaPlus />
                    Add Currency
                </button>
            </div>

            <div className="space-y-4">
                {targetCurrencies.map((currency) => (
                    <motion.div
                        key={currency}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white/50 p-4 rounded-lg"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{currency.toUpperCase()}</span>
                                <span className="text-sm text-gray-500">
                                    Rate: 1 {baseCurrency.toUpperCase()} = {currencyInfo[currency].toFixed(4)} {currency.toUpperCase()}
                                </span>
                            </div>
                            <button
                                onClick={() => removeCurrency(currency)}
                                className="text-red-500 hover:text-red-600 p-1"
                            >
                                <FaTrash />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Converted Amount</label>
                                <div className="bg-gray-100 p-2 rounded">
                                    {getConvertedAmount(currency).toFixed(2)} {currency.toUpperCase()}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Split Amount</label>
                                <input
                                    type="number"
                                    value={splitAmounts[currency] || ''}
                                    onChange={(e) => updateSplitAmount(currency, e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Total Split Amount:</span>
                    <span className="font-semibold">
                        {calculateTotal().toFixed(2)} {baseCurrency.toUpperCase()}
                    </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    {calculateTotal() !== baseAmount && (
                        <span className="text-red-500">
                            Warning: Total split amount ({calculateTotal().toFixed(2)}) does not match base amount ({baseAmount})
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MultiCurrencyConverter; 