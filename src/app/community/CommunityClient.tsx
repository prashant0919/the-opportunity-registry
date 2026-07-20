"use client";

import React, { useState } from "react";
import { 
  Users, MessageSquare, Award, BookOpen, Send, 
  PlusCircle, Globe, ChevronRight, User, CheckCircle2, 
  MapPin, Calendar, Sparkles, MessageCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { addForumPost, addForumComment } from "@/app/actions";

interface Author {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
}

interface ForumComment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  author: Author;
  comments: ForumComment[];
}

interface CommunityClientProps {
  initialPosts: ForumPost[];
}

const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Elena Rostova",
    title: "Gates Cambridge Scholar '24",
    story: "Focusing my personal statement on how deep learning could forecast flash floods in Siberia was the tipping point. The interviewers cared deeply about leadership potential and global commitment. Don't just list coding achievements—explain their practical, humanitarian utility.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    country: "Russia to Cambridge UK"
  },
  {
    id: 2,
    name: "Marcus K.",
    title: "Remote Engineer at Stripe",
    story: "I applied to 120 remote jobs with no response. Then I used AI matching keywords to restructure my resume to highlight database query structures and system design rather than just coding assignments. Got three screening calls the next week. Focus heavily on distributed systems and telemetry.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    country: "Kenya to Ireland Remote"
  }
];

const MENTORS = [
  {
    id: 1,
    name: "Sophia Chen",
    role: "ML PhD Candidate at Stanford",
    expertise: "Gates Cambridge & Knight-Hennessy applications, Research statements",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    location: "Stanford, USA"
  },
  {
    id: 2,
    name: "David K. Osei",
    role: "Senior Staff Engineer at Stripe",
    expertise: "Technical interviews, System Design preparation, CV review",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    location: "Dublin, Ireland"
  }
];

export default function CommunityClient({ initialPosts }: CommunityClientProps) {
  const { user } = useAuth();
  const { showToast } = useNotification();
  
  const [activeSubTab, setActiveSubTab] = useState<"forum" | "stories" | "mentors">("forum");
  
  // Forum States
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  
  // Form values
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("GENERAL");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  const [newCommentText, setNewCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // --- ACTIONS ---
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const res = await addForumPost(user.id, newPostTitle, newPostContent, newPostCategory);
    if (res.success && res.data) {
      const created: ForumPost = {
        id: res.data.id,
        title: res.data.title,
        content: res.data.content,
        category: res.data.category,
        createdAt: new Date().toISOString(),
        author: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role
        },
        comments: []
      };
      setPosts(prev => [created, ...prev]);
      setNewPostTitle("");
      setNewPostContent("");
      setIsCreatingPost(false);
      showToast("Forum topic published!", "success");
    } else {
      showToast("Failed to publish topic", "error");
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activePost) return;

    setCommentLoading(true);
    const res = await addForumComment(user.id, activePost.id, newCommentText);
    if (res.success && res.data) {
      const createdComment: ForumComment = {
        id: res.data.id,
        content: res.data.content,
        createdAt: new Date().toISOString(),
        author: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role
        }
      };
      
      // Update local state
      const updatedPost = {
        ...activePost,
        comments: [...activePost.comments, createdComment]
      };
      
      setActivePost(updatedPost);
      setPosts(prev => prev.map(p => p.id === activePost.id ? updatedPost : p));
      setNewCommentText("");
      showToast("Reply posted successfully!", "success");
    } else {
      showToast("Failed to post reply", "error");
    }
    setCommentLoading(false);
  };

  const handleRequestMentor = (name: string) => {
    showToast(`Mentor request sent to ${name}! They will review your CV.`, "success");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-4">
          <Users className="w-3.5 h-3.5" />
          Global Alumni Network
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Community Forums & Mentors
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Connect with past scholarship recipients, share study advice, review work offers, and network with global peers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Navigation Tabs (Left 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => { setActiveSubTab("forum"); setActivePost(null); }}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeSubTab === "forum" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Discussion Forums
          </button>
          <button
            onClick={() => setActiveSubTab("stories")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeSubTab === "stories" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Success Stories
          </button>
          <button
            onClick={() => setActiveSubTab("mentors")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeSubTab === "mentors" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Award className="w-4 h-4" />
            Mentor Directory
          </button>
        </div>

        {/* Content Workspace (Right 9 cols) */}
        <div className="lg:col-span-9 p-6 rounded-2xl glass-card border border-lightborder dark:border-darkborder min-h-[500px]">
          
          {/* TAB 1: DISCUSSION FORUMS */}
          {activeSubTab === "forum" && (
            <div className="space-y-6">
              
              {/* Back to list or Create Trigger */}
              {!activePost ? (
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                    Active Discussions ({posts.length})
                  </span>
                  
                  <button
                    onClick={() => setIsCreatingPost(!isCreatingPost)}
                    className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-600 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-brand-500/10"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    New Topic
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <button 
                    onClick={() => setActivePost(null)}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold flex items-center"
                  >
                    ← Back to Forums
                  </button>
                </div>
              )}

              {/* Creating post form */}
              {isCreatingPost && !activePost && (
                <form onSubmit={handleCreatePost} className="p-4 rounded-xl border border-brand-500/20 bg-slate-50 dark:bg-slate-950/20 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Topic Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="e.g. Anyone applying to CERN Fellowships?"
                        className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Forum Category
                      </label>
                      <select
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                      >
                        <option value="GENERAL">General Discussions</option>
                        <option value="SCHOLARSHIPS">Scholarship Application Help</option>
                        <option value="JOBS">Job Boards & Internships</option>
                        <option value="NETWORKING">Peer Networking & Events</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Discussion Content
                    </label>
                    <textarea
                      required
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share details, links, or specific questions you want peers to answer..."
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 min-h-[90px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700"
                    >
                      Publish Topic
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingPost(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* POST LIST */}
              {!activePost && (
                <div className="space-y-4">
                  {posts.map(post => (
                    <div 
                      key={post.id}
                      onClick={() => setActivePost(post)}
                      className="p-5 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-xs text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-500 mb-1.5 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {post.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                            alt={post.author.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {post.author.name}
                          </span>
                          <span className="text-slate-400 uppercase text-[8px] bg-slate-100 dark:bg-slate-800 px-1 rounded font-bold">
                            {post.author.role}
                          </span>
                        </div>

                        <span className="flex items-center gap-1 font-medium">
                          <MessageCircle className="w-3.5 h-3.5 text-brand-500" />
                          {post.comments.length} replies
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* POST DETAIL VIEW (with comments) */}
              {activePost && (
                <div className="space-y-6">
                  {/* Topic Card */}
                  <div className="p-5 rounded-xl border border-brand-500/20 bg-brand-500/5 dark:bg-brand-500/10 text-xs">
                    <div className="flex items-center justify-between border-b border-brand-500/10 pb-3 mb-4">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        {activePost.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(activePost.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug mb-3">
                      {activePost.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                      {activePost.content}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <img
                        src={activePost.author.avatarUrl || ""}
                        alt={activePost.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{activePost.author.name}</span>
                      <span className="uppercase text-[8px] px-1 rounded bg-slate-200 dark:bg-slate-800 font-bold">
                        {activePost.author.role}
                      </span>
                    </div>
                  </div>

                  {/* Replies List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider text-left pl-1">
                      Replies ({activePost.comments.length})
                    </h3>

                    {activePost.comments.map(c => (
                      <div 
                        key={c.id}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex gap-3 text-left"
                      >
                        <img
                          src={c.author.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"}
                          alt={c.author.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="space-y-1.5 flex-grow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {c.author.name}
                              </span>
                              <span className="text-[8px] uppercase px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold">
                                {c.author.role === "EMPLOYER" ? "MENTOR" : c.author.role}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            {c.content}
                          </p>
                        </div>
                      </div>
                    ))}

                    {activePost.comments.length === 0 && (
                      <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        No replies yet. Be the first to answer!
                      </div>
                    )}
                  </div>

                  {/* Add Reply Form */}
                  <form onSubmit={handleCreateComment} className="border-t border-slate-100 dark:border-slate-800 pt-6 text-xs text-left">
                    <label className="block text-slate-550 dark:text-slate-400 font-bold mb-2 uppercase tracking-wider text-[9px]">
                      Post a Reply
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write your response, suggestions, or follow-up question here..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                      />
                      <button
                        type="submit"
                        disabled={commentLoading}
                        className="p-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-brand-500/25 transition-all shrink-0 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUCCESS STORIES */}
          {activeSubTab === "stories" && (
            <div className="grid grid-cols-1 gap-8">
              {SUCCESS_STORIES.map(story => (
                <div 
                  key={story.id}
                  className="p-6 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 flex flex-col md:flex-row gap-6 text-xs text-left"
                >
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-brand-500/10 self-start"
                  />
                  <div className="space-y-2 leading-relaxed">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {story.name}
                        </h4>
                        <p className="text-[10px] text-brand-600 dark:text-brand-455 font-bold uppercase tracking-wider">
                          {story.title}
                        </p>
                      </div>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-505 flex items-center gap-1 shrink-0">
                        <Globe className="w-3 h-3 text-brand-500" />
                        {story.country}
                      </span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 italic">
                      "{story.story}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MENTORS */}
          {activeSubTab === "mentors" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {MENTORS.map(m => (
                <div 
                  key={m.id}
                  className="p-5 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 flex flex-col justify-between text-xs"
                >
                  <div className="flex gap-4">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-14 h-14 rounded-xl object-cover ring-1 ring-brand-500/10 shrink-0 self-start"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {m.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {m.role}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-500" />
                        {m.location}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">
                        Expertise Areas:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5">
                        {m.expertise}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRequestMentor(m.name)}
                      className="w-full py-2.5 rounded-lg border border-brand-500/20 hover:border-brand-500 bg-brand-500/5 hover:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold transition-all"
                    >
                      Request Resume Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
