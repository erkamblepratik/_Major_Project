'use client'

import { useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { generateDummyDataset, calculateStats } from '@/lib/dummy-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Upload, FileSpreadsheet, Rows3, Columns3, AlertTriangle, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { dataset, setDataset, setDatasetName, setDatasetStats, datasetStats, setCurrentPage } = useAppStore()

  const processFile = async (file: File) => {
    setIsLoading(true)
    setDatasetName(file.name)

    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
      
      const data = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''))
        const row: Record<string, string | number | null> = {}
        headers.forEach((header, i) => {
          const val = values[i]
          if (val === '' || val === undefined) {
            row[header] = null
          } else if (!isNaN(Number(val))) {
            row[header] = Number(val)
          } else {
            row[header] = val
          }
        })
        return row
      })

      setDataset(data)
      setDatasetStats(calculateStats(data))
      toast.success('Dataset uploaded successfully!', {
        description: `${data.length} rows and ${headers.length} columns loaded.`,
      })
    } catch {
      toast.error('Failed to parse file', {
        description: 'Please ensure your file is a valid CSV.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
        processFile(file)
      } else {
        toast.error('Invalid file type', {
          description: 'Please upload a CSV or Excel file.',
        })
      }
    },
    []
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const loadDemoData = () => {
    setIsLoading(true)
    setTimeout(() => {
      const data = generateDummyDataset(100)
      setDataset(data)
      setDatasetName('demo_business_data.csv')
      setDatasetStats(calculateStats(data))
      setIsLoading(false)
      toast.success('Demo dataset loaded!', {
        description: '100 rows of sample business data ready for analysis.',
      })
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Dataset</h1>
        <p className="text-muted-foreground mt-1">
          Upload your CSV or Excel file to begin analysis
        </p>
      </div>

      {/* Upload Zone */}
      <Card className="glass-card border-border">
        <CardContent className="p-8">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/10 neon-glow-cyan'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragging ? 'Drop your file here' : 'Drag & Drop your dataset'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Supports CSV and Excel files
            </p>
            <div className="flex items-center justify-center gap-4">
              <label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Browse Files
                  </span>
                </Button>
              </label>
              <span className="text-muted-foreground text-sm">or</span>
              <Button onClick={loadDemoData} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="w-4 h-4 mr-2" />
                Load Demo Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="glass-card border-border">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Processing your dataset...</p>
          </CardContent>
        </Card>
      )}

      {/* Dataset Stats */}
      {dataset && datasetStats && !isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Rows3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Rows</p>
                  <p className="text-2xl font-bold text-primary">{datasetStats.rows}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Columns3 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Columns</p>
                  <p className="text-2xl font-bold text-accent">{datasetStats.columns}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-chart-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Missing Values</p>
                  <p className="text-2xl font-bold text-chart-5">{datasetStats.missingValues}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Preview */}
          <Card className="glass-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Data Preview</CardTitle>
              <Button onClick={() => setCurrentPage('preprocessing')} className="bg-primary text-primary-foreground">
                <Check className="w-4 h-4 mr-2" />
                Continue to Preprocessing
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      {Object.keys(dataset[0]).map((header) => (
                        <TableHead key={header} className="text-muted-foreground whitespace-nowrap">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.slice(0, 10).map((row, i) => (
                      <TableRow key={i} className="border-border hover:bg-primary/5">
                        {Object.values(row).map((value, j) => (
                          <TableCell key={j} className="text-foreground whitespace-nowrap">
                            {value === null ? <span className="text-muted-foreground italic">null</span> : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {dataset.length > 10 && (
                <p className="text-muted-foreground text-sm mt-4 text-center">
                  Showing 10 of {dataset.length} rows
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
