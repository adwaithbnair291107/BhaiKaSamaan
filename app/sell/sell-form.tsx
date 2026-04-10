"use client";

import { useDeferredValue, useEffect, useId, useState } from "react";
import {
  collegeAccessorySubcategories,
  competitiveExamNames,
  indiaStatesWithDistricts,
  type College
} from "@/lib/data";

type SellFormProps = {
  colleges: College[];
  categories: string[];
  action: (formData: FormData) => void;
};

export function SellForm({ colleges, categories, action }: SellFormProps) {
  const datalistId = useId();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [collegeQuery, setCollegeQuery] = useState("");
  const [collegeCity, setCollegeCity] = useState("");
  const deferredCollegeQuery = useDeferredValue(collegeQuery);
  const [selectedCollegeSlug, setSelectedCollegeSlug] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState("No file selected");
  const [isCollegeMenuOpen, setIsCollegeMenuOpen] = useState(false);

  const fieldClassName =
    "w-full rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10";
  const helperClassName = "text-xs leading-5 text-ink/55";
  const isCompetitiveCategory = selectedCategory === "Competitive Exam Books";
  const isCollegeAccessoriesCategory = selectedCategory === "College Accessories";
  const availableDistricts = selectedState ? indiaStatesWithDistricts[selectedState] ?? [] : [];

  const normalizedQuery = deferredCollegeQuery.trim().toLowerCase();
  const matchingColleges = normalizedQuery
    ? colleges.filter((college) => {
        const haystack = `${college.name} ${college.city}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : colleges.slice(0, 8);

  useEffect(() => {
    if (!collegeQuery.trim()) {
      setSelectedCollegeSlug("");
      return;
    }

    const exactMatch = colleges.find(
      (college) =>
        college.name.toLowerCase() === collegeQuery.trim().toLowerCase() ||
        `${college.name} (${college.city})`.toLowerCase() === collegeQuery.trim().toLowerCase()
    );

    setSelectedCollegeSlug(exactMatch?.slug ?? "");
  }, [collegeQuery, colleges]);

  function handleCollegeChange(value: string) {
    setCollegeQuery(value);
    setIsCollegeMenuOpen(true);

    const matchingCollege = colleges.find(
      (college) => value === college.name || value === `${college.name} (${college.city})`
    );

    if (matchingCollege) {
      setSelectedCollegeSlug(matchingCollege.slug);
    }
  }

  function selectCollege(name: string, slug: string) {
    const matchedCollege = colleges.find((college) => college.slug === slug);
    setCollegeQuery(name);
    setCollegeCity(matchedCollege?.city ?? "");
    setSelectedCollegeSlug(slug);
    setIsCollegeMenuOpen(false);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 3);
    setSelectedFileName(
      files.length > 0 ? `${files.length} image${files.length === 1 ? "" : "s"} selected` : "No file selected"
    );

    setPreviewUrls((currentPreviews) => {
      currentPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      return files.map((file) => URL.createObjectURL(file));
    });
  }

  useEffect(() => {
    return () => {
      previewUrls.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previewUrls]);

  return (
    <form action={action} className="mt-8 grid gap-6">
      <input type="hidden" name="collegeSlug" value={selectedCollegeSlug} />

      <section className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_18px_50px_rgba(26,35,32,0.06)]">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.24em] text-moss">Listing Type</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">Start with the category</h3>
        </div>

        <div className="grid gap-3">
          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">Category</span>
            <select
              name="category"
              required
              className={fieldClassName}
              defaultValue=""
              onChange={(event) => {
                setSelectedCategory(event.target.value);
                setSelectedExamName("");
                setSelectedSubcategory("");
                setSelectedState("");
                setSelectedDistrict("");
              }}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <p className={helperClassName}>
            {isCompetitiveCategory
              ? "Competitive exam posts like JEE do not need a college. Add the location where buyers can find it."
              : isCollegeAccessoriesCategory
                ? "Choose the college first, then select the exact subdivision inside college accessories."
                : "For campus-specific items, choose the college this post belongs to."}
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_18px_50px_rgba(26,35,32,0.06)]">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.24em] text-moss">
            {isCompetitiveCategory ? "Location Match" : "Campus Match"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            {isCompetitiveCategory ? "Tell us where this is available" : "Tell us where this belongs"}
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {isCompetitiveCategory ? (
            <>
              <label className="grid gap-3 text-sm font-medium text-ink">
                <span className="text-[0.95rem] font-semibold">State</span>
                <select
                  name="state"
                  required
                  className={fieldClassName}
                  value={selectedState}
                  onChange={(event) => {
                    setSelectedState(event.target.value);
                    setSelectedDistrict("");
                  }}
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  {Object.keys(indiaStatesWithDistricts).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-3 text-sm font-medium text-ink">
                <span className="text-[0.95rem] font-semibold">District</span>
                <select
                  name="district"
                  required
                  className={fieldClassName}
                  value={selectedDistrict}
                  onChange={(event) => setSelectedDistrict(event.target.value)}
                  disabled={!selectedState}
                >
                  <option value="" disabled>
                    {selectedState ? "Select a district" : "Select state first"}
                  </option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-3 text-sm font-medium text-ink md:col-span-2">
                <span className="text-[0.95rem] font-semibold">Address</span>
                <input
                  name="address"
                  required
                  className={fieldClassName}
                  placeholder="Coaching area, hostel, street, landmark"
                />
              </label>
            </>
          ) : (
            <>
          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">College</span>
            <div className="relative">
              <input
                name="collegeName"
                required={!isCompetitiveCategory}
                list={datalistId}
                value={collegeQuery}
                onFocus={() => setIsCollegeMenuOpen(true)}
                onBlur={() => setTimeout(() => setIsCollegeMenuOpen(false), 120)}
                onChange={(event) => handleCollegeChange(event.target.value)}
                className={fieldClassName}
                placeholder="Start typing your college name"
                autoComplete="off"
              />
              <datalist id={datalistId}>
                {matchingColleges.map((college) => (
                  <option key={college.slug} value={college.name}>
                    {college.city}
                  </option>
                ))}
              </datalist>

              {isCollegeMenuOpen && matchingColleges.length > 0 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-10 overflow-hidden rounded-[22px] border border-ink/10 bg-white shadow-[0_20px_50px_rgba(26,35,32,0.15)]">
                  {matchingColleges.slice(0, 6).map((college) => (
                    <button
                      key={college.slug}
                      type="button"
                      onMouseDown={() => selectCollege(college.name, college.slug)}
                      className="flex w-full items-center justify-between border-b border-ink/5 px-4 py-3 text-left transition hover:bg-mist last:border-b-0"
                    >
                      <span className="font-medium text-ink">{college.name}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-ink/45">{college.city}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </label>

          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">College City</span>
            <input
              name="collegeCity"
              required={!isCompetitiveCategory}
              value={collegeCity}
              onChange={(event) => setCollegeCity(event.target.value)}
              className={fieldClassName}
              placeholder="Type your college city"
            />
          </label>
            </>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_18px_50px_rgba(26,35,32,0.06)]">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.24em] text-moss">Listing Details</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">Make the post easy to trust</h3>
        </div>

        {isCompetitiveCategory ? (
          <div className="mb-6">
            <label className="grid gap-3 text-sm font-medium text-ink">
              <span className="text-[0.95rem] font-semibold">Exam Name</span>
              <select
                name="examName"
                required={isCompetitiveCategory}
                className={fieldClassName}
                value={selectedExamName}
                onChange={(event) => setSelectedExamName(event.target.value)}
              >
                <option value="" disabled>
                  Select an exam
                </option>
                {competitiveExamNames.map((examName) => (
                  <option key={examName} value={examName}>
                    {examName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {isCollegeAccessoriesCategory ? (
          <div className="mb-6">
            <label className="grid gap-3 text-sm font-medium text-ink">
              <span className="text-[0.95rem] font-semibold">Subdivision</span>
              <select
                name="subcategory"
                required={isCollegeAccessoriesCategory}
                className={fieldClassName}
                value={selectedSubcategory}
                onChange={(event) => setSelectedSubcategory(event.target.value)}
              >
                <option value="" disabled>
                  Select a subdivision
                </option>
                {collegeAccessorySubcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">Title</span>
            <input
              name="title"
              required
              className={fieldClassName}
              placeholder="Engineering maths set / JEE PYQ bundle"
            />
          </label>

          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">Expected Price</span>
            <input
              name="expectedPrice"
              required
              type="number"
              min="1"
              className={fieldClassName}
              placeholder="850"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">Minimum Price</span>
            <input
              name="minPrice"
              required
              type="number"
              min="1"
              className={fieldClassName}
              placeholder="700"
            />
          </label>

          <div className="rounded-[24px] border border-dashed border-ink/15 bg-[#f7f1e3] px-5 py-4 text-sm text-ink/65">
            Buyers will only see the expected price. Offers below your minimum price will be rejected automatically.
          </div>
        </div>

        {!isCompetitiveCategory ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="grid gap-3 text-sm font-medium text-ink">
              <span className="text-[0.95rem] font-semibold">Branch</span>
              <input name="branch" className={fieldClassName} placeholder="CSE / Mechanical / ECE" />
            </label>

            <label className="grid gap-3 text-sm font-medium text-ink">
              <span className="text-[0.95rem] font-semibold">Year or Program</span>
              <input name="year" className={fieldClassName} placeholder="1st year / 2nd year / Final year" />
            </label>
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">Seller Name</span>
            <input
              name="postedBy"
              required
              className={fieldClassName}
              placeholder="Your name"
            />
          </label>

          {!isCompetitiveCategory ? (
            <label className="grid gap-3 text-sm font-medium text-ink">
              <span className="text-[0.95rem] font-semibold">Pickup Location</span>
              <input
                name="location"
                className={fieldClassName}
                placeholder="Main gate / Hostel block / Library canteen"
              />
            </label>
          ) : (
            <div className="grid gap-3 text-sm font-medium text-ink">
              <span className="text-[0.95rem] font-semibold">College</span>
              <div className="rounded-[22px] border border-dashed border-ink/15 bg-[#f7f1e3] px-5 py-4 text-[15px] text-ink/65">
                Not required for competitive exam listings
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">Condition</span>
            <select name="condition" className={fieldClassName} defaultValue="Good">
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </label>

          <label className="grid gap-3 text-sm font-medium text-ink">
            <span className="text-[0.95rem] font-semibold">Listing Images</span>
            <div className="rounded-[24px] border border-ink/10 bg-[#f7f1e3] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex w-fit cursor-pointer items-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss">
                  Choose from device
                  <input
                    name="imageFiles"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    multiple
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <span className="text-sm text-ink/70 sm:text-right">{selectedFileName}</span>
              </div>
              <p className="mt-3 text-xs text-ink/55">Upload up to 3 images.</p>
            </div>
          </label>
        </div>
      </section>

      {previewUrls.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {previewUrls.map((previewUrl, index) => (
            <div key={previewUrl} className="overflow-hidden rounded-[28px] border border-ink/10 bg-[#f7f1e3] p-3 shadow-card">
              <img src={previewUrl} alt={`Listing preview ${index + 1}`} className="h-56 w-full rounded-[20px] object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-ink/15 bg-[#f7f1e3] p-6 text-sm text-ink/65">
          Choose up to 3 images from your device and we will preview them here before posting.
        </div>
      )}

      <section className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_18px_50px_rgba(26,35,32,0.06)]">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.24em] text-moss">Description</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">Add the details that close the deal</h3>
        </div>

        <label className="grid gap-3 text-sm font-medium text-ink">
          <span className="text-[0.95rem] font-semibold">Description</span>
          <textarea
            name="description"
            required
            rows={5}
            className={`${fieldClassName} min-h-[150px] resize-y`}
            placeholder="Mention condition, edition, included extras, and pickup area."
          />
        </label>
      </section>

      <button
        type="submit"
        className="w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-moss sm:w-fit"
      >
        Post to marketplace
      </button>
    </form>
  );
}
