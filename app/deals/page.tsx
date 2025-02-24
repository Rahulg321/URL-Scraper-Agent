import DealCard from "@/components/deal-card";
import { getAllDeals } from "@/lib/db/queries";
import React from "react";

const DealsPage = async () => {
  const deals = await getAllDeals();

  return (
    <div className="narrow-container block-space">
      <h2>DealsPage</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {deals.map((deal) => {
          return <DealCard deal={deal} key={deal.id} />;
        })}
      </div>
    </div>
  );
};

export default DealsPage;
