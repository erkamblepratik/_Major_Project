'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { generateMLResults } from '@/lib/dummy-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Cpu,
  Brain,
  TreeDeciduous,
  Shuffle,
  Network,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  Gauge,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { toast } from 'sonner'

const ML_MODELS = [
  { id: 'knn', name: 'K-Nearest Neighbors', icon: Shuffle, description: 'Instance-based learning' },
  { id: 'lr', name: 'Linear Regression', icon: TrendingUp, description: 'Linear relationship modeling' },
  { id: 'dt', name: 'Decision Tree', icon: TreeDeciduous, description: 'Tree-based classification' },
  { id: 'rf', name: 'Random Forest', icon: TreeDeciduous, description: 'Ensemble of decision trees' },
  { id: 'nn', name: 'Neural Network', icon: Network, description: 'Deep learning approach' },
]

export function MLAnalysisPage() {
  const {
    dataset,
    selectedModel,
    setSelectedModel,
    mlResults,
    setMLResults,
    isAnalyzing,
    setIsAnalyzing,
    setCurrentPage,
  } = useAppStore()

  const [progress, setProgress] = useState(0)

  const runAnalysis = () => {
    if (!selectedModel) {
      toast.error('Please select a model first')
      return
    }

    setIsAnalyzing(true)
    setProgress(0)

    const modelName = ML_MODELS.find((m) => m.id === selectedModel)?.name || selectedModel

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      const results = generateMLResults(modelName)
      setMLResults(results)
      setIsAnalyzing(false)
      toast.success('Analysis complete!', {
        description: `${modelName} achieved ${(results.accuracy * 100).toFixed(1)}% accuracy.`,
      })
    }, 2500)
  }

  if (!dataset) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ML Analysis</h1>
          <p className="text-muted-foreground mt-1">Train and evaluate machine learning models</p>
        </div>
        <Card className="glass-card border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Dataset Loaded</h3>
            <p className="text-muted-foreground mb-4">
              Please upload a dataset first before running ML analysis.
            </p>
            <Button onClick={() => setCurrentPage('upload')} className="bg-primary text-primary-foreground">
              Go to Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ML Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Select a model and train on your dataset
          </p>
        </div>
        {mlResults && (
          <Button onClick={() => setCurrentPage('decision-support')} className="bg-accent text-accent-foreground">
            View Insights
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Model Selection */}
      <div className="grid md:grid-cols-5 gap-4">
        {ML_MODELS.map((model) => (
          <Card
            key={model.id}
            onClick={() => !isAnalyzing && setSelectedModel(model.id)}
            className={`glass-card border-border cursor-pointer transition-all duration-300 hover:border-primary/50 ${
              selectedModel === model.id ? 'border-primary neon-glow-cyan' : ''
            }`}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                  selectedModel === model.id ? 'bg-primary/20' : 'bg-muted'
                }`}
              >
                <model.icon
                  className={`w-6 h-6 ${
                    selectedModel === model.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{model.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Run Analysis Button */}
      <Card className="glass-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {selectedModel
                  ? `Ready to train ${ML_MODELS.find((m) => m.id === selectedModel)?.name}`
                  : 'Select a model to begin'}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {isAnalyzing
                  ? 'Training model on your dataset...'
                  : 'Click the button to start training your selected model.'}
              </p>
            </div>
            <Button
              onClick={runAnalysis}
              disabled={!selectedModel || isAnalyzing}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Training...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
          {isAnalyzing && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {mlResults && (
        <>
          {/* Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Accuracy', value: mlResults.accuracy, icon: Target, color: 'text-primary' },
              { label: 'Precision', value: mlResults.precision, icon: Gauge, color: 'text-accent' },
              { label: 'Recall', value: mlResults.recall, icon: TrendingUp, color: 'text-chart-3' },
              { label: 'F1 Score', value: mlResults.f1Score, icon: CheckCircle2, color: 'text-chart-4' },
            ].map((metric, i) => (
              <Card key={i} className="glass-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">{metric.label}</span>
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <p className={`text-3xl font-bold ${metric.color}`}>
                    {(metric.value * 100).toFixed(1)}%
                  </p>
                  <Progress value={metric.value * 100} className="h-1 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Importance & Confusion Matrix */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Feature Importance */}
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Feature Importance
                </CardTitle>
                <CardDescription>
                  Relative importance of each feature in the model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mlResults.featureImportance}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" tick={{ fill: '#888' }} domain={[0, 0.4]} />
                      <YAxis type="category" dataKey="feature" tick={{ fill: '#888', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                      />
                      <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                        {mlResults.featureImportance.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? '#64ffda' : index === 1 ? '#bb86fc' : '#4a5568'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Confusion Matrix */}
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-accent" />
                  Confusion Matrix
                </CardTitle>
                <CardDescription>
                  Visualization of prediction accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <div className="relative">
                    {/* Labels */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      Predicted
                    </div>
                    <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                      Actual
                    </div>
                    
                    {/* Matrix */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: mlResults.confusionMatrix[0][0], label: 'TN', color: 'bg-primary/20 border-primary/50' },
                        { value: mlResults.confusionMatrix[0][1], label: 'FP', color: 'bg-destructive/20 border-destructive/50' },
                        { value: mlResults.confusionMatrix[1][0], label: 'FN', color: 'bg-destructive/20 border-destructive/50' },
                        { value: mlResults.confusionMatrix[1][1], label: 'TP', color: 'bg-primary/20 border-primary/50' },
                      ].map((cell, i) => (
                        <div
                          key={i}
                          className={`w-28 h-28 rounded-lg border flex flex-col items-center justify-center ${cell.color}`}
                        >
                          <span className="text-3xl font-bold text-foreground">{cell.value}</span>
                          <span className="text-xs text-muted-foreground mt-1">{cell.label}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Axis labels */}
                    <div className="flex justify-around mt-2 text-xs text-muted-foreground">
                      <span>Negative</span>
                      <span>Positive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
