import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'BHD' : 'USD');
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount) || 0;
    if (currency === 'BHD') {
      // 1 USD = 0.376 BHD (approximate)
      const bhd = num * 0.376;
      return `${bhd.toFixed(3)} BD`;
    }
    return `$${num.toFixed(2)}`;
  };

  const convertToBHD = (usdAmount) => {
    return parseFloat(usdAmount) * 0.376;
  };

  const convertToUSD = (bhdAmount) => {
    return parseFloat(bhdAmount) / 0.376;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      toggleCurrency, 
      formatAmount,
      convertToBHD,
      convertToUSD,
      symbol: currency === 'USD' ? '$' : 'BD'
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}