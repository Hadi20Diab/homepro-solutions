// ─── User & Auth ──────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'editor_blog' | 'editor_services' | 'editor_projects' | 'editor_news' | 'viewer';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;         // icon name from react-icons
  image?: string;        // URL (optional)
  features: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────
export interface ProjectSubmission {
  id: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;   // e.g. 'Plumbing', 'Electrical'
  beforeImages: string[];
  afterImages: string[];
  completionDate: string;
  location: string;
  clientTestimonial?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;    // HTML / markdown
  coverImage: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── News ─────────────────────────────────────────────────────────────────────
export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  source?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Contact Submission ───────────────────────────────────────────────────────
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// ─── Site Content ─────────────────────────────────────────────────────────────
export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export interface HomeContent {
  hero: HeroContent;
  statsTitle: string;
  stats: { label: string; value: string }[];
  whyUsTitle: string;
  whyUsPoints: { title: string; description: string; icon: string }[];
  ctaBannerTitle: string;
  ctaBannerSubtitle: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  story: string;
  mission: string;
  vision: string;
  teamMembers: { name: string; role: string; image: string; bio: string }[];
  values: { title: string; description: string }[];
}
