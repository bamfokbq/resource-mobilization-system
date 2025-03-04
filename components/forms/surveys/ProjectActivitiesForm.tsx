"use client"

import { useFormStore } from "@/store/useFormStore"

export default function ProjectActivitiesForm() {
  const { formData } = useFormStore()

  const ncdsSelectedFromProjectInfoForm = formData?.projectInfo?.targetedNCDs || []

  console.log("ncdsSelectedFromProjectInfoForm", ncdsSelectedFromProjectInfoForm);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Section B.3: Project Activities</h2>
        <p className="text-gray-600 mb-2">
          Note: Activities are the day to day, month to month tasks that you do to achieve your objectives. Activities have a focus in that they are done in a specific place (region/district/community), they target a certain population, address a set of disease area(s) and seek to improve a section on the continuum of care. This section will ask questions focusing on each disease your project targets.
        </p>
        <p className="text-gray-600 mb-2">
          Note: For questions on continuum of care, please condense your project activities and outputs to align with at least one of the sections on the continuum of care.
        </p>
        <p className="text-gray-600">Note: For the primary target population, this is the group of people that your project activity seeks to directly inﬂuence or affect. While other groups may beneﬁt from the activity, the primary target population is the group to which your project was awarded the funding.
        </p>
      </div>
    </div>
  )
}
