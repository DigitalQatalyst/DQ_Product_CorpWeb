import { FormSchema } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const IssueSupportLetterSchema: FormSchema = {
  formId: "issue-support-letter",
  formTitle: "Issue Support Letter",
  formDescription:
    "Please complete the form below to request a support letter from our organization.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

  steps: [
    {
      stepTitle: "Requester Information",
      stepDescription: "Tell us about yourself and your role in the business.",
      groups: [
        {
          groupTitle: "PERSONAL DETAILS",
          fields: [
            {
              id: "emailAddress",
              label: "Email Address",
              type: "email",
              placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
              helperText: PLACEHOLDER_STANDARDS.email.helperText,
              required: true,
            },
            {
              id: "telephoneNumber",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.phoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.phoneNumber.helperText,
            },
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.companyName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyName.helperText,
              required: true,
            },
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
              required: true,
            },
            {
              id: "position",
              label: "Position",
              type: "select",
              required: true,
              options: [
                { value: "Manager", label: "Manager" },
                { value: "CEO", label: "CEO" },
                { value: "Owner/Founder", label: "Owner/Founder" },
                { value: "Partner", label: "Partner" },
                { value: "Director", label: "Director" },
                { value: "Other", label: "Other" },
              ],
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Support Letter Details",
      stepDescription:
        "Provide details about the support letter and its purpose.",
      groups: [
        {
          groupTitle: "LETTER REQUEST",
          fields: [
            {
              id: "fundingNumber",
              label: "Funding Number",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
              required: true,
            },
            {
              id: "cancellationDetails",
              label: "Cancellation Details",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.cancellationDetails.placeholder,
              helperText: PLACEHOLDER_STANDARDS.cancellationDetails.helperText,
              required: true,
            },
            {
              id: "supportLetterType",
              label: "Type of Support Letter",
              required: true,
              type: "select",
              options: [
                { value: "employment", label: "Employment Verification" },
                { value: "financial", label: "Financial Support" },
                { value: "travel", label: "Travel Support" },
                { value: "education", label: "Education Support" },
                { value: "visa", label: "Visa Support" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "supportLetterPurpose",
              label: "Purpose of the Support Letter",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.letterPurpose.placeholder,
              helperText: PLACEHOLDER_STANDARDS.letterPurpose.helperText,
            },
            {
              id: "letterRecipient",
              label: "Recipient of the Support Letter",
              type: "text",
              placeholder: PLACEHOLDER_STANDARDS.letterRecipient.placeholder,
              helperText: PLACEHOLDER_STANDARDS.letterRecipient.helperText,
              required: true,
              validation: { minLength: 2 },
            },
            {
              id: "letterDateNeededBy",
              label: "Date Needed By",
              type: "date",
              required: true,
            },
            {
              id: "letterContentSpecifics",
              label: "Letter Content Specifics",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.notes.placeholder,
              helperText: PLACEHOLDER_STANDARDS.notes.helperText,
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Attachments & Documentation",
      stepDescription:
        "Upload any required documents to complete your request.",
      groups: [
        {
          groupTitle: "REQUIRED DOCUMENTS",
          fields: [
            {
              id: "supportingDocuments",
              label: "Supporting Documents",
              type: "multi-file",
              required: false,
              validation: {
                max: 5, // Maximum 5 files
                maxFileSize: 5242880, // 5MB in bytes
                fileTypes: [
                  ".pdf",
                  ".doc",
                  ".docx",
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".txt",
                ],
              },
            },
            {
              id: "additionalNotes",
              label: "Additional Notes or Requests",
              type: "textarea",
              placeholder: PLACEHOLDER_STANDARDS.notes.placeholder,
              helperText: PLACEHOLDER_STANDARDS.notes.helperText,
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Review & Submit",
      stepDescription: "Review your information and submit the request.",
      groups: [
        {
          groupTitle: "CONFIRMATION",
          fields: [
            {
              id: "consentAcknowledgement",
              label: "I confirm that the information provided is accurate and complete",
              type: "checkbox",
              required: true,
            },
            {
              id: "termsAndConditions",
              label: "I agree to the Terms and Conditions",
              type: "checkbox",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
