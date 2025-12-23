"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Send,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Mail,
  User,
  Phone,
  Building2,
  MessageSquare,
  HelpCircle,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import {
  PRODUCT_LABELS,
  ISSUE_TYPE_LABELS,
  type Product,
  type IssueType,
} from "@/lib/types";

interface FormData {
  email: string;
  name: string;
  phone: string;
  company: string;
  product: Product | "";
  issue_type: IssueType | "";
  subject: string;
  message: string;
}

interface SubmitResult {
  success: boolean;
  ticket_id?: string;
  ticket_number?: number;
}

interface FileAttachment {
  file: File;
  preview?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function SupportPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    phone: "",
    company: "",
    product: "",
    issue_type: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const maxFiles = 5;
    const remainingSlots = maxFiles - files.length;

    const newFiles = selectedFiles.slice(0, remainingSlots).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Create the ticket first
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit ticket");
        return;
      }

      // Upload attachments if any
      if (files.length > 0) {
        for (const fileData of files) {
          const uploadFormData = new window.FormData();
          uploadFormData.append("file", fileData.file);
          uploadFormData.append("ticket_id", data.ticket.id);

          try {
            await fetch("/api/upload", {
              method: "POST",
              body: uploadFormData,
            });
          } catch (uploadError) {
            console.error("Failed to upload file:", uploadError);
            // Continue with other files even if one fails
          }
        }
      }

      setResult({
        success: true,
        ticket_id: data.ticket.ticket_id,
        ticket_number: data.ticket.ticket_number,
      });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (result?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ticket Submitted!
            </h2>
            <p className="text-gray-600 mb-4">
              Your ticket <strong className="text-navy">{result.ticket_id}</strong> has been created.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We&apos;ve sent a confirmation email to <strong>{formData.email}</strong>.
              Our team will respond within 24 hours.
            </p>
            <div className="space-y-3">
              <Link
                href="/support/status"
                className="block w-full py-2.5 px-4 bg-navy text-white font-medium rounded-lg hover:bg-navy-dark transition-colors"
              >
                Check Ticket Status
              </Link>
              <Link
                href="/"
                className="block w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to website
          </Link>
          <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
          <p className="text-gray-600 mt-2">
            Submit a support request and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Manufacturing"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Issue Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
                  >
                    <option value="">Select a product...</option>
                    {Object.entries(PRODUCT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="issue_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="issue_type"
                    name="issue_type"
                    value={formData.issue_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
                  >
                    <option value="">Select issue type...</option>
                    {Object.entries(ISSUE_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you expected to happen."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none resize-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments (optional)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    files.length >= 5
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 hover:border-emerald hover:bg-emerald/5"
                  }`}
                  onClick={() => files.length < 5 && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={files.length >= 5}
                  />
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {files.length >= 5
                      ? "Maximum 5 files reached"
                      : "Click to upload screenshots or documents"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Images, PDF, Word, Excel up to 10MB each
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((fileData, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg"
                      >
                        {fileData.preview ? (
                          <img
                            src={fileData.preview}
                            alt={fileData.file.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            {fileData.file.type.startsWith("image/") ? (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                              <FileText className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {fileData.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(fileData.file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-emerald text-white font-medium rounded-lg hover:bg-emerald/90 focus:ring-2 focus:ring-emerald focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Support Request
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              By submitting, you agree to our{" "}
              <Link href="/privacy" className="text-emerald hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        {/* Help Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need immediate assistance?</p>
          <p className="text-sm text-gray-500">
            Call us at{" "}
            <a href="tel:+18005551234" className="text-emerald font-medium hover:underline">
              1-800-555-1234
            </a>{" "}
            or email{" "}
            <a href="mailto:support@the-aquila-group.com" className="text-emerald font-medium hover:underline">
              support@the-aquila-group.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
