import { FormSchema } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const RequestForFundingSchema: FormSchema = {
  formId: "request-for-funding",
  formTitle: "Request for Funding",
  formDescription:
    "Please complete the form below to proceed with your funding application.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

  steps: [
    {
      stepTitle: "Applicant Information",
      stepDescription: "Tell us about yourself and your role in the business.",
      groups: [
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
            },
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
            },
          ],
        },
        {
          groupTitle: "REQUESTOR INFORMATION",
          fields: [
            {
              id: "position",
              label: "Position",
              type: "select",
              required: true,
              options: [
                { value: "CEO", label: "CEO" },
                { value: "Owner/Founder", label: "Owner/Founder" },
                { value: "Partner", label: "Partner" },
                { value: "Director", label: "Director" },
                { value: "Manager", label: "Manager" },
                { value: "Other", label: "Other" },
              ],
            },
            {
              id: "emailAddress",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
              helperText: PLACEHOLDER_STANDARDS.email.helperText,
            },
            {
              id: "telephoneNumber",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.phoneNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.phoneNumber.helperText,
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Funding Details",
      stepDescription: "Provide information about your funding needs.",
      groups: [
        {
          groupTitle: "FUNDING PROGRAM",
          fields: [
            {
              id: "fundingProgram",
              label: "Please select the funding program you want to apply for",
              type: "select",
              required: true,
              options: [
                { label: "Start Up", value: "Start Up" },
                { label: "Scale Up", value: "Scale Up" },
                { label: "Growth", value: "Growth" },
                { label: "Expansion", value: "Expansion" },
              ],
            },
          ],
        },
        {
          groupTitle: "PROJECT DETAILS",
          fields: [
            {
              id: "projectName",
              label: "Project Name",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.projectName.placeholder,
              helperText: PLACEHOLDER_STANDARDS.projectName.helperText,
            },
            {
              id: "currentInvestment",
              label: "Current Investment (AED)",
              type: "number",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.amountAED.placeholder,
              helperText: PLACEHOLDER_STANDARDS.amountAED.helperText,
            },
          ],
        },
        {
          groupTitle: "FUNDING AMOUNTS",
          fields: [
            {
              id: "loanAmount",
              label: "Loan Amount Requested (AED)",
              type: "number",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.amountAED.placeholder,
              helperText: PLACEHOLDER_STANDARDS.amountAED.helperText,
            },
            {
              id: "minContribution",
              label: "Minimum Contribution (AED)",
              type: "number",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.amountAED.placeholder,
              helperText: PLACEHOLDER_STANDARDS.amountAED.helperText,
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Supporting Documents",
      stepDescription: "Upload required supporting documents.",
      groups: [
        {
          groupTitle: "UPLOAD DOCUMENTS",
          fields: [
            {
              id: "TradeLicence",
              label: "Valid Trade License of the Enterprise",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
            {
              id: "scoredReport",
              label: "Entrepreneur's Scored Report from Al Etihad Credit Bureau (AECB)",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Consent and Confirmation",
      stepDescription: "Please review and confirm your application details.",
      groups: [
        {
          groupTitle: "CONSENT",
          fields: [
            {
              id: "consentAcknowledgement",
              label: "I confirm that all information provided is accurate and complete",
              type: "checkbox",
              required: true,
            },
            {
              id: "dataSharingConsent",
              label: "I consent to the sharing of my business information with third parties for partnership opportunities and platform services",
              type: "checkbox",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
