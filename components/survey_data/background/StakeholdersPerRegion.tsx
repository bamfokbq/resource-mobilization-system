"use client";

import React from 'react'
import StakeholdersTable from '@/components/tables/StakeholdersTable'
import { REGIONAL_SECTOR_DATA } from '@/constant'
import SectorMap from '@/components/chart_and_graphics/SectorMap'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from 'motion/react'
import { MapIcon, UsersIcon, Building2Icon } from "lucide-react"

export default function StakeholdersPerRegion() {
  return (
    <motion.section 
      className='mb-8' 
      id='stakeholders-per-region'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-navy-blue to-blue-800 rounded-2xl p-8 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Stakeholders Per Region</h1>
            <p className='text-blue-100 text-lg'>
              Regional distribution of stakeholders and organizations involved in NCD activities across Ghana
            </p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MapIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Interactive Regional View</CardTitle>
              <CardDescription className="text-emerald-100">
                Explore stakeholder distribution through map visualization and detailed table
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[80vh]'>
            <motion.div 
              className='relative overflow-hidden w-full h-[80vh] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SectorMap regionalData={REGIONAL_SECTOR_DATA} />
            </motion.div>
            <motion.div 
              className='h-[80vh] bg-gradient-to-br from-white to-gray-50 rounded-xl border overflow-hidden'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="p-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                <div className="flex items-center gap-2">
                  <Building2Icon className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Stakeholder Directory</h3>
                </div>
              </div>
              <div className="h-[calc(80vh-60px)] overflow-y-auto">
                <StakeholdersTable />
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
