import { create } from 'zustand'

export interface DataRow {
  [key: string]: string | number | null
}

export interface DatasetStats {
  rows: number
  columns: number
  missingValues: number
  numericColumns: string[]
  categoricalColumns: string[]
}

export interface MLResult {
  model: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  confusionMatrix: number[][]
  predictions: number[]
  featureImportance: { feature: string; importance: number }[]
}

export interface Insight {
  type: 'success' | 'warning' | 'info'
  title: string
  description: string
}

interface AppState {
  // Navigation
  currentPage: 'landing' | 'dashboard' | 'upload' | 'preprocessing' | 'visualization' | 'ml-analysis' | 'decision-support'
  setCurrentPage: (page: AppState['currentPage']) => void

  // Dataset
  dataset: DataRow[] | null
  setDataset: (data: DataRow[] | null) => void
  datasetName: string
  setDatasetName: (name: string) => void
  datasetStats: DatasetStats | null
  setDatasetStats: (stats: DatasetStats | null) => void

  // Preprocessing
  preprocessingOptions: {
    normalize: boolean
    handleMissing: 'drop' | 'mean' | 'median' | 'mode' | null
    selectedFeatures: string[]
  }
  setPreprocessingOptions: (options: Partial<AppState['preprocessingOptions']>) => void
  processedDataset: DataRow[] | null
  setProcessedDataset: (data: DataRow[] | null) => void

  // ML Analysis
  selectedModel: string | null
  setSelectedModel: (model: string | null) => void
  mlResults: MLResult | null
  setMLResults: (results: MLResult | null) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void

  // Decision Support
  insights: Insight[]
  setInsights: (insights: Insight[]) => void
  riskLevel: 'Low' | 'Medium' | 'High' | null
  setRiskLevel: (level: AppState['riskLevel']) => void

  // Chat
  chatMessages: { role: 'user' | 'assistant'; content: string }[]
  addChatMessage: (message: { role: 'user' | 'assistant'; content: string }) => void
  clearChat: () => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Dataset
  dataset: null,
  setDataset: (data) => set({ dataset: data }),
  datasetName: '',
  setDatasetName: (name) => set({ datasetName: name }),
  datasetStats: null,
  setDatasetStats: (stats) => set({ datasetStats: stats }),

  // Preprocessing
  preprocessingOptions: {
    normalize: false,
    handleMissing: null,
    selectedFeatures: [],
  },
  setPreprocessingOptions: (options) =>
    set((state) => ({
      preprocessingOptions: { ...state.preprocessingOptions, ...options },
    })),
  processedDataset: null,
  setProcessedDataset: (data) => set({ processedDataset: data }),

  // ML Analysis
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),
  mlResults: null,
  setMLResults: (results) => set({ mlResults: results }),
  isAnalyzing: false,
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  // Decision Support
  insights: [],
  setInsights: (insights) => set({ insights }),
  riskLevel: null,
  setRiskLevel: (level) => set({ riskLevel: level }),

  // Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
