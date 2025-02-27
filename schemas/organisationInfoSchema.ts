import * as yup from 'yup';

export const organisationInfoSchema = yup.object({
  organisationName: yup.string().required('Organization name is required'),
  region: yup.string().required('Region is required'),
  hasRegionalOffice: yup.boolean().required(),
  regionalOfficeLocation: yup.string().when('hasRegionalOffice', (hasRegionalOffice, schema) => {
    return hasRegionalOffice ? schema.required('Regional office location is required') : schema;
  }),
  gpsCoordinates: yup.object({
    latitude: yup.string(),
    longitude: yup.string(),
  }),
  ghanaPostGPS: yup.string(),
  sector: yup.string().required('Sector is required'),
  hqPhoneNumber: yup.string().required('HQ phone number is required'),
  regionalPhoneNumber: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  website: yup.string().url('Invalid URL format'),
});

export type OrganisationInfoSchema = yup.InferType<typeof organisationInfoSchema>;
