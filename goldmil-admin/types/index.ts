// أنواع البيانات المشتركة عبر لوحة التحكم

export type UserRole = "admin" | "manager" | "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  type: "residential" | "commercial" | "industrial";
  status: "planning" | "in_progress" | "on_hold" | "completed";
  progress: number; // 0-100
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  manager: string;
  location: string;
  thumbnail?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: "lead" | "prospect" | "active" | "past";
  totalSpent: number;
  projectsCount: number;
  lastContact: string;
  source: "website" | "referral" | "social" | "ads";
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "responded" | "closed";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  source: "contact_form" | "design_studio" | "store" | "phone";
  createdAt: string;
}

export interface DesignRequest {
  id: string;
  customer: string;
  projectName: string;
  roomType: "living" | "bedroom" | "kitchen" | "bathroom" | "office" | "outdoor";
  style: "modern" | "classic" | "minimal" | "luxury";
  status: "pending" | "in_design" | "review" | "approved" | "delivered";
  budget: number;
  deadline: string;
  images: string[];
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: "active" | "out_of_stock" | "draft";
  image?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  status: "draft" | "published" | "archived";
  views: number;
  likes: number;
  publishedAt?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerRole?: string;
  rating: number;
  content: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  createdAt: string;
}

export interface KPIData {
  title: string;
  value: number;
  formattedValue: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: "gold" | "success" | "info" | "warning" | "danger";
}

export interface ChartDataPoint {
  label: string;
  value: number;
}