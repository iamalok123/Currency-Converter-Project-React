import { useState } from 'react'
import { InputBox } from './components'
import useCurrencyInfo from './hooks/useCurrencyInfo'
import CurrencyChart from './components/CurrencyChart'
import FavoriteCurrencies from './components/FavoriteCurrencies'
import MultiCurrencyConverter from './components/MultiCurrencyConverter'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChartLine, FaStar, FaExchangeAlt } from 'react-icons/fa'

function App() {
  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [activeFeature, setActiveFeature] = useState('convert') // 'convert', 'chart', 'multi'

  const currencyInfo = useCurrencyInfo(from)
  const options = Object.keys(currencyInfo)

  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
  }
  
  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to])
  }

  const handleSelectPair = (fromCurrency, toCurrency) => {
    setFrom(fromCurrency)
    setTo(toCurrency)
  }

  return (
    <div
      className="w-full min-h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/1574182/pexels-photo-1574182.jpeg?auto=compress&cs=tinysrgb&w=600')`,
      }}
    >
      <div className="w-full max-w-4xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30 mb-4"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert()
            }}
          >
            <div className="w-full mb-1">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={(amount) => setAmount(amount)}
              />
            </div>
            <div className="relative w-full h-0.5">
              <button
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5 hover:bg-blue-700 transition-colors"
                onClick={swap}
              >
                <FaExchangeAlt />
              </button>
            </div>
            <div className="w-full mt-1 mb-4">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                amountDisable
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </motion.div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setActiveFeature('convert')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeFeature === 'convert'
                ? 'bg-blue-600 text-white'
                : 'bg-white/30 text-gray-800 hover:bg-white/40'
            }`}
          >
            <FaExchangeAlt />
            Convert
          </button>
          <button
            onClick={() => setActiveFeature('chart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeFeature === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-white/30 text-gray-800 hover:bg-white/40'
            }`}
          >
            <FaChartLine />
            Chart
          </button>
          <button
            onClick={() => setActiveFeature('multi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeFeature === 'multi'
                ? 'bg-blue-600 text-white'
                : 'bg-white/30 text-gray-800 hover:bg-white/40'
            }`}
          >
            <FaStar />
            Multi Convert
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeFeature === 'chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CurrencyChart fromCurrency={from} toCurrency={to} />
            </motion.div>
          )}

          {activeFeature === 'multi' && (
            <motion.div
              key="multi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MultiCurrencyConverter
                currencyInfo={currencyInfo}
                baseAmount={amount}
                baseCurrency={from}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <FavoriteCurrencies
          onSelectPair={handleSelectPair}
          currentFrom={from}
          currentTo={to}
        />
      </div>
    </div>
  );
}

export default App
