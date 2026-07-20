import React from "react";
import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  // Query candidate user and include nested relations
  const user = await prisma.user.findFirst({
    where: {
      email: "candidate@opportunity.com",
    },
    include: {
      badges: true,
      documents: {
        orderBy: {
          createdAt: "desc",
        },
      },
      applications: {
        include: {
          opportunity: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400">
        Candidate profile not found. Please run the database seeding command.
      </div>
    );
  }

  // Query all active opportunities for client-side recommendations matching
  const allOpportunities = await prisma.opportunity.findMany({
    where: {
      isApproved: true,
    },
  });

  // Serialize model objects to plain JS objects with string dates for client transitions
  const serializedApplications = user.applications.map((app) => ({
    id: app.id,
    opportunityId: app.opportunityId,
    status: app.status,
    notes: app.notes,
    opportunity: {
      id: app.opportunity.id,
      title: app.opportunity.title,
      organizationName: app.opportunity.organizationName,
      location: app.opportunity.location,
      deadline: app.opportunity.deadline.toISOString(),
      fundingType: app.opportunity.fundingType,
    },
  }));

  const serializedBadges = user.badges.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    icon: b.icon,
  }));

  const serializedDocuments = user.documents.map((d) => ({
    id: d.id,
    name: d.name,
    fileType: d.fileType,
    sizeBytes: d.sizeBytes,
    createdAt: d.createdAt.toISOString(),
  }));

  const serializedOpportunities = allOpportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    organizationName: opp.organizationName,
    location: opp.location,
    deadline: opp.deadline.toISOString(),
    fundingType: opp.fundingType,
  }));

  return (
    <DashboardClient
      initialApplications={serializedApplications}
      badges={serializedBadges}
      documents={serializedDocuments}
      allOpportunities={serializedOpportunities}
    />
  );
}
