import { notFound } from "next/navigation";
import { ListingDetailView } from "@/components/listing-detail-view";
import { SiteHeader } from "@/components/site-header";
import { getListing, getOfferThreadsByListing, getOfferThreadsForBuyer } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    offer?: string;
    manage?: string;
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
  const canManageListing = Boolean(user && listing.userId === user.id);
  const buyerThreads = user && !canManageListing ? await getOfferThreadsForBuyer(params.id, user.id) : [];
  const sellerThreads = canManageListing ? await getOfferThreadsByListing(params.id) : [];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <ListingDetailView
          listing={listing}
          offerStatus={offerStatus}
          manageStatus={manageStatus}
          canManageListing={canManageListing}
          userName={user?.user_metadata?.full_name}
          userEmail={user?.email}
          buyerThreads={buyerThreads}
          sellerThreads={sellerThreads}
        />
      </main>
    </div>
  );
}
