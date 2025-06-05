import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const CurrencyChart = ({ fromCurrency, toCurrency }) => {
    const [historicalData, setHistoricalData] = useState([]);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        const fetchHistoricalData = async () => {
            // Fetch last 7 days of data
            const dates = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return format(date, 'yyyy-MM-dd');
            }).reverse();

            const data = await Promise.all(
                dates.map(async (date) => {
                    const response = await fetch(
                        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${fromCurrency}.json`
                    );
                    const result = await response.json();
                    return {
                        date: format(new Date(date), 'MMM dd'),
                        rate: result[fromCurrency][toCurrency]
                    };
                })
            );
            setHistoricalData(data);
        };

        fetchHistoricalData();
    }, [fromCurrency, toCurrency]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/30 backdrop-blur-sm rounded-lg p-4 mt-4"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Historical Rates: {fromCurrency.toUpperCase()} to {toCurrency.toUpperCase()}
                </h3>
                <div className="flex gap-2">
                    {['7d', '1m', '3m'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-md text-sm ${
                                timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ fill: '#2563eb', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#2563eb' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CurrencyChart; 