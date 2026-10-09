import type { DataRow, DatasetStats, MLResult, Insight } from './store'

export const generateDummyDataset = (rows: number = 100): DataRow[] => {
  const products = ['Widget A', 'Widget B', 'Gadget X', 'Gadget Y', 'Device Z']
  const regions = ['North', 'South', 'East', 'West', 'Central']
  
  return Array.from({ length: rows }, (_, i) => ({
    id: i + 1,
    product: products[Math.floor(Math.random() * products.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    sales: Math.floor(Math.random() * 10000) + 1000,
    revenue: Math.floor(Math.random() * 50000) + 5000,
    profit_margin: parseFloat((Math.random() * 0.4 + 0.1).toFixed(2)),
    customer_satisfaction: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    units_sold: Math.floor(Math.random() * 500) + 50,
    marketing_spend: Math.floor(Math.random() * 5000) + 500,
    employee_count: Math.floor(Math.random() * 50) + 10,
    quarter: `Q${Math.floor(Math.random() * 4) + 1}`,
  }))
}

export const calculateStats = (data: DataRow[]): DatasetStats => {
  if (!data.length) {
    return { rows: 0, columns: 0, missingValues: 0, numericColumns: [], categoricalColumns: [] }
  }
  
  const columns = Object.keys(data[0])
  const numericColumns: string[] = []
  const categoricalColumns: string[] = []
  let missingValues = 0

  columns.forEach((col) => {
    const values = data.map((row) => row[col])
    const numericCount = values.filter((v) => typeof v === 'number' && !isNaN(v)).length
    const nullCount = values.filter((v) => v === null || v === '' || v === undefined).length
    
    missingValues += nullCount
    
    if (numericCount > values.length * 0.5) {
      numericColumns.push(col)
    } else {
      categoricalColumns.push(col)
    }
  })

  return {
    rows: data.length,
    columns: columns.length,
    missingValues,
    numericColumns,
    categoricalColumns,
  }
}

export const generateMLResults = (model: string): MLResult => {
  const baseAccuracy = {
    'K-Nearest Neighbors': 0.85,
    'Linear Regression': 0.78,
    'Decision Tree': 0.82,
    'Random Forest': 0.91,
    'Neural Network': 0.89,
  }

  const accuracy = (baseAccuracy[model as keyof typeof baseAccuracy] || 0.8) + (Math.random() * 0.08 - 0.04)
  
  return {
    model,
    accuracy: parseFloat(accuracy.toFixed(4)),
    precision: parseFloat((accuracy - Math.random() * 0.05).toFixed(4)),
    recall: parseFloat((accuracy - Math.random() * 0.03).toFixed(4)),
    f1Score: parseFloat((accuracy - Math.random() * 0.02).toFixed(4)),
    confusionMatrix: [
      [Math.floor(Math.random() * 50) + 40, Math.floor(Math.random() * 10) + 2],
      [Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 45) + 35],
    ],
    predictions: Array.from({ length: 20 }, () => Math.round(Math.random())),
    featureImportance: [
      { feature: 'revenue', importance: 0.28 + Math.random() * 0.1 },
      { feature: 'marketing_spend', importance: 0.22 + Math.random() * 0.08 },
      { feature: 'customer_satisfaction', importance: 0.18 + Math.random() * 0.06 },
      { feature: 'units_sold', importance: 0.15 + Math.random() * 0.05 },
      { feature: 'profit_margin', importance: 0.12 + Math.random() * 0.04 },
      { feature: 'employee_count', importance: 0.05 + Math.random() * 0.02 },
    ].sort((a, b) => b.importance - a.importance),
  }
}

export const generateInsights = (mlResults: MLResult | null): Insight[] => {
  if (!mlResults) return []
  
  const insights: Insight[] = [
    {
      type: 'success',
      title: 'Strong Revenue Correlation',
      description: `Revenue shows a ${(mlResults.featureImportance[0].importance * 100).toFixed(1)}% impact on predictions. Consider increasing revenue-generating activities.`,
    },
    {
      type: 'info',
      title: 'Marketing Effectiveness',
      description: 'Marketing spend has a moderate positive correlation with outcomes. Current ROI suggests optimal allocation.',
    },
    {
      type: 'warning',
      title: 'Customer Satisfaction Alert',
      description: 'Customer satisfaction scores below 3.5 correlate with 40% lower retention. Monitor closely.',
    },
    {
      type: 'success',
      title: 'Model Performance',
      description: `${mlResults.model} achieved ${(mlResults.accuracy * 100).toFixed(1)}% accuracy. This exceeds baseline expectations by 12%.`,
    },
    {
      type: 'info',
      title: 'Feature Optimization',
      description: `Top 3 features account for ${((mlResults.featureImportance[0].importance + mlResults.featureImportance[1].importance + mlResults.featureImportance[2].importance) * 100).toFixed(1)}% of predictive power.`,
    },
  ]
  
  return insights
}

export const generateChatResponse = (userMessage: string, hasData: boolean): string => {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('explain') && lowerMessage.includes('dataset')) {
    if (!hasData) {
      return "You haven't uploaded a dataset yet. Please go to the Upload section to add your data, and I'll be happy to explain it!"
    }
    return "Your dataset contains business performance metrics including sales, revenue, profit margins, and customer satisfaction scores across different regions and products. The data spans multiple quarters and includes marketing spend information, making it suitable for predictive analysis and trend identification."
  }
  
  if (lowerMessage.includes('best') && lowerMessage.includes('model')) {
    return "Based on typical business datasets, I recommend trying Random Forest for its balance of accuracy and interpretability. It handles mixed data types well and provides useful feature importance rankings. For your specific use case, it achieved 91% accuracy in our tests. Decision Trees are also good if you need more explainable results."
  }
  
  if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
    return "To improve your model performance, consider: 1) Engineering new features from existing data (e.g., revenue per employee), 2) Handling outliers in numeric columns, 3) Collecting more data if possible, 4) Trying ensemble methods like Random Forest, and 5) Tuning hyperparameters for your chosen model."
  }
  
  if (lowerMessage.includes('feature') && lowerMessage.includes('important')) {
    return "The most impactful features in your analysis are: Revenue (28%), Marketing Spend (22%), and Customer Satisfaction (18%). These three features alone account for nearly 70% of the model's predictive power. I recommend focusing optimization efforts on these areas for maximum impact."
  }
  
  if (lowerMessage.includes('risk') || lowerMessage.includes('concern')) {
    return "Current risk assessment shows Medium risk level. Key concerns: 1) Some regions show declining customer satisfaction trends, 2) Marketing ROI variance is high across products, 3) Profit margins in Q3 were 15% below target. I recommend focusing on the underperforming regions and reviewing marketing allocation."
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your AI data analysis assistant. I can help you understand your dataset, recommend ML models, explain results, and provide actionable insights. What would you like to know?"
  }
  
  return "I can help you with data analysis questions like: 'Explain my dataset', 'Which model is best?', 'What features are most important?', or 'What are the main risks?'. Feel free to ask anything about your data or the analysis results!"
}
