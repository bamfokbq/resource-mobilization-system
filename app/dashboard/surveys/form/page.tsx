"use client";

import React from 'react';
import FormSidebar from '@/components/forms/surveys/FormSidebar';
import AdditionalInfoForm from '@/components/forms/surveys/AdditionalInfoForm';
import FinalSubmissionForm from '@/components/forms/surveys/FinalSubmissionForm';
import OrganisationInfoForm from '@/components/forms/surveys/OrganisationInfoForm';
import PartnersInfoForm from '@/components/forms/surveys/PartnersInfoForm';
import ProjectActivitiesForm from '@/components/forms/surveys/ProjectActivitiesForm';
import ProjectInfoForm from '@/components/forms/surveys/ProjectInfoForm';
import { useFormStore } from '@/store/useFormStore';

export default function SurveyFormPage() {
  const { activeForm, setActiveForm, handleNext, handlePrevious, isFirstStep } = useFormStore();

  const renderForm = () => {
    const formProps = {
      handleNext,
      handlePrevious,
      isFirstStep
    };

    const forms = {
      organisation: OrganisationInfoForm,
      project: ProjectInfoForm,
      activities: ProjectActivitiesForm,
      partners: PartnersInfoForm,
      additional: AdditionalInfoForm,
      final: FinalSubmissionForm
    };

    const FormComponent = forms[activeForm] || forms.organisation;
    return <FormComponent {...formProps} />;
  };

  return (
    <section className='bg-white rounded-lg p-4 flex shadow-2xl min-h-screen w-full'>
      <FormSidebar
        activeForm={activeForm}
        onFormChange={setActiveForm}
      />
      <div className='bg-gray-100 flex-1 rounded-r-lg p-4'>
        {renderForm()}
      </div>
    </section>
  );
}
