export interface Portfolio {
  code: string;
  name: string;
  description: string;
  currency: string;
  type: string;
}

export interface Security {
  code: string;
  name: string;
  description: string;
  currency: string;
  sector: string;
  exchange: string;
}

export const TEST_PORTFOLIOS: Portfolio[] = [
  {
    code: 'PF001',
    name: 'Global Equity Fund',
    description: 'Diversified global equity portfolio',
    currency: 'USD',
    type: 'Equity',
  },
  {
    code: 'PF002',
    name: 'Tech Growth Portfolio',
    description: 'Technology focused growth portfolio',
    currency: 'USD',
    type: 'Growth',
  },
  {
    code: 'PF003',
    name: 'European Value Fund',
    description: 'European value-oriented investments',
    currency: 'EUR',
    type: 'Value',
  },
  {
    code: 'PF004',
    name: 'Asia Pacific Fund',
    description: 'Asia Pacific market exposure',
    currency: 'USD',
    type: 'Regional',
  },
  {
    code: 'PF005',
    name: 'Bond Strategic Fund',
    description: 'Fixed income strategic allocation',
    currency: 'USD',
    type: 'Fixed Income',
  },
];

export const TEST_SECURITIES: Security[] = [
  {
    code: 'AAPL',
    name: 'Apple Inc.',
    description: 'Technology hardware and software',
    currency: 'USD',
    sector: 'Technology',
    exchange: 'NASDAQ',
  },
  {
    code: 'MSFT',
    name: 'Microsoft Corporation',
    description: 'Software and cloud services',
    currency: 'USD',
    sector: 'Technology',
    exchange: 'NASDAQ',
  },
  {
    code: 'GOOGL',
    name: 'Alphabet Inc.',
    description: 'Internet services and technology',
    currency: 'USD',
    sector: 'Technology',
    exchange: 'NASDAQ',
  },
  {
    code: 'TSLA',
    name: 'Tesla Inc.',
    description: 'Electric vehicles and energy',
    currency: 'USD',
    sector: 'Automotive',
    exchange: 'NASDAQ',
  },
  {
    code: 'NVDA',
    name: 'NVIDIA Corporation',
    description: 'Graphics and AI computing',
    currency: 'USD',
    sector: 'Technology',
    exchange: 'NASDAQ',
  },
  {
    code: 'JPM',
    name: 'JPMorgan Chase & Co.',
    description: 'Banking and financial services',
    currency: 'USD',
    sector: 'Financials',
    exchange: 'NYSE',
  },
  {
    code: 'JNJ',
    name: 'Johnson & Johnson',
    description: 'Healthcare and pharmaceuticals',
    currency: 'USD',
    sector: 'Healthcare',
    exchange: 'NYSE',
  },
  {
    code: 'V',
    name: 'Visa Inc.',
    description: 'Payment processing services',
    currency: 'USD',
    sector: 'Financials',
    exchange: 'NYSE',
  },
];

// Generate mock price data
export const generateMockPriceData = (code: string, days: number = 252) => {
  const data = [];
  let price = Math.random() * 100 + 50; // Start between 50-150
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * price * 0.03;
    price = Math.max(price + change, 1); // Don't let price go below 1

    data.push({
      date: date.toISOString().split('T')[0],
      [code]: price,
      value: price,
    });
  }

  return data;
};

export const generateMockReturnsData = (code: string, days: number = 252) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Random returns with realistic distribution
    const returns = (Math.random() - 0.5) * 0.06; // ±3% daily returns

    data.push({
      date: date.toISOString().split('T')[0],
      [code]: returns,
      value: returns,
    });
  }

  return data;
};

export const generateMockVolatilityData = (
  code: string,
  days: number = 252,
) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Volatility clustering effect
    const baseVol = 0.2 + Math.random() * 0.3; // 20-50% annualized
    const vol = Math.max(baseVol * (0.8 + Math.random() * 0.4), 0.05);

    data.push({
      date: date.toISOString().split('T')[0],
      [code]: vol,
      value: vol,
    });
  }

  return data;
};
