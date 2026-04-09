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

export const colleges: College[] = [
  {
    slug: "iit-delhi",
    name: "IIT Delhi",
    city: "New Delhi",
    activeListings: 18,
    description: "Books, hostel gear, and branch-specific items for campus handoff."
  },
  {
    slug: "nit-trichy",
    name: "NIT Trichy",
    city: "Tiruchirappalli",
    activeListings: 12,
    description: "Mini marketplace for seniors, juniors, and hostel students."
  },
  {
    slug: "allen-kota",
    name: "Allen Kota",
    city: "Kota",
    activeListings: 24,
    description: "JEE and NEET prep books, PYQs, notes, and room essentials."
  }
];

export const listings: Listing[] = [
  {
    id: "hc-verma-set",
    title: "HC Verma + PYQ combo set",
    collegeSlug: "allen-kota",
    collegeName: "Allen Kota",
    branch: "JEE",
    year: "Dropper",
    category: "Books",
    condition: "Lightly used",
    price: 850,
    location: "Talwandi Hostel Area",
    postedBy: "Raghav S.",
    postedAgo: "2 hours ago",
    description: "Both volumes, marked in pencil only. Includes one PYQ practice book for mains.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "first-year-drafting-kit",
    title: "First-year drafting kit",
    collegeSlug: "nit-trichy",
    collegeName: "NIT Trichy",
    branch: "Mechanical",
    year: "1st Year",
    category: "Lab / Project Items",
    condition: "Good",
    price: 600,
    location: "Orion Hostel",
    postedBy: "Aparna K.",
    postedAgo: "5 hours ago",
    description: "Drafter, mini set squares, compass, and sheets folder. Useful for first semester.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "hostel-whiteboard",
    title: "Small magnetic whiteboard",
    collegeSlug: "iit-delhi",
    collegeName: "IIT Delhi",
    category: "Hostel / Room Essentials",
    condition: "Used",
    price: 250,
    location: "Kumaon Hostel",
    postedBy: "Mehul P.",
    postedAgo: "1 day ago",
    description: "Good for revision plans and daily tasks. Comes with 2 markers and wall hooks.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gate-cse-book-bundle",
    title: "GATE CSE book bundle",
    collegeSlug: "iit-delhi",
    collegeName: "IIT Delhi",
    branch: "CSE",
    year: "4th Year",
    category: "Books",
    condition: "Very good",
    price: 1800,
    location: "Library Gate",
    postedBy: "Nikita R.",
    postedAgo: "2 days ago",
    description: "Made Easy notes, DBMS book, OS book, and practice workbook. Selling as one set.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80"
  }
];

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
