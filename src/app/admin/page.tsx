import React from "react";
import { prisma } from "@/lib/db";
import AdminClient from "./AdminClient";

export const revalidate = 0;

export default async function AdminPage() {
  // Query all opportunities in the platform for moderation audits
  const opportunities = await prisma.opportunity.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Query all registered users
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize opportunities (dates -> strings)
  const serializedOpps = opportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    organizationName: opp.organizationName,
    location: opp.location,
    category: opp.category,
    fundingType: opp.fundingType,
    isApproved: opp.isApproved,
    deadline: opp.deadline.toISOString(),
  }));

  // Serialize users (dates -> strings)
  const serializedUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    membership: u.membership,
    createdAt: u.createdAt.toISOString(),
  }));

  return <AdminClient opportunities={serializedOpps} users={serializedUsers} />;
}
