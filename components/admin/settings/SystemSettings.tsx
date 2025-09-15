'use client'

import React, { useState } from 'react'
import { Cog, Save, Plus, Trash2, Edit, Database, FileText, Bell, Shield, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EnhancedSelect } from "@/components/ui/enhanced-select"
import { Switch } from "@/components/ui/switch"

interface SystemSetting {
  id: string
  key: string
  value: string
  description?: string
  category: string
  type: 'text' | 'number' | 'boolean' | 'json' | 'email' | 'url'
  isEditable: boolean
  requiresRestart?: boolean
}

// Initial system settings
const initialSystemSettings: SystemSetting[] = [
  // Application Settings
  { 
    id: '1', 
    key: 'app_name', 
    value: 'NCD Navigator', 
    description: 'Application display name', 
    category: 'Application', 
    type: 'text',
    isEditable: true
  },
  { 
    id: '2', 
    key: 'app_version', 
    value: '1.0.0', 
    description: 'Current application version', 
    category: 'Application', 
    type: 'text',
    isEditable: false
  },
  { 
    id: '3', 
    key: 'app_description', 
    value: 'Non-Communicable Disease Navigator for Ghana', 
    description: 'Application description', 
    category: 'Application', 
    type: 'text',
    isEditable: true
  },
  { 
    id: '4', 
    key: 'support_email', 
    value: 'support@ncdnavigator.gh', 
    description: 'Support contact email', 
    category: 'Application', 
    type: 'email',
    isEditable: true
  },

  // File Upload Settings
  { 
    id: '5', 
    key: 'max_file_size', 
    value: '10485760', 
    description: 'Maximum file upload size in bytes (10MB)', 
    category: 'File Upload', 
    type: 'number',
    isEditable: true
  },
  { 
    id: '6', 
    key: 'allowed_file_types', 
    value: 'pdf,doc,docx,jpg,jpeg,png,xlsx,xls', 
    description: 'Comma-separated list of allowed file extensions', 
    category: 'File Upload', 
    type: 'text',
    isEditable: true
  },
  { 
    id: '7', 
    key: 'storage_path', 
    value: '/uploads/resources', 
    description: 'Default storage path for uploaded files', 
    category: 'File Upload', 
    type: 'text',
    isEditable: true,
    requiresRestart: true
  },

  // Notification Settings
  { 
    id: '8', 
    key: 'enable_notifications', 
    value: 'true', 
    description: 'Enable system notifications', 
    category: 'Notifications', 
    type: 'boolean',
    isEditable: true
  },
  { 
    id: '9', 
    key: 'email_notifications', 
    value: 'true', 
    description: 'Enable email notifications', 
    category: 'Notifications', 
    type: 'boolean',
    isEditable: true
  },
  { 
    id: '10', 
    key: 'notification_retention_days', 
    value: '30', 
    description: 'Number of days to keep notifications', 
    category: 'Notifications', 
    type: 'number',
    isEditable: true
  },

  // Data Management
  { 
    id: '11', 
    key: 'data_retention_days', 
    value: '365', 
    description: 'Number of days to retain user data', 
    category: 'Data Management', 
    type: 'number',
    isEditable: true
  },
  { 
    id: '12', 
    key: 'backup_frequency', 
    value: 'daily', 
    description: 'Database backup frequency', 
    category: 'Data Management', 
    type: 'text',
    isEditable: true
  },
  { 
    id: '13', 
    key: 'auto_cleanup', 
    value: 'true', 
    description: 'Enable automatic cleanup of old data', 
    category: 'Data Management', 
    type: 'boolean',
    isEditable: true
  },

  // Security Settings
  { 
    id: '14', 
    key: 'session_timeout', 
    value: '3600', 
    description: 'Session timeout in seconds (1 hour)', 
    category: 'Security', 
    type: 'number',
    isEditable: true
  },
  { 
    id: '15', 
    key: 'max_login_attempts', 
    value: '5', 
    description: 'Maximum login attempts before lockout', 
    category: 'Security', 
    type: 'number',
    isEditable: true
  },
  { 
    id: '16', 
    key: 'password_min_length', 
    value: '8', 
    description: 'Minimum password length', 
    category: 'Security', 
    type: 'number',
    isEditable: true
  },

  // API Settings
  { 
    id: '17', 
    key: 'api_rate_limit', 
    value: '100', 
    description: 'API requests per minute per user', 
    category: 'API', 
    type: 'number',
    isEditable: true
  },
  { 
    id: '18', 
    key: 'api_timeout', 
    value: '30', 
    description: 'API request timeout in seconds', 
    category: 'API', 
    type: 'number',
    isEditable: true
  }
]

const settingCategories = [
  'Application',
  'File Upload', 
  'Notifications',
  'Data Management',
  'Security',
  'API',
  'Performance',
  'Integration'
]

const settingTypes = ['text', 'number', 'boolean', 'json', 'email', 'url'] as const

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>(initialSystemSettings)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set())
  
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    category: '',
    type: 'text' as 'text' | 'number' | 'boolean' | 'json' | 'email' | 'url',
    isEditable: true,
    requiresRestart: false
  })

  const resetForm = () => {
    setFormData({
      key: '',
      value: '',
      description: '',
      category: '',
      type: 'text',
      isEditable: true,
      requiresRestart: false
    })
    setEditingSetting(null)
  }

  const handleOpenModal = (setting?: SystemSetting) => {
    if (setting) {
      setEditingSetting(setting)
      setFormData({
        key: setting.key,
        value: setting.value,
        description: setting.description || '',
        category: setting.category,
        type: setting.type as 'text' | 'number' | 'boolean' | 'json' | 'email' | 'url',
        isEditable: setting.isEditable,
        requiresRestart: setting.requiresRestart || false
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.key || !formData.value || !formData.category) return

    const settingData: SystemSetting = {
      id: editingSetting?.id || Date.now().toString(),
      key: formData.key,
      value: formData.value,
      description: formData.description || undefined,
      category: formData.category,
      type: formData.type,
      isEditable: formData.isEditable,
      requiresRestart: formData.requiresRestart
    }

    if (editingSetting) {
      setSettings(settings.map(s => s.id === editingSetting.id ? settingData : s))
    } else {
      setSettings([...settings, settingData])
    }

    setIsModalOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setSettings(settings.filter(s => s.id !== id))
    setUnsavedChanges(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleSettingValueChange = (id: string, value: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, value } : s))
    setUnsavedChanges(prev => new Set([...prev, id]))
  }

  const saveAllChanges = () => {
    // Here you would typically send the changes to your backend
    console.log('Saving all changes:', settings.filter(s => unsavedChanges.has(s.id)))
    setUnsavedChanges(new Set())
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Application': return <Globe size={16} />
      case 'File Upload': return <FileText size={16} />
      case 'Notifications': return <Bell size={16} />
      case 'Data Management': return <Database size={16} />
      case 'Security': return <Shield size={16} />
      case 'API': return <Cog size={16} />
      default: return <Cog size={16} />
    }
  }

  const formatValue = (setting: SystemSetting) => {
    if (setting.type === 'boolean') {
      return setting.value === 'true' ? 'Enabled' : 'Disabled'
    }
    if (setting.type === 'number' && setting.key.includes('size')) {
      const bytes = parseInt(setting.value)
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }
    return setting.value
  }

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) acc[setting.category] = []
    acc[setting.category].push(setting)
    return acc
  }, {} as Record<string, SystemSetting[]>)

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Cog className="text-purple-600" size={20} />
                <span className="font-medium">System Configuration</span>
              </div>
              {unsavedChanges.size > 0 && (
                <Badge variant="destructive">
                  {unsavedChanges.size} unsaved change{unsavedChanges.size !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleOpenModal()}>
                    <Plus size={16} className="mr-2" />
                    Add Setting
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSetting ? 'Edit Setting' : 'Add New Setting'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSetting ? 'Update system setting' : 'Add a new system configuration setting'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Setting Key *</label>
                      <Input
                        placeholder="e.g., max_file_size"
                        value={formData.key}
                        onChange={(e) => setFormData({...formData, key: e.target.value})}
                        disabled={!!editingSetting}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category *</label>
                        <EnhancedSelect
                          value={formData.category}
                          onValueChange={(value) => setFormData({...formData, category: value})}
                          placeholder="Select category"
                        >
                          {settingCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </EnhancedSelect>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type *</label>
                        <EnhancedSelect
                          value={formData.type}
                          onValueChange={(value) => setFormData({...formData, type: value as any})}
                        >
                          {settingTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </EnhancedSelect>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Value *</label>
                      {formData.type === 'boolean' ? (
                        <EnhancedSelect
                          value={formData.value}
                          onValueChange={(value) => setFormData({...formData, value})}
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </EnhancedSelect>
                      ) : (
                        <Input
                          type={formData.type === 'number' ? 'number' : 'text'}
                          placeholder="Setting value"
                          value={formData.value}
                          onChange={(e) => setFormData({...formData, value: e.target.value})}
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Brief description of the setting..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isEditable"
                          checked={formData.isEditable}
                          onChange={(e) => setFormData({...formData, isEditable: e.target.checked})}
                        />
                        <label htmlFor="isEditable" className="text-sm">Editable</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="requiresRestart"
                          checked={formData.requiresRestart}
                          onChange={(e) => setFormData({...formData, requiresRestart: e.target.checked})}
                        />
                        <label htmlFor="requiresRestart" className="text-sm">Requires Restart</label>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} className="flex-1">
                        <Save size={16} className="mr-2" />
                        {editingSetting ? 'Update' : 'Save'} Setting
                      </Button>
                      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              {unsavedChanges.size > 0 && (
                <Button onClick={saveAllChanges}>
                  <Save size={16} className="mr-2" />
                  Save All Changes
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings by Category */}
      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <Card key={category} className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {category} Settings
            </CardTitle>
            <CardDescription>
              Configure {category.toLowerCase()} related settings ({categorySettings.length} settings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySettings.map((setting) => (
                <div 
                  key={setting.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    unsavedChanges.has(setting.id) ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      {setting.requiresRestart && (
                        <Badge variant="outline" className="text-xs">
                          Requires Restart
                        </Badge>
                      )}
                      {unsavedChanges.has(setting.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Modified
                        </Badge>
                      )}
                    </div>
                    {setting.description && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-48">
                      {setting.isEditable ? (
                        setting.type === 'boolean' ? (
                          <EnhancedSelect
                            value={setting.value}
                            onValueChange={(value) => handleSettingValueChange(setting.id, value)}
                          >
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                          </EnhancedSelect>
                        ) : (
                          <Input
                            type={setting.type === 'number' ? 'number' : 'text'}
                            value={setting.value}
                            onChange={(e) => handleSettingValueChange(setting.id, e.target.value)}
                            className="text-right"
                          />
                        )
                      ) : (
                        <div className="text-sm text-gray-600 text-right py-2">
                          {formatValue(setting)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {setting.isEditable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(setting)}
                        >
                          <Edit size={14} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(setting.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* System Status Summary */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Overview of current system configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{settings.length}</div>
              <div className="text-sm text-gray-600">Total Settings</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {settings.filter(s => s.isEditable).length}
              </div>
              <div className="text-sm text-gray-600">Editable Settings</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{unsavedChanges.size}</div>
              <div className="text-sm text-gray-600">Unsaved Changes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(groupedSettings).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
