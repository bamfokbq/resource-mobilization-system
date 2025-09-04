import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Target, BarChart3, Users, FileText, CheckCircle } from 'lucide-react'

interface ProjectOverviewFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function ProjectOverviewForm({ handleNext, handlePrevious }: ProjectOverviewFormProps) {
  return (
    <section>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Project Overview</h2>
              <p className="text-gray-600 text-lg">
                Review your project information before proceeding to the detailed sections.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1 bg-emerald-200 rounded">
                  <Target className="h-5 w-5 text-emerald-700" />
                </div>
                Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Project Information</h4>
                    <p className="text-gray-600 text-sm">
                      You will provide details about your project goals, objectives, timeline, and scope.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Target Areas</h4>
                    <p className="text-gray-600 text-sm">
                      Specify the regions and NCDs your project addresses.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Funding & Budget</h4>
                    <p className="text-gray-600 text-sm">
                      Share information about funding sources and estimated budget.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Project Activities</h4>
                    <p className="text-gray-600 text-sm">
                      Detail the specific activities and interventions planned.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1 bg-blue-200 rounded">
                  <BarChart3 className="h-5 w-5 text-blue-700" />
                </div>
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Comprehensive Data Collection</h4>
                    <p className="text-gray-600 text-sm">
                      We'll gather detailed information about your organization, project activities, and impact.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Stakeholder Information</h4>
                    <p className="text-gray-600 text-sm">
                      Details about partners, collaborators, and key stakeholders involved in your project.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Impact Assessment</h4>
                    <p className="text-gray-600 text-sm">
                      Information about monitoring, evaluation, and sustainability planning.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1 bg-amber-200 rounded">
                  <FileText className="h-5 w-5 text-amber-700" />
                </div>
                Ready to Begin?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                The survey will take approximately 15-20 minutes to complete. You can save your progress and return later if needed.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>All information provided will be kept confidential and used for research purposes only.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            onClick={handlePrevious}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Start Survey
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
