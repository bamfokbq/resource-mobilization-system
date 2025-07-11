"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Home,
  Share2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SurveySuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const surveyId = searchParams.get('surveyId');
  const submissionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleViewSurvey = () => {
    if (surveyId) {
      router.push(`/dashboard/surveys/${surveyId}`);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleCreateNewSurvey = () => {
    router.push('/dashboard/surveys/form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Enhanced Success Header with Glass Effect */}
        <div className="text-center space-y-4 relative">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg -z-10"></div>
          <div className="p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-xl">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Survey Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thank you for contributing to the NCD Navigator platform. Your valuable data will help improve healthcare initiatives across Ghana.
            </p>

            {/* Success Animation */}
            <div className="flex items-center justify-center mt-6">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Submission Details */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Submission Details</h2>
                <p className="text-sm text-gray-600 mt-1">Your survey information and confirmation</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Survey ID</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="font-mono text-xs bg-blue-100 text-blue-700">
                      {surveyId || 'SRV-' + Date.now().toString().slice(-6)}
                    </Badge>
                    <span className="text-xs text-gray-500">Use this ID for future reference</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Submission Date & Time</p>
                  <p className="text-gray-800 font-semibold">{submissionDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                    ✓ Successfully Submitted
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Next Steps */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">What Happens Next?</h2>
                <p className="text-sm text-gray-600 mt-1">Your submission journey through our system</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Review Process</h3>
                  <p className="text-sm text-gray-600">
                    Our expert team will review your submission for completeness, accuracy, and compliance with data standards within 2-3 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-emerald-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Data Integration</h3>
                  <p className="text-sm text-gray-600">
                    Approved data will be seamlessly integrated into the NCD Navigator database, enhancing our analytics and reporting capabilities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-amber-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Public Availability</h3>
                  <p className="text-sm text-gray-600">
                    Your valuable contribution will become available in our public datasets, visualizations, and impact our policy recommendations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-0">
          {surveyId && (
            <Button 
              onClick={handleViewSurvey}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-4"
              size="lg"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Your Submission
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleBackToDashboard}
              variant="outline"
              size="lg"
              className="w-full bg-white/80 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button 
              onClick={handleCreateNewSurvey}
              variant="outline"
              size="lg"
              className="w-full bg-white/80 hover:bg-green-50 border-2 border-green-200 hover:border-green-300 text-green-600 transition-all duration-200"
            >
              <FileText className="w-5 h-5 mr-2" />
              Submit Another Survey
            </Button>
          </div>
        </div>

        {/* Enhanced Additional Actions */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-full">
                <Share2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Share Your Impact</h3>
                <p className="text-sm text-gray-600">Help us spread awareness about NCD initiatives</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-blue-600 transition-all duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Achievement
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-green-50 border border-green-200 hover:border-green-300 text-green-600 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Support Information */}
        <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Need help or have questions about your submission?
          </p>
          <a
            href="/contact-us" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium underline transition-colors duration-200"
          >
            Contact our support team
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
