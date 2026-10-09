'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Database,
  Rows3,
  Columns3,
  AlertTriangle,
  Upload,
  BarChart3,
  Cpu,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

export function DashboardOverview() {
  const { dataset, datasetStats, mlResults, setCurrentPage, datasetName } = useAppStore()

  const quickActions = [
    { label: 'Upload Dataset', icon: Upload, page: 'upload' as const, color: 'primary' },
    { label: 'Visualize Data', icon: BarChart3, page: 'visualization' as const, color: 'accent' },
    { label: 'Run ML Analysis', icon: Cpu, page: 'ml-analysis' as const, color: 'primary' },
    { label: 'Get Insights', icon: Lightbulb, page: 'decision-support' as const, color: 'accent' },
  ]

  const stats = [
    {
      label: 'Total Rows',
      value: datasetStats?.rows ?? '—',
      icon: Rows3,
      color: 'text-primary',
    },
    {
      label: 'Total Columns',
      value: datasetStats?.columns ?? '—',
      icon: Columns3,
      color: 'text-accent',
    },
    {
      label: 'Missing Values',
      value: datasetStats?.missingValues ?? '—',
      icon: AlertTriangle,
      color: 'text-chart-5',
    },
    {
      label: 'Model Accuracy',
      value: mlResults ? `${(mlResults.accuracy * 100).toFixed(1)}%` : '—',
      icon: TrendingUp,
      color: 'text-chart-4',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          {dataset ? `Analyzing: ${datasetName || 'Uploaded Dataset'}` : 'Welcome to DataMind AI. Upload a dataset to get started.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={() => setCurrentPage(action.page)}
                className="h-auto py-4 flex flex-col items-center gap-2 border-border hover:bg-primary/10 hover:border-primary/50"
              >
                <action.icon className={`w-6 h-6 ${action.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Pipeline Status */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Analysis Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {[
              { label: 'Upload', done: !!dataset },
              { label: 'Preprocess', done: !!dataset },
              { label: 'Visualize', done: !!dataset },
              { label: 'ML Analysis', done: !!mlResults },
              { label: 'Insights', done: !!mlResults },
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.done
                        ? 'bg-primary/20 text-primary neon-glow-cyan'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{i + 1}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step.done ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      {!dataset && (
        <Card className="glass-card border-border neon-glow-cyan">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Get Started</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Upload your first dataset to unlock AI-powered analysis and insights.
                </p>
              </div>
              <Button onClick={() => setCurrentPage('upload')} className="bg-primary text-primary-foreground">
                Upload Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
