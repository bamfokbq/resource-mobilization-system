# Fix: Client Component Serialization Error

## Problem
The dashboard was throwing an error: "Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported."

This occurred because MongoDB objects were being passed directly to client components, which contain methods like `toJSON()` that cannot be serialized.

## Solution
Converted all MongoDB objects to plain JavaScript objects before passing them to client components.

### Changes Made

1. **Survey Data Serialization** (in `app/dashboard/page.tsx`):
   ```tsx
   // Before: Direct MongoDB objects
   const userSurveys = surveysResult.data.filter(survey => ...)

   // After: Serialized plain objects
   const userSurveys = surveysResult.data
     .filter(survey => survey.createdBy?.userId === session?.user?.id)
     .map(survey => ({
       _id: survey._id?.toString(),
       projectInfo: survey.projectInfo ? {
         projectName: survey.projectInfo.projectName,
         // ... other plain properties
       } : null,
       organisationInfo: survey.organisationInfo ? {
         organisationName: survey.organisationInfo.organisationName,
         // ... other plain properties  
       } : null,
       status: survey.status,
       submissionDate: survey.submissionDate?.toISOString?.() || survey.submissionDate || null,
       lastUpdated: survey.lastUpdated?.toISOString?.() || survey.lastUpdated || null,
       createdBy: survey.createdBy ? {
         userId: survey.createdBy.userId,
         userName: survey.createdBy.userName
       } : null
     }))
   ```

2. **Date Handling**:
   - Converted MongoDB Date objects to ISO strings using `toISOString()`
   - Added null checks to prevent errors if dates are undefined
   - Used optional chaining for safe property access

3. **Draft Data Serialization**:
   - Ensured draft data is also properly serialized for active surveys
   - Added safe date conversion for lastSaved timestamps

## Benefits
- ✅ Eliminates client component serialization errors
- ✅ Maintains all dashboard functionality  
- ✅ Provides clean, predictable data structure for client components
- ✅ Handles edge cases with null/undefined values
- ✅ Preserves type safety with proper interfaces

## Key Points
- Only extract the properties actually needed by client components
- Convert complex objects (ObjectId, Date) to simple types (string, string)
- Use optional chaining (`?.`) and nullish coalescing (`||`) for safety
- Test with both empty and populated data sets

The dashboard now works without serialization errors while maintaining all the enhanced analytics and visualizations.
