import React from "react";
import { prisma } from "@/lib/db";
import CommunityClient from "./CommunityClient";

export const revalidate = 0;

export default async function CommunityPage() {
  // Query all forum posts along with their authors and comments
  const posts = await prisma.forumPost.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize date fields to ISO strings for client transfer safety
  const serializedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    createdAt: post.createdAt.toISOString(),
    author: {
      id: post.author.id,
      name: post.author.name,
      avatarUrl: post.author.avatarUrl,
      role: post.author.role,
    },
    comments: post.comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      author: {
        id: c.author.id,
        name: c.author.name,
        avatarUrl: c.author.avatarUrl,
        role: c.author.role,
      },
    })),
  }));

  return <CommunityClient initialPosts={serializedPosts} />;
}
