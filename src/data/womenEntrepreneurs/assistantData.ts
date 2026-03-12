export interface AssistantQA {
  question: string;
  answer: string;
}
export const assistantData: AssistantQA[] = [{
  question: 'How can I access funding?',
  answer: "You can explore available programs under Funding Opportunities. The Khalifa Fund and Emirates Development Bank offer specialized programs for women entrepreneurs. You'll need to prepare a business plan and financial projections."
}, {
  question: 'What mentorship programs are available?',
  answer: 'We offer several mentorship programs connecting you with experienced business leaders. The Women Entrepreneurs Mentorship Program runs quarterly cohorts with both group and one-on-one sessions.'
}, {
  question: 'How do I join networking events?',
  answer: 'Check our Events calendar for upcoming networking opportunities. Most events require registration through our portal. The monthly Entrepreneur Connect sessions are specifically designed for making new business connections.'
}, {
  question: 'What resources exist for tech startups?',
  answer: 'Tech startups can access specialized support through Hub71 and startAD incubators. We also offer coding workshops, technical mentorship, and connections to tech investors through our Technology Innovation Program.'
}, {
  question: 'Are there export assistance programs?',
  answer: 'Yes, the Export Development Program helps businesses prepare for international markets. This includes market research, regulatory guidance, and connecting with distributors abroad. Dubai Exports also offers specialized services for women-led businesses.'
}];
export const footerData = {
  title: 'Ready to grow?',
  subtitle: 'Join the next generation of entrepreneurs.',
  buttonText: 'Get Started'
};