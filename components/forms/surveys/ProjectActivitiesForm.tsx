"use client"

import { useFormStore } from "@/store/useFormStore"
import { Info, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"

interface ProjectActivitiesFormProps {
  handleNext: () => void
  handlePrevious: () => void
}

export default function ProjectActivitiesForm({ handleNext, handlePrevious }: ProjectActivitiesFormProps) {
  const { formData } = useFormStore()
  const ncdsSelectedFromProjectInfoForm = formData?.projectInfo?.targetedNCDs || []

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b border-blue-200 pb-4">
            Section B.3: Project Activities
          </h2>

          <AnimatePresence>
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 hover:bg-blue-50/50 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-500 mt-1" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {ncdsSelectedFromProjectInfoForm.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <h4 className="text-green-800 font-medium mb-2">Selected NCDs:</h4>
              <div className="flex flex-wrap gap-2">
                {ncdsSelectedFromProjectInfoForm.map((ncd, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {ncd}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
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
