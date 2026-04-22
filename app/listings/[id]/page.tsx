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
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }

  const offerStatus = searchParams?.offer;
  const manageStatus = searchParams?.manage;
  const activeOfferId = searchParams?.thread;
  const activeOfferStep = searchParams?.step;
  const reviewStatus = searchParams?.review;
  const canManageListing = Boolean(user && listing.userId === user.id);
  const buyerThreads = user && !canManageListing ? await getOfferThreadsForBuyer(params.id, user.id) : [];
  const sellerThreads = canManageListing ? await getOfferThreadsByListing(params.id) : [];
  const sellerSnapshot = await getSellerSnapshot(listing.userId);
  const canLeaveReview = user && !canManageListing && listing.userId
    ? await canUserReviewListing(listing.id, listing.userId, user.id)
    : false;
  const shouldAutoRefreshConversations = Boolean(user);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <ConversationAutoRefresh enabled={shouldAutoRefreshConversations} intervalMs={1500} />
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
