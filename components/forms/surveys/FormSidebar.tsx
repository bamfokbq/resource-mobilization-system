import { formSteps, FormStepId } from '@/constant/formSteps';

interface FormSidebarProps {
  activeForm: FormStepId;
  onFormChange: (formId: FormStepId) => void;
}

export default function FormSidebar({ activeForm, onFormChange }: FormSidebarProps) {
  return (
    <div className='h-full w-[250px] bg-gray-200 rounded-l-lg p-4 flex flex-col'>
      <ul className='flex-1 flex flex-col justify-between'>
        {formSteps.map((form, index) => (
          <li
            key={form.id}
            className={`cursor-pointer p-2 flex items-center ${activeForm === form.id ? 'text-navy-blue' : ''}`}
            onClick={() => onFormChange(form.id)}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 ${activeForm === form.id ? 'bg-navy-blue text-white' : 'bg-gray-300 text-black'}`}>
              {index + 1}
            </span>
            {form.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
