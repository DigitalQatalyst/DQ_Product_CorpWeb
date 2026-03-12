import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const collateralGuideSchema: FormSchema = {
  formId: "collateral-user-guide",
  formTitle: "Collateral User Guide Request",
  formDescription:
    "Please complete the form below to request guidance on collateral procedures.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 15000,
  submitEndpoint: "",
  steps: [
    {
      stepTitle: "Personal & Company Information",
      stepDescription:
        "Please provide your personal and company details.",
      groups: [
        {
          groupTitle: "PERSONAL INFORMATION",
          fields: [
            {
              id: "submittedBy",
              label: "Name of Person Making the Submission",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.submitterName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.submitterName.helperText,
              validation: {
                required: "Submitter name is required",
                minLength: 2,
                message: "Submitter name must be at least 2 characters",
              },
            } as FormField,
            {
              id: "emailAddress",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
              helperText: PLACEHOLDER_STANDARDS.email.helperText,
              validation: {
                required: "Email address is required",
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message: "Please enter a valid email address",
              },
            } as FormField,
            {
              id: "telephoneNumber",
              label: "Telephone Number",
              type: "tel",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.telephoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.telephoneNumber.helperText,
              validation: {
                required: "Telephone number is required",
                pattern: "^\\+?[0-9]{8,15}$",
                message: "Please enter a valid phone number",
              },
            } as FormField,
            {
              id: "position",
              label: "Position",
              type: "text",
              required: true,
              placeholder: "Senior",
            } as FormField,
          ],
        },
        {
          groupTitle: "COMPANY INFORMATION",
          fields: [
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyName.helperText,
            } as FormField,
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Asset Details",
      stepDescription: "Please provide asset details.",
      groups: [
        {
          groupTitle: "ASSET INFORMATION",
          fields: [
            {
              id: "assetName",
              label: "Asset Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.assetName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.assetName.helperText,
            } as FormField,
            {
              id: "assetNumber",
              label: "Asset Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.assetNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.assetNumber.helperText,
            } as FormField,
            {
              id: "additionalDetails",
              label: "Additional Details",
              type: "textarea",
              required: false,
              placeholder: PLACEHOLDER_STANDARDS.additionalDetails.placeholder,
              helperText: PLACEHOLDER_STANDARDS.additionalDetails.helperText,
            } as FormField,
          ],
        },
      ],
    },
  ],
};

// Validation schema for the "Collateral User Guide" form
export const collateralGuideValidationSchema = yup.object({
  // Step 1 fields
  submittedBy: yup
    .string()
    .required("Submitter name is required")
    .min(2, "Submitter name must be at least 2 characters"),
  emailAddress: yup
    .string()
    .required("Email address is required")
    .email("Please enter a valid email address"),
  telephoneNumber: yup
    .string()
    .required("Telephone number is required")
    .matches(/^\+?[0-9]{8,15}$/, "Please enter a valid phone number"),
  position: yup.string().required("Position is required"),

  // Step 2 fields
  companyName: yup.string().required("Company name is required"),
  companyNumber: yup.string().required("Company number is required"),
  assetName: yup.string().required("Asset name is required"),
  assetNumber: yup.string().required("Asset number is required"),
  additionalDetails: yup.string().optional(),
});
