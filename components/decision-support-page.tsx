'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { generateInsights, generateChatResponse } from '@/lib/dummy-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Download,
  Printer,
  FileDown,
} from 'lucide-react'
import { toast } from 'sonner'

export function DecisionSupportPage() {
  const {
    dataset,
    datasetName,
    mlResults,
    insights,
    setInsights,
    riskLevel,
    setRiskLevel,
    chatMessages,
    addChatMessage,
    setCurrentPage,
  } = useAppStore()

  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mlResults && insights.length === 0) {
      const generatedInsights = generateInsights(mlResults)
      setInsights(generatedInsights)
      
      // Set risk level based on model performance
      if (mlResults.accuracy > 0.85) {
        setRiskLevel('Low')
      } else if (mlResults.accuracy > 0.7) {
        setRiskLevel('Medium')
      } else {
        setRiskLevel('High')
      }
    }
  }, [mlResults, insights.length, setInsights, setRiskLevel])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    addChatMessage({ role: 'user', content: userMessage })
    setChatInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateChatResponse(userMessage, !!dataset)
      addChatMessage({ role: 'assistant', content: response })
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleDownloadData = () => {
    if (!dataset || dataset.length === 0) {
      toast.error('No data available to download')
      return
    }

    const headers = Object.keys(dataset[0])
    const csvRows = [
      headers.join(','),
      ...dataset.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            const stringValue = value === null || value === undefined ? '' : String(value)
            // Escape values containing commas or quotes
            return /[",\n]/.test(stringValue)
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue
          })
          .join(',')
      ),
    ]
    const csvContent = csvRows.join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${datasetName || 'dataset'}-analysis.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Data downloaded successfully')
  }

  const handlePrintReport = () => {
    window.print()
  }

  const getInsightIcon = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-primary" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-chart-5" />
      case 'info':
        return <Info className="w-5 h-5 text-accent" />
    }
  }

  const getRiskColor = (level: 'Low' | 'Medium' | 'High' | null) => {
    switch (level) {
      case 'Low':
        return 'text-primary bg-primary/10 border-primary/30'
      case 'Medium':
        return 'text-chart-3 bg-chart-3/10 border-chart-3/30'
      case 'High':
        return 'text-destructive bg-destructive/10 border-destructive/30'
      default:
        return 'text-muted-foreground bg-muted border-border'
    }
  }

  if (!dataset) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Decision Support</h1>
          <p className="text-muted-foreground mt-1">AI-powered insights and recommendations</p>
        </div>
        <Card className="glass-card border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">
              Upload a dataset and run ML analysis to get AI-powered insights.
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Decision Support</h1>
        <p className="text-muted-foreground mt-1">
          AI-generated insights and intelligent recommendations
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Insights Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Indicator */}
          <Card className="glass-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Risk Assessment</h3>
                    <p className="text-muted-foreground text-sm">Overall system confidence level</p>
                  </div>
                </div>
                <div
                  className={`px-6 py-3 rounded-lg border font-semibold text-lg ${getRiskColor(riskLevel)}`}
                >
                  {riskLevel || 'N/A'} Risk
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights List */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>
                Key findings and recommendations from your analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'success'
                        ? 'bg-primary/5 border-primary/20'
                        : insight.type === 'warning'
                        ? 'bg-chart-5/5 border-chart-5/20'
                        : 'bg-accent/5 border-accent/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <h4 className="font-semibold text-foreground">{insight.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Run ML analysis to generate insights
                  </p>
                  <Button
                    onClick={() => setCurrentPage('ml-analysis')}
                    variant="outline"
                    className="mt-4"
                  >
                    Go to ML Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Recommendations */}
          {mlResults && (
            <Card className="glass-card border-border neon-glow-purple">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Quick Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    `Focus on ${mlResults.featureImportance[0]?.feature || 'key features'} - it has the highest predictive power`,
                    `Consider collecting more data for features with low importance scores`,
                    `Model accuracy of ${(mlResults.accuracy * 100).toFixed(1)}% suggests reliable predictions`,
                    `Monitor ${mlResults.featureImportance[2]?.feature || 'secondary features'} for potential optimization`,
                  ].map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Export & Report */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-primary" />
                Export &amp; Report
              </CardTitle>
              <CardDescription>
                Download your dataset or print a full analysis report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDownloadData}
                  className="flex-1 bg-primary text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Data (CSV)
                </Button>
                <Button
                  onClick={handlePrintReport}
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                >
                  <Printer className="w-4 h-4" />
                  Print Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="glass-card border-border h-[600px] flex flex-col no-print">
          <CardHeader className="border-b border-border flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>Ask questions about your data</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {/* Welcome message */}
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Hi! I&apos;m your AI assistant. Ask me anything about your dataset or analysis
                    results.
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      'Explain my dataset',
                      'Which model is best?',
                      'What features are important?',
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setChatInput(suggestion)
                        }}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {chatMessages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm">{message.content}</p>
                      {message.role === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-2"
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your data..."
                className="bg-input border-border"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!chatInput.trim() || isTyping}
                className="bg-primary text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
