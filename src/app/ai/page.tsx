import React from "react";
import { prisma } from "@/lib/db";
import AiHubClient from "./AiHubClient";

export const revalidate = 0;

export default async function AiPage() {
  // Query only approved opportunities with essential fields for custom SOP templates
  const opportunities = await prisma.opportunity.findMany({
    where: {
      isApproved: true,
    },
    select: {
      id: true,
      title: true,
      organizationName: true,
      requirements: true,
      category: true,
    },
  });

  return <AiHubClient opportunities={opportunities} />;
}
