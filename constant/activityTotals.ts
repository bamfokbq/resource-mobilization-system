// Shared activity totals to ensure consistency across all components
// Total target: 850 activities

export const ACTIVITY_TOTALS = {
  // Component totals
  REACH: 24,
  PARTNERS: 18,
  TARGET_GROUPS: 60,
  ORGANIZATIONS: 100,
  AGE_GROUPS: 150,
  SETTINGS: 200,
  GENDER: 100,
  ACTIVITY_BY_REGION: 100,
  DISEASES: 98,
  
  // Grand total
  TOTAL: 850
} as const;

// Verification function
export const verifyTotal = () => {
  const sum = Object.values(ACTIVITY_TOTALS).reduce((acc, val) => {
    if (val === ACTIVITY_TOTALS.TOTAL) return acc;
    return acc + val;
  }, 0);
  
  return sum === ACTIVITY_TOTALS.TOTAL;
};

// Export individual totals for easy reference
export const {
  REACH,
  PARTNERS,
  TARGET_GROUPS,
  ORGANIZATIONS,
  AGE_GROUPS,
  SETTINGS,
  GENDER,
  ACTIVITY_BY_REGION,
  DISEASES,
  TOTAL
} = ACTIVITY_TOTALS;
