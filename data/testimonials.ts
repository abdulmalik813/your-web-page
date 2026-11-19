export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  roleAndCompany: string;
  location: string;
  approved: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'Working with this team was an absolute pleasure. Their expertise and dedication to the project were evident from the start. They took the time to understand our needs and delivered a solution that exceeded our expectations.',
    authorName: 'Jane Doe',
    roleAndCompany: 'CEO, Acme Corp',
    location: 'Toronto, ON',
    approved: true,
  }, {
    id: '2',
    quote:
      'The team was incredibly responsive and helpful throughout the project. They went above and beyond to ensure we were satisfied with the final product.',
    authorName: 'John Smith',
    roleAndCompany: 'CTO, Tech Solutions Inc',
    location: 'Vancouver, BC',
    approved: true,
  },
  {
    id: '3',
    quote:
      'I was impressed by the team’s ability to take our vision and turn it into a reality. Their attention to detail and commitment to quality is unmatched.',
    authorName: 'Emily Johnson',
    roleAndCompany: 'Product Manager, Innovatech',
    location: 'Montreal, QC',
    approved: false,
  },
];

export function getApprovedTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter((item) => item.approved);
}
