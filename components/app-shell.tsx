'use client'

import { useAppStore } from '@/lib/store'
import { LandingPage } from './landing-page'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardOverview } from './dashboard-overview'
import { UploadPage } from './upload-page'
import { PreprocessingPage } from './preprocessing-page'
import { VisualizationPage } from './visualization-page'
import { MLAnalysisPage } from './ml-analysis-page'
import { DecisionSupportPage } from './decision-support-page'
import { ReportView } from './report-view'

export function AppShell() {
  const currentPage = useAppStore((state) => state.currentPage)

  // Landing page is full-screen without sidebar
  if (currentPage === 'landing') {
    return <LandingPage />
  }

  // Dashboard pages have sidebar
  return (
    <>
    <div className="flex min-h-screen animated-gradient screen-only">
      {/* Grid overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      
      {/* Sidebar */}
      <div className="relative z-10">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {currentPage === 'dashboard' && <DashboardOverview />}
          {currentPage === 'upload' && <UploadPage />}
          {currentPage === 'preprocessing' && <PreprocessingPage />}
          {currentPage === 'visualization' && <VisualizationPage />}
          {currentPage === 'ml-analysis' && <MLAnalysisPage />}
          {currentPage === 'decision-support' && <DecisionSupportPage />}
        </div>
      </main>
    </div>

    {/* Print-only comprehensive report */}
    <ReportView />
    </>
  )
}
