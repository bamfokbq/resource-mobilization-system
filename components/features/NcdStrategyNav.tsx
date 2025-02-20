'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'
import { MdDashboard, MdOutlinePreview } from 'react-icons/md'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { BiTask } from 'react-icons/bi'
import { TbActivityHeartbeat } from 'react-icons/tb'

interface NcdStrategyNavProps {
    isOpen: boolean;
}

export default function NcdStrategyNav({ isOpen }: NcdStrategyNavProps) {
  const pathname = usePathname()
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const items = [
      {
          name: 'Overview',
          href: '/survey-data/overview',
          icon: <MdOutlinePreview className="w-5 h-5" />,
          subItems: ['Regional Activities', 'Diseases', 'Continuum of Care']
      },
      {
          name: 'Background',
          href: '/survey-data/background',
          icon: <IoInformationCircleOutline className="w-5 h-5" />,
          subItems: ['Regional Stakeholders', 'Sectors', 'Projects', 'Funding', 'Stakeholder Info']
      },
      {
          name: 'Activities',
          href: '/survey-data/activity-overview',
          icon: <BiTask className="w-5 h-5" />,
          subItems: ['By Region', 'Diseases', 'Care Continuum', 'Target Groups', 'Organizations', 'Age Groups', 'Settings', 'Gender', 'Reach', 'Partners']
      },
      {
          name: 'Morbidity',
          href: '/survey-data/activity-morbidity',
          icon: <TbActivityHeartbeat className="w-5 h-5" />,
          subItems: ['Hypertension', 'Diabetes', 'Traffic Accidents', 'Asthma', 'Sickle Cell', 'Stroke', 'Schizophrenia', 'Prostate Cancer', 'Lymphoma', 'Breast Cancer', 'Cervical Cancer']
      },
  ]

  useEffect(() => {
    // Find which section matches the current path
    const sectionIndex = items.findIndex(section => 
      pathname.startsWith(section.href) || 
      section.subItems.some(subItem => 
        pathname.includes(subItem.toLowerCase().replace(/\s+/g, '-'))
      )
    );
    
    if (sectionIndex !== -1) {
      setOpenItem(`item-${sectionIndex}`);
    }
  }, [pathname]);

    if (!isOpen) {
        return (
            <div className="w-full flex flex-col gap-4 items-center pt-2">
                <Link href="/survey-data" className="text-white hover:text-white/90">
                    <MdDashboard className="w-5 h-5" />
                </Link>
                {items.map((section, idx) => (
                    <Link
                        key={section.name}
                        href={section.href}
                        className="text-white hover:text-white/90"
                    >
                        {section.icon}
                    </Link>
                ))}
            </div>
        );
    }

  return (
      <div className="w-full">
          <div className="mb-2">
              <Link
                  href={'/survey-data'}
                  className="text-lg font-medium text-white px-2 py-2 flex items-center gap-2"
                  onClick={() => setOpenItem(undefined)}
              >
                  <MdDashboard className="w-5 h-5" />
                  Dashboard
              </Link>
          </div>
          <Accordion 
              type="single" 
              collapsible 
              className="w-full space-y-2 [&>*>[data-state=open]>svg]:rotate-180"
              value={openItem}
              onValueChange={setOpenItem}
          >
              {items.map((section, idx) => (
                  <AccordionItem key={section.name} value={`item-${idx}`} className="border-b-0">
                      <AccordionTrigger 
                          className="text-lg font-medium text-white hover:text-white/90 [&>svg]:text-white [&>svg]:opacity-75 hover:[&>svg]:opacity-100 py-2 px-2"
                          onClick={(e) => {
                              e.preventDefault();
                              setOpenItem(openItem === `item-${idx}` ? undefined : `item-${idx}`);
                          }}
                      >
                          <Link 
                              href={section.href} 
                              className="flex-1 text-left flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                          >
                              {section.icon}
                              {section.name}
                          </Link>
                      </AccordionTrigger>
                      <AccordionContent className="px-2">
                          <div className="flex flex-col space-y-1">
                              {section.subItems.map((item) => (
                                  <Link
                                      key={item}
                                      href={`${section.href}/#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded px-3 py-2"
                                  >
                                      {item}
                                  </Link>
                              ))}
                          </div>
                      </AccordionContent>
                  </AccordionItem>
              ))}
          </Accordion>
      </div>
  )
}
