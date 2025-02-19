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

export default function NcdStrategyNav() {
  const pathname = usePathname()
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const items = [
    { name: 'Overview', href: '/survey-data/overview', subItems: ['Activities by Region', 'Diseases Area', 'Activities by Continuum of Care'] },
    { name: 'Background', href: '/survey-data/background', subItems: ['Stakeholders per Region', 'Sectors', 'Number of Projects', 'Funding Source', 'Stakeholder Details'] },
    { name: 'Activity Overview', href: '/survey-data/activity-overview', subItems: ['Activities by Region', 'Diseases Area', 'Activities by Continuum of Care', 'Primary Target Population', 'Organisations', 'Activities by Age Group', 'Activities by Setting', 'Activities by Gender', 'Persons Reached', 'Partners'] },
    { name: 'Activity Morbidity', href: '/survey-data/activity-morbidity', subItems: ['Hypertension', 'Diabetes Mellitus', 'Road Traffic Accidents', 'Asthma', 'Sickle Cell Disease', 'Stroke', 'Schizophrenia', 'Prostate Cancer', 'Lymphoma', 'Breast Cancer', 'Cervical Cancer'] },
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

  return (
      <div className="w-full">
          <div className="mb-2">
              <Link
                  href={'/survey-data'}
                  className="text-lg font-medium text-white px-2 py-2"
                  onClick={() => setOpenItem(undefined)}
              >
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
                              className="flex-1 text-left"
                              onClick={(e) => e.stopPropagation()}
                          >
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
