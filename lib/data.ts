const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80";

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
  city: string;
  location?: string | null;
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

type CollegeRow = {
  slug: string;
  name: string;
  city: string;
  description: string | null;
};

type ListingRow = {
  id: string;
  college_slug: string;
  title: string;
  branch: string | null;
  year: string | null;
  category: string;
  condition: string;
  price: number;
  location: string | null;
  posted_by: string;
  description: string;
  image: string | null;
  created_at: string;
};
export const categories = ["Competitive Exam Books", "College Accessories"];

export const competitiveExamNames = [
  "JEE",
  "NEET",
  "NDA",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "SSC",
  "Bank Exams",
  "Railway Exams",
  "Other"
];

export const collegeAccessorySubcategories = [
  "College Books",
  "Notes & Printed Material",
  "Study Tools & Stationery",
  "College Accessories",
  "Hostel & Room Essentials",
  "Electronics & Gadgets",
  "Lab & Project Items"
];
function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

function createHeaders() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
    "Content-Type": "application/json"
  };
}

async function querySupabase<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getSupabaseConfig();
  const headers = createHeaders();

  if (!config || !headers) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function formatPostedAgo(createdAt: string) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

function mapListing(row: ListingRow, collegesBySlug: Map<string, CollegeRow>): Listing {
  const college = collegesBySlug.get(row.college_slug);

  return {
    id: row.id,
    title: row.title,
    collegeSlug: row.college_slug,
    collegeName: college?.name ?? "Unknown College",
    branch: row.branch ?? undefined,
    year: row.year ?? undefined,
    category: row.category,
    condition: row.condition,
    price: Number(row.price),
    city: college?.city ?? "Unknown City",
    location: row.location,
    postedBy: row.posted_by,
    postedAgo: formatPostedAgo(row.created_at),
    description: row.description,
    image: row.image ?? DEFAULT_LISTING_IMAGE
  };
}

export async function getColleges(): Promise<College[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const [collegeRows, listingRows] = await Promise.all([
    querySupabase<CollegeRow[]>("colleges?select=slug,name,city,description&order=name.asc"),
    querySupabase<ListingRow[]>("listings?select=id,college_slug")
  ]);

  const counts = new Map<string, number>();
  for (const listing of listingRows) {
    counts.set(listing.college_slug, (counts.get(listing.college_slug) ?? 0) + 1);
  }

  return collegeRows.map((college) => ({
    slug: college.slug,
    name: college.name,
    city: college.city,
    description: college.description ?? "Local resale hub for this campus.",
    activeListings: counts.get(college.slug) ?? 0
  }));
}

export async function getCollege(slug: string): Promise<College | null> {
  const colleges = await getColleges();
  return colleges.find((college) => college.slug === slug) ?? null;
}

function slugifyCollegeName(name: string) {
  const baseSlug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseSlug || "college";
}

async function getCollegeRowByName(name: string): Promise<CollegeRow | null> {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const normalizedName = encodeURIComponent(name.trim());
  const rows = await querySupabase<CollegeRow[]>(
    `colleges?select=slug,name,city,description&name=ilike.${normalizedName}&limit=1`
  );

  return rows[0] ?? null;
}

async function generateUniqueCollegeSlug(name: string): Promise<string> {
  const baseSlug = slugifyCollegeName(name);
  const matchingRows = await querySupabase<Array<Pick<CollegeRow, "slug">>>(
    `colleges?select=slug&slug=like.${encodeURIComponent(baseSlug)}*`
  );

  const existingSlugs = new Set(matchingRows.map((row) => row.slug));
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}

export async function ensureCollegeByName(name: string, city?: string): Promise<CollegeRow> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("College name is required.");
  }

  const existingCollege = await getCollegeRowByName(trimmedName);
  if (existingCollege) {
    return existingCollege;
  }

  const slug = await generateUniqueCollegeSlug(trimmedName);
  const insertedRows = await querySupabase<CollegeRow[]>("colleges?select=slug,name,city,description", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify([
      {
        slug,
        name: trimmedName,
        city: city?.trim() || "Unknown City",
        description: `Marketplace for ${trimmedName} students.`
      }
    ])
  });

  const insertedCollege = insertedRows[0];
  if (!insertedCollege) {
    throw new Error("Supabase did not return the created college.");
  }

  return insertedCollege;
}

export async function getListingsByCollege(slug: string): Promise<Listing[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const [collegeRows, listingRows] = await Promise.all([
    querySupabase<CollegeRow[]>("colleges?select=slug,name,city,description"),
    querySupabase<ListingRow[]>(
      `listings?select=id,college_slug,title,branch,year,category,condition,price,location,posted_by,description,image,created_at&college_slug=eq.${encodeURIComponent(
        slug
      )}&order=created_at.desc`
    )
  ]);

  const collegesBySlug = new Map(collegeRows.map((college) => [college.slug, college]));
  return listingRows.map((listing) => mapListing(listing, collegesBySlug));
}

export async function getListing(id: string): Promise<Listing | null> {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const [collegeRows, listingRows] = await Promise.all([
    querySupabase<CollegeRow[]>("colleges?select=slug,name,city,description"),
    querySupabase<ListingRow[]>(
      `listings?select=id,college_slug,title,branch,year,category,condition,price,location,posted_by,description,image,created_at&id=eq.${encodeURIComponent(
        id
      )}&limit=1`
    )
  ]);

  const listing = listingRows[0];
  if (!listing) {
    return null;
  }

  const collegesBySlug = new Map(collegeRows.map((college) => [college.slug, college]));
  return mapListing(listing, collegesBySlug);
}

type CreateListingInput = {
  title: string;
  collegeSlug: string;
  category: string;
  price: number;
  branch?: string;
  year?: string;
  description: string;
  postedBy: string;
  condition?: string;
  location?: string;
  image?: string;
};

export async function createListing(input: CreateListingInput): Promise<string> {
  const rows = await querySupabase<Array<{ id: string }>>("listings?select=id", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify([
      {
        college_slug: input.collegeSlug,
        title: input.title,
        branch: input.branch || null,
        year: input.year || null,
        category: input.category,
        condition: input.condition || "Good",
        price: input.price,
        location: input.location || null,
        posted_by: input.postedBy,
        description: input.description,
        image: input.image || null
      }
    ])
  });

  const created = rows[0];
  if (!created) {
    throw new Error("Supabase did not return the created listing.");
  }

  return created.id;
}
