import { notFound } from "next/navigation";
import { ConversationAutoRefresh } from "@/components/conversation-auto-refresh";
import { ConversationRealtime } from "@/components/conversation-realtime";
import { ListingDetailView } from "@/components/listing-detail-view";
import { SiteHeader } from "@/components/site-header";
import { canUserReviewListing, getListing, getOfferThreadsByListing, getOfferThreadsForBuyer, getSellerSnapshot } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    offer?: string;
    manage?: string;
    thread?: string;
    step?: string;
    review?: string;
  };
};

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
  const supabase = createClient();
  const [
    {
      data: { user }
    },
    listing
  ] = await Promise.all([supabase.auth.getUser(), getListing(params.id)]);

  if (!listing) {
    notFound();
  }

  const offerStatus = searchParams?.offer;
  const manageStatus = searchParams?.manage;
  const activeOfferId = searchParams?.thread;
  const activeOfferStep = searchParams?.step;
  const reviewStatus = searchParams?.review;
  const canManageListing = Boolean(user && listing.userId === user.id);
  const [buyerThreads, sellerThreads, sellerSnapshot, canLeaveReview] = await Promise.all([
    user && !canManageListing ? getOfferThreadsForBuyer(params.id, user.id) : Promise.resolve([]),
    canManageListing ? getOfferThreadsByListing(params.id) : Promise.resolve([]),
    getSellerSnapshot(listing.userId),
    user && !canManageListing && listing.userId
      ? canUserReviewListing(listing.id, listing.userId, user.id)
      : Promise.resolve(false)
  ]);
  const shouldAutoRefreshConversations = Boolean((canManageListing && sellerThreads.length > 0) || buyerThreads.length > 0);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <ConversationAutoRefresh enabled={shouldAutoRefreshConversations} intervalMs={0} />
        <ConversationRealtime listingId={listing.id} enabled={shouldAutoRefreshConversations} />
        <ListingDetailView
          listing={listing}
          offerStatus={offerStatus}
          manageStatus={manageStatus}
          reviewStatus={reviewStatus}
          activeOfferId={activeOfferId}
          activeOfferStep={activeOfferStep}
          canManageListing={canManageListing}
          userName={user?.user_metadata?.full_name}
          userEmail={user?.email}
          canLeaveReview={canLeaveReview}
          sellerSnapshot={sellerSnapshot}
          buyerThreads={buyerThreads}
          sellerThreads={sellerThreads}
        />
      </main>
    </div>
  );
}
