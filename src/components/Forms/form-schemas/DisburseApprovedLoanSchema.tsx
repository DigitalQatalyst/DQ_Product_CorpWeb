import { FormSchema } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const DisburseApprovedLoanSchema: FormSchema = {
  formId: "disburse-approved-loan",
  formTitle: "Disburse an Approved Loan",
  formDescription:
    "Please fill out the details to disburse the approved loan. Ensure that all information is correct before confirming the disbursement.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

  steps: [
    {
      stepTitle: "Personal & Company Information",
      stepDescription:
        "Enter your personal details and company information.",
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
            {
              id: "position",
              label: "Position",
              type: "select",
              required: true,
              options: [
                { value: "Project Manager", label: "Project Manager" },
                { value: "Senior Manager", label: "Senior Manager" },
                { value: "Director", label: "Director" },
                { value: "CEO", label: "CEO" },
                { value: "Owner/Founder", label: "Owner/Founder" },
                { value: "Other", label: "Other" },
              ],
            },
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
            },
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.companyNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.companyNumber.helperText,
            },
            {
              id: "fundingNumber",
              label: "Funding Number",
              type: "text",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.fundingNumber.placeholder,
              helperText: PLACEHOLDER_STANDARDS.fundingNumber.helperText,
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Disbursement Details",
      stepDescription:
        "Specify the amount and payment method for the disbursement.",
      groups: [
        {
          groupTitle: "DISBURSEMENT INFORMATION",
          fields: [
            {
              id: "amountInAED",
              label: "Amount in AED",
              type: "number",
              required: true,
              placeholder: PLACEHOLDER_STANDARDS.amountAED.placeholder,
              helperText: PLACEHOLDER_STANDARDS.amountAED.helperText,
            },
            {
              id: "paymentMethod",
              label: "Payment Method",
              type: "select",
              required: true,
              options: [
                { value: "Cheque", label: "Cheque" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Cash", label: "Cash" },
                { value: "Other", label: "Other" },
              ],
            },
            {
              id: "otherOptional",
              label: "Other Payment Details (Optional)",
              type: "text",
              placeholder: "N/A",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Required Documents",
      stepDescription:
        "Upload all required documents for the loan disbursement.",
      groups: [
        {
          groupTitle: "DOCUMENT UPLOADS",
          fields: [
            {
              id: "supplierLicense",
              label: "Supplier License",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
            {
              id: "officialQuotations",
              label: "Official Quotations",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
            {
              id: "invoices",
              label: "Invoices",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
            {
              id: "deliveryNotes",
              label: "Delivery Notes",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
            {
              id: "paymentReceipts",
              label: "Payment Receipts",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
            {
              id: "employeeList",
              label: "Employee List",
              type: "file",
              required: true,
              accept: ".pdf,.doc,.docx",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Review & Submit",
      stepDescription:
        "Review the details before submitting the disbursement request.",
      groups: [
        {
          groupTitle: "CONFIRMATION",
          fields: [
            {
              id: "consentAcknowledgement",
              label: "I confirm that the information provided is accurate and complete.",
              type: "checkbox",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
