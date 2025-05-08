import * as z from "zod"

export const organisationInfoSchema = z
  .object({
    organisationName: z.string().min(1, { message: "Please enter your organization's name" }),
    region: z.string().min(1, { message: "Please select your head office region" }),
    hasRegionalOffice: z.boolean(),
    regionalOfficeLocation: z.string().optional(),
    gpsCoordinates: z.object({
      latitude: z.string(),
      longitude: z.string(),
    }),
    ghanaPostGPS: z.string().optional(),
    sector: z.string().min(1, { message: "Please select your organization's sector" }),
    hqPhoneNumber: z.string().min(1, { message: "Please enter your HQ phone number" })
      .regex(/^[0-9]+$/, { message: "Phone number must contain only numbers" })
      .min(10, { message: "Phone number must be at least 10 digits" }),
    regionalPhoneNumber: z.string().optional(),
    email: z.string()
      .min(1, { message: "Please enter your email address" })
      .email({ message: "Please enter a valid email address" }),
    website: z.string().url({ message: "Please enter a valid URL (e.g., https://www.example.com)" }).optional().or(z.literal("")),
    registrationNumber: z.string().optional(),
    address: z.string().optional(),
    contactPerson: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasRegionalOffice && (!data.regionalOfficeLocation || data.regionalOfficeLocation.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Regional office location is required when 'Has Regional Office' is Yes.",
        path: ["regionalOfficeLocation"],
      });
    }
  });