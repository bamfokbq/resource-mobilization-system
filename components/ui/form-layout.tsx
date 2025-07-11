"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Save, Send, AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { Progress } from "./progress"
import { Badge } from "./badge"

// Form Layout Component
interface FormLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  variant?: "default" | "card" | "split" | "modal"
  showProgress?: boolean
  currentStep?: number
  totalSteps?: number
  onSubmit?: (e: React.FormEvent) => void
  isLoading?: boolean
  hasErrors?: boolean
}

const FormLayout = ({ 
  children,
  title,
  description,
  className,
  variant = "default",
  showProgress = false,
  currentStep = 1,
  totalSteps = 1,
  onSubmit,
  isLoading = false,
  hasErrors = false
}: FormLayoutProps) => {
  const layoutClasses = {
    default: "max-w-4xl mx-auto space-y-8",
    card: "max-w-4xl mx-auto bg-white rounded-xl shadow-lg border space-y-8",
    split: "max-w-6xl mx-auto grid lg:grid-cols-3 gap-8",
    modal: "max-w-2xl mx-auto space-y-6"
  }

  const FormHeader = () => {
    if (!title && !description && !showProgress) return null

    return (
      <div className={cn(
        "space-y-4",
        variant === "card" && "p-8 pb-0",
        variant === "modal" && "text-center"
      )}>
        {/* Progress Bar */}
        {showProgress && totalSteps > 1 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-muted-foreground">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <Progress 
              value={(currentStep / totalSteps) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Title & Description */}
        {(title || description) && (
          <div className="space-y-2">
            {title && (
              <div className="flex items-center gap-3">
                <h1 className={cn(
                  "font-bold tracking-tight",
                  variant === "modal" ? "text-2xl" : "text-3xl"
                )}>
                  {title}
                </h1>
                {hasErrors && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Errors
                  </Badge>
                )}
              </div>
            )}
            {description && (
              <p className={cn(
                "text-muted-foreground leading-relaxed",
                variant === "modal" ? "text-sm" : "text-lg"
              )}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  const FormContent = () => (
    <div className={cn(
      variant === "card" && "px-8 pb-8",
      variant === "split" && "lg:col-span-2"
    )}>
      {children}
    </div>
  )

  if (variant === "split") {
    return (
      <div className={cn(layoutClasses[variant], className)}>
        <div className="lg:col-span-1 space-y-6">
          <FormHeader />
          {/* Sidebar content can be added here */}
        </div>
        <FormContent />
      </div>
    )
  }

  return (
    <div className={cn(layoutClasses[variant], className)}>
      <form onSubmit={onSubmit} noValidate>
        <FormHeader />
        <FormContent />
      </form>
    </div>
  )
}

// Form Navigation Component
interface FormNavigationProps {
  onPrevious?: () => void
  onNext?: () => void
  onSave?: () => void
  onSubmit?: () => void
  previousLabel?: string
  nextLabel?: string
  saveLabel?: string
  submitLabel?: string
  showPrevious?: boolean
  showNext?: boolean
  showSave?: boolean
  showSubmit?: boolean
  isLoading?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
  canProceed?: boolean
  className?: string
  variant?: "default" | "separated" | "floating"
}

const FormNavigation = ({
  onPrevious,
  onNext,
  onSave,
  onSubmit,
  previousLabel = "Previous",
  nextLabel = "Next",
  saveLabel = "Save Draft",
  submitLabel = "Submit",
  showPrevious = true,
  showNext = true,
  showSave = false,
  showSubmit = false,
  isLoading = false,
  isFirstStep = false,
  isLastStep = false,
  canProceed = true,
  className,
  variant = "default"
}: FormNavigationProps) => {
  const navigationClasses = {
    default: "flex items-center justify-between pt-8 border-t",
    separated: "flex items-center justify-between py-6 px-8 mt-8 bg-muted/30 border-t",
    floating: "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 bg-background border rounded-lg shadow-lg"
  }

  return (
    <div className={cn(navigationClasses[variant], className)}>
      {/* Left side - Previous/Save */}
      <div className="flex items-center gap-3">
        {showPrevious && !isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {previousLabel}
          </Button>
        )}
        
        {showSave && (
          <Button
            type="button"
            variant="outline"
            onClick={onSave}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saveLabel}
          </Button>
        )}
      </div>

      {/* Right side - Next/Submit */}
      <div className="flex items-center gap-3">
        {showNext && !isLastStep && (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className="gap-2"
          >
            {nextLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {showSubmit && (isLastStep || !showNext) && (
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={!canProceed || isLoading}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isLoading ? "Submitting..." : submitLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

// Form Step Indicator
interface FormStepIndicatorProps {
  steps: Array<{
    label: string
    description?: string
    completed?: boolean
    current?: boolean
    optional?: boolean
  }>
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "minimal" | "dots"
  className?: string
}

const FormStepIndicator = ({
  steps,
  orientation = "horizontal",
  variant = "default",
  className
}: FormStepIndicatorProps) => {
  const containerClasses = {
    horizontal: "flex items-center",
    vertical: "flex flex-col"
  }

  const StepItem = ({ step, index, isLast }: { 
    step: typeof steps[0], 
    index: number, 
    isLast: boolean 
  }) => {
    const stepNumber = index + 1
    
    return (
      <div className={cn(
        "flex items-center",
        orientation === "vertical" && "flex-col text-center",
        !isLast && orientation === "horizontal" && "flex-1"
      )}>
        <div className="flex items-center">
          {/* Step Circle */}
          <div className={cn(
            "flex items-center justify-center rounded-full border-2 font-semibold transition-colors",
            variant === "dots" ? "h-3 w-3" : "h-10 w-10 text-sm",
            step.completed 
              ? "bg-primary border-primary text-primary-foreground"
              : step.current
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted-foreground/30 bg-background text-muted-foreground"
          )}>
            {variant !== "dots" && (
              step.completed ? "✓" : stepNumber
            )}
          </div>

          {/* Step Label */}
          {variant !== "minimal" && (
            <div className={cn(
              "ml-3",
              orientation === "vertical" && "ml-0 mt-2"
            )}>
              <div className={cn(
                "text-sm font-medium",
                step.current ? "text-primary" : "text-foreground"
              )}>
                {step.label}
                {step.optional && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (Optional)
                  </span>
                )}
              </div>
              {step.description && (
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Connector Line */}
        {!isLast && orientation === "horizontal" && (
          <div className={cn(
            "flex-1 h-px mx-4",
            step.completed ? "bg-primary" : "bg-muted-foreground/30"
          )} />
        )}
      </div>
    )
  }

  return (
    <div className={cn(containerClasses[orientation], className)}>
      {steps.map((step, index) => (
        <StepItem
          key={index}
          step={step}
          index={index}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  )
}

export {
  FormLayout,
  FormNavigation,
  FormStepIndicator
}
