import React, { useState } from 'react'

interface AdditionalInfoFormProps {
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function AdditionalInfoForm({ handleNext, handlePrevious }: AdditionalInfoFormProps) {
  const [risks, setRisks] = useState('');
  const [sustainability, setSustainability] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Additional Information</h2>
      <div>
        <label className="block mb-1 text-gray-600">Potential Risks and Mitigation Strategies *</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={risks}
          onChange={(e) => setRisks(e.target.value)}
          placeholder="Describe potential risks and strategies to mitigate them"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Project Sustainability *</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={sustainability}
          onChange={(e) => setSustainability(e.target.value)}
          placeholder="Explain how the project will be sustained"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Monitoring and Evaluation Plan *</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={evaluation}
          onChange={(e) => setEvaluation(e.target.value)}
          placeholder="Describe your monitoring and evaluation plan"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Additional Notes</label>
        <textarea
          className="w-full p-2 border rounded-md bg-white"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional information"
        />
      </div>

      <div className='flex justify-between mt-4'>
        <button onClick={handlePrevious} className='bg-blue-500 text-white px-4 py-2 rounded'>Previous</button>
        <button onClick={handleNext} className='bg-blue-500 text-white px-4 py-2 rounded'>Next</button>
      </div>
    </div>
  )
}
