'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { motion, AnimatePresence, MotionConfig } from 'motion/react'
import { Route } from 'next'

interface NcdStrategyNavProps {
    isOpen: boolean;
}

export default function NcdStrategyNav({ isOpen }: NcdStrategyNavProps) {
  const pathname = usePathname()
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  // Memoize navigation items to prevent unnecessary re-renders
  const items = useMemo(() => [
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
  ], [])

  // Optimized accordion value change handler
  const handleAccordionChange = useCallback((value: string | undefined) => {
    setOpenItem(value);
  }, []);

  // Memoize active item calculation
  const activeItemIndex = useMemo(() => {
    return items.findIndex(section => 
      pathname.startsWith(section.href) || 
      section.subItems.some(subItem => 
        pathname.includes(subItem.toLowerCase().replace(/\s+/g, '-'))
      )
    );
  }, [pathname, items]);

  useEffect(() => {
    if (activeItemIndex !== -1) {
      const matchingSection = items[activeItemIndex];
      setOpenItem(`${matchingSection.name.toLowerCase()}-${activeItemIndex}`);
    }
  }, [activeItemIndex, items]);

  // Optimized motion configuration for better performance
  const motionConfig = {
    transition: { type: "spring" as const, stiffness: 400, damping: 30 }
  };

    if (!isOpen) {
        return (
            <MotionConfig {...motionConfig}>
            <motion.div
                className="w-full flex flex-col gap-3 items-center pt-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                    duration: 0.25, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    staggerChildren: 0.05 
                }}
            >
                <TooltipProvider>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/survey-data"
                                    className="text-white hover:text-mint-green transition-all duration-200 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
                                >
                                        <MdDashboard className="w-6 h-6 text-white" />
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
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 15, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                                delay: idx * 0.05,
                                type: "spring", 
                                stiffness: 400, 
                                damping: 25 
                            }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={section.href as Route}
                                        className={`
                                            text-white hover:text-white transition-all duration-200 p-3 rounded-xl
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
            </MotionConfig>
        );
    }

  return (
      <MotionConfig {...motionConfig}>
      <motion.div
          className="w-full"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ 
              duration: 0.25, 
              ease: [0.25, 0.46, 0.45, 0.94] 
          }}
      >
          <motion.div
              className="mb-4"
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                  delay: 0.05,
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25 
              }}
          >
              <Link
                  href={'/survey-data'}
                  className="group text-lg font-semibold text-white px-3 py-3 flex items-center gap-3 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl"
                  onClick={() => setOpenItem(undefined)}
              >
                      <div className="p-1 rounded-lg bg-mint-green/20">
                          <MdDashboard className="w-5 h-5" />
                  </div>
                  <span className="group-hover:text-mint-green transition-colors duration-200">Dashboard</span>
              </Link>
          </motion.div>

          <Accordion 
              type="single" 
              collapsible 
              className="w-full space-y-3"
              value={openItem}
              onValueChange={handleAccordionChange}
              suppressHydrationWarning
          >
                {items.map((section, idx) => (
                    <motion.div
                        key={`nav-${section.name}-${idx}`}
                        initial={{ x: -15, opacity: 0, scale: 0.98 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{ 
                            delay: 0.1 + idx * 0.05,
                            type: "spring", 
                            stiffness: 400, 
                            damping: 25 
                        }}
                    >
                        <AccordionItem
                            value={`${section.name.toLowerCase()}-${idx}`}
                            className="border-0 bg-white/5 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
                        >
                          <AccordionTrigger 
                              className={`
                                  text-lg font-medium text-white hover:text-white 
                                  py-3 px-3 rounded-xl transition-all duration-200
                                  hover:bg-white/20
                                  ${pathname.startsWith(section.href) ? 'bg-white/20' : ''}
                                  [&>svg]:text-white [&>svg]:opacity-75 hover:[&>svg]:opacity-100
                                  [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200
                              `}
                          >
                              <Link
                                  href={section.href as Route} 
                                  className="flex-1 text-left flex items-center gap-3"
                                  onClick={(e) => e.stopPropagation()}
                              >
                                  <div className="p-1 rounded-lg bg-white/20 transition-colors duration-200">
                                      {section.icon}
                                  </div>
                                  <span>{section.name}</span>
                              </Link>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                              <AnimatePresence mode="wait">
                                  {openItem === `${section.name.toLowerCase()}-${idx}` && (
                                      <motion.div
                                          className="flex flex-col space-y-1 mt-2"
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ 
                                              duration: 0.2,
                                              ease: [0.25, 0.46, 0.45, 0.94]
                                          }}
                                      >
                                          {section.subItems.map((item, itemIdx) => (
                                              <motion.div
                                                  key={`${section.name}-${item}-${itemIdx}`}
                                                  initial={{ x: -8, opacity: 0 }}
                                                  animate={{ x: 0, opacity: 1 }}
                                                  transition={{ 
                                                      delay: itemIdx * 0.03,
                                                      type: "spring", 
                                                      stiffness: 500, 
                                                      damping: 30 
                                                  }}
                                              >
                                                  <Link
                                                      href={`${section.href}/#${item.toLowerCase().replace(/\s+/g, '-')}` as Route}
                                                      className="group text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 backdrop-blur-sm"
                                                  >
                                                      <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-mint-green transition-colors duration-200"></div>
                                                      {item}
                                                  </Link>
                                              </motion.div>
                                          ))}
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                          </AccordionContent>
                      </AccordionItem>
                  </motion.div>
              ))}
          </Accordion>
      </motion.div>
      </MotionConfig>
  )
}
