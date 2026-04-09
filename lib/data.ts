export type Listing = {
  id: string;
  title: string;
  collegeSlug: string;
  collegeName: string;
  branch?: string;
  year?: string;
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

export const colleges: College[] = [];

export const listings: Listing[] = [];

export const categories = [
  "Books",
  "Notes / Material",
  "Study Tools",
  "Electronics",
  "Hostel / Room Essentials",
  "Lab / Project Items"
];

export function getCollege(slug: string) {
  return colleges.find((college) => college.slug === slug);
}

export function getListingsByCollege(slug: string) {
  return listings.filter((listing) => listing.collegeSlug === slug);
}

export function getListing(id: string) {
  return listings.find((listing) => listing.id === id);
}
