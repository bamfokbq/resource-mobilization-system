import { formSteps, FormStepId } from '@/constant/formSteps';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormSidebarProps {
  activeForm: FormStepId;
  onFormChange: (formId: FormStepId) => void;
}

export default function FormSidebar({ activeForm, onFormChange }: FormSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`h-auto ${isCollapsed ? 'w-[80px]' : 'w-[250px]'} bg-gray-200 rounded-l-lg p-4 flex flex-col transition-all duration-300 ease-in-out relative`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center z-50 hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <ul className='flex-1 flex flex-col justify-between'>
        {formSteps.map((form, index) => (
          <li
            key={form.id}
            className={`cursor-pointer p-2 flex items-center ${activeForm === form.id ? 'text-navy-blue' : ''} ${isCollapsed ? 'justify-center' : ''}`}
            onClick={() => onFormChange(form.id)}
            title={isCollapsed ? form.label : undefined}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isCollapsed ? '' : 'mr-4'} ${activeForm === form.id ? 'bg-navy-blue text-white' : 'bg-gray-300 text-black'}`}>
              {index + 1}
            </span>
            {!isCollapsed && (
              <span className="truncate">{form.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
