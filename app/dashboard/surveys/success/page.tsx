"use client";

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Users, 
  ArrowRight,
  Download,
  Share2,
  Home
} from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Survey Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for contributing to the NCD Navigator platform
          </p>
        </div>

        {/* Submission Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Submission Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Survey ID</span>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {surveyId || 'Generated'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Submitted</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {submissionDate}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Status</span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Submitted
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What Happens Next?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Review Process</h3>
                  <p className="text-sm text-gray-600">
                    Your submission will be reviewed by our team for completeness and accuracy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Data Integration</h3>
                  <p className="text-sm text-gray-600">
                    Approved data will be integrated into the NCD Navigator database and analytics.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Public Availability</h3>
                  <p className="text-sm text-gray-600">
                    Your contribution will become available in our public datasets and visualizations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {surveyId && (
            <Button 
              onClick={handleViewSurvey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Your Submission
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={handleBackToDashboard}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button 
              onClick={handleCreateNewSurvey}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Submit Another Survey
            </Button>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Share Your Impact</h3>
          <p className="text-sm text-gray-600 mb-3">
            Help us spread awareness about NCD initiatives by sharing your contribution.
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-3 h-3 mr-1" />
              Download Receipt
            </Button>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help or have questions about your submission?{' '}
            <a 
              href="/contact-us" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
