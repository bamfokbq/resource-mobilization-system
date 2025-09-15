'use client'

import React, { useState } from 'react'
import { Users, Plus, Trash2, Save, X, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EnhancedSelect } from "@/components/ui/enhanced-select"

interface Partner {
  id: string
  name: string
  category: string
  region: string
  email?: string
  phone?: string
  description?: string
  isActive: boolean
  foundedYear?: number
}

// Initial data from the existing codebase
const initialPartners: Partner[] = [
  { 
    id: '1', 
    name: 'UNICEF Ghana', 
    category: 'International NGO', 
    region: 'Greater Accra', 
    email: 'contact@unicef.gh', 
    phone: '+233 302 772524',
    description: 'United Nations International Children\'s Emergency Fund focusing on child welfare and development',
    isActive: true, 
    foundedYear: 1946 
  },
  { 
    id: '2', 
    name: 'WHO Ghana', 
    category: 'International Organization', 
    region: 'Greater Accra', 
    email: 'info@who.gh', 
    phone: '+233 302 685441',
    description: 'World Health Organization Ghana office providing health guidance and support',
    isActive: true, 
    foundedYear: 1948 
  },
  { 
    id: '3', 
    name: 'Ghana Health Service', 
    category: 'Government Agency', 
    region: 'National', 
    email: 'info@ghs.gov.gh', 
    phone: '+233 302 681109',
    description: 'Primary healthcare delivery agency of the Ministry of Health',
    isActive: true, 
    foundedYear: 1996 
  },
  { 
    id: '4', 
    name: 'Plan International Ghana', 
    category: 'International NGO', 
    region: 'Northern', 
    email: 'info@plan-international.gh',
    phone: '+233 372 027506', 
    description: 'Child-centered development organization promoting children\'s rights',
    isActive: true, 
    foundedYear: 1992 
  },
  { 
    id: '5', 
    name: 'World Vision Ghana', 
    category: 'International NGO', 
    region: 'Ashanti', 
    email: 'contact@worldvision.gh',
    phone: '+233 322 773314', 
    description: 'Christian humanitarian organization focused on child-centered development',
    isActive: true, 
    foundedYear: 1974 
  },
  { 
    id: '6', 
    name: 'Ministry of Health', 
    category: 'Government Ministry', 
    region: 'National', 
    email: 'moh@gov.gh',
    phone: '+233 302 685441', 
    description: 'Government ministry responsible for health policy and oversight',
    isActive: true, 
    foundedYear: 1957 
  },
  { 
    id: '7', 
    name: 'USAID Ghana', 
    category: 'Bilateral Agency', 
    region: 'Greater Accra', 
    email: 'info@usaid.gov',
    phone: '+233 302 741300', 
    description: 'United States Agency for International Development supporting health and development',
    isActive: true, 
    foundedYear: 1961 
  },
  { 
    id: '8', 
    name: 'Save the Children Ghana', 
    category: 'International NGO', 
    region: 'Upper East', 
    email: 'info@savethechildren.gh',
    phone: '+233 382 022459', 
    description: 'International organization promoting children\'s rights and welfare',
    isActive: true, 
    foundedYear: 1976 
  }
]

// Partner categories
const partnerCategories = [
  'International NGO',
  'Government Agency', 
  'Government Ministry',
  'International Organization',
  'Private Sector',
  'Academic Institution',
  'Local NGO',
  'Bilateral Agency',
  'Faith-based Organization',
  'Research Institution'
]

// Ghana regions
const ghanaRegions = [
  'National',
  'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern',
  'Greater Accra', 'North East', 'Northern', 'Oti', 'Savannah',
  'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
]

export default function PartnersSettings() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    region: '',
    email: '',
    phone: '',
    description: '',
    foundedYear: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      region: '',
      email: '',
      phone: '',
      description: '',
      foundedYear: ''
    })
    setEditingPartner(null)
  }

  const handleOpenModal = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner)
      setFormData({
        name: partner.name,
        category: partner.category,
        region: partner.region,
        email: partner.email || '',
        phone: partner.phone || '',
        description: partner.description || '',
        foundedYear: partner.foundedYear?.toString() || ''
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.region) return

    const partnerData: Partner = {
      id: editingPartner?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      region: formData.region,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      description: formData.description || undefined,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
      isActive: editingPartner?.isActive ?? true
    }

    if (editingPartner) {
      setPartners(partners.map(p => p.id === editingPartner.id ? partnerData : p))
    } else {
      setPartners([...partners, partnerData])
    }

    setIsModalOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setPartners(partners.filter(p => p.id !== id))
  }

  const toggleStatus = (id: string) => {
    setPartners(partners.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ))
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-green-600" size={20} />
            Partners Management
          </CardTitle>
          <CardDescription>
            Manage organization partners ({partners.filter(p => p.isActive).length} active, {partners.length} total)
          </CardDescription>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => handleOpenModal()}>
              <Plus size={16} />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </DialogTitle>
              <DialogDescription>
                {editingPartner ? 'Update partner information' : 'Add a new organization partner'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Partner Name *</label>
                  <Input
                    placeholder="e.g., UNICEF Ghana"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Founded Year</label>
                  <Input
                    type="number"
                    placeholder="e.g., 1946"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({...formData, foundedYear: e.target.value})}
                  />
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
                    {partnerCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </EnhancedSelect>
                </div>
                <div>
                  <label className="text-sm font-medium">Region *</label>
                  <EnhancedSelect
                    value={formData.region}
                    onValueChange={(value) => setFormData({...formData, region: value})}
                    placeholder="Select region"
                  >
                    {ghanaRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </EnhancedSelect>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="contact@partner.org"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    placeholder="+233 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Brief description of the partner organization..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save size={16} className="mr-2" />
                  {editingPartner ? 'Update' : 'Save'} Partner
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
                <TableHead>Partner Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      {partner.foundedYear && (
                        <div className="text-xs text-gray-500">Founded {partner.foundedYear}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{partner.category}</Badge>
                  </TableCell>
                  <TableCell>{partner.region}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {partner.email && (
                        <div className="flex items-center gap-1 text-xs">
                          <Mail size={12} />
                          <a href={`mailto:${partner.email}`} className="text-blue-600 hover:underline">
                            {partner.email}
                          </a>
                        </div>
                      )}
                      {partner.phone && (
                        <div className="flex items-center gap-1 text-xs">
                          <Phone size={12} />
                          <span>{partner.phone}</span>
                        </div>
                      )}
                      {!partner.email && !partner.phone && <span className="text-gray-400">N/A</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={partner.isActive ? "default" : "secondary"}>
                      {partner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal(partner)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(partner.id)}
                      >
                        {partner.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(partner.id)}
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
