import Image from "next/image";
import Link from "next/link";
import {
  closeOfferConversation,
  deleteListing,
  deleteOfferConversation,
  saveListingChanges,
  sendOfferMessage,
  submitOffer
} from "@/app/sell/actions";
import { AuthButton } from "@/components/auth-button";
import { FormSubmitButton } from "@/components/form-submit-button";
import { ListingImageGallery } from "@/components/listing-image-gallery";
import {
  COMPETITIVE_EXAMS_LABEL,
  COMPETITIVE_EXAMS_SLUG,
  type Listing,
  type OfferThread
} from "@/lib/data";

type ListingDetailViewProps = {
  listing: Listing;
  offerStatus?: string;
  manageStatus?: string;
  activeOfferId?: string;
  activeOfferStep?: string;
  canManageListing: boolean;
  userName?: string;
  userEmail?: string;
  buyerThreads: OfferThread[];
  sellerThreads: OfferThread[];
};

export function ListingDetailView({
  listing,
  offerStatus,
  manageStatus,
  activeOfferId,
  activeOfferStep,
  canManageListing,
  userName,
  userEmail,
  buyerThreads,
  sellerThreads
}: ListingDetailViewProps) {
  const listingPlace = listing.location || listing.city;
  const isCompetitiveListing = listing.collegeSlug === COMPETITIVE_EXAMS_SLUG;
  const listingIsSold = listing.status === "sold";

  return (
    <>
      {isCompetitiveListing ? (
        <Link href="/" className="text-sm font-semibold text-moss hover:text-ink">
          {"<- Back to explore"}
        </Link>
      ) : (
        <Link href={`/college/${listing.collegeSlug}`} className="text-sm font-semibold text-moss hover:text-ink">
          {`<- Back to ${listing.collegeName}`}
        </Link>
      )}

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ListingImageGallery images={listing.images} title={listing.title} />

        <div className="rounded-[32px] bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.26em] text-moss">{listing.category}</p>
          {isCompetitiveListing ? <p className="mt-2 text-sm text-ink/55">{COMPETITIVE_EXAMS_LABEL}</p> : null}
          <h1 className="mt-3 font-display text-4xl text-ink">{listing.title}</h1>
          <p className="mt-4 text-3xl font-semibold text-clay">Rs. {listing.expectedPrice}</p>
          <p className="mt-2 text-sm text-ink/60">
            This is the seller&apos;s expected price. Buyers can offer the price they feel is appropriate, and the seller
            will receive the offer when it meets or exceeds the minimum price set by the seller.
          </p>
          {listingIsSold ? (
            <div className="mt-4 rounded-2xl bg-ink/5 px-4 py-3 text-sm text-ink/70">
              This listing has been marked as sold. New offers are closed.
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-ink/75">
            <span className="rounded-full bg-mist px-4 py-2">
              {isCompetitiveListing ? COMPETITIVE_EXAMS_LABEL : listing.collegeName}
            </span>
            {listing.branch ? <span className="rounded-full bg-mist px-4 py-2">{listing.branch}</span> : null}
            {listing.year ? <span className="rounded-full bg-mist px-4 py-2">{listing.year}</span> : null}
            <span className="rounded-full bg-mist px-4 py-2">{listing.condition}</span>
          </div>

          <div className="mt-8 space-y-4 text-sm text-ink/72">
            <p>
              <span className="font-semibold text-ink">{listing.location ? "Location:" : "City:"}</span> {listingPlace}
            </p>
            <p>
              <span className="font-semibold text-ink">Seller:</span> {listing.postedBy}
            </p>
            <p>
              <span className="font-semibold text-ink">Posted:</span> {listing.postedAgo}
            </p>
          </div>

          <p className="mt-8 whitespace-pre-wrap leading-7 text-ink/80">{listing.description}</p>

          {canManageListing ? (
            <div className="mt-8 rounded-[24px] border border-moss/20 bg-moss/5 px-5 py-4 text-sm text-moss">
              <p>Seller access is enabled for this signed-in account. Buyer actions are hidden here, and your offer inbox is shown below.</p>
              <a href="#seller-controls" className="mt-3 inline-flex rounded-full bg-moss px-4 py-2 font-semibold text-white transition hover:bg-ink">
                Jump to seller controls
              </a>
            </div>
          ) : null}
        </div>
      </section>

      {!canManageListing ? (
        <section className="mt-8 rounded-[32px] bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.26em] text-moss">Buyer Action</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Connect or make an offer</h2>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            The amount shown above is the seller&apos;s expected price, which is the public price buyers can see. You can
            keep that same amount if you want to offer the full expected price, or enter a lower amount. If your offer
            is below the seller&apos;s hidden minimum price, the chat will not open and you will get an instant low-offer
            note instead.
          </p>

          {offerStatus === "sent" ? (
            <p className="mt-6 rounded-2xl bg-moss/10 px-4 py-3 text-sm text-moss">
              Your offer reached the seller and the conversation thread is now open below.
            </p>
          ) : null}

          {offerStatus === "low" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Offered amount is too low for this product
            </p>
          ) : null}

          {offerStatus === "confirmed" ? (
            <p className="mt-6 rounded-2xl bg-moss/10 px-4 py-3 text-sm text-moss">
              The seller confirmed this deal and closed the conversation.
            </p>
          ) : null}

          {offerStatus === "sold" ? (
            <p className="mt-6 rounded-2xl bg-ink/5 px-4 py-3 text-sm text-ink/70">
              The seller confirmed this deal and marked the listing as sold.
            </p>
          ) : null}

          {offerStatus === "missing" || offerStatus === "invalid" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please enter a valid buyer name and offer amount.
            </p>
          ) : null}

          {offerStatus === "auth" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please sign in with Google before sending an offer.
            </p>
          ) : null}

          {offerStatus === "deleted" ? (
            <p className="mt-6 rounded-2xl bg-moss/10 px-4 py-3 text-sm text-moss">
              This conversation was deleted by the seller.
            </p>
          ) : null}
          {offerStatus === "closed" ? (
            <p className="mt-6 rounded-2xl bg-ink/5 px-4 py-3 text-sm text-ink/70">
              This conversation has been closed by the seller.
            </p>
          ) : null}

          {listingIsSold ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-ink/15 bg-[#f7f1e3] p-5">
              <p className="text-sm leading-6 text-ink/68">
                This listing is sold. You can still read any previous conversation thread below, but no new offers can be sent.
              </p>
            </div>
          ) : userEmail ? (
            <form action={submitOffer} className="mt-6 grid gap-5">
              <input type="hidden" name="listingId" value={listing.id} />

              <label className="grid gap-2 text-sm font-medium text-ink">
                Buyer Name
                <input
                  name="buyerName"
                  required
                  defaultValue={userName || userEmail}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  placeholder="Your name"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Contact Info
                <input
                  name="buyerContact"
                  defaultValue={userEmail}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  placeholder="Phone, email, or Instagram"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Offer Amount
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    required
                    defaultValue={listing.expectedPrice}
                    className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  />
                </label>

                <div className="rounded-[24px] border border-dashed border-ink/15 bg-[#f7f1e3] px-5 py-4 text-sm text-ink/65">
                  Posted price: Rs. {listing.expectedPrice}
                  <br />
                  Offers below the seller minimum get the note: "Offered amount is too low for this product"
                </div>
              </div>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Message to Seller
                <textarea
                  name="message"
                  rows={4}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                  placeholder="Why this price works for you, pickup timing, or any question"
                />
              </label>

              <FormSubmitButton
                idleLabel="Send Offer"
                pendingLabel="Sending..."
                className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss disabled:opacity-60"
              />
            </form>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-ink/15 bg-[#f7f1e3] p-5">
              <p className="text-sm leading-6 text-ink/68">
                Sign in with Google to make an offer and chat with the seller after your offer is accepted by the minimum-price rule.
              </p>
              <div className="mt-4">
                <AuthButton isSignedIn={false} />
              </div>
            </div>
          )}
        </section>
      ) : null}

      {canManageListing ? (
        <section className="mt-8 rounded-[32px] bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.26em] text-moss">Seller Inbox</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Offers and buyer conversations</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            Buyers only reach this inbox when their offer is at or above your minimum price. Reply here to continue the deal.
          </p>

          <div className="mt-6 grid gap-5">
            {sellerThreads.length > 0 ? (
              sellerThreads.map((thread) => (
                <article key={thread.id} className="rounded-[28px] border border-ink/10 bg-[#f7f1e3] p-5">
                  {activeOfferId === thread.id && activeOfferStep === "deal" && thread.status === "open" ? (
                    <div className="mb-4 rounded-[22px] border border-ink/10 bg-white px-4 py-4 text-sm text-ink/70">
                      <p className="font-semibold text-ink">Is this deal confirmed?</p>
                      <p className="mt-1 text-sm text-ink/60">Choose yes only if the buyer agreed to the final price.</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/listings/${listing.id}?thread=${thread.id}&step=close`}
                          className="rounded-full bg-moss px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-ink"
                        >
                          Yes, confirmed
                        </Link>
                        <form action={closeOfferConversation}>
                          <input type="hidden" name="listingId" value={listing.id} />
                          <input type="hidden" name="offerId" value={thread.id} />
                          <input type="hidden" name="resolution" value="close_only" />
                          <button
                            type="submit"
                            className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-clay/30 hover:text-clay"
                          >
                            No, close conversation
                          </button>
                        </form>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/70 transition hover:text-ink"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {activeOfferId === thread.id && activeOfferStep === "close" && thread.status === "open" ? (
                    <div className="mb-4 rounded-[22px] border border-ink/10 bg-white px-4 py-4 text-sm text-ink/70">
                      <p className="font-semibold text-ink">Should we close this listing now?</p>
                      <p className="mt-1 text-sm text-ink/60">
                        If you close it now, the listing will be marked sold for 14 days and then deleted.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <form action={closeOfferConversation}>
                          <input type="hidden" name="listingId" value={listing.id} />
                          <input type="hidden" name="offerId" value={thread.id} />
                          <input type="hidden" name="resolution" value="confirm_and_sell" />
                          <button
                            type="submit"
                            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-moss"
                          >
                            Yes, close listing
                          </button>
                        </form>
                        <form action={closeOfferConversation}>
                          <input type="hidden" name="listingId" value={listing.id} />
                          <input type="hidden" name="offerId" value={thread.id} />
                          <input type="hidden" name="resolution" value="confirm_keep_open" />
                          <button
                            type="submit"
                            className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-moss/40 hover:text-moss"
                          >
                            Not yet
                          </button>
                        </form>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/70 transition hover:text-ink"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-ink">{thread.buyerName}</p>
                      <p className="mt-1 text-sm text-ink/65">
                        Offer: Rs. {thread.amount}
                        {thread.buyerContact ? ` - ${thread.buyerContact}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-moss">
                        {thread.status}
                      </span>
                      {thread.status === "open" ? (
                        <Link
                          href={`/listings/${listing.id}?thread=${thread.id}&step=deal`}
                          className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-clay/30 hover:text-clay"
                        >
                          Close conversation
                        </Link>
                      ) : null}
                      <form action={deleteOfferConversation}>
                        <input type="hidden" name="listingId" value={listing.id} />
                        <input type="hidden" name="offerId" value={thread.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-clay/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-clay transition hover:bg-clay/10"
                        >
                          Delete conversation
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {thread.messages.length > 0 ? (
                      thread.messages.map((message) => (
                        <div key={message.id} className="rounded-[22px] bg-white px-4 py-3 text-sm text-ink/78">
                          <p className="font-semibold text-ink">{message.senderName}</p>
                          <p className="mt-1 whitespace-pre-wrap leading-6">{message.body}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[22px] bg-white px-4 py-3 text-sm text-ink/60">
                        Buyer has not added a message yet.
                      </div>
                    )}
                  </div>

                  {thread.status === "open" ? (
                    <form action={sendOfferMessage} className="mt-4 grid gap-3">
                      <input type="hidden" name="listingId" value={listing.id} />
                      <input type="hidden" name="offerId" value={thread.id} />
                      <input type="hidden" name="senderRole" value="seller" />
                      <input type="hidden" name="senderName" value={listing.postedBy} />
                      <textarea
                        name="body"
                        rows={3}
                        required
                        className="rounded-[22px] border border-ink/10 bg-white px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:ring-4 focus:ring-moss/10"
                        placeholder="Reply to this buyer"
                      />
                      <button className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss">
                        Send reply
                      </button>
                    </form>
                  ) : (
                    <div className="mt-4 rounded-[22px] bg-white px-4 py-3 text-sm text-ink/65">
                      This conversation is closed. The buyer can still read the thread, and you can delete it anytime if you no longer need it.
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-ink/15 bg-[#f7f1e3] p-6 text-sm text-ink/65">
                No valid offers yet. Buyer conversations will appear here as soon as someone offers at or above your minimum price.
              </div>
            )}
          </div>
        </section>
      ) : null}

      {!canManageListing && userEmail && buyerThreads.length > 0 ? (
        <section className="mt-8 rounded-[32px] bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.26em] text-moss">Your Conversation</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Chat with the seller</h2>
          <div className="mt-6 grid gap-5">
            {buyerThreads.map((thread) => (
              <article key={thread.id} className="rounded-[28px] border border-ink/10 bg-[#f7f1e3] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">Your offer: Rs. {thread.amount}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-moss">
                    {thread.status}
                  </span>
                </div>
                <div className="mt-4 grid gap-3">
                  {thread.messages.length > 0 ? (
                    thread.messages.map((message) => (
                      <div key={message.id} className="rounded-[22px] bg-white px-4 py-3 text-sm text-ink/78">
                        <p className="font-semibold text-ink">{message.senderName}</p>
                        <p className="mt-1 whitespace-pre-wrap leading-6">{message.body}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[22px] bg-white px-4 py-3 text-sm text-ink/60">
                      This offer is open. Start the conversation with a question for the seller.
                    </div>
                  )}
                </div>

                {thread.status === "open" ? (
                  <form action={sendOfferMessage} className="mt-4 grid gap-3">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <input type="hidden" name="offerId" value={thread.id} />
                    <input type="hidden" name="senderRole" value="buyer" />
                    <input type="hidden" name="senderName" value={userName || userEmail || thread.buyerName} />
                    <textarea
                      name="body"
                      rows={3}
                      required
                      className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                      placeholder="Send a message to the seller"
                    />
                    <button className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss">
                      Send message
                    </button>
                  </form>
                ) : (
                  <div className="mt-4 rounded-[22px] bg-white px-4 py-3 text-sm text-ink/65">
                    This conversation was closed by the seller.
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {canManageListing ? (
        <section id="seller-controls" className="mt-8 rounded-[32px] bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.26em] text-moss">Seller Controls</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Edit your listing</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68">
            This edit access is tied to your Google account, so you can manage the listing from any device after signing in.
          </p>

          {manageStatus === "saved" ? (
            <p className="mt-6 rounded-2xl bg-moss/10 px-4 py-3 text-sm text-moss">
              Listing changes saved.
            </p>
          ) : null}

          {manageStatus === "denied" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              This signed-in account does not own that listing.
            </p>
          ) : null}

          {manageStatus === "auth" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please sign in with Google to manage your listing.
            </p>
          ) : null}

          {manageStatus === "missing" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please fill in all required seller fields before saving.
            </p>
          ) : null}

          {manageStatus === "price" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please enter valid prices greater than zero.
            </p>
          ) : null}

          {manageStatus === "range" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Expected price must be greater than or equal to minimum price.
            </p>
          ) : null}

          {manageStatus === "error" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              We could not save the listing changes right now. Please try again.
            </p>
          ) : null}

          {manageStatus === "image-size" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please upload an image smaller than 2 MB.
            </p>
          ) : null}

          {manageStatus === "image-count" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please upload no more than 3 images.
            </p>
          ) : null}

          {manageStatus === "image-total-size" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Total image size is too large. Keep all images under 6 MB together.
            </p>
          ) : null}

          {manageStatus === "image-type" ? (
            <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
              Please upload a JPG, PNG, or WebP image.
            </p>
          ) : null}

          <form action={saveListingChanges} className="mt-6 grid gap-5">
            <input type="hidden" name="listingId" value={listing.id} />
            <input type="hidden" name="existingImages" value={JSON.stringify(listing.images)} />

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Title
                <input
                  name="title"
                  required
                  defaultValue={listing.title}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Seller Name
                <input
                  name="postedBy"
                  required
                  defaultValue={listing.postedBy}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Expected Price
                <input
                  name="expectedPrice"
                  type="number"
                  min="1"
                  required
                  defaultValue={listing.expectedPrice}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Minimum Price
                <input
                  name="minPrice"
                  type="number"
                  min="1"
                  required
                  defaultValue={listing.minPrice}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Condition
                <select
                  name="condition"
                  defaultValue={listing.condition}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                >
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                  <option value="Needs Review">Needs Review</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Location
                <input
                  name="location"
                  defaultValue={listing.location ?? ""}
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
                />
              </label>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-3">
                <p className="text-sm font-medium text-ink">Current Images</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {listing.images.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative h-28 overflow-hidden rounded-[24px] bg-[#f7f1e3]">
                      <Image
                        src={image}
                        alt={`${listing.title} current image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={image.startsWith("data:")}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Add or Replace Images
                <input
                  name="imageFiles"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  multiple
                  className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none"
                />
              </label>

              <label className="flex items-center gap-3 text-sm text-ink/72">
                <input type="checkbox" name="replaceImages" value="yes" className="h-4 w-4 rounded border-ink/20" />
                Replace current images instead of appending new ones
              </label>

              <p className="text-xs leading-5 text-ink/55">
                Upload up to 3 images total. Leave this section untouched if you want to keep the current pictures.
              </p>
            </div>

            <label className="grid gap-2 text-sm font-medium text-ink">
              Description
              <textarea
                name="description"
                required
                rows={5}
                defaultValue={listing.description}
                className="rounded-[22px] border border-ink/10 bg-[#f7f1e3] px-5 py-4 text-[15px] outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-moss/10"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <FormSubmitButton
                idleLabel="Save Changes"
                pendingLabel="Saving..."
                className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-moss disabled:opacity-60"
              />
            </div>
          </form>

          <form action={deleteListing} className="mt-4">
            <input type="hidden" name="listingId" value={listing.id} />
            <button
              type="submit"
              className="rounded-full border border-clay/30 px-5 py-3 text-sm font-semibold text-clay transition hover:bg-clay/10"
            >
              Delete Listing
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}
