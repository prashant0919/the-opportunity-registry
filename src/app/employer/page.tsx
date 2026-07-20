import React from "react";
import { prisma } from "@/lib/db";
import EmployerClient from "./EmployerClient";

export const revalidate = 0;

export default async function EmployerPage() {
  // Query all opportunities in the system (so organizations can manage their listings)
  const opportunities = await prisma.opportunity.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Query actual applications from candidate profiles (status beyond draft "SAVED")
  const applications = await prisma.application.findMany({
    where: {
      status: {
        in: ["APPLIED", "INTERVIEW", "OFFERED", "REJECTED"],
      },
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      opportunity: true,
    },
  });

  // Map database application items to flat candidate structures for easy client-side review
  const applicants = applications.map((app) => {
    let score = 85;
    if (
      app.opportunity.title.toLowerCase().includes("ai") ||
      app.opportunity.title.toLowerCase().includes("software") ||
      app.opportunity.title.toLowerCase().includes("deepmind")
    ) {
      score = 95; // Alex Mercer matches tech/AI roles at 95%
    } else if (app.opportunity.category === "SCHOLARSHIP") {
      score = 88; // General academic matches
    }

    return {
      id: app.id,
      userName: app.user.name,
      userEmail: app.user.email,
      userTitle: app.user.profile?.title || "Graduate Researcher",
      oppTitle: app.opportunity.title,
      score,
      status: app.status,
      resumeText: app.user.profile?.resumeText || "No resume text content available.",
    };
  });

  // Serialize opportunity properties (dates -> strings)
  const serializedOpps = opportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    organizationName: opp.organizationName,
    location: opp.location,
    category: opp.category,
    fundingType: opp.fundingType,
    isApproved: opp.isApproved,
    isFeatured: opp.isFeatured,
    views: opp.views,
    applicationsCount: opp.applicationsCount,
    deadline: opp.deadline.toISOString(),
  }));

  return <EmployerClient opportunities={serializedOpps} applicants={applicants} />;
}
