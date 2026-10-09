'use client'

import { useAppStore } from '@/lib/store'
import { AnimatedBackground } from './animated-background'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Upload, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Database, 
  Cpu, 
  LineChart,
  Shield,
  Zap
} from 'lucide-react'

export function LandingPage() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage)

  const features = [
    {
      icon: Upload,
      title: 'Smart Upload',
      description: 'Drag & drop CSV or Excel files with instant parsing and validation.',
    },
    {
      icon: Database,
      title: 'Auto Preprocessing',
      description: 'Intelligent data cleaning, normalization, and feature engineering.',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Interactive charts and heatmaps for deep data exploration.',
    },
    {
      icon: Cpu,
      title: 'ML Models',
      description: 'KNN, Decision Trees, Neural Networks - one click to train.',
    },
    {
      icon: LineChart,
      title: 'Real-time Insights',
      description: 'AI-generated recommendations and pattern detection.',
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Automatic risk scoring and actionable warnings.',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Grid overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center neon-glow-cyan">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Data<span className="text-primary">Mind</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#demo" className="hover:text-primary transition-colors">Demo</a>
        </div>
        <Button 
          onClick={() => setCurrentPage('dashboard')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-cyan"
        >
          Launch App
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">ML-Powered Analysis Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Transform Data into</span>
            <br />
            <span className="text-primary neon-text-cyan">Smart Decisions</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload your datasets, let AI analyze patterns, visualize insights, 
            and receive intelligent decision support — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => setCurrentPage('upload')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-cyan px-8 py-6 text-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Dataset
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage('dashboard')}
              className="border-border hover:bg-secondary px-8 py-6 text-lg"
            >
              Start Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            {[
              { value: '99.2%', label: 'Accuracy' },
              { value: '< 1s', label: 'Analysis Time' },
              { value: '5+', label: 'ML Models' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary neon-text-cyan">{stat.value}</div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Powerful Features for </span>
              <span className="text-accent neon-text-purple">Data Excellence</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to transform raw data into actionable intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="glass-card rounded-xl p-6 hover:neon-glow-cyan transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">How It </span>
              <span className="text-primary neon-text-cyan">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Drop your CSV or Excel file', icon: Upload },
              { step: '02', title: 'Process', desc: 'Auto-clean and preprocess', icon: Zap },
              { step: '03', title: 'Analyze', desc: 'Run ML models instantly', icon: Cpu },
              { step: '04', title: 'Decide', desc: 'Get AI-powered insights', icon: Brain },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 neon-glow-cyan">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-xs text-primary font-mono mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-12 text-center neon-glow-purple">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Transform Your Data?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Start analyzing your datasets with AI-powered insights today.
            </p>
            <Button 
              size="lg"
              onClick={() => setCurrentPage('dashboard')}
              className="bg-accent text-accent-foreground hover:bg-accent/90 neon-glow-purple px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-foreground font-semibold">DataMind AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Integrated ML-Based Automated Data Analysis & Decision Support System
          </p>
        </div>
      </footer>
    </div>
  )
}
