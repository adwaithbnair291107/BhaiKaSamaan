"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { COMPETITIVE_EXAMS_LABEL, COMPETITIVE_EXAMS_SLUG, getListing } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

function requireValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseStoredImages(value: string) {
  if (!value) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((image): image is string => typeof image === "string" && image.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

async function collectUploadedImages(formData: FormData, errorBasePath: string) {
  const imageFiles = formData.getAll("imageFiles");
  const images: string[] = [];
  let totalImageBytes = 0;

  if (imageFiles.length > 3) {
    redirect(`${errorBasePath}image-count`);
  }

  for (const imageFile of imageFiles) {
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      continue;
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      redirect(`${errorBasePath}image-size`);
    }

    totalImageBytes += imageFile.size;
    if (totalImageBytes > 6 * 1024 * 1024) {
      redirect(`${errorBasePath}image-total-size`);
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(imageFile.type)) {
      redirect(`${errorBasePath}image-type`);
    }

    const bytes = await imageFile.arrayBuffer();
    images.push(`data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`);
  }

  return images;
}

function slugifyCollegeName(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "college"
  );
}

async function resolveCollegeSlug(
  supabase: ReturnType<typeof createClient>,
  options: {
    collegeSlug: string;
    collegeName: string;
    collegeCity: string;
    isCompetitiveCategory: boolean;
    state: string;
    district: string;
  }
) {
  if (options.collegeSlug) {
    return options.collegeSlug;
  }

  if (options.isCompetitiveCategory) {
    const { error } = await supabase.from("colleges").upsert(
      {
        slug: COMPETITIVE_EXAMS_SLUG,
        name: COMPETITIVE_EXAMS_LABEL,
        city: options.district || options.state || "Unknown City",
        description: "Marketplace for competitive exam students."
      },
      { onConflict: "slug" }
    );

    if (error) {
      throw error;
    }

    return COMPETITIVE_EXAMS_SLUG;
  }

  const normalizedName = options.collegeName.trim();
  const { data: existingCollege, error: existingCollegeError } = await supabase
    .from("colleges")
    .select("slug")
    .ilike("name", normalizedName)
    .limit(1)
    .maybeSingle();

  if (existingCollegeError) {
    throw existingCollegeError;
  }

  if (existingCollege?.slug) {
    return existingCollege.slug;
  }

  const baseSlug = slugifyCollegeName(normalizedName);
  const { data: matchingSlugs, error: slugLookupError } = await supabase
    .from("colleges")
    .select("slug")
    .like("slug", `${baseSlug}%`);

  if (slugLookupError) {
    throw slugLookupError;
  }

  const existingSlugs = new Set((matchingSlugs ?? []).map((college) => college.slug));
  let nextSlug = baseSlug;
  let counter = 2;

  while (existingSlugs.has(nextSlug)) {
    nextSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const { error: insertCollegeError } = await supabase.from("colleges").insert({
    slug: nextSlug,
    name: normalizedName,
    city: options.collegeCity || "Unknown City",
    description: `Marketplace for ${normalizedName} students.`
  });

  if (insertCollegeError) {
    throw insertCollegeError;
  }

  return nextSlug;
}

export async function submitListing(formData: FormData) {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/sell?status=auth");
    }

    const title = requireValue(formData, "title");
    const collegeSlug = requireValue(formData, "collegeSlug");
    const collegeName = requireValue(formData, "collegeName");
    const collegeCity = requireValue(formData, "collegeCity");
    const category = requireValue(formData, "category");
    const examName = requireValue(formData, "examName");
    const subcategory = requireValue(formData, "subcategory");
    const location = requireValue(formData, "location");
    const state = requireValue(formData, "state");
    const district = requireValue(formData, "district");
    const address = requireValue(formData, "address");
    const postedBy = requireValue(formData, "postedBy");
    const description = requireValue(formData, "description");
    const expectedPriceValue = requireValue(formData, "expectedPrice");
    const minPriceValue = requireValue(formData, "minPrice");
    const isCompetitiveCategory = category === "Competitive Exam Books";
    const isCollegeAccessoriesCategory = category === "College Accessories";
    const competitiveLocation = [address, district, state].filter(Boolean).join(", ");

    if (!title || !category || !postedBy || !description || !expectedPriceValue || !minPriceValue) {
      redirect("/sell?status=missing");
    }

    if (isCollegeAccessoriesCategory && !subcategory) {
      redirect("/sell?status=missing");
    }

    if (!isCompetitiveCategory && (!collegeName || !collegeCity)) {
      redirect("/sell?status=missing");
    }

    if (isCompetitiveCategory && !examName) {
      redirect("/sell?status=missing");
    }

    if (isCompetitiveCategory && (!state || !district || !address)) {
      redirect("/sell?status=location");
    }

    const expectedPrice = Number(expectedPriceValue);
    const minPrice = Number(minPriceValue);
    if (Number.isNaN(expectedPrice) || Number.isNaN(minPrice) || expectedPrice <= 0 || minPrice <= 0) {
      redirect("/sell?status=price");
    }

    if (expectedPrice < minPrice) {
      redirect("/sell?status=price-range");
    }

    const images = await collectUploadedImages(formData, "/sell?status=");

    const resolvedCollegeSlug = await resolveCollegeSlug(supabase, {
      collegeSlug,
      collegeName,
      collegeCity,
      isCompetitiveCategory,
      state,
      district
    });

    const storedCategory = isCompetitiveCategory ? examName : isCollegeAccessoriesCategory ? subcategory : category;

    const { data: createdListing, error: createListingError } = await supabase
      .from("listings")
      .insert({
        title,
        user_id: user.id,
        college_slug: resolvedCollegeSlug,
        category: storedCategory,
        price: expectedPrice,
        min_price: minPrice,
        expected_price: expectedPrice,
        posted_by: postedBy,
        description,
        branch: requireValue(formData, "branch") || null,
        year: requireValue(formData, "year") || null,
        condition: requireValue(formData, "condition") || "Good",
        location: isCompetitiveCategory ? competitiveLocation : location || null,
        image: images.length ? JSON.stringify(images) : null
      })
      .select("id")
      .single();

    if (createListingError || !createdListing) {
      throw createListingError ?? new Error("Supabase did not return the created listing.");
    }

    revalidatePath("/");
    revalidatePath(`/college/${resolvedCollegeSlug}`);
    redirect(`/listings/${createdListing.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Failed to submit listing", error);
    redirect("/sell?status=error");
  }
}

export async function submitOffer(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const listingId = requireValue(formData, "listingId");
  const buyerName = requireValue(formData, "buyerName");
  const buyerContact = requireValue(formData, "buyerContact");
  const message = requireValue(formData, "message");
  const amountValue = requireValue(formData, "amount");

  if (!user) {
    redirect(`/listings/${listingId}?offer=auth`);
  }

  if (!listingId || !buyerName || !amountValue) {
    redirect(`/listings/${listingId}?offer=missing`);
  }

  const listing = await getListing(listingId);
  if (!listing) {
    redirect("/");
  }

  const amount = Number(amountValue);
  if (Number.isNaN(amount) || amount <= 0) {
    redirect(`/listings/${listingId}?offer=invalid`);
  }

  if (amount < listing.minPrice) {
    redirect(`/listings/${listingId}?offer=low`);
  }

  const { data: createdOffer, error } = await supabase
    .from("offers")
    .insert({
      listing_id: listingId,
      buyer_user_id: user.id,
      buyer_name: buyerName,
      buyer_contact: buyerContact || null,
      amount,
      message: message || null,
      status: "open"
    })
    .select("id")
    .single();

  if (error || !createdOffer) {
    throw error;
  }

  if (message) {
    const { error: messageError } = await supabase.from("offer_messages").insert({
      offer_id: createdOffer.id,
      sender_user_id: user.id,
      sender_role: "buyer",
      sender_name: buyerName,
      body: message
    });

    if (messageError) {
      throw messageError;
    }
  }

  revalidatePath(`/listings/${listingId}`);
  redirect(`/listings/${listingId}?offer=sent`);
}

export async function sendOfferMessage(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const listingId = requireValue(formData, "listingId");
  const offerId = requireValue(formData, "offerId");
  const body = requireValue(formData, "body");
  const senderRole = requireValue(formData, "senderRole");
  const senderName = requireValue(formData, "senderName");

  if (!listingId) {
    redirect("/");
  }

  if (!user) {
    redirect(`/listings/${listingId}?offer=auth`);
  }

  if (!offerId || !body || !senderName || (senderRole !== "buyer" && senderRole !== "seller")) {
    redirect(`/listings/${listingId}?offer=invalid`);
  }

  const listing = await getListing(listingId);
  if (!listing) {
    redirect("/");
  }

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id,buyer_user_id,status")
    .eq("id", offerId)
    .eq("listing_id", listingId)
    .single();

  if (offerError || !offer) {
    redirect(`/listings/${listingId}?offer=invalid`);
  }

  const isSeller = listing.userId === user.id;
  const isBuyer = offer.buyer_user_id === user.id;
  if ((senderRole === "seller" && !isSeller) || (senderRole === "buyer" && !isBuyer)) {
    redirect(`/listings/${listingId}?offer=invalid`);
  }

  if (offer.status === "closed") {
    redirect(`/listings/${listingId}?offer=closed`);
  }

  const { error: messageError } = await supabase.from("offer_messages").insert({
    offer_id: offerId,
    sender_user_id: user.id,
    sender_role: senderRole,
    sender_name: senderName,
    body
  });

  if (messageError) {
    throw messageError;
  }

  revalidatePath(`/listings/${listingId}`);
  redirect(`/listings/${listingId}?offer=sent`);
}

export async function closeOfferConversation(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const listingId = requireValue(formData, "listingId");
  const offerId = requireValue(formData, "offerId");

  if (!listingId) {
    redirect("/");
  }

  if (!user) {
    redirect(`/listings/${listingId}?offer=auth`);
  }

  const listing = await getListing(listingId);
  if (!listing || listing.userId !== user.id) {
    redirect(`/listings/${listingId}?offer=invalid`);
  }

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id,status")
    .eq("id", offerId)
    .eq("listing_id", listingId)
    .single();

  if (offerError || !offer) {
    redirect(`/listings/${listingId}?offer=invalid`);
  }

  if (offer.status !== "closed") {
    const { error: closeError } = await supabase
      .from("offers")
      .update({ status: "closed" })
      .eq("id", offerId)
      .eq("listing_id", listingId);

    if (closeError) {
      throw closeError;
    }

    const { error: systemMessageError } = await supabase.from("offer_messages").insert({
      offer_id: offerId,
      sender_user_id: user.id,
      sender_role: "system",
      sender_name: listing.postedBy,
      body: "This conversation was closed by the seller."
    });

    if (systemMessageError) {
      throw systemMessageError;
    }
  }

  revalidatePath(`/listings/${listingId}`);
  redirect(`/listings/${listingId}?offer=closed`);
}

export async function saveListingChanges(formData: FormData) {
  const listingId = requireValue(formData, "listingId");

  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const title = requireValue(formData, "title");
    const postedBy = requireValue(formData, "postedBy");
    const description = requireValue(formData, "description");
    const expectedPriceValue = requireValue(formData, "expectedPrice");
    const minPriceValue = requireValue(formData, "minPrice");
    const condition = requireValue(formData, "condition");
    const location = requireValue(formData, "location");
    const replaceImages = requireValue(formData, "replaceImages") === "yes";
    const existingImages = parseStoredImages(requireValue(formData, "existingImages"));

    if (!listingId) {
      redirect("/");
    }

    if (!user) {
      redirect(`/listings/${listingId}?manage=auth`);
    }

    const listing = await getListing(listingId);
    if (!listing || listing.userId !== user.id) {
      redirect(`/listings/${listingId}?manage=denied`);
    }

    if (!title || !postedBy || !description || !expectedPriceValue || !minPriceValue || !condition) {
      redirect(`/listings/${listingId}?manage=missing`);
    }

    const expectedPrice = Number(expectedPriceValue);
    const minPrice = Number(minPriceValue);
    if (Number.isNaN(expectedPrice) || Number.isNaN(minPrice) || expectedPrice <= 0 || minPrice <= 0) {
      redirect(`/listings/${listingId}?manage=price`);
    }

    if (expectedPrice < minPrice) {
      redirect(`/listings/${listingId}?manage=range`);
    }

    const uploadedImages = await collectUploadedImages(formData, `/listings/${listingId}?manage=`);
    const mergedImages = replaceImages ? uploadedImages : [...existingImages, ...uploadedImages];
    const nextImages = mergedImages.length > 3 ? mergedImages.slice(-3) : mergedImages;

    const { error: updateError } = await supabase
      .from("listings")
      .update({
        title,
        posted_by: postedBy,
        description,
        price: expectedPrice,
        min_price: minPrice,
        expected_price: expectedPrice,
        condition,
        location: location || null,
        image: nextImages.length ? JSON.stringify(nextImages) : null
      })
      .eq("id", listingId)
      .eq("user_id", user.id);

    if (updateError) {
      throw updateError;
    }

    revalidatePath("/");
    revalidatePath(`/listings/${listingId}`);
    redirect(`/listings/${listingId}?manage=saved`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Failed to save listing changes", error);
    redirect(`/listings/${listingId}?manage=error`);
  }
}

export async function deleteListing(formData: FormData) {
  const listingId = requireValue(formData, "listingId");

  if (!listingId) {
    redirect("/sell");
  }

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sell?status=auth");
  }

  const listing = await getListing(listingId);
  if (!listing || listing.userId !== user.id) {
    redirect(`/listings/${listingId}?manage=denied`);
  }

  const { error } = await supabase.from("listings").delete().eq("id", listingId).eq("user_id", user.id);
  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/sell");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath(`/college/${listing.collegeSlug}`);
  redirect("/sell?status=deleted");
}
