'use client'

import React, { useState } from 'react'
import { Settings } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from 'motion/react'

// Import our setting components
import RegionsSettings from './settings/RegionsSettings'
import PartnersSettings from './settings/PartnersSettings'
import NCDSettings from './settings/NCDSettings'
import SystemSettings from './settings/SystemSettings'


export default function SettingsManager() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              System Settings
            </h1>
          </div>
          <p className="text-gray-600">Manage system configurations, regions, partners, and NCD types</p>
        </div>
      </motion.div>

      {/* Main Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="regions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-2 shadow-sm">
            <TabsTrigger value="regions" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Regions
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Partners
            </TabsTrigger>
            <TabsTrigger value="ncds" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              NCD Types
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regions">
            <RegionsSettings />
          </TabsContent>

          <TabsContent value="partners">
            <PartnersSettings />
          </TabsContent>

          <TabsContent value="ncds">
            <NCDSettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
