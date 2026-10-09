'use client'

import { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { BarChart3, PieChart, Grid3X3, AlertCircle, ArrowRight } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
} from 'recharts'

const COLORS = ['#64ffda', '#bb86fc', '#82ca9d', '#ffc658', '#ff7c7c', '#8884d8']

export function VisualizationPage() {
  const { dataset, datasetStats, setCurrentPage } = useAppStore()
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'heatmap'>('bar')
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [xColumn, setXColumn] = useState<string>('')
  const [yColumn, setYColumn] = useState<string>('')

  // Set default columns when data is available
  useMemo(() => {
    if (datasetStats && !selectedColumn) {
      if (datasetStats.categoricalColumns.length > 0) {
        setSelectedColumn(datasetStats.categoricalColumns[0])
      }
      if (datasetStats.numericColumns.length > 0) {
        setXColumn(datasetStats.numericColumns[0])
        setYColumn(datasetStats.numericColumns[1] || datasetStats.numericColumns[0])
      }
    }
  }, [datasetStats, selectedColumn])

  const barChartData = useMemo(() => {
    if (!dataset || !selectedColumn) return []
    
    const counts = new Map<string, number>()
    dataset.forEach((row) => {
      const val = String(row[selectedColumn] || 'Unknown')
      counts.set(val, (counts.get(val) || 0) + 1)
    })
    
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [dataset, selectedColumn])

  const pieChartData = useMemo(() => {
    return barChartData.slice(0, 6)
  }, [barChartData])

  const scatterData = useMemo(() => {
    if (!dataset || !xColumn || !yColumn) return []
    
    return dataset
      .filter((row) => typeof row[xColumn] === 'number' && typeof row[yColumn] === 'number')
      .slice(0, 200)
      .map((row) => ({
        x: row[xColumn] as number,
        y: row[yColumn] as number,
      }))
  }, [dataset, xColumn, yColumn])

  // Correlation matrix data
  const correlationData = useMemo(() => {
    if (!dataset || !datasetStats) return []
    
    const numericCols = datasetStats.numericColumns.slice(0, 6)
    const matrix: { x: string; y: string; value: number }[] = []
    
    numericCols.forEach((col1) => {
      numericCols.forEach((col2) => {
        const values1 = dataset.map((r) => r[col1]).filter((v) => typeof v === 'number') as number[]
        const values2 = dataset.map((r) => r[col2]).filter((v) => typeof v === 'number') as number[]
        
        if (values1.length === 0 || values2.length === 0) {
          matrix.push({ x: col1, y: col2, value: 0 })
          return
        }
        
        const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length
        const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length
        
        let num = 0
        let den1 = 0
        let den2 = 0
        
        for (let i = 0; i < Math.min(values1.length, values2.length); i++) {
          num += (values1[i] - mean1) * (values2[i] - mean2)
          den1 += (values1[i] - mean1) ** 2
          den2 += (values2[i] - mean2) ** 2
        }
        
        const correlation = den1 && den2 ? num / Math.sqrt(den1 * den2) : 0
        matrix.push({ x: col1, y: col2, value: parseFloat(correlation.toFixed(2)) })
      })
    })
    
    return matrix
  }, [dataset, datasetStats])

  if (!dataset) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Visualization</h1>
          <p className="text-muted-foreground mt-1">Interactive charts and graphs</p>
        </div>
        <Card className="glass-card border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Dataset Loaded</h3>
            <p className="text-muted-foreground mb-4">
              Please upload a dataset first to visualize your data.
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
          <h1 className="text-3xl font-bold text-foreground">Data Visualization</h1>
          <p className="text-muted-foreground mt-1">
            Explore your data through interactive charts
          </p>
        </div>
        <Button onClick={() => setCurrentPage('ml-analysis')} className="bg-primary text-primary-foreground">
          Continue to ML Analysis
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Chart Type Selection */}
      <div className="flex gap-2">
        {[
          { type: 'bar', label: 'Bar Chart', icon: BarChart3 },
          { type: 'pie', label: 'Pie Chart', icon: PieChart },
          { type: 'heatmap', label: 'Correlation', icon: Grid3X3 },
        ].map((item) => (
          <Button
            key={item.type}
            variant={chartType === item.type ? 'default' : 'outline'}
            onClick={() => setChartType(item.type as typeof chartType)}
            className={
              chartType === item.type
                ? 'bg-primary text-primary-foreground'
                : 'border-border hover:bg-primary/10'
            }
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="glass-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Chart Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(chartType === 'bar' || chartType === 'pie') && (
              <div className="space-y-2">
                <Label>Select Column</Label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Choose column" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {datasetStats?.categoricalColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {chartType === 'heatmap' && (
              <>
                <div className="space-y-2">
                  <Label>X Axis</Label>
                  <Select value={xColumn} onValueChange={setXColumn}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Choose column" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {datasetStats?.numericColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Y Axis</Label>
                  <Select value={yColumn} onValueChange={setYColumn}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Choose column" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {datasetStats?.numericColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Tip:</span> Use bar charts for
                categorical comparisons, pie charts for proportions, and correlation heatmaps for
                numeric relationships.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chart Display */}
        <Card className="glass-card border-border lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {chartType === 'bar' && 'Distribution by ' + selectedColumn}
              {chartType === 'pie' && 'Proportion by ' + selectedColumn}
              {chartType === 'heatmap' && 'Scatter Plot & Correlation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {chartType === 'bar' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#888', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: '#888' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="#64ffda" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {chartType === 'pie' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}

              {chartType === 'heatmap' && (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name={xColumn}
                      tick={{ fill: '#888' }}
                      label={{ value: xColumn, position: 'bottom', fill: '#888' }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name={yColumn}
                      tick={{ fill: '#888' }}
                      label={{ value: yColumn, angle: -90, position: 'left', fill: '#888' }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Scatter data={scatterData} fill="#bb86fc" />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Matrix */}
      {chartType === 'heatmap' && correlationData.length > 0 && (
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Correlation Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${datasetStats?.numericColumns.slice(0, 6).length || 0}, minmax(80px, 1fr))` }}>
                {correlationData.map((cell, i) => {
                  const intensity = Math.abs(cell.value)
                  const color = cell.value >= 0 ? `rgba(100, 255, 218, ${intensity})` : `rgba(255, 124, 124, ${intensity})`
                  return (
                    <div
                      key={i}
                      className="aspect-square flex items-center justify-center text-xs font-mono rounded"
                      style={{ backgroundColor: color }}
                      title={`${cell.x} vs ${cell.y}: ${cell.value}`}
                    >
                      {cell.value.toFixed(2)}
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-2 mt-4 text-xs text-muted-foreground">
                {datasetStats?.numericColumns.slice(0, 6).map((col) => (
                  <span key={col} className="flex-1 text-center truncate">{col}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
