"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

import { ErrorFallback } from "@/components/error-fallback"

type ErrorBoundaryProps = {
  children: ReactNode
  title?: string
  showHeader?: boolean
  variant?: "page" | "panel"
  className?: string
  onError?: (error: Error, info: ErrorInfo) => void
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          reset={this.reset}
          title={this.props.title}
          showHeader={this.props.showHeader}
          variant={this.props.variant}
          className={this.props.className}
        />
      )
    }

    return this.props.children
  }
}
