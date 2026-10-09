'use client'

import { useAppStore } from '@/lib/store'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'

const COLORS = ['#0891b2', '#7c3aed', '#059669', '#d97706', '#dc2626', '#4f46e5']

/**
 * ReportView renders a clean, print-only analysis report that aggregates every
 * stage of the pipeline: dataset summary, preprocessing, visualizations,
 * ML analysis, and decision-support insights. It is hidden on screen and only
 * displayed when printing (see the `.report-view` rules in globals.css).
 * Charts use fixed dimensions (not ResponsiveContainer) so they render even
 * while the container is hidden off-screen.
 */
export function ReportView() {
  const {
    dataset,
    datasetName,
    datasetStats,
    preprocessingOptions,
    processedDataset,
    selectedModel,
    mlResults,
    insights,
    riskLevel,
  } = useAppStore()

  // Build categorical distribution for a bar/pie chart
  const firstCategorical = datasetStats?.categoricalColumns[0]
  const distributionData = (() => {
    if (!dataset || !firstCategorical) return []
    const counts = new Map<string, number>()
    dataset.forEach((row) => {
      const val = String(row[firstCategorical] ?? 'Unknown')
      counts.set(val, (counts.get(val) || 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  })()

  // Correlation matrix for numeric columns
  const numericCols = datasetStats?.numericColumns.slice(0, 6) || []
  const correlation = (() => {
    if (!dataset) return [] as { x: string; y: string; value: number }[]
    const matrix: { x: string; y: string; value: number }[] = []
    numericCols.forEach((col1) => {
      numericCols.forEach((col2) => {
        const v1 = dataset.map((r) => r[col1]).filter((v) => typeof v === 'number') as number[]
        const v2 = dataset.map((r) => r[col2]).filter((v) => typeof v === 'number') as number[]
        if (!v1.length || !v2.length) {
          matrix.push({ x: col1, y: col2, value: 0 })
          return
        }
        const m1 = v1.reduce((a, b) => a + b, 0) / v1.length
        const m2 = v2.reduce((a, b) => a + b, 0) / v2.length
        let num = 0
        let d1 = 0
        let d2 = 0
        for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
          num += (v1[i] - m1) * (v2[i] - m2)
          d1 += (v1[i] - m1) ** 2
          d2 += (v2[i] - m2) ** 2
        }
        const corr = d1 && d2 ? num / Math.sqrt(d1 * d2) : 0
        matrix.push({ x: col1, y: col2, value: parseFloat(corr.toFixed(2)) })
      })
    })
    return matrix
  })()

  const reportDate = new Date().toLocaleString()

  if (!dataset) {
    return (
      <div className="report-view">
        <h1>ML Analysis Report</h1>
        <p>No dataset has been loaded. Upload data and run the analysis to generate a report.</p>
      </div>
    )
  }

  return (
    <div className="report-view">
      {/* Report Header */}
      <header className="report-header">
        <h1>Machine Learning Analysis Report</h1>
        <p className="report-meta">
          Dataset: <strong>{datasetName || 'Untitled dataset'}</strong> &nbsp;|&nbsp; Generated: {reportDate}
        </p>
      </header>

      {/* 1. Dataset Overview */}
      <section className="report-section">
        <h2>1. Dataset Overview</h2>
        <table className="report-table">
          <tbody>
            <tr>
              <th>Total Rows</th>
              <td>{datasetStats?.rows ?? '-'}</td>
              <th>Total Columns</th>
              <td>{datasetStats?.columns ?? '-'}</td>
            </tr>
            <tr>
              <th>Missing Values</th>
              <td>{datasetStats?.missingValues ?? '-'}</td>
              <th>Numeric / Categorical</th>
              <td>
                {datasetStats?.numericColumns.length ?? 0} / {datasetStats?.categoricalColumns.length ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="report-note">
          <strong>Numeric columns:</strong> {datasetStats?.numericColumns.join(', ') || 'none'}
        </p>
        <p className="report-note">
          <strong>Categorical columns:</strong> {datasetStats?.categoricalColumns.join(', ') || 'none'}
        </p>
      </section>

      {/* 2. Preprocessing Report */}
      <section className="report-section">
        <h2>2. Preprocessing Report</h2>
        {processedDataset ? (
          <table className="report-table">
            <tbody>
              <tr>
                <th>Normalization</th>
                <td>{preprocessingOptions.normalize ? 'Applied (0–1 scaling)' : 'Not applied'}</td>
              </tr>
              <tr>
                <th>Missing Value Handling</th>
                <td>{preprocessingOptions.handleMissing ? preprocessingOptions.handleMissing : 'Not applied'}</td>
              </tr>
              <tr>
                <th>Selected Features</th>
                <td>{preprocessingOptions.selectedFeatures.join(', ') || 'All features'}</td>
              </tr>
              <tr>
                <th>Rows Before → After</th>
                <td>
                  {dataset.length} → {processedDataset.length}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="report-note">Preprocessing has not been run for this dataset.</p>
        )}
      </section>

      {/* 3. Visualizations */}
      <section className="report-section">
        <h2>3. Data Visualizations</h2>
        {distributionData.length > 0 && (
          <div className="report-chart">
            <h3>Distribution by {firstCategorical}</h3>
            <BarChart width={680} height={280} data={distributionData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" tick={{ fill: '#333', fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#333', fontSize: 11 }} />
              <Bar dataKey="value" fill="#0891b2" isAnimationActive={false} radius={[3, 3, 0, 0]} />
            </BarChart>
          </div>
        )}

        {distributionData.length > 0 && (
          <div className="report-chart">
            <h3>Proportion by {firstCategorical}</h3>
            <PieChart width={680} height={300}>
              <Pie
                data={distributionData.slice(0, 6)}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                isAnimationActive={false}
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
              >
                {distributionData.slice(0, 6).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        )}

        {correlation.length > 0 && (
          <div className="report-chart">
            <h3>Correlation Matrix</h3>
            <div
              className="report-corr-grid"
              style={{ gridTemplateColumns: `repeat(${numericCols.length}, 1fr)` }}
            >
              {correlation.map((cell, i) => {
                const intensity = Math.abs(cell.value)
                const color =
                  cell.value >= 0
                    ? `rgba(8, 145, 178, ${intensity})`
                    : `rgba(220, 38, 38, ${intensity})`
                return (
                  <div key={i} className="report-corr-cell" style={{ backgroundColor: color }}>
                    {cell.value.toFixed(2)}
                  </div>
                )
              })}
            </div>
            <div className="report-corr-labels">
              {numericCols.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. ML Analysis */}
      <section className="report-section">
        <h2>4. Machine Learning Analysis</h2>
        {mlResults ? (
          <>
            <p className="report-note">
              <strong>Model:</strong> {mlResults.model} {selectedModel ? '' : ''}
            </p>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1 Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{(mlResults.accuracy * 100).toFixed(1)}%</td>
                  <td>{(mlResults.precision * 100).toFixed(1)}%</td>
                  <td>{(mlResults.recall * 100).toFixed(1)}%</td>
                  <td>{(mlResults.f1Score * 100).toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>

            <div className="report-chart">
              <h3>Feature Importance</h3>
              <BarChart
                width={680}
                height={260}
                data={mlResults.featureImportance}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis type="number" tick={{ fill: '#333', fontSize: 11 }} domain={[0, 0.4]} />
                <YAxis type="category" dataKey="feature" tick={{ fill: '#333', fontSize: 11 }} />
                <Bar dataKey="importance" isAnimationActive={false} radius={[0, 3, 3, 0]}>
                  {mlResults.featureImportance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>

            <div className="report-chart">
              <h3>Confusion Matrix</h3>
              <table className="report-table report-confusion">
                <thead>
                  <tr>
                    <th></th>
                    <th>Predicted Negative</th>
                    <th>Predicted Positive</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Actual Negative</th>
                    <td>{mlResults.confusionMatrix[0][0]} (TN)</td>
                    <td>{mlResults.confusionMatrix[0][1]} (FP)</td>
                  </tr>
                  <tr>
                    <th>Actual Positive</th>
                    <td>{mlResults.confusionMatrix[1][0]} (FN)</td>
                    <td>{mlResults.confusionMatrix[1][1]} (TP)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="report-note">ML analysis has not been run for this dataset.</p>
        )}
      </section>

      {/* 5. Insights & Recommendations */}
      <section className="report-section">
        <h2>5. Decision Support &amp; Insights</h2>
        <p className="report-note">
          <strong>Overall Risk Assessment:</strong> {riskLevel || 'Not assessed'}
        </p>
        {insights.length > 0 ? (
          <ul className="report-insights">
            {insights.map((insight, i) => (
              <li key={i}>
                <strong>[{insight.type.toUpperCase()}] {insight.title}:</strong> {insight.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="report-note">No insights generated yet. Run the ML analysis to produce insights.</p>
        )}
      </section>

      <footer className="report-footer">
        <p>Generated by NeuraData ML Analysis Platform — {reportDate}</p>
      </footer>
    </div>
  )
}
