"use client";

import React, { useState } from 'react'
import AdditionalInfoForm from '@/components/forms/surveys/AdditionalInfoForm'
import FinalSubmissionForm from '@/components/forms/surveys/FinalSubmissionForm'
import OrganisationInfoForm from '@/components/forms/surveys/OrganisationInfoForm'
import PartnersInfoForm from '@/components/forms/surveys/PartnersInfoForm'
import ProjectActivitiesForm from '@/components/forms/surveys/ProjectActivitiesForm'
import ProjectInfoForm from '@/components/forms/surveys/ProjectInfoForm'

export default function SurveyFormPage() {
  const [activeForm, setActiveForm] = useState('organisation')

  const forms = [
    { id: 'organisation', label: 'Organisation Info' },
    { id: 'project', label: 'Project Info' },
    { id: 'activities', label: 'Project Activities' },
    { id: 'partners', label: 'Partners Info' },
    { id: 'additional', label: 'Additional Info' },
    { id: 'final', label: 'Final Submission' }
  ]

  const renderForm = () => {
    const formProps = { handleNext, handlePrevious }
    switch (activeForm) {
      case 'organisation':
        return <OrganisationInfoForm {...formProps} />
      case 'project':
        return <ProjectInfoForm {...formProps} />
      case 'activities':
        return <ProjectActivitiesForm {...formProps} />
      case 'partners':
        return <PartnersInfoForm {...formProps} />
      case 'additional':
        return <AdditionalInfoForm {...formProps} />
      case 'final':
        return <FinalSubmissionForm {...formProps} />
      default:
        return <OrganisationInfoForm {...formProps} />
    }
  }

  const handleNext = () => {
    const currentIndex = forms.findIndex(form => form.id === activeForm)
    if (currentIndex < forms.length - 1) {
      setActiveForm(forms[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = forms.findIndex(form => form.id === activeForm)
    if (currentIndex > 0) {
      setActiveForm(forms[currentIndex - 1].id)
    }
  }

  return (
    <section className='bg-white rounded-lg p-4 flex shadow-2xl h-screen w-full'>
      <div className='h-full w-[250px] bg-gray-200 rounded-l-lg p-4 flex flex-col'>
        <ul className='flex-1 flex flex-col justify-between'>
          {forms.map((form, index) => (
            <li
              key={form.id}
              className={`cursor-pointer p-2 flex items-center ${activeForm === form.id ? 'text-navy-blue' : ''}`}
              onClick={() => setActiveForm(form.id)}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 ${activeForm === form.id ? 'bg-navy-blue text-white' : 'bg-gray-300 text-black'}`}>
                {index + 1}
              </span>
              {form.label}
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-gray-100 flex-1 h-full rounded-r-lg p-4'>
        {renderForm()}
      </div>
    </section>
  )
}
