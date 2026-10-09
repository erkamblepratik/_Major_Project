'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Settings2, Sparkles, ArrowRight, AlertCircle, Check, Zap } from 'lucide-react'
import { toast } from 'sonner'

export function PreprocessingPage() {
  const {
    dataset,
    datasetStats,
    preprocessingOptions,
    setPreprocessingOptions,
    processedDataset,
    setProcessedDataset,
    setCurrentPage,
  } = useAppStore()

  const [isProcessing, setIsProcessing] = useState(false)
  const [showComparison, setShowComparison] = useState(!!processedDataset)

  // Default: select all numeric features so the panel is never empty
  useEffect(() => {
    if (
      datasetStats &&
      datasetStats.numericColumns.length > 0 &&
      preprocessingOptions.selectedFeatures.length === 0
    ) {
      setPreprocessingOptions({ selectedFeatures: datasetStats.numericColumns })
    }
  }, [datasetStats, preprocessingOptions.selectedFeatures.length, setPreprocessingOptions])

  const previewData = showComparison && processedDataset ? processedDataset : dataset

  const handleFeatureToggle = (feature: string) => {
    const selected = preprocessingOptions.selectedFeatures
    if (selected.includes(feature)) {
      setPreprocessingOptions({
        selectedFeatures: selected.filter((f) => f !== feature),
      })
    } else {
      setPreprocessingOptions({
        selectedFeatures: [...selected, feature],
      })
    }
  }

  const applyPreprocessing = () => {
    if (!dataset) return

    setIsProcessing(true)
    setTimeout(() => {
      let processed = [...dataset]

      // Handle missing values
      if (preprocessingOptions.handleMissing) {
        processed = processed.map((row) => {
          const newRow = { ...row }
          Object.keys(newRow).forEach((key) => {
            if (newRow[key] === null || newRow[key] === '') {
              const col = dataset.map((r) => r[key]).filter((v) => v !== null && v !== '')
              const numericCol = col.filter((v) => typeof v === 'number') as number[]
              
              if (numericCol.length > 0) {
                switch (preprocessingOptions.handleMissing) {
                  case 'mean':
                    newRow[key] = numericCol.reduce((a, b) => a + b, 0) / numericCol.length
                    break
                  case 'median':
                    const sorted = [...numericCol].sort((a, b) => a - b)
                    newRow[key] = sorted[Math.floor(sorted.length / 2)]
                    break
                  case 'mode':
                    const counts = new Map<number, number>()
                    numericCol.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1))
                    let maxCount = 0
                    let mode = numericCol[0]
                    counts.forEach((count, val) => {
                      if (count > maxCount) {
                        maxCount = count
                        mode = val
                      }
                    })
                    newRow[key] = mode
                    break
                  case 'drop':
                    // Will filter out later
                    break
                }
              }
            }
          })
          return newRow
        })

        if (preprocessingOptions.handleMissing === 'drop') {
          processed = processed.filter((row) =>
            Object.values(row).every((v) => v !== null && v !== '')
          )
        }
      }

      // Normalize numeric columns
      if (preprocessingOptions.normalize && datasetStats) {
        datasetStats.numericColumns.forEach((col) => {
          const values = processed.map((r) => r[col]).filter((v) => typeof v === 'number') as number[]
          if (values.length === 0) return
          const min = Math.min(...values)
          const max = Math.max(...values)
          const range = max - min || 1

          processed = processed.map((row) => ({
            ...row,
            [col]: typeof row[col] === 'number' ? ((row[col] as number) - min) / range : row[col],
          }))
        })
      }

      // Feature selection: keep selected numeric features + all categorical columns
      const selected = preprocessingOptions.selectedFeatures
      if (datasetStats && selected.length > 0 && selected.length < datasetStats.numericColumns.length) {
        const keep = new Set([...selected, ...datasetStats.categoricalColumns])
        processed = processed.map((row) => {
          const newRow: typeof row = {}
          Object.keys(row).forEach((key) => {
            if (keep.has(key)) newRow[key] = row[key]
          })
          return newRow
        })
      }

      setProcessedDataset(processed)
      setShowComparison(true)
      setIsProcessing(false)
      toast.success('Preprocessing complete!', {
        description: `${processed.length} rows processed successfully.`,
      })
    }, 1500)
  }

  if (!dataset) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Preprocessing</h1>
          <p className="text-muted-foreground mt-1">Clean and prepare your data</p>
        </div>
        <Card className="glass-card border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Dataset Loaded</h3>
            <p className="text-muted-foreground mb-4">
              Please upload a dataset first before preprocessing.
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
        <h1 className="text-3xl font-bold text-foreground">Data Preprocessing</h1>
        <p className="text-muted-foreground mt-1">
          Clean, normalize, and prepare your dataset for ML analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Options Panel */}
        <Card className="glass-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Preprocessing Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Normalize */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="normalize" className="text-foreground">Normalize Data</Label>
                <p className="text-xs text-muted-foreground mt-1">Scale numeric values to 0-1</p>
              </div>
              <Switch
                id="normalize"
                checked={preprocessingOptions.normalize}
                onCheckedChange={(checked) => setPreprocessingOptions({ normalize: checked })}
              />
            </div>

            {/* Handle Missing Values */}
            <div className="space-y-2">
              <Label className="text-foreground">Handle Missing Values</Label>
              <Select
                value={preprocessingOptions.handleMissing || ''}
                onValueChange={(value) =>
                  setPreprocessingOptions({
                    handleMissing: value as typeof preprocessingOptions.handleMissing,
                  })
                }
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="drop">Drop rows with missing</SelectItem>
                  <SelectItem value="mean">Fill with mean</SelectItem>
                  <SelectItem value="median">Fill with median</SelectItem>
                  <SelectItem value="mode">Fill with mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feature Selection */}
            <div className="space-y-3">
              <Label className="text-foreground">Feature Selection</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {datasetStats?.numericColumns.map((col) => (
                  <div key={col} className="flex items-center gap-2">
                    <Checkbox
                      id={col}
                      checked={preprocessingOptions.selectedFeatures.includes(col)}
                      onCheckedChange={() => handleFeatureToggle(col)}
                    />
                    <Label htmlFor={col} className="text-sm text-muted-foreground cursor-pointer">
                      {col}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={applyPreprocessing}
              disabled={isProcessing}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Apply Preprocessing
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="glass-card border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                {showComparison ? 'After preprocessing' : 'Original data'}
              </CardDescription>
            </div>
            {showComparison && (
              <Button onClick={() => setCurrentPage('visualization')} className="bg-accent text-accent-foreground">
                Continue to Visualization
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    {Object.keys(previewData[0]).slice(0, 6).map((header) => (
                      <TableHead key={header} className="text-muted-foreground whitespace-nowrap">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 8).map((row, i) => (
                    <TableRow key={i} className="border-border hover:bg-primary/5">
                      {Object.values(row).slice(0, 6).map((value, j) => (
                        <TableCell key={j} className="text-foreground whitespace-nowrap">
                          {value === null ? (
                            <span className="text-destructive italic">null</span>
                          ) : typeof value === 'number' ? (
                            value.toFixed(2)
                          ) : (
                            String(value)
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preprocessing Summary */}
      {showComparison && (
        <Card className="glass-card border-border neon-glow-cyan">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Preprocessing Complete</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Your data has been cleaned and is ready for visualization and ML analysis.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Applied:</p>
                <div className="flex gap-2 mt-1">
                  {preprocessingOptions.normalize && (
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">Normalized</span>
                  )}
                  {preprocessingOptions.handleMissing && (
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                      Missing: {preprocessingOptions.handleMissing}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
