"use client";

import { Filter, X, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'

interface FilterSectionProps {
  children: React.ReactNode
}

export default function FilterSection({ children }: FilterSectionProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isExpanded, setIsExpanded] = useState(true)
    
    const activeFiltersCount = Array.from(searchParams.keys()).length

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams)
        for (const key of Array.from(params.keys())) {
            params.delete(key)
        }
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/50 overflow-hidden">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                                <Filter className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Data Filters</h3>
                                <p className="text-sm text-slate-600">
                                    Refine your data view
                                    {activeFiltersCount > 0 && (
                                        <Badge variant="secondary" className="ml-2 bg-purple-50 text-purple-700">
                                            {activeFiltersCount} active
                                        </Badge>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {activeFiltersCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClearFilters}
                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Clear All
                                    </Button>
                                </motion.div>
                            )}
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-slate-600 hover:bg-slate-100"
                            >
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-white/50 backdrop-blur-sm"
                    >
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {React.Children.map(children, (child, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="space-y-2"
                                    >
                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200">
                                            {child}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Active Filters Summary */}
                            {activeFiltersCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                    className="mt-6 pt-4 border-t border-slate-200"
                                >
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className="font-medium">Active filters:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(searchParams.entries()).map(([key, value], index) => (
                                                <motion.div
                                                    key={`${key}-${value}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                >
                                                    <Badge 
                                                        variant="secondary" 
                                                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                                                        onClick={() => {
                                                            const params = new URLSearchParams(searchParams)
                                                            params.delete(key)
                                                            router.replace(`?${params.toString()}`, { scroll: false })
                                                        }}
                                                    >
                                                        {key}: {value}
                                                        <X className="w-3 h-3 ml-1" />
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
