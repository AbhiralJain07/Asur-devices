"use client";

import { useDeferredValue, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FileText,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { broadcastCmsUpdate } from "@/lib/cms/realtime";
import type {
  BlogPostRecord,
  CmsStore,
  ContactSubmissionRecord,
  PricingPlanRecord,
  TestimonialRecord,
} from "@/lib/cms/types";

import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import BlogEditorModal from "./BlogEditorModal";
import PricingEditorModal from "./PricingEditorModal";
import TestimonialEditorModal from "./TestimonialEditorModal";
import {
  BLOG_STATUS_OPTIONS,
  CONTACT_STATUS_OPTIONS,
  DashboardTab,
  EMPTY_BLOG_FORM,
  EMPTY_PRICING_FORM,
  EMPTY_TESTIMONIAL_FORM,
  PAGE_SIZE,
  PRICING_STATUS_OPTIONS,
  TESTIMONIAL_STATUS_OPTIONS,
  BlogFormState,
  PricingFormState,
  TestimonialFormState,
  buildStats,
  formatDate,
  getStatusVariant,
  parseResponse,
  sortBlogs,
  sortContacts,
  sortPricing,
  sortTestimonials,
} from "./admin-helpers";

interface AdminDashboardProps {
  adminEmail: string;
  initialStore: CmsStore;
}

export default function AdminDashboard({ adminEmail, initialStore }: AdminDashboardProps) {
  const router = useRouter();
  const [store, setStore] = useState(initialStore);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogForm, setBlogForm] = useState<BlogFormState>(EMPTY_BLOG_FORM);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormState>(EMPTY_TESTIMONIAL_FORM);
  const [pricingForm, setPricingForm] = useState<PricingFormState>(EMPTY_PRICING_FORM);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [blogSlugDirty, setBlogSlugDirty] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const stats = buildStats(store);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setNotice("");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  const blogRows = sortBlogs(store.blogs).filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(deferredSearchQuery) ||
      blog.slug.toLowerCase().includes(deferredSearchQuery) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(deferredSearchQuery));
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const testimonialRows = sortTestimonials(store.testimonials).filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(deferredSearchQuery) ||
      testimonial.role.toLowerCase().includes(deferredSearchQuery) ||
      testimonial.content.toLowerCase().includes(deferredSearchQuery);
    const matchesStatus = statusFilter === "all" || testimonial.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pricingRows = sortPricing(store.pricingPlans).filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(deferredSearchQuery) ||
      plan.description.toLowerCase().includes(deferredSearchQuery) ||
      plan.features.some((feature) => feature.toLowerCase().includes(deferredSearchQuery));
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const contactRows = sortContacts(store.contactSubmissions).filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(deferredSearchQuery) ||
      submission.email.toLowerCase().includes(deferredSearchQuery) ||
      submission.message.toLowerCase().includes(deferredSearchQuery);
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentRows =
    activeTab === "blogs"
      ? blogRows
      : activeTab === "testimonials"
        ? testimonialRows
        : activeTab === "pricing"
          ? pricingRows
          : activeTab === "contacts"
            ? contactRows
            : [];

  const totalPages = Math.max(1, Math.ceil(currentRows.length / PAGE_SIZE));
  const paginatedRows = currentRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const statusOptions =
    activeTab === "blogs"
      ? BLOG_STATUS_OPTIONS
      : activeTab === "testimonials"
        ? TESTIMONIAL_STATUS_OPTIONS
        : activeTab === "pricing"
          ? PRICING_STATUS_OPTIONS
          : CONTACT_STATUS_OPTIONS;

  const showManagementControls = activeTab !== "overview";
  const showCreateButton = activeTab === "blogs" || activeTab === "testimonials" || activeTab === "pricing";

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openBlogModal = (blog?: BlogPostRecord) => {
    setFormError("");
    if (blog) {
      setBlogForm({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        tags: blog.tags.join(", "),
        coverImage: blog.coverImage,
        status: blog.status,
      });
      setBlogSlugDirty(true);
    } else {
      setBlogForm(EMPTY_BLOG_FORM);
      setBlogSlugDirty(false);
    }
    setIsBlogModalOpen(true);
  };

  const openTestimonialModal = (testimonial?: TestimonialRecord) => {
    setFormError("");
    if (testimonial) {
      setTestimonialForm({
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        image: testimonial.image,
        content: testimonial.content,
        rating: testimonial.rating,
        status: testimonial.status,
        featured: testimonial.featured,
      });
    } else {
      setTestimonialForm(EMPTY_TESTIMONIAL_FORM);
    }
    setIsTestimonialModalOpen(true);
  };

  const openPricingModal = (plan?: PricingPlanRecord) => {
    setFormError("");
    if (plan) {
      setPricingForm({
        id: plan.id,
        name: plan.name,
        price: String(plan.price),
        billingCycle: plan.billingCycle,
        description: plan.description,
        features: plan.features.length > 0 ? plan.features : [""],
        highlight: plan.highlight,
        status: plan.status,
        ctaLabel: plan.ctaLabel,
        position: String(plan.position),
      });
    } else {
      setPricingForm(EMPTY_PRICING_FORM);
    }
    setIsPricingModalOpen(true);
  };

  const handleUnauthorized = (message: string) => {
    if (message.toLowerCase().includes("unauthorized")) {
      router.push("/admin/login");
      router.refresh();
    }
  };

  const syncNotice = (message: string) => {
    setNotice(message);
    broadcastCmsUpdate();
  };

  const saveBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    try {
      const response = await fetch(
        blogForm.id ? `/api/admin/blogs/${blogForm.id}` : "/api/admin/blogs",
        {
          method: blogForm.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: blogForm.title,
            slug: blogForm.slug,
            content: blogForm.content,
            tags: blogForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
            coverImage: blogForm.coverImage,
            status: blogForm.status,
          }),
        },
      );
      const payload = await parseResponse<{ blog: BlogPostRecord }>(response);

      setStore((currentStore) => ({
        ...currentStore,
        blogs: blogForm.id
          ? currentStore.blogs.map((blog) => (blog.id === payload.blog.id ? payload.blog : blog))
          : [payload.blog, ...currentStore.blogs],
      }));
      setIsBlogModalOpen(false);
      setBlogForm(EMPTY_BLOG_FORM);
      setBlogSlugDirty(false);
      syncNotice(blogForm.id ? "Blog updated." : "Blog created.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save blog.";
      handleUnauthorized(message);
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTestimonial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    try {
      const response = await fetch(
        testimonialForm.id ? `/api/admin/testimonials/${testimonialForm.id}` : "/api/admin/testimonials",
        {
          method: testimonialForm.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testimonialForm),
        },
      );
      const payload = await parseResponse<{ testimonial: TestimonialRecord }>(response);

      setStore((currentStore) => ({
        ...currentStore,
        testimonials: testimonialForm.id
          ? currentStore.testimonials.map((item) =>
              item.id === payload.testimonial.id ? payload.testimonial : item,
            )
          : [payload.testimonial, ...currentStore.testimonials],
      }));
      setIsTestimonialModalOpen(false);
      setTestimonialForm(EMPTY_TESTIMONIAL_FORM);
      syncNotice(testimonialForm.id ? "Testimonial updated." : "Testimonial created.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save testimonial.";
      handleUnauthorized(message);
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const savePricingPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    try {
      const response = await fetch(
        pricingForm.id ? `/api/admin/pricing/${pricingForm.id}` : "/api/admin/pricing",
        {
          method: pricingForm.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...pricingForm,
            price: Number(pricingForm.price),
            position: Number(pricingForm.position),
            features: pricingForm.features.map((feature) => feature.trim()).filter(Boolean),
          }),
        },
      );
      const payload = await parseResponse<{ pricingPlan: PricingPlanRecord }>(response);

      setStore((currentStore) => ({
        ...currentStore,
        pricingPlans: pricingForm.id
          ? currentStore.pricingPlans.map((item) =>
              item.id === payload.pricingPlan.id ? payload.pricingPlan : item,
            )
          : [...currentStore.pricingPlans, payload.pricingPlan],
      }));
      setIsPricingModalOpen(false);
      setPricingForm(EMPTY_PRICING_FORM);
      syncNotice(pricingForm.id ? "Pricing plan updated." : "Pricing plan created.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save pricing plan.";
      handleUnauthorized(message);
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (url: string, onSuccess: () => void, noticeMessage: string) => {
    if (!window.confirm("This action cannot be undone. Continue?")) {
      return;
    }

    try {
      const response = await fetch(url, { method: "DELETE" });
      await parseResponse<{ success: boolean }>(response);
      onSuccess();
      syncNotice(noticeMessage);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete record.";
      handleUnauthorized(message);
      setNotice(message);
    }
  };

  const updateContactStatus = async (id: string, status: "new" | "resolved") => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await parseResponse<{ contactSubmission: ContactSubmissionRecord }>(response);

      setStore((currentStore) => ({
        ...currentStore,
        contactSubmissions: currentStore.contactSubmissions.map((submission) =>
          submission.id === payload.contactSubmission.id ? payload.contactSubmission : submission,
        ),
      }));
      syncNotice(status === "resolved" ? "Query resolved." : "Query reopened.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update query.";
      handleUnauthorized(message);
      setNotice(message);
    }
  };

  const overviewCards = [
    { label: "Published blogs", value: stats.publishedBlogs, accent: "text-neon-blue" },
    { label: "Live testimonials", value: stats.publishedTestimonials, accent: "text-neon-green" },
    { label: "Active pricing plans", value: stats.activePricingPlans, accent: "text-neon-purple" },
    { label: "Open contact queries", value: stats.openQueries, accent: "text-pink-400" },
  ];

  const tabs: Array<{ id: DashboardTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "blogs", label: "Blogs" },
    { id: "testimonials", label: "Testimonials" },
    { id: "pricing", label: "Pricing" },
    { id: "contacts", label: "Contact Queries" },
  ];

  const pageTitle =
    activeTab === "overview"
      ? "Dashboard Overview"
      : activeTab === "blogs"
        ? "Blog Management"
        : activeTab === "testimonials"
          ? "Testimonial Management"
          : activeTab === "pricing"
            ? "Pricing Management"
            : "Contact Form Management";

  const pageDescription =
    activeTab === "overview"
      ? "Track content health, recent activity, and open customer conversations from one place."
      : activeTab === "blogs"
        ? "Create, publish, and maintain SEO-friendly articles without leaving the dashboard."
        : activeTab === "testimonials"
          ? "Manage customer proof, ratings, and visibility on the landing page."
          : activeTab === "pricing"
            ? "Edit plan names, prices, billing cycles, highlights, and feature lists in real time."
            : "Review incoming landing-page submissions, mark them resolved, or remove them.";

  return (
    <div className="min-h-screen bg-background-primary px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neon-blue">Admin Panel</p>
            <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Control landing page content in real time</h1>
            <p className="max-w-3xl text-base text-white/65 sm:text-lg">
              Signed in as {adminEmail}. Manage blogs, testimonials, pricing, and contact submissions without leaving the existing SmartCity AI workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => router.push("/")}>Visit landing page</Button>
            <Button variant="primary" onClick={() => router.push("/blogs")}>View public blogs</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <Card key={card.label} variant="glass" padding="md" className="border border-white/10" hover={false}>
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">{card.label}</p>
              <p className={`mt-3 text-4xl font-bold ${card.accent}`}>{card.value}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setStatusFilter("all");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-neon-blue text-black" : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">{pageTitle}</h2>
              <p className="mt-2 text-sm text-white/60">{pageDescription}</p>
            </div>
            {showCreateButton ? (
              <Button
                variant="primary"
                onClick={() => {
                  if (activeTab === "blogs") openBlogModal();
                  if (activeTab === "testimonials") openTestimonialModal();
                  if (activeTab === "pricing") openPricingModal();
                }}
              >
                <Plus />
                Add {activeTab === "blogs" ? "Blog" : activeTab === "testimonials" ? "Testimonial" : "Plan"}
              </Button>
            ) : null}
          </div>

          {showManagementControls ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <Search className="h-4 w-4 text-white/50" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option} className="bg-background-secondary text-white">
                    {option === "all" ? "All statuses" : option}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card variant="glass" className="border border-white/10" hover={false}>
                <div className="mb-4 flex items-center gap-3"><FileText className="h-5 w-5 text-neon-blue" /><h3 className="text-lg font-semibold text-white">Recent blogs</h3></div>
                <div className="space-y-4">
                  {sortBlogs(store.blogs).slice(0, 3).map((blog) => (
                    <div key={blog.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3"><p className="font-medium text-white">{blog.title}</p><Badge variant={getStatusVariant(blog.status)} size="sm">{blog.status}</Badge></div>
                      <p className="mt-2 text-sm text-white/50">Updated {formatDate(blog.updatedAt)}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card variant="glass" className="border border-white/10" hover={false}>
                <div className="mb-4 flex items-center gap-3"><MessageSquare className="h-5 w-5 text-neon-green" /><h3 className="text-lg font-semibold text-white">Featured testimonials</h3></div>
                <div className="space-y-4">
                  {sortTestimonials(store.testimonials).filter((item) => item.featured).slice(0, 3).map((testimonial) => (
                    <div key={testimonial.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3"><p className="font-medium text-white">{testimonial.name}</p><span className="text-sm text-amber-300">{testimonial.rating.toFixed(1)}/5</span></div>
                      <p className="mt-2 text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card variant="glass" className="border border-white/10" hover={false}>
                <div className="mb-4 flex items-center gap-3"><Mail className="h-5 w-5 text-neon-purple" /><h3 className="text-lg font-semibold text-white">Open queries</h3></div>
                <div className="space-y-4">
                  {sortContacts(store.contactSubmissions).filter((item) => item.status === "new").slice(0, 3).map((submission) => (
                    <div key={submission.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3"><p className="font-medium text-white">{submission.name}</p><Badge variant="warning" size="sm">new</Badge></div>
                      <p className="mt-2 text-sm text-white/60">{submission.organization || submission.email}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-white/45">{submission.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}

          {activeTab === "blogs" ? (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10"><thead className="bg-black/30 text-left text-xs uppercase tracking-[0.25em] text-white/45"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Tags</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5 text-sm text-white/80">
                {paginatedRows.map((row) => { const blog = row as BlogPostRecord; return <tr key={blog.id}><td className="px-4 py-4 align-top"><p className="font-medium text-white">{blog.title}</p><p className="mt-1 text-xs text-white/45">/{blog.slug}</p></td><td className="px-4 py-4 align-top"><Badge variant={getStatusVariant(blog.status)} size="sm">{blog.status}</Badge></td><td className="px-4 py-4 align-top text-white/55">{blog.tags.join(", ")}</td><td className="px-4 py-4 align-top text-white/55">{formatDate(blog.updatedAt)}</td><td className="px-4 py-4 align-top"><div className="flex justify-end gap-2"><button type="button" className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-neon-blue/40 hover:text-neon-blue" onClick={() => openBlogModal(blog)}><Pencil className="h-4 w-4" /></button><button type="button" className="rounded-full border border-red-500/20 p-2 text-red-300 transition hover:border-red-500/40 hover:text-red-200" onClick={() => void deleteItem(`/api/admin/blogs/${blog.id}`, () => setStore((currentStore) => ({ ...currentStore, blogs: currentStore.blogs.filter((item) => item.id !== blog.id) })), "Blog deleted.")}><Trash2 className="h-4 w-4" /></button></div></td></tr>; })}
              </tbody></table>
            </div>
          ) : null}

          {activeTab === "testimonials" ? (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10"><thead className="bg-black/30 text-left text-xs uppercase tracking-[0.25em] text-white/45"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5 text-sm text-white/80">
                {paginatedRows.map((row) => { const testimonial = row as TestimonialRecord; return <tr key={testimonial.id}><td className="px-4 py-4 align-top"><div className="flex items-center gap-3"><img src={testimonial.image} alt={testimonial.name} className="h-10 w-10 rounded-full object-cover" /><div><p className="font-medium text-white">{testimonial.name}</p>{testimonial.featured ? <p className="text-xs uppercase tracking-[0.2em] text-neon-blue">Featured</p> : null}</div></div></td><td className="px-4 py-4 align-top text-white/55">{testimonial.role}</td><td className="px-4 py-4 align-top text-amber-300">{testimonial.rating.toFixed(1)}/5</td><td className="px-4 py-4 align-top"><Badge variant={getStatusVariant(testimonial.status)} size="sm">{testimonial.status}</Badge></td><td className="px-4 py-4 align-top"><div className="flex justify-end gap-2"><button type="button" className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-neon-blue/40 hover:text-neon-blue" onClick={() => openTestimonialModal(testimonial)}><Pencil className="h-4 w-4" /></button><button type="button" className="rounded-full border border-red-500/20 p-2 text-red-300 transition hover:border-red-500/40 hover:text-red-200" onClick={() => void deleteItem(`/api/admin/testimonials/${testimonial.id}`, () => setStore((currentStore) => ({ ...currentStore, testimonials: currentStore.testimonials.filter((item) => item.id !== testimonial.id) })), "Testimonial deleted.")}><Trash2 className="h-4 w-4" /></button></div></td></tr>; })}
              </tbody></table>
            </div>
          ) : null}

          {activeTab === "pricing" ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {paginatedRows.map((row) => { const plan = row as PricingPlanRecord; return <Card key={plan.id} variant="glass" className="border border-white/10" hover={false}><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-3"><h3 className="text-xl font-semibold text-white">{plan.name}</h3><Badge variant={getStatusVariant(plan.status)} size="sm">{plan.status}</Badge></div><p className="mt-2 text-sm text-white/60">{plan.description}</p><p className="mt-3 text-2xl font-bold text-neon-blue">${plan.price}/{plan.billingCycle}</p></div><div className="flex gap-2"><button type="button" className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-neon-blue/40 hover:text-neon-blue" onClick={() => openPricingModal(plan)}><Pencil className="h-4 w-4" /></button><button type="button" className="rounded-full border border-red-500/20 p-2 text-red-300 transition hover:border-red-500/40 hover:text-red-200" onClick={() => void deleteItem(`/api/admin/pricing/${plan.id}`, () => setStore((currentStore) => ({ ...currentStore, pricingPlans: currentStore.pricingPlans.filter((item) => item.id !== plan.id) })), "Pricing plan deleted.")}><Trash2 className="h-4 w-4" /></button></div></div><ul className="mt-5 space-y-2 text-sm text-white/70">{plan.features.map((feature) => <li key={`${plan.id}-${feature}`}>• {feature}</li>)}</ul></Card>; })}
            </div>
          ) : null}

          {activeTab === "contacts" ? (
            <div className="space-y-4">
              {paginatedRows.map((row) => { const submission = row as ContactSubmissionRecord; return <Card key={submission.id} variant="glass" className="border border-white/10" hover={false}><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="space-y-3"><div className="flex flex-wrap items-center gap-3"><h3 className="text-lg font-semibold text-white">{submission.name}</h3><Badge variant={getStatusVariant(submission.status)} size="sm">{submission.status}</Badge></div><div className="text-sm text-white/60">{submission.email}{submission.organization ? ` • ${submission.organization}` : ""}</div><p className="max-w-3xl text-sm leading-7 text-white/75">{submission.message}</p><p className="text-xs uppercase tracking-[0.2em] text-white/35">Received {formatDate(submission.createdAt)}</p></div><div className="flex gap-2"><button type="button" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-neon-blue/40 hover:text-neon-blue" onClick={() => void updateContactStatus(submission.id, submission.status === "resolved" ? "new" : "resolved")}>{submission.status === "resolved" ? "Mark new" : "Resolve"}</button><button type="button" className="rounded-full border border-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:border-red-500/40 hover:text-red-200" onClick={() => void deleteItem(`/api/admin/contacts/${submission.id}`, () => setStore((currentStore) => ({ ...currentStore, contactSubmissions: currentStore.contactSubmissions.filter((item) => item.id !== submission.id) })), "Contact query deleted.")}>Delete</button></div></div></Card>; })}
            </div>
          ) : null}

          {showManagementControls && currentRows.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center text-white/45">No records match the current search and filter.</div> : null}
          {showManagementControls && currentRows.length > PAGE_SIZE ? <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/55"><span>Page {currentPage} of {totalPages}</span><div className="flex gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded-full border border-white/10 px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="rounded-full border border-white/10 px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div> : null}
        </div>
      </div>

      <BlogEditorModal form={blogForm} formError={formError} isOpen={isBlogModalOpen} isSaving={isSaving} slugDirty={blogSlugDirty} onClose={() => setIsBlogModalOpen(false)} onSetSlugDirty={setBlogSlugDirty} onSubmit={saveBlog} onChange={setBlogForm} />
      <TestimonialEditorModal form={testimonialForm} formError={formError} isOpen={isTestimonialModalOpen} isSaving={isSaving} onClose={() => setIsTestimonialModalOpen(false)} onSubmit={saveTestimonial} onChange={setTestimonialForm} />
      <PricingEditorModal form={pricingForm} formError={formError} isOpen={isPricingModalOpen} isSaving={isSaving} onClose={() => setIsPricingModalOpen(false)} onSubmit={savePricingPlan} onChange={setPricingForm} />

      <AnimatePresence>
        {notice ? <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed bottom-6 right-6 z-50 rounded-2xl border border-neon-blue/30 bg-black/85 px-5 py-3 text-sm text-white shadow-[0_0_24px_rgba(0,217,255,0.18)]">{notice}</motion.div> : null}
      </AnimatePresence>
    </div>
  );
}


