export const formSteps = [
  { id: 'organisation', label: 'Organisation Info' },
  { id: 'project', label: 'Project Info' },
  { id: 'activities', label: 'Project Activities' },
  { id: 'partners', label: 'Partners Info' },
  { id: 'additional', label: 'Additional Info' },
  { id: 'final', label: 'Final Submission' }
] as const;

export type FormStepId = typeof formSteps[number]['id'];
