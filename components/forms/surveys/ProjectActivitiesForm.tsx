"use client"

import { useFormStore } from "@/store/useFormStore"
import { Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"

interface ProjectActivitiesFormProps {
  handleNext: () => void
  handlePrevious: () => void
}

export default function ProjectActivitiesForm({ handleNext, handlePrevious }: ProjectActivitiesFormProps) {
  const { formData } = useFormStore()
  const ncdsSelectedFromProjectInfoForm = formData?.projectInfo?.targetedNCDs || []
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(undefined)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b border-blue-200 pb-4">
            Section B.3: Project Activities
          </h2>

          <div className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
              <Info className="text-blue-500" />
              Important Notes
            </h3>
            {[
              "Activities are the day to day, month to month tasks that you do to achieve your objectives. Activities have a focus in that they are done in a specific place (region/district/community), they target a certain population, address a set of disease area(s) and seek to improve a section on the continuum of care.",
              "For questions on continuum of care, please condense your project activities and outputs to align with at least one of the sections on the continuum of care.",
              "For the primary target population, this is the group of people that your project activity seeks to directly inﬂuence or affect. While other groups may beneﬁt from the activity, the primary target population is the group to which your project was awarded the funding."
            ].map((text, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 hover:bg-blue-50/50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-500 mt-1" />
                </div>
                <p className="text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {ncdsSelectedFromProjectInfoForm.length > 0 && (
            <div className="mt-8 space-y-6">
              {ncdsSelectedFromProjectInfoForm.map((ncd, index) => (
                <Accordion
                  key={index} 
                  type="single"
                  value={activeAccordion}
                  onValueChange={setActiveAccordion}
                  collapsible
                  className="bg-gradient-to-r from-background to-background/80 rounded-xl shadow-sm border border-border/40 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <AccordionItem value={`item-${index}`} className="px-6 border-none">
                    <AccordionTrigger className="hover:bg-muted/30 rounded-lg py-5 px-4 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-smit-green to-mint-green shadow-sm"></div>
                        <span className="text-dark-gray font-semibold tracking-wide">
                          {ncd}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-6 p-8 bg-muted/20 rounded-xl border border-border/30 my-3 backdrop-blur-sm">
                        <p className="text-muted-foreground font-medium">Questions</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            onClick={handlePrevious}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
