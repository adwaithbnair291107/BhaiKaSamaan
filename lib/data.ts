export type Listing = {
  id: string;
  title: string;
  collegeSlug: string;
  collegeName: string;
  branch?: string | null;
  year?: string | null;
  category: string;
  condition: string;
  price: number;
  location: string;
  postedBy: string;
  postedAgo: string;
  description: string;
  image: string;
};

export type College = {
  slug: string;
  name: string;
  city: string;
  activeListings: number;
  description: string;
};

export const categories = [
  "College Books",
  "Exam Books (Competitive)",
  "Notes & Printed Material",
  "Study Tools & Stationery",
  "College Accessories",
  "Hostel & Room Essentials",
  "Electronics & Gadgets",
  "Lab & Project Items"
];
