'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'
import { MdDashboard, MdOutlinePreview } from 'react-icons/md'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { BiTask } from 'react-icons/bi'
import { TbActivityHeartbeat } from 'react-icons/tb'
import { motion, AnimatePresence } from 'motion/react'

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
    //   {
    //       name: 'Morbidity',
    //       href: '/survey-data/activity-morbidity',
    //       icon: <TbActivityHeartbeat className="w-5 h-5" />,
    //       subItems: ['Hypertension', 'Diabetes', 'Traffic Accidents', 'Asthma', 'Sickle Cell', 'Stroke', 'Schizophrenia', 'Prostate Cancer', 'Lymphoma', 'Breast Cancer', 'Cervical Cancer']
    //   },
  ]

  useEffect(() => {
    // Find which section matches the current path
    const matchingSectionIndex = items.findIndex(section => 
      pathname.startsWith(section.href) || 
      section.subItems.some(subItem => 
        pathname.includes(subItem.toLowerCase().replace(/\s+/g, '-'))
      )
    );
    
    if (matchingSectionIndex !== -1) {
      const matchingSection = items[matchingSectionIndex];
      setOpenItem(`${matchingSection.name.toLowerCase()}-${matchingSectionIndex}`);
    }
  }, [pathname]);

    if (!isOpen) {
        return (
            <motion.div
                className="w-full flex flex-col gap-3 items-center pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
            >
                <TooltipProvider>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/survey-data"
                                    className="text-white hover:text-mint-green transition-all duration-300 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
                                >
                                    <MdDashboard className="w-6 h-6" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className="bg-white text-navy-blue z-50 font-medium shadow-xl border-0"
                            >
                                <p>Dashboard</p>
                            </TooltipContent>
                        </Tooltip>
                    </motion.div>

                    {items.map((section, idx) => (
                        <motion.div
                            key={section.name}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={section.href}
                                        className={`
                                            text-white hover:text-white transition-all duration-300 p-3 rounded-xl
                                            hover:bg-white/20 backdrop-blur-sm
                                            border border-white/20 shadow-lg hover:shadow-xl
                                            ${pathname.startsWith(section.href) ? 'bg-white/20 shadow-xl' : 'hover:bg-white/10'}
                                        `}
                                    >
                                        {section.icon}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="bg-white text-navy-blue z-50 font-medium shadow-xl border-0"
                                >
                                    <p>{section.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </motion.div>
                    ))}
                </TooltipProvider>
            </motion.div>
        );
    }

  return (
      <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
          <motion.div
              className="mb-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
          >
              <Link
                  href={'/survey-data'}
                  className="group text-lg font-semibold text-white px-3 py-3 flex items-center gap-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl"
                  onClick={() => setOpenItem(undefined)}
              >
                  <div className="p-1 rounded-lg bg-mint-green">
                      <MdDashboard className="w-5 h-5 text-navy-blue" />
                  </div>
                  <span className="group-hover:text-mint-green transition-colors">Dashboard</span>
              </Link>
          </motion.div>

          <div suppressHydrationWarning>
            <Accordion 
                type="single" 
                collapsible 
                className="w-full space-y-3"
                value={openItem}
                onValueChange={setOpenItem}
            >
                {items.map((section, idx) => (
                    <motion.div
                        key={`nav-${section.name}-${idx}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                    >
                        <AccordionItem
                            value={`${section.name.toLowerCase()}-${idx}`}
                            className="border-0 bg-white/5 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <AccordionTrigger 
                              className={`
                                  text-lg font-medium text-white hover:text-white 
                                  py-3 px-3 rounded-xl transition-all duration-300
                                  hover:bg-white/20
                                  ${pathname.startsWith(section.href) ? 'bg-white/20' : ''}
                                  [&>svg]:text-white [&>svg]:opacity-75 hover:[&>svg]:opacity-100
                                  [&[data-state=open]>svg]:rotate-180
                              `}
                              onClick={(e) => {
                                  e.preventDefault();
                                  setOpenItem(openItem === section.name.toLowerCase() ? undefined : section.name.toLowerCase());
                              }}
                          >
                              <Link
                                  href={section.href} 
                                  className="flex-1 text-left flex items-center gap-3"
                                  onClick={(e) => e.stopPropagation()}
                              >
                                  <div className="p-1 rounded-lg bg-white/20">
                                      {section.icon}
                                  </div>
                                  <span>{section.name}</span>
                              </Link>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3">
                              <motion.div
                                  className="flex flex-col space-y-1 mt-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                              >
                                  {section.subItems.map((item, itemIdx) => (
                                      <motion.div
                                          key={`${section.name}-${item}-${itemIdx}`}
                                          initial={{ x: -10, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: itemIdx * 0.05 }}
                                      >
                                          <Link
                                              href={`${section.href}/#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                              className="group text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg px-4 py-2 flex items-center gap-2 backdrop-blur-sm"
                                          >
                                              <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-mint-green transition-colors"></div>
                                              {item}
                                          </Link>
                                      </motion.div>
                                  ))}
                              </motion.div>
                          </AccordionContent>
                      </AccordionItem>
                  </motion.div>
              ))}
          </Accordion>
          </div>
      </motion.div>
  )
}
