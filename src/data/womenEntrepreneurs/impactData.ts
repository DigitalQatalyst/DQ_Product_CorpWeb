export interface ImpactMetric {
  label: string;
  value: number;
  trend: number;
  description?: string;
}
export const impactData: ImpactMetric[] = [{
  label: 'Women-Led Businesses',
  value: 5238,
  trend: 15.3,
  description: 'Number of women-led businesses registered in Abu Dhabi'
}, {
  label: 'Investment Secured (AED M)',
  value: 2345,
  trend: 27.8,
  description: 'Total funding secured by women entrepreneurs in millions of AED'
}, {
  label: 'Annual Growth Rate (%)',
  value: 35,
  trend: 4.2,
  description: 'Year-over-year growth rate of women-owned businesses'
}, {
  label: 'Jobs Created',
  value: 12480,
  trend: 18.6,
  description: 'Number of jobs created by women-led enterprises'
}];