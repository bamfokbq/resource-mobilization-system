"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFormStore } from '@/store/useFormStore';
import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
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
import React from 'react';
import { toast } from 'sonner';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    color: '#1f2937',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  bulletPoint: {
    marginBottom: 6,
    paddingLeft: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepNumber: {
    width: 20,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: '#4b5563',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  successIcon: {
    fontSize: 20,
    color: '#10b981',
    marginBottom: 10,
  }
});

// PDF Receipt Component
const ReceiptPDF = ({ receiptData, formData }: { receiptData: any; formData: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.title}>NCD NAVIGATOR PLATFORM</Text>
        <Text style={styles.subtitle}>Survey Submission Receipt</Text>
      </View>

      {/* Submission Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Submission Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Survey ID:</Text>
          <Text style={styles.value}>{receiptData.surveyId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Confirmation Number:</Text>
          <Text style={styles.value}>{receiptData.confirmationNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Submission Date:</Text>
          <Text style={styles.value}>{receiptData.submissionDate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.statusBadge}>{receiptData.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Platform:</Text>
          <Text style={styles.value}>{receiptData.platform}</Text>
        </View>
      </View>

      {/* Organization Information */}
      {formData.organisationInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization Information</Text>

          {formData.organisationInfo.organisationName && (
            <View style={styles.row}>
              <Text style={styles.label}>Organization Name:</Text>
              <Text style={styles.value}>{formData.organisationInfo.organisationName}</Text>
            </View>
          )}

          {formData.organisationInfo.region && (
            <View style={styles.row}>
              <Text style={styles.label}>Region:</Text>
              <Text style={styles.value}>{formData.organisationInfo.region}</Text>
            </View>
          )}

          {formData.organisationInfo.sector && (
            <View style={styles.row}>
              <Text style={styles.label}>Sector:</Text>
              <Text style={styles.value}>{formData.organisationInfo.sector}</Text>
            </View>
          )}

          {formData.organisationInfo.hqPhoneNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Phone (HQ):</Text>
              <Text style={styles.value}>{formData.organisationInfo.hqPhoneNumber}</Text>
            </View>
          )}

          {formData.organisationInfo.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{formData.organisationInfo.email}</Text>
            </View>
          )}

          {formData.organisationInfo.website && (
            <View style={styles.row}>
              <Text style={styles.label}>Website:</Text>
              <Text style={styles.value}>{formData.organisationInfo.website}</Text>
            </View>
          )}

          {formData.organisationInfo.ghanaPostGPS && (
            <View style={styles.row}>
              <Text style={styles.label}>Ghana Post GPS:</Text>
              <Text style={styles.value}>{formData.organisationInfo.ghanaPostGPS}</Text>
            </View>
          )}
        </View>
      )}

      {/* Project Information */}
      {formData.projectInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Information</Text>

          {formData.projectInfo.projectName && (
            <View style={styles.row}>
              <Text style={styles.label}>Project Name:</Text>
              <Text style={styles.value}>{formData.projectInfo.projectName}</Text>
            </View>
          )}

          {formData.projectInfo.totalProjects && (
            <View style={styles.row}>
              <Text style={styles.label}>Total Projects:</Text>
              <Text style={styles.value}>{formData.projectInfo.totalProjects}</Text>
            </View>
          )}

          {formData.projectInfo.startDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Start Date:</Text>
              <Text style={styles.value}>{formData.projectInfo.startDate}</Text>
            </View>
          )}

          {formData.projectInfo.endDate && (
            <View style={styles.row}>
              <Text style={styles.label}>End Date:</Text>
              <Text style={styles.value}>{formData.projectInfo.endDate}</Text>
            </View>
          )}

          {formData.projectInfo.fundingSource && (
            <View style={styles.row}>
              <Text style={styles.label}>Funding Source:</Text>
              <Text style={styles.value}>{formData.projectInfo.fundingSource}</Text>
            </View>
          )}

          {formData.projectInfo.estimatedBudget && (
            <View style={styles.row}>
              <Text style={styles.label}>Budget:</Text>
              <Text style={styles.value}>GHS {formData.projectInfo.estimatedBudget}</Text>
            </View>
          )}

          {formData.projectInfo.regions && formData.projectInfo.regions.length > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Regions:</Text>
              <Text style={styles.value}>{formData.projectInfo.regions.join(', ')}</Text>
            </View>
          )}

          {formData.projectInfo.targetedNCDs && formData.projectInfo.targetedNCDs.length > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Targeted NCDs:</Text>
              <Text style={styles.value}>{formData.projectInfo.targetedNCDs.join(', ')}</Text>
            </View>
          )}

          {formData.projectInfo.projectGoal && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Project Goal:</Text>
              <Text style={[styles.value, { marginTop: 5, lineHeight: 1.4 }]}>{formData.projectInfo.projectGoal}</Text>
            </View>
          )}
        </View>
      )}

      {/* Project Activities */}
      {formData.activities && formData.activities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Activities ({formData.activities.length})</Text>
          {formData.activities.map((activity: any, index: number) => (
            <View key={index} style={{ marginBottom: 15, paddingLeft: 10, borderLeft: 2, borderLeftColor: '#f97316' }}>
              <Text style={[styles.value, { fontWeight: 'bold', marginBottom: 3 }]}>
                {index + 1}. {activity.name}
              </Text>
              <Text style={[styles.stepText, { marginBottom: 3 }]}>{activity.description}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Timeline:</Text>
                <Text style={styles.value}>{activity.timeline}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Budget:</Text>
                <Text style={styles.value}>${activity.budget}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Project Partners */}
      {formData.partners && formData.partners.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Partners ({formData.partners.length})</Text>
          {formData.partners.map((partner: any, index: number) => (
            <View key={index} style={{ marginBottom: 15, paddingLeft: 10, borderLeft: 2, borderLeftColor: '#06b6d4' }}>
              <Text style={[styles.value, { fontWeight: 'bold', marginBottom: 3 }]}>
                {index + 1}. {partner.organisationName}
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>{partner.role}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Contact Person:</Text>
                <Text style={styles.value}>{partner.contactPerson}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{partner.email}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Additional Information */}
      {(formData.risks || formData.sustainability || formData.evaluation || formData.notes) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          {formData.risks && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.label, { marginBottom: 3 }]}>Risks & Mitigation:</Text>
              <Text style={[styles.value, { lineHeight: 1.4 }]}>{formData.risks}</Text>
            </View>
          )}

          {formData.sustainability && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.label, { marginBottom: 3 }]}>Sustainability Plan:</Text>
              <Text style={[styles.value, { lineHeight: 1.4 }]}>{formData.sustainability}</Text>
            </View>
          )}

          {formData.evaluation && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.label, { marginBottom: 3 }]}>Monitoring & Evaluation:</Text>
              <Text style={[styles.value, { lineHeight: 1.4 }]}>{formData.evaluation}</Text>
            </View>
          )}

          {formData.notes && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.label, { marginBottom: 3 }]}>Additional Notes:</Text>
              <Text style={[styles.value, { lineHeight: 1.4 }]}>{formData.notes}</Text>
            </View>
          )}
        </View>
      )}

      {/* Submission Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Submission Summary</Text>
        <View style={styles.bulletPoint}>
          <Text style={styles.value}>• Your survey has been successfully submitted</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.value}>• Data will be reviewed within 2-3 business days</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.value}>• Approved data will be integrated into our database</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.value}>• Your contribution will help improve healthcare initiatives</Text>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Happens Next?</Text>

        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>1.</Text>
          <View>
            <Text style={styles.value}>Review Process</Text>
            <Text style={styles.stepText}>Expert team validation for completeness and accuracy</Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>2.</Text>
          <View>
            <Text style={styles.value}>Data Integration</Text>
            <Text style={styles.stepText}>Database incorporation and analytics enhancement</Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>3.</Text>
          <View>
            <Text style={styles.value}>Public Availability</Text>
            <Text style={styles.stepText}>Dataset publication and policy impact</Text>
          </View>
        </View>
      </View>

      {/* Support Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Website:</Text>
          <Text style={styles.value}>{receiptData.websiteUrl}/contact-us</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>support@ncdnavigator.com</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Thank you for contributing to healthcare improvement in Ghana!
        </Text>
        <Text style={styles.footerText}>
          Generated on: {receiptData.generatedDate}
        </Text>
        <Text style={styles.footerText}>
          This is an automatically generated receipt. Please save it for your records.
        </Text>
      </View>
    </Page>
  </Document>
);

export default function SurveySuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formData } = useFormStore();
  const [isDownloadingReceipt, setIsDownloadingReceipt] = React.useState(false);
  
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

  const handleShareAchievement = async () => {
    const shareData = {
      title: 'NCD Navigator Survey Contribution',
      text: `I just contributed to the NCD Navigator platform by submitting a survey! Join me in helping improve healthcare initiatives across Ghana. Survey ID: ${surveyId || 'SRV-' + Date.now().toString().slice(-6)}`,
      url: window.location.origin + '/survey-data'
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!', {
          description: 'Thank you for spreading awareness about NCD initiatives'
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n\nLearn more: ${shareData.url}`
        );
        toast.success('Share text copied to clipboard!', {
          description: 'You can now paste it anywhere to share your achievement'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${shareData.text}\n\nLearn more: ${shareData.url}`
        );
        toast.success('Share text copied to clipboard!', {
          description: 'You can now paste it anywhere to share your achievement'
        });
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        toast.error('Unable to share', {
          description: 'Please copy the URL manually from your browser'
        });
      }
    }
  };

  const handleDownloadReceipt = async () => {
    setIsDownloadingReceipt(true);

    const receiptData = {
      surveyId: surveyId || 'SRV-' + Date.now().toString().slice(-6),
      submissionDate: submissionDate,
      status: 'Successfully Submitted',
      platform: 'NCD Navigator',
      submittedBy: 'Survey Contributor',
      confirmationNumber: 'CONF-' + Date.now().toString().slice(-8),
      timestamp: new Date().toISOString(),
      websiteUrl: window.location.origin,
      generatedDate: new Date().toLocaleString()
    }; try {
      // Generate PDF blob
      const blob = await pdf(<ReceiptPDF receiptData={receiptData} formData={formData} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NCD-Navigator-Receipt-${receiptData.surveyId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF Receipt downloaded successfully!', {
        description: `File saved as: NCD-Navigator-Receipt-${receiptData.surveyId}.pdf`
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF receipt', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsDownloadingReceipt(false);
    }
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
                onClick={handleShareAchievement}
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-blue-600 transition-all duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Achievement
              </Button>
              <Button
                onClick={handleDownloadReceipt}
                disabled={isDownloadingReceipt}
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-green-50 border border-green-200 hover:border-green-300 text-green-600 transition-all duration-200 disabled:opacity-50"
              >
                {isDownloadingReceipt ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                  </>
                )}
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
