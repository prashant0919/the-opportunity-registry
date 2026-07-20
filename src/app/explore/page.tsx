import React from "react";
import { prisma } from "@/lib/db";
import ExploreClient from "./ExploreClient";

export const revalidate = 0;

export default async function ExplorePage() {
  // Query all approved opportunities from database
  const opportunities = await prisma.opportunity.findMany({
    where: {
      isApproved: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize date fields to ISO strings for safe client transition
  const serializedOpportunities = opportunities.map((opp) => ({
    ...opp,
    createdAt: opp.createdAt.toISOString() as any,
    updatedAt: opp.updatedAt.toISOString() as any,
    deadline: opp.deadline.toISOString() as any,
  }));

  return <ExploreClient initialOpportunities={serializedOpportunities} />;
}
