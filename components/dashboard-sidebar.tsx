'use client'

import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  Brain,
  LayoutDashboard,
  Upload,
  Settings2,
  BarChart3,
  Cpu,
  Lightbulb,
  MessageSquare,
  Home,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Dataset', icon: Upload },
  { id: 'preprocessing', label: 'Preprocessing', icon: Settings2 },
  { id: 'visualization', label: 'Visualization', icon: BarChart3 },
  { id: 'ml-analysis', label: 'ML Analysis', icon: Cpu },
  { id: 'decision-support', label: 'Decision Support', icon: Lightbulb },
] as const

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const currentPage = useAppStore((state) => state.currentPage)
  const setCurrentPage = useAppStore((state) => state.setCurrentPage)

  return (
    <aside
      className={cn(
        'h-screen glass border-r border-border flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 neon-glow-cyan">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-foreground">
            Data<span className="text-primary">Mind</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as typeof currentPage)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-primary/10',
                isActive && 'bg-primary/20 neon-glow-cyan',
                collapsed && 'justify-center'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              {!collapsed && (
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Chat Button */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage('landing')}
          className={cn(
            'w-full justify-start gap-3 border-border hover:bg-secondary',
            collapsed && 'justify-center'
          )}
        >
          <Home className="w-5 h-5" />
          {!collapsed && <span>Home</span>}
        </Button>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  )
}
