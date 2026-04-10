"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createListing, ensureCollegeByName } from "@/lib/data";

function requireValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitListing(formData: FormData) {
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
  const priceValue = requireValue(formData, "price");
  const isCompetitiveCategory = category === "Competitive Exam Books";
  const isCollegeAccessoriesCategory = category === "College Accessories";
  const competitiveLocation = [address, district, state].filter(Boolean).join(", ");

  if (!title || !category || !postedBy || !description || !priceValue) {
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

  const price = Number(priceValue);
  if (Number.isNaN(price) || price <= 0) {
    redirect("/sell?status=price");
  }

  const imageFile = formData.get("imageFile");
  let image: string | undefined;

  if (imageFile instanceof File && imageFile.size > 0) {
    if (imageFile.size > 2 * 1024 * 1024) {
      redirect("/sell?status=image-size");
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(imageFile.type)) {
      redirect("/sell?status=image-type");
    }

    const bytes = await imageFile.arrayBuffer();
    image = `data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`;
  }

  const resolvedCollege = collegeSlug
    ? { slug: collegeSlug }
    : await ensureCollegeByName(
        isCompetitiveCategory ? "Competitive Exams" : collegeName,
        isCompetitiveCategory ? district || state : collegeCity
      );

  const storedCategory = isCompetitiveCategory ? examName : isCollegeAccessoriesCategory ? subcategory : category;

  const listingId = await createListing({
    title,
    collegeSlug: resolvedCollege.slug,
    category: storedCategory,
    price,
    postedBy,
    description,
    branch: requireValue(formData, "branch") || undefined,
    year: requireValue(formData, "year") || undefined,
    condition: requireValue(formData, "condition") || undefined,
    location: isCompetitiveCategory ? competitiveLocation : location || undefined,
    image
  });

  revalidatePath("/");
  revalidatePath(`/college/${resolvedCollege.slug}`);
  redirect(`/listings/${listingId}`);
}
