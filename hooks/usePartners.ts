import { useState, useEffect } from 'react'

export interface Partner {
    id: string
    name: string
    category: string
    region: string
}

const STATIC_PARTNERS: Partner[] = [
    { id: 'partner-1', name: 'UNICEF Ghana', category: 'International NGO', region: 'Greater Accra' },
    { id: 'partner-2', name: 'WHO Ghana', category: 'International Organization', region: 'Greater Accra' },
    { id: 'partner-3', name: 'Ghana Health Service', category: 'Government Agency', region: 'National' },
    { id: 'partner-4', name: 'Plan International', category: 'International NGO', region: 'Northern Region' },
    { id: 'partner-5', name: 'World Vision Ghana', category: 'International NGO', region: 'Ashanti Region' },
    { id: 'partner-6', name: 'Ministry of Health', category: 'Government Ministry', region: 'National' },
    { id: 'partner-7', name: 'USAID Ghana', category: 'Bilateral Agency', region: 'Greater Accra' },
    { id: 'partner-8', name: 'Save the Children Ghana', category: 'International NGO', region: 'Upper East Region' }
]

export function usePartners() {
    const [partners, setPartners] = useState<Partner[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        // Simulate a small delay to match real API behavior
        const timer = setTimeout(() => {
            setPartners(STATIC_PARTNERS)
            setLoading(false)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    const getPartnerById = (id: string): Partner | undefined => {
        return partners.find(partner => partner.id === id)
    }

    const getPartnersByCategory = (category: string): Partner[] => {
        return partners.filter(partner => partner.category === category)
    }

    const getPartnersByRegion = (region: string): Partner[] => {
        return partners.filter(partner => partner.region === region)
    }

    return {
        partners,
        loading,
        getPartnerById,
        getPartnersByCategory,
        getPartnersByRegion
    }
}
