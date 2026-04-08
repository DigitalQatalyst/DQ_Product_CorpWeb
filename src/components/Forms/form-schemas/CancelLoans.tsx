import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";
import { isValidEmail } from "../../../utils/emailValidation";

// Define the form schema for the "Loan Cancellation" form
export const loanCancellationSchema: FormSchema = {
  formId: "cancel-loan",
  formTitle: "Cancel Loan Request",
  formDescription:
    "Please complete this form to request the cancellation of your existing loan. Provide all required information and documentation to process your request.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000,
  submitEndpoint: "",
  steps: [
    {
      stepTitle: "Personal Information",
      stepDescription:
        "Please provide your personal details and contact information",
      groups: [
        {
          groupTitle: "Personal Details",
          groupDescription:
            "Enter your personal information for the loan cancellation request",
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
            } as FormField,
            {
              id: "telephoneNumber",
              label: "Contact Telephone Number",
              type: "tel",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.telephoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.telephoneNumber.helperText,
              validation: {
                required: "Contact telephone number is required",
                pattern: "^\\+?[0-9]{10,15}$",
                message: "Please enter a valid phone number",
              },
            } as FormField,
            {
              id: "position",
              label: "Position",
              type: "select",
              required: true,
              options: [
                { value: "Junior", label: "Junior" },
                { value: "Senior", label: "Senior" },
                { value: "Manager", label: "Manager" },
                { value: "Director", label: "Director" },
                { value: "CEO", label: "CEO" },
                { value: "Owner/Founder", label: "Owner/Founder" },
                { value: "Other", label: "Other" },
              ],
            } as FormField,
            {
              id: "fundingNumber",
              label: "Funding Request Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Company & Cancellation Details",
      stepDescription:
        "Please provide company information and cancellation details",
      groups: [
        {
          groupTitle: "Company Information",
          groupDescription: "Enter your company details (if applicable)",
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
        {
          groupTitle: "Cancellation Information",
          groupDescription:
            "Provide details about your loan cancellation request",
          fields: [
            {
              id: "cancellationDetails",
              label: "Cancellation Details",
              type: "textarea",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.cancellationDetails.placeholder,
              helperText: PLACEHOLDER_STANDARDS.cancellationDetails.helperText,
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Data Sharing Consent",
      stepDescription: "Review and provide consent for data sharing",
      groups: [
        {
          groupTitle: "Data Sharing Consent",
          groupDescription:
              "Please review our data sharing policy and provide your consent",
          fields: [
            {
              id: "consentAcknowledgement",
              label:
                  "I acknowledge that by providing this consent, my information may be shared with third-party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.",
              type: "checkbox",
              required: true,
            } as FormField,
          ],
        },
      ],
    },
  ],
};

// Validation schema for the "Loan Cancellation" form
export const loanCancellationValidationSchema = yup.object({
  // Step 1 fields
  Nameofpersonmakingthesubmission: yup
    .string()
    .required("Submitter name is required")
    .min(2, "Submitter name must be at least 2 characters"),
  EmailAddress: yup
    .string()
    .required("Email address is required")
    .test("email-validation", "Please enter a valid email address", (value) => {
      return value ? isValidEmail(value) : false;
    }),
  Contacttelephonenumber: yup
    .string()
    .required("Contact telephone number is required")
    .matches(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  Position: yup.string().optional(),
  FundingRequestNumber: yup.string().optional(),

  // Step 2 fields
  Companyname: yup.string().optional(),
  Companynumber: yup.string().optional(),
  CancellationDetails: yup.string().optional(),
});
