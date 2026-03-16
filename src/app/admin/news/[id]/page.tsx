"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  ImagePlus,
  Video,
  Paperclip,
  Trash2,
  Download,
  FileText,
  Star,
} from "lucide-react";

interface Attachment {
  filename: string;
  url: string;
  mime_type: string;
  size: number;
}

const CATEGORIES = [
  { value: "case-study", label: "Case Study" },
  { value: "partnership", label: "Partnership" },
  { value: "industry-news", label: "Industry News" },
  { value: "news", label: "News" },
  { value: "announcement", label: "Announcement" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function NewsEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("news");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [slug, setSlug] = useState("");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const uploadFile = async (file: File): Promise<{ url: string; filename: string; mime_type: string; size: number } | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("context", "kb");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Upload failed"); return null; }
    const url = data.attachment?.url;
    if (!url) return null;
    return { url, filename: file.name, mime_type: file.type, size: file.size };
  };

  const insertAtCursor = (markdown: string) => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = content.substring(0, start);
      const after = content.substring(end);
      const newContent = before + (before.endsWith("\n") || before === "" ? "" : "\n\n") + markdown + "\n\n" + after;
      setContent(newContent);
      setTimeout(() => { textarea.focus(); const pos = newContent.length - after.length; textarea.setSelectionRange(pos, pos); }, 0);
    } else {
      setContent((prev) => prev + "\n\n" + markdown + "\n");
    }
  };

  const handleMediaUpload = async (type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/mp4,video/webm,video/quicktime";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const result = await uploadFile(file);
        if (!result) return;
        const markdown = type === "image" ? `![${file.name}](${result.url})` : `<video src="${result.url}" controls width="100%"></video>`;
        insertAtCursor(markdown);
      } catch { setError("Upload failed"); } finally { setUploading(false); }
    };
    input.click();
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        setUploading(true);
        try {
          const name = `screenshot-${Date.now()}.png`;
          const renamedFile = new File([file], name, { type: file.type });
          const result = await uploadFile(renamedFile);
          if (!result) return;
          insertAtCursor(`![${name}](${result.url})`);
        } catch { setError("Failed to upload pasted image"); } finally { setUploading(false); }
        return;
      }
    }
  };

  const handleAttachmentUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          const result = await uploadFile(file);
          if (result) {
            setAttachments((prev) => [...prev, { filename: result.filename, url: result.url, mime_type: result.mime_type, size: result.size }]);
          }
        }
      } catch { setError("Failed to upload attachment"); } finally { setUploading(false); }
    };
    input.click();
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchArticle = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/${id}`);
      if (!res.ok) { setError("Article not found"); return; }
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setExcerpt(data.excerpt || "");
      setCategory(data.category);
      setIsFeatured(data.is_featured);
      setIsPublished(data.is_published);
      setSortOrder(data.sort_order);
      setSlug(data.slug);
      setPublishedAt(data.published_at);
      setCoverImageUrl(data.cover_image_url || "");
      setCtaText(data.cta_text || "");
      setCtaUrl(data.cta_url || "");
      setAttachments(data.attachments || []);
    } catch { setError("Failed to load article"); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    if (!isNew) fetchArticle();
  }, [id, isNew, fetchArticle]);

  const handleSave = async (publish?: boolean) => {
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    const publishState = publish !== undefined ? publish : isPublished;

    const body = {
      title: title.trim(),
      content,
      excerpt: excerpt.trim() || null,
      category,
      is_featured: isFeatured,
      is_published: publishState,
      sort_order: sortOrder,
      cover_image_url: coverImageUrl.trim() || null,
      cta_text: ctaText.trim() || null,
      cta_url: ctaUrl.trim() || null,
      attachments,
    };

    try {
      const res = await fetch(isNew ? "/api/news" : `/api/news/${id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save article"); return; }
      if (publish !== undefined) setIsPublished(publishState);
      if (isNew) {
        router.push(`/admin/news/${data.id}`);
      } else {
        setSlug(data.slug);
        setPublishedAt(data.published_at);
        setSuccess("Article saved successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch { setError("An unexpected error occurred"); } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/news" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? "New News Article" : "Edit News Article"}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && slug && (
            <Link href={`/news/${slug}`} target="_blank" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
              Preview
            </Link>
          )}
          {!isNew && (
            <button onClick={() => handleSave(!isPublished)} disabled={saving} className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isPublished ? "text-yellow-700 bg-yellow-50 hover:bg-yellow-100" : "text-green-700 bg-green-50 hover:bg-green-100"}`}>
              {isPublished ? (<><EyeOff className="w-4 h-4" />Unpublish</>) : (<><Eye className="w-4 h-4" />Publish</>)}
            </button>
          )}
          <button onClick={() => handleSave()} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald text-white font-medium text-sm rounded-lg hover:bg-emerald/90 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? "Create Article" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt <span className="font-normal text-gray-500 ml-1">(shown in listings)</span>
            </label>
            <textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A brief summary of this article..." rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none resize-none" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content <span className="font-normal text-gray-500 ml-1">(Markdown — paste screenshots directly)</span>
              </label>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => handleMediaUpload("image")} disabled={uploading} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" title="Insert image">
                  <ImagePlus className="w-4 h-4" />Image
                </button>
                <button type="button" onClick={() => handleMediaUpload("video")} disabled={uploading} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" title="Insert video">
                  <Video className="w-4 h-4" />Video
                </button>
                {uploading && <Loader2 className="w-4 h-4 animate-spin text-emerald ml-1" />}
              </div>
            </div>
            <textarea ref={contentRef} id="content" value={content} onChange={(e) => setContent(e.target.value)} onPaste={handlePaste} placeholder="Write your article content here using Markdown..." rows={20} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-mono text-sm focus:ring-2 focus:ring-emerald focus:border-emerald outline-none resize-y" />
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Downloadable Attachments <span className="font-normal text-gray-500 ml-1">(optional)</span>
              </label>
              <button type="button" onClick={handleAttachmentUpload} disabled={uploading} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                <Paperclip className="w-4 h-4" />Add File
              </button>
            </div>
            {attachments.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                <Paperclip className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No attachments yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {attachments.map((att, index) => (
                  <div key={index} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{att.filename}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(att.size)}</p>
                    </div>
                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </a>
                    <button type="button" onClick={() => removeAttachment(index)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">State</span>
                <span className={`font-medium ${isPublished ? "text-green-600" : "text-gray-600"}`}>
                  {isPublished ? "Published" : "Draft"}
                </span>
              </div>
              {publishedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Published</span>
                  <span className="text-gray-900">{new Date(publishedAt).toLocaleDateString()}</span>
                </div>
              )}
              {slug && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Slug</span>
                  <span className="text-gray-900 font-mono text-xs">{slug}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label htmlFor="category" className="block font-medium text-gray-900 mb-2">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none">
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
              <Star className={`w-4 h-4 ${isFeatured ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
              <span className="text-sm font-medium text-gray-700">Featured Article</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">Only one article can be featured at a time</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Call to Action</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="ctaText" className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                <input type="text" id="ctaText" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g., Request a Demo" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none" />
              </div>
              <div>
                <label htmlFor="ctaUrl" className="block text-xs font-medium text-gray-600 mb-1">Button Link</label>
                <input type="text" id="ctaUrl" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="e.g., /contact" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label htmlFor="sortOrder" className="block font-medium text-gray-900 mb-2">Sort Order</label>
            <input type="number" id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none" />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>
        </div>
      </div>
    </div>
  );
}
