// Shared activity totals to ensure consistency across all components
// Total target: 640 activities

export const ACTIVITY_TOTALS = {
  // Component totals
  REACH: 18,
  PARTNERS: 14,
  TARGET_GROUPS: 45,
  ORGANIZATIONS: 75,
  AGE_GROUPS: 113,
  SETTINGS: 151,
  GENDER: 75,
  ACTIVITY_BY_REGION: 75,
  DISEASES: 74,
  
  // Grand total
  TOTAL: 640
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
