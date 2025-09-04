'use client'

import React, { useState } from 'react'
import { MapPin, Plus, Trash2, Save, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Region {
  id: string
  name: string
  code: string
  population?: number
  coordinates?: { lat: number; lng: number }
  isActive: boolean
}

// Initial data - Ghana's 16 regions
const initialRegions: Region[] = [
  { id: '1', name: 'Ahafo', code: 'AH', isActive: true, population: 563797 },
  { id: '2', name: 'Ashanti', code: 'AS', isActive: true, population: 4780380 },
  { id: '3', name: 'Bono', code: 'BO', isActive: true, population: 668301 },
  { id: '4', name: 'Bono East', code: 'BE', isActive: true, population: 639843 },
  { id: '5', name: 'Central', code: 'CR', isActive: true, population: 2859821 },
  { id: '6', name: 'Eastern', code: 'ER', isActive: true, population: 2633154 },
  { id: '7', name: 'Greater Accra', code: 'GA', isActive: true, population: 4010054 },
  { id: '8', name: 'North East', code: 'NE', isActive: true, population: 469558 },
  { id: '9', name: 'Northern', code: 'NR', isActive: true, population: 2479461 },
  { id: '10', name: 'Oti', code: 'OT', isActive: true, population: 438008 },
  { id: '11', name: 'Savannah', code: 'SV', isActive: true, population: 527013 },
  { id: '12', name: 'Upper East', code: 'UE', isActive: true, population: 1301253 },
  { id: '13', name: 'Upper West', code: 'UW', isActive: true, population: 702110 },
  { id: '14', name: 'Volta', code: 'VR', isActive: true, population: 2118252 },
  { id: '15', name: 'Western', code: 'WR', isActive: true, population: 2060585 },
  { id: '16', name: 'Western North', code: 'WN', isActive: true, population: 278555 },
]

export default function RegionsSettings() {
  const [regions, setRegions] = useState<Region[]>(initialRegions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    population: '',
    coordinates: { lat: '', lng: '' }
  })

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      population: '',
      coordinates: { lat: '', lng: '' }
    })
    setEditingRegion(null)
  }

  const handleOpenModal = (region?: Region) => {
    if (region) {
      setEditingRegion(region)
      setFormData({
        name: region.name,
        code: region.code,
        population: region.population?.toString() || '',
        coordinates: {
          lat: region.coordinates?.lat?.toString() || '',
          lng: region.coordinates?.lng?.toString() || ''
        }
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.code) return

    const regionData: Region = {
      id: editingRegion?.id || Date.now().toString(),
      name: formData.name,
      code: formData.code.toUpperCase(),
      population: formData.population ? parseInt(formData.population) : undefined,
      coordinates: formData.coordinates.lat && formData.coordinates.lng ? {
        lat: parseFloat(formData.coordinates.lat),
        lng: parseFloat(formData.coordinates.lng)
      } : undefined,
      isActive: editingRegion?.isActive ?? true
    }

    if (editingRegion) {
      setRegions(regions.map(r => r.id === editingRegion.id ? regionData : r))
    } else {
      setRegions([...regions, regionData])
    }

    setIsModalOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setRegions(regions.filter(r => r.id !== id))
  }

  const toggleStatus = (id: string) => {
    setRegions(regions.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ))
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            Ghana Regions Management
          </CardTitle>
          <CardDescription>
            Manage all 16 regions of Ghana ({regions.filter(r => r.isActive).length} active, {regions.length} total)
          </CardDescription>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => handleOpenModal()}>
              <Plus size={16} />
              Add Region
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRegion ? 'Edit Region' : 'Add New Region'}
              </DialogTitle>
              <DialogDescription>
                {editingRegion ? 'Update region information' : 'Add a new region to the system'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Region Name *</label>
                <Input
                  placeholder="e.g., Greater Accra"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Region Code *</label>
                <Input
                  placeholder="e.g., GA"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  maxLength={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Population (Optional)</label>
                <Input
                  type="number"
                  placeholder="e.g., 2500000"
                  value={formData.population}
                  onChange={(e) => setFormData({...formData, population: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Latitude (Optional)</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g., 5.7"
                    value={formData.coordinates.lat}
                    onChange={(e) => setFormData({
                      ...formData, 
                      coordinates: {...formData.coordinates, lat: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Longitude (Optional)</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g., 0.1"
                    value={formData.coordinates.lng}
                    onChange={(e) => setFormData({
                      ...formData, 
                      coordinates: {...formData.coordinates, lng: e.target.value}
                    })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save size={16} className="mr-2" />
                  {editingRegion ? 'Update' : 'Save'} Region
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
                <TableHead>Region Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region) => (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{region.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{region.code}</Badge>
                  </TableCell>
                  <TableCell>
                    {region.population ? region.population.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {region.coordinates ? (
                      <span className="text-xs text-gray-600">
                        {region.coordinates.lat.toFixed(2)}, {region.coordinates.lng.toFixed(2)}
                      </span>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={region.isActive ? "default" : "secondary"}>
                      {region.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal(region)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(region.id)}
                      >
                        {region.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(region.id)}
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
  )
}
