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
  buyerUserId?: string | null;
  buyerName: string;
  buyerContact?: string | null;
  amount: number;
  message?: string | null;
  status: string;
  createdAt: string;
};

export type OfferMessage = {
  id: string;
  offerId: string;
  senderUserId?: string | null;
  senderRole: "buyer" | "seller" | "system";
  senderName: string;
  body: string;
  createdAt: string;
};

export type OfferThread = Offer & {
  messages: OfferMessage[];
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

type ListingCollegeRelation = {
  name: string;
  city: string;
  description?: string | null;
} | null;

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
  colleges?: ListingCollegeRelation | ListingCollegeRelation[];
};

type OfferRow = {
  id: string;
  listing_id: string;
  buyer_user_id: string | null;
  buyer_name: string;
  buyer_contact: string | null;
  amount: number;
  message: string | null;
  status: string;
  created_at: string;
};

type OfferMessageRow = {
  id: string;
  offer_id: string;
  sender_user_id: string | null;
  sender_role: "buyer" | "seller" | "system";
  sender_name: string;
  body: string;
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

export const categoryBrowseConfig = {
  "competitive-exam-books": {
    label: "Competitive Exam Books",
    description: "Browse by exam first, then open the exact books and bundles you want.",
    subdivisions: competitiveExamNames
  },
  "college-accessories": {
    label: "College Accessories",
    description: "Open the exact campus subdivision first, then browse the relevant products inside it.",
    subdivisions: collegeAccessorySubcategories
  }
} as const;

export type CategoryBrowseSlug = keyof typeof categoryBrowseConfig;
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

type SupabaseRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function querySupabase<T>(path: string, init?: SupabaseRequestInit): Promise<T> {
  const config = getSupabaseConfig();
  const headers = createHeaders();

  if (!config || !headers) {
    throw new Error("Supabase environment variables are missing.");
  }

  const resolvedCache = init?.cache ?? (init?.next?.revalidate ? undefined : "no-store");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {})
    },
    cache: resolvedCache,
    next: init?.next
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

function getListingCollege(row: ListingRow, collegesBySlug?: Map<string, CollegeRow>) {
  const relationCollege = Array.isArray(row.colleges) ? row.colleges[0] ?? null : row.colleges ?? null;
  return relationCollege ?? collegesBySlug?.get(row.college_slug) ?? null;
}

function isCompetitiveListingCategory(category: string) {
  return competitiveExamNames.includes(category);
}

function isCollegeListingVisibleForCollegeFeed(row: ListingRow) {
  return !isCompetitiveListingCategory(row.category);
}

function mapListing(row: ListingRow, collegesBySlug?: Map<string, CollegeRow>): Listing {
  const college = getListingCollege(row, collegesBySlug);
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
    querySupabase<CollegeRow[]>("colleges?select=slug,name,city,description&order=name.asc", {
      next: { revalidate: 60 }
    }),
    querySupabase<ListingRow[]>("listings?select=id,college_slug", {
      next: { revalidate: 60 }
    })
  ]);

  const counts = new Map<string, number>();
  for (const listing of listingRows) {
    if (!isCollegeListingVisibleForCollegeFeed(listing)) {
      continue;
    }

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
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const [collegeRows, listingRows] = await Promise.all([
    querySupabase<CollegeRow[]>(
      `colleges?select=slug,name,city,description&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      {
        next: { revalidate: 60 }
      }
    ),
    querySupabase<ListingRow[]>(
      `listings?select=id&college_slug=eq.${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 }
      }
    )
  ]);

  const college = collegeRows[0];
  if (!college) {
    return null;
  }

  return {
    slug: college.slug,
    name: college.name,
    city: college.city,
    description: college.description ?? "Local resale hub for this campus.",
    activeListings: listingRows.filter(isCollegeListingVisibleForCollegeFeed).length
  };
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

  const listingRows = await querySupabase<ListingRow[]>(
    `listings?select=id,user_id,college_slug,title,branch,year,category,condition,price,min_price,expected_price,location,posted_by,description,image,created_at,colleges(name,city)&college_slug=eq.${encodeURIComponent(
      slug
    )}&order=created_at.desc`,
    {
      next: { revalidate: 60 }
    }
  );

  return listingRows.filter(isCollegeListingVisibleForCollegeFeed).map((listing) => mapListing(listing));
}

export async function getListingsByCategoryBrowse(
  slug: CategoryBrowseSlug,
  subdivision?: string
): Promise<Listing[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const categoryConfig = categoryBrowseConfig[slug];
  const allowedSubdivisions = subdivision
    ? categoryConfig.subdivisions.filter((item) => item === subdivision)
    : categoryConfig.subdivisions;

  if (allowedSubdivisions.length === 0) {
    return [];
  }

  const serializedCategories = allowedSubdivisions
    .map((item) => `"${item.replace(/"/g, '\\"')}"`)
    .join(",");

  const listingRows = await querySupabase<ListingRow[]>(
    `listings?select=id,user_id,college_slug,title,branch,year,category,condition,price,min_price,expected_price,location,posted_by,description,image,created_at,colleges(name,city)&category=in.(${serializedCategories})&order=created_at.desc`,
    {
      next: { revalidate: 60 }
    }
  );

  return listingRows.map((listing) => mapListing(listing));
}

export async function getListingsByUser(userId: string): Promise<Listing[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const listingRows = await querySupabase<ListingRow[]>(
    `listings?select=id,user_id,college_slug,title,branch,year,category,condition,price,min_price,expected_price,location,posted_by,description,image,created_at,colleges(name,city)&user_id=eq.${encodeURIComponent(
      userId
    )}&order=created_at.desc`
  );

  return listingRows.map((listing) => mapListing(listing));
}

export async function getRecentListings(limit = 6): Promise<Listing[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const listingRows = await querySupabase<ListingRow[]>(
    `listings?select=id,user_id,college_slug,title,branch,year,category,condition,price,min_price,expected_price,location,posted_by,description,image,created_at,colleges(name,city)&order=created_at.desc&limit=${limit}`,
    {
      next: { revalidate: 60 }
    }
  );

  return listingRows.map((listing) => mapListing(listing));
}

export async function getListing(id: string): Promise<Listing | null> {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const listingRows = await querySupabase<ListingRow[]>(
    `listings?select=id,user_id,college_slug,title,branch,year,category,condition,price,min_price,expected_price,location,posted_by,description,image,created_at,colleges(name,city)&id=eq.${encodeURIComponent(
      id
    )}&limit=1`
  );

  const listing = listingRows[0];
  if (!listing) {
    return null;
  }

  return mapListing(listing);
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
    buyerUserId: row.buyer_user_id,
    buyerName: row.buyer_name,
    buyerContact: row.buyer_contact,
    amount: Number(row.amount),
    message: row.message,
    status: row.status,
    createdAt: row.created_at
  };
}

function mapOfferMessage(row: OfferMessageRow): OfferMessage {
  return {
    id: row.id,
    offerId: row.offer_id,
    senderUserId: row.sender_user_id,
    senderRole: row.sender_role,
    senderName: row.sender_name,
    body: row.body,
    createdAt: row.created_at
  };
}

async function getOfferMessagesByOfferIds(offerIds: string[]): Promise<Map<string, OfferMessage[]>> {
  if (offerIds.length === 0) {
    return new Map();
  }

  const serializedIds = offerIds.map((offerId) => `"${offerId}"`).join(",");
  const rows = await querySupabase<OfferMessageRow[]>(
    `offer_messages?select=id,offer_id,sender_user_id,sender_role,sender_name,body,created_at&offer_id=in.(${serializedIds})&order=created_at.asc`
  );

  const messagesByOfferId = new Map<string, OfferMessage[]>();
  for (const row of rows) {
    const message = mapOfferMessage(row);
    const thread = messagesByOfferId.get(message.offerId) ?? [];
    thread.push(message);
    messagesByOfferId.set(message.offerId, thread);
  }

  return messagesByOfferId;
}

function mergeOfferMessages(offers: Offer[], messagesByOfferId: Map<string, OfferMessage[]>): OfferThread[] {
  return offers.map((offer) => ({
    ...offer,
    messages: messagesByOfferId.get(offer.id) ?? []
  }));
}

export async function getOffersByListing(listingId: string): Promise<Offer[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const offerRows = await querySupabase<OfferRow[]>(
    `offers?select=id,listing_id,buyer_user_id,buyer_name,buyer_contact,amount,message,status,created_at&listing_id=eq.${encodeURIComponent(
      listingId
    )}&order=created_at.desc`
  );

  return offerRows.map(mapOffer);
}

export async function getOfferThreadsByListing(listingId: string): Promise<OfferThread[]> {
  const offers = await getOffersByListing(listingId);
  const messagesByOfferId = await getOfferMessagesByOfferIds(offers.map((offer) => offer.id));
  return mergeOfferMessages(offers, messagesByOfferId);
}

export async function getOfferThreadsForBuyer(listingId: string, buyerUserId: string): Promise<OfferThread[]> {
  const config = getSupabaseConfig();
  if (!config) {
    return [];
  }

  const offerRows = await querySupabase<OfferRow[]>(
    `offers?select=id,listing_id,buyer_user_id,buyer_name,buyer_contact,amount,message,status,created_at&listing_id=eq.${encodeURIComponent(
      listingId
    )}&buyer_user_id=eq.${encodeURIComponent(buyerUserId)}&order=created_at.desc`
  );

  const offers = offerRows.map(mapOffer);
  const messagesByOfferId = await getOfferMessagesByOfferIds(offers.map((offer) => offer.id));
  return mergeOfferMessages(offers, messagesByOfferId);
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
