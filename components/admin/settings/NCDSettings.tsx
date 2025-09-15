'use client'

import React, { useState } from 'react'
import { Heart, Plus, Trash2, Save, X, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EnhancedSelect } from "@/components/ui/enhanced-select"

interface NCDType {
  id: string
  name: string
  description?: string
  category: string
  isActive: boolean
  priority: 'High' | 'Medium' | 'Low'
  prevalenceRate?: number
  targetPopulation?: string
}

// Initial data from the existing codebase
const initialNCDTypes: NCDType[] = [
  { 
    id: '1', 
    name: 'Hypertension', 
    category: 'Cardiovascular', 
    isActive: true, 
    priority: 'High', 
    description: 'High blood pressure management and prevention programs',
    prevalenceRate: 28.3,
    targetPopulation: 'Adults 18+'
  },
  { 
    id: '2', 
    name: 'Diabetes Mellitus', 
    category: 'Metabolic', 
    isActive: true, 
    priority: 'High', 
    description: 'Type 1 and Type 2 diabetes management and prevention',
    prevalenceRate: 3.4,
    targetPopulation: 'Adults 20+'
  },
  { 
    id: '3', 
    name: 'Breast Cancer', 
    category: 'Cancer', 
    isActive: true, 
    priority: 'High', 
    description: 'Breast cancer screening, treatment and survivor support',
    prevalenceRate: 34.6,
    targetPopulation: 'Women 15+'
  },
  { 
    id: '4', 
    name: 'Cervical Cancer', 
    category: 'Cancer', 
    isActive: true, 
    priority: 'High', 
    description: 'Cervical cancer prevention, screening and treatment programs',
    prevalenceRate: 32.5,
    targetPopulation: 'Women 15-44'
  },
  { 
    id: '5', 
    name: 'Mental Health', 
    category: 'Mental Health', 
    isActive: true, 
    priority: 'High', 
    description: 'Mental health and psychosocial support services',
    prevalenceRate: 13.1,
    targetPopulation: 'All ages'
  },
  { 
    id: '6', 
    name: 'COPD & Asthma', 
    category: 'Respiratory', 
    isActive: true, 
    priority: 'Medium', 
    description: 'Chronic obstructive pulmonary disease and asthma management',
    prevalenceRate: 2.1,
    targetPopulation: 'Adults 30+'
  },
  { 
    id: '7', 
    name: 'CVD & Stroke', 
    category: 'Cardiovascular', 
    isActive: true, 
    priority: 'High', 
    description: 'Cardiovascular disease and stroke prevention and management',
    prevalenceRate: 6.2,
    targetPopulation: 'Adults 35+'
  },
  { 
    id: '8', 
    name: 'Childhood Cancers', 
    category: 'Cancer', 
    isActive: true, 
    priority: 'High', 
    description: 'Pediatric cancer diagnosis, treatment and family support',
    prevalenceRate: 0.14,
    targetPopulation: 'Children 0-17'
  },
  { 
    id: '9', 
    name: 'Prostate Cancer', 
    category: 'Cancer', 
    isActive: true, 
    priority: 'Medium', 
    description: 'Prostate cancer screening and treatment for men',
    prevalenceRate: 18.7,
    targetPopulation: 'Men 40+'
  },
  { 
    id: '10', 
    name: 'Sickle Cell Disease', 
    category: 'Genetic', 
    isActive: true, 
    priority: 'High', 
    description: 'Sickle cell disease management and genetic counseling',
    prevalenceRate: 2.0,
    targetPopulation: 'All ages'
  }
]

// NCD categories
const ncdCategories = [
  'Cardiovascular',
  'Cancer', 
  'Metabolic',
  'Respiratory',
  'Mental Health',
  'Neurological',
  'Genetic',
  'Kidney Disease',
  'Musculoskeletal',
  'Other'
]

const priorityLevels = ['High', 'Medium', 'Low'] as const

export default function NCDSettings() {
  const [ncdTypes, setNCDTypes] = useState<NCDType[]>(initialNCDTypes)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNCD, setEditingNCD] = useState<NCDType | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    prevalenceRate: '',
    targetPopulation: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      priority: 'Medium',
      prevalenceRate: '',
      targetPopulation: ''
    })
    setEditingNCD(null)
  }

  const handleOpenModal = (ncd?: NCDType) => {
    if (ncd) {
      setEditingNCD(ncd)
      setFormData({
        name: ncd.name,
        category: ncd.category,
        description: ncd.description || '',
        priority: ncd.priority,
        prevalenceRate: ncd.prevalenceRate?.toString() || '',
        targetPopulation: ncd.targetPopulation || ''
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.category) return

    const ncdData: NCDType = {
      id: editingNCD?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      description: formData.description || undefined,
      priority: formData.priority,
      prevalenceRate: formData.prevalenceRate ? parseFloat(formData.prevalenceRate) : undefined,
      targetPopulation: formData.targetPopulation || undefined,
      isActive: editingNCD?.isActive ?? true
    }

    if (editingNCD) {
      setNCDTypes(ncdTypes.map(n => n.id === editingNCD.id ? ncdData : n))
    } else {
      setNCDTypes([...ncdTypes, ncdData])
    }

    setIsModalOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setNCDTypes(ncdTypes.filter(n => n.id !== id))
  }

  const toggleStatus = (id: string) => {
    setNCDTypes(ncdTypes.map(n => 
      n.id === id ? { ...n, isActive: !n.isActive } : n
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'secondary'
    }
  }

  const highPriorityCount = ncdTypes.filter(n => n.priority === 'High' && n.isActive).length
  const avgPrevalence = ncdTypes.filter(n => n.prevalenceRate && n.isActive)
    .reduce((sum, n) => sum + n.prevalenceRate!, 0) / 
    ncdTypes.filter(n => n.prevalenceRate && n.isActive).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <div>
                <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
                <div className="text-sm text-gray-600">High Priority NCDs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="text-blue-500" size={20} />
              <div>
                <div className="text-2xl font-bold text-blue-600">{ncdTypes.filter(n => n.isActive).length}</div>
                <div className="text-sm text-gray-600">Active NCD Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-2xl font-bold text-green-600">{avgPrevalence.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Avg. Prevalence Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main NCD Management Card */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="text-red-600" size={20} />
              NCD Types Management
            </CardTitle>
            <CardDescription>
              Manage Non-Communicable Disease types ({ncdTypes.filter(n => n.isActive).length} active, {ncdTypes.length} total)
            </CardDescription>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={() => handleOpenModal()}>
                <Plus size={16} />
                Add NCD Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNCD ? 'Edit NCD Type' : 'Add New NCD Type'}
                </DialogTitle>
                <DialogDescription>
                  {editingNCD ? 'Update NCD type information' : 'Add a new non-communicable disease type'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">NCD Name *</label>
                    <Input
                      placeholder="e.g., Hypertension"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority Level *</label>
                    <EnhancedSelect
                      value={formData.priority}
                      onValueChange={(value) => setFormData({...formData, priority: value as 'High' | 'Medium' | 'Low'})}
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </EnhancedSelect>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <EnhancedSelect
                      value={formData.category}
                      onValueChange={(value) => setFormData({...formData, category: value})}
                      placeholder="Select category"
                    >
                      {ncdCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </EnhancedSelect>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Population</label>
                    <Input
                      placeholder="e.g., Adults 18+"
                      value={formData.targetPopulation}
                      onChange={(e) => setFormData({...formData, targetPopulation: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Prevalence Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 28.3"
                    value={formData.prevalenceRate}
                    onChange={(e) => setFormData({...formData, prevalenceRate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Brief description of the NCD type and its management approach..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save size={16} className="mr-2" />
                    {editingNCD ? 'Update' : 'Save'} NCD Type
                  </Button>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NCD Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Prevalence</TableHead>
                  <TableHead>Target Population</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ncdTypes.map((ncd) => (
                  <TableRow key={ncd.id}>
                    <TableCell className="font-medium">{ncd.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ncd.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(ncd.priority) as any}>
                        {ncd.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ncd.prevalenceRate ? `${ncd.prevalenceRate}%` : 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {ncd.targetPopulation || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ncd.isActive ? "default" : "secondary"}>
                        {ncd.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(ncd)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(ncd.id)}
                        >
                          {ncd.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(ncd.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
