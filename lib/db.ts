import { unstable_noStore as noStore } from "next/cache";
import { College, Listing } from "@/lib/data";
import { getSupabaseClient } from "@/lib/supabase";

type CollegeRow = {
  slug: string;
  name: string;
  city: string;
  description: string | null;
};

type ListingRow = {
  id: string;
  title: string;
  college_slug: string;
  branch: string | null;
  year: string | null;
  category: string;
  condition: string;
  price: number;
  location: string;
  posted_by: string;
  description: string;
  image_url: string | null;
  created_at: string;
  colleges: {
    name: string;
  } | null;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80";

function formatPostedAgo(createdAt: string) {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffHours = Math.max(1, Math.floor((now - created) / (1000 * 60 * 60)));

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function mapListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    collegeSlug: row.college_slug,
    collegeName: row.colleges?.name ?? "Unknown College",
    branch: row.branch,
    year: row.year,
    category: row.category,
    condition: row.condition,
    price: row.price,
    location: row.location,
    postedBy: row.posted_by,
    postedAgo: formatPostedAgo(row.created_at),
    description: row.description,
    image: row.image_url || fallbackImage
  };
}

export async function getColleges(): Promise<College[]> {
  noStore();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data: colleges, error } = await supabase
    .from("colleges")
    .select("slug, name, city, description")
    .order("name", { ascending: true });

  if (error || !colleges) {
    return [];
  }

  const { data: counts } = await supabase
    .from("listings")
    .select("college_slug")
    .eq("is_sold", false);

  const listingCounts = new Map<string, number>();
  counts?.forEach((row: { college_slug: string }) => {
    listingCounts.set(row.college_slug, (listingCounts.get(row.college_slug) ?? 0) + 1);
  });

  return (colleges as CollegeRow[]).map((college) => ({
    slug: college.slug,
    name: college.name,
    city: college.city,
    description: college.description ?? "Student marketplace for campus-specific resale.",
    activeListings: listingCounts.get(college.slug) ?? 0
  }));
}

export async function getCollegeBySlug(slug: string): Promise<College | null> {
  const colleges = await getColleges();
  return colleges.find((college) => college.slug === slug) ?? null;
}

export async function getListingsByCollege(slug: string): Promise<Listing[]> {
  noStore();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, title, college_slug, branch, year, category, condition, price, location, posted_by, description, image_url, created_at, colleges(name)"
    )
    .eq("college_slug", slug)
    .eq("is_sold", false)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as ListingRow[]).map(mapListing);
}

export async function getLatestListings(limit = 3): Promise<Listing[]> {
  noStore();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, title, college_slug, branch, year, category, condition, price, location, posted_by, description, image_url, created_at, colleges(name)"
    )
    .eq("is_sold", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as ListingRow[]).map(mapListing);
}

export async function getListingById(id: string): Promise<Listing | null> {
  noStore();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, title, college_slug, branch, year, category, condition, price, location, posted_by, description, image_url, created_at, colleges(name)"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapListing(data as ListingRow);
}
