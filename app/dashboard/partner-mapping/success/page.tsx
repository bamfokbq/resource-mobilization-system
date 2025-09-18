"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PartnerMappingSuccessPage() {
  const searchParams = useSearchParams();
  const partnerMappingId = searchParams.get('partnerMappingId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Partner Mapping Submitted Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-green-700">
              Your partner mapping has been submitted and saved to the system.
            </p>
            
            {partnerMappingId && (
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Partner Mapping ID:</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {partnerMappingId}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard/partner-mapping">
                  <FileText className="w-4 h-4 mr-2" />
                  View All Partner Mappings
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
