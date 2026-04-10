const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80";
export { indiaStatesWithDistricts } from "@/lib/india-states-districts";

export type Listing = {
  id: string;
  title: string;
  collegeSlug: string;
  collegeName: string;
  userId?: string | null;
  branch?: string | null;
  year?: string | null;
  category: string;
  condition: string;
  expectedPrice: number;
  minPrice: number;
  city: string;
  location?: string | null;
  postedBy: string;
  postedAgo: string;
  description: string;
  image: string;
  images: string[];
};

export type Offer = {
  id: string;
  listingId: string;
  buyerName: string;
  buyerContact?: string | null;
  amount: number;
  message?: string | null;
  status: string;
  createdAt: string;
};

export type College = {
  slug: string;
  name: string;
  city: string;
  activeListings: number;
  description: string;
};

export const COMPETITIVE_EXAMS_SLUG = "competitive-exams";
export const COMPETITIVE_EXAMS_LABEL = "Competitive Exams";

type CollegeRow = {
  slug: string;
  name: string;
  city: string;
  description: string | null;
};

type ListingRow = {
  id: string;
  user_id?: string | null;
  college_slug: string;
  title: string;
  branch: string | null;
  year: string | null;
  category: string;
  condition: string;
  price?: number | null;
  min_price?: number | null;
  expected_price?: number | null;
  location: string | null;
  posted_by: string;
  description: string;
  image: string | null;
  created_at: string;
};

type OfferRow = {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_contact: string | null;
  amount: number;
  message: string | null;
  status: string;
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

function parseListingImages(image: string | null) {
  if (!image) {
    return [DEFAULT_LISTING_IMAGE];
  }

  try {
    const parsed = JSON.parse(image);
    if (Array.isArray(parsed)) {
      const cleanedImages = parsed.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
      if (cleanedImages.length > 0) {
        return cleanedImages;
      }
    }
  } catch {
    // Older listings store a single image string. Keep supporting that format.
  }

  return [image];
}

function mapListing(row: ListingRow, collegesBySlug: Map<string, CollegeRow>): Listing {
  const college = collegesBySlug.get(row.college_slug);
  const images = parseListingImages(row.image);

  return {
    id: row.id,
    title: row.title,
    collegeSlug: row.college_slug,
    collegeName: college?.name ?? "Unknown College",
    userId: row.user_id ?? null,
    branch: row.branch ?? undefined,
    year: row.year ?? undefined,
    category: row.category,
    condition: row.condition,
    minPrice: Number(row.min_price ?? row.price ?? 0),
    expectedPrice: Number(row.expected_price ?? row.price ?? 0),
    city: college?.city ?? "Unknown City",
    location: row.location,
    postedBy: row.posted_by,
    postedAgo: formatPostedAgo(row.created_at),
    description: row.description,
    image: images[0] ?? DEFAULT_LISTING_IMAGE,
    images
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
  })).filter((college) => college.slug !== COMPETITIVE_EXAMS_SLUG);
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
      `listings?select=*&college_slug=eq.${encodeURIComponent(
        slug
      )}&order=created_at.desc`
    )
  ]);

  const collegesBySlug = new Map(collegeRows.map((college) => [college.slug, college]));
  return listingRows.map((listing) => mapListing(listing, collegesBySlug));
}

export async function getListingsByUser(userId: string): Promise<Listing[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const [collegeRows, listingRows] = await Promise.all([
    querySupabase<CollegeRow[]>("colleges?select=slug,name,city,description"),
    querySupabase<ListingRow[]>(
      `listings?select=*&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`
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
      `listings?select=*&id=eq.${encodeURIComponent(
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
  userId: string;
  minPrice: number;
  expectedPrice: number;
  branch?: string;
  year?: string;
  description: string;
  postedBy: string;
  condition?: string;
  location?: string;
  images?: string[];
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
        user_id: input.userId,
        title: input.title,
        branch: input.branch || null,
        year: input.year || null,
        category: input.category,
        condition: input.condition || "Good",
        min_price: input.minPrice,
        expected_price: input.expectedPrice,
        location: input.location || null,
        posted_by: input.postedBy,
        description: input.description,
        image: input.images?.length ? JSON.stringify(input.images) : null
      }
    ])
  });

  const created = rows[0];
  if (!created) {
    throw new Error("Supabase did not return the created listing.");
  }

  return created.id;
}

function mapOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerName: row.buyer_name,
    buyerContact: row.buyer_contact,
    amount: Number(row.amount),
    message: row.message,
    status: row.status,
    createdAt: row.created_at
  };
}

export async function getOffersByListing(listingId: string): Promise<Offer[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const offerRows = await querySupabase<OfferRow[]>(
    `offers?select=id,listing_id,buyer_name,buyer_contact,amount,message,status,created_at&listing_id=eq.${encodeURIComponent(
      listingId
    )}&order=created_at.desc`
  );

  return offerRows.map(mapOffer);
}

type CreateOfferInput = {
  listingId: string;
  buyerName: string;
  buyerContact?: string;
  amount: number;
  message?: string;
};

export async function createOffer(input: CreateOfferInput): Promise<string> {
  const rows = await querySupabase<Array<{ id: string }>>("offers?select=id", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify([
      {
        listing_id: input.listingId,
        buyer_name: input.buyerName,
        buyer_contact: input.buyerContact || null,
        amount: input.amount,
        message: input.message || null,
        status: "pending"
      }
    ])
  });

  const created = rows[0];
  if (!created) {
    throw new Error("Supabase did not return the created offer.");
  }

  return created.id;
}

type UpdateListingInput = {
  id: string;
  userId: string;
  title: string;
  minPrice: number;
  expectedPrice: number;
  description: string;
  postedBy: string;
  condition: string;
  location?: string;
};

export async function updateListing(input: UpdateListingInput): Promise<void> {
  await querySupabase(
    `listings?id=eq.${encodeURIComponent(input.id)}&user_id=eq.${encodeURIComponent(input.userId)}`,
    {
    method: "PATCH",
    headers: {
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      title: input.title,
      min_price: input.minPrice,
      expected_price: input.expectedPrice,
      description: input.description,
      posted_by: input.postedBy,
      condition: input.condition,
      location: input.location || null
    })
    }
  );
}
