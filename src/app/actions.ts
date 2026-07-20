"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Toggle Save Opportunity
export async function toggleSaveOpportunity(userId: string, opportunityId: string) {
  try {
    const existing = await prisma.application.findUnique({
      where: {
        userId_opportunityId: {
          userId,
          opportunityId,
        },
      },
    });

    if (existing) {
      await prisma.application.delete({
        where: {
          id: existing.id,
        },
      });
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath("/dashboard");
      return { success: true, action: "removed" };
    } else {
      await prisma.application.create({
        data: {
          userId,
          opportunityId,
          status: "SAVED",
        },
      });
      revalidatePath("/");
      revalidatePath("/explore");
      revalidatePath("/dashboard");
      return { success: true, action: "saved" };
    }
  } catch (error) {
    console.error("Error toggling save opportunity:", error);
    return { success: false, error: String(error) };
  }
}

// 2. Update Application Status (for Kanban board)
export async function updateApplicationStatus(
  userId: string, 
  opportunityId: string, 
  status: string,
  notes?: string
) {
  try {
    const app = await prisma.application.upsert({
      where: {
        userId_opportunityId: {
          userId,
          opportunityId,
        },
      },
      update: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
      create: {
        userId,
        opportunityId,
        status,
        notes: notes || "",
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: app };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: String(error) };
  }
}

// 3. Create Opportunity (Post listing)
export async function createOpportunity(data: {
  title: string;
  description: string;
  requirements: string;
  organizationName: string;
  category: string;
  subCategory: string;
  fundingType: string;
  degreeLevel: string;
  location: string;
  isRemote: boolean;
  deadline: string;
  applyUrl: string;
  isApproved?: boolean;
}) {
  try {
    const opp = await prisma.opportunity.create({
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        organizationName: data.organizationName,
        category: data.category,
        subCategory: data.subCategory,
        fundingType: data.fundingType,
        degreeLevel: data.degreeLevel,
        location: data.location,
        isRemote: data.isRemote,
        deadline: new Date(data.deadline),
        applyUrl: data.applyUrl,
        isApproved: data.isApproved ?? false, // Defaults to pending
        isFeatured: false,
      },
    });

    revalidatePath("/explore");
    revalidatePath("/admin");
    return { success: true, data: opp };
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return { success: false, error: String(error) };
  }
}

// 4. Approve Opportunity (Admin action)
export async function approveOpportunity(id: string) {
  try {
    const opp = await prisma.opportunity.update({
      where: { id },
      data: { isApproved: true },
    });

    revalidatePath("/explore");
    revalidatePath("/admin");
    return { success: true, data: opp };
  } catch (error) {
    console.error("Error approving opportunity:", error);
    return { success: false, error: String(error) };
  }
}

// 5. Featured Toggle (Admin action)
export async function toggleFeaturedOpportunity(id: string, isFeatured: boolean) {
  try {
    const opp = await prisma.opportunity.update({
      where: { id },
      data: { isFeatured },
    });
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath("/admin");
    return { success: true, data: opp };
  } catch (error) {
    console.error("Error setting featured status:", error);
    return { success: false, error: String(error) };
  }
}

// 6. Post Forum Topic
export async function addForumPost(userId: string, title: string, content: string, category: string) {
  try {
    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        category,
        authorId: userId,
      },
    });

    revalidatePath("/community");
    return { success: true, data: post };
  } catch (error) {
    console.error("Error adding forum post:", error);
    return { success: false, error: String(error) };
  }
}

// 7. Post Forum Comment
export async function addForumComment(userId: string, postId: string, content: string) {
  try {
    const comment = await prisma.forumComment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    revalidatePath("/community");
    return { success: true, data: comment };
  } catch (error) {
    console.error("Error adding forum comment:", error);
    return { success: false, error: String(error) };
  }
}

// 8. Delete Opportunity (Admin action)
export async function deleteOpportunity(id: string) {
  try {
    await prisma.opportunity.delete({
      where: { id },
    });
    revalidatePath("/explore");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return { success: false, error: String(error) };
  }
}

// 9. Get User Saved Opportunity IDs
export async function getUserSavedOpportunityIds(userId: string) {
  try {
    const apps = await prisma.application.findMany({
      where: { userId },
      select: { opportunityId: true },
    });
    return { success: true, ids: apps.map((a) => a.opportunityId) };
  } catch (error) {
    console.error("Error fetching saved IDs:", error);
    return { success: false, ids: [] };
  }
}

// 10. Upload User Document
export async function uploadUserDocument(
  userId: string,
  name: string,
  sizeBytes: number,
  fileType: string
) {
  try {
    const doc = await prisma.document.create({
      data: {
        userId,
        name,
        sizeBytes,
        fileType,
        url: `/vault/${name}`,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: doc };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { success: false, error: String(error) };
  }
}
