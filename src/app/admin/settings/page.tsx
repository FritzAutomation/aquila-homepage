"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Clock,
  Save,
  Loader2,
  CheckCircle,
  Mail,
  Bell,
} from "lucide-react";

interface SLAConfig {
  id: string;
  priority: string;
  first_response_hours: number;
  resolution_hours: number;
}

export default function SettingsPage() {
  const [slaConfigs, setSlaConfigs] = useState<SLAConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Email settings (demo - not persisted)
  const [emailSettings, setEmailSettings] = useState({
    notification_email: "support@the-aquila-group.com",
    auto_reply: true,
    include_ticket_id: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.sla_config) {
          setSlaConfigs(data.sla_config);
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSLA() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sla_config: slaConfigs }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  }

  const updateSLA = (priority: string, field: string, value: number) => {
    setSlaConfigs((prev) =>
      prev.map((config) =>
        config.priority === priority ? { ...config, [field]: value } : config
      )
    );
  };

  const priorityLabels: Record<string, { label: string; color: string }> = {
    low: { label: "Low Priority", color: "text-gray-600" },
    normal: { label: "Normal Priority", color: "text-blue-600" },
    high: { label: "High Priority", color: "text-orange-600" },
    urgent: { label: "Urgent Priority", color: "text-red-600" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* SLA Configuration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-navy" />
            <div>
              <h2 className="font-semibold text-gray-900">SLA Configuration</h2>
              <p className="text-sm text-gray-600">
                Set response and resolution time targets by priority
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveSLA}
            disabled={saving}
            className="px-4 py-2 bg-emerald text-white font-medium rounded-lg hover:bg-emerald/90 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="space-y-4">
          {["urgent", "high", "normal", "low"].map((priority) => {
            const config = slaConfigs.find((c) => c.priority === priority);
            const { label, color } = priorityLabels[priority];
            return (
              <div
                key={priority}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className={`font-medium ${color}`}>{label}</span>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    First Response (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config?.first_response_hours || 24}
                    onChange={(e) =>
                      updateSLA(priority, "first_response_hours", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    Resolution (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config?.resolution_hours || 72}
                    onChange={(e) =>
                      updateSLA(priority, "resolution_hours", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-navy" />
          <div>
            <h2 className="font-semibold text-gray-900">Email Settings</h2>
            <p className="text-sm text-gray-600">
              Configure email notifications and auto-replies
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Support Email Address
            </label>
            <input
              type="email"
              value={emailSettings.notification_email}
              onChange={(e) =>
                setEmailSettings({ ...emailSettings, notification_email: e.target.value })
              }
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
            />
            <p className="text-xs text-gray-600 mt-1">
              Customers will see this as the reply-to address
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="auto_reply"
              checked={emailSettings.auto_reply}
              onChange={(e) =>
                setEmailSettings({ ...emailSettings, auto_reply: e.target.checked })
              }
              className="w-4 h-4 text-emerald border-gray-300 rounded focus:ring-emerald"
            />
            <label htmlFor="auto_reply" className="text-sm text-gray-700">
              Send automatic confirmation when tickets are created
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="include_ticket_id"
              checked={emailSettings.include_ticket_id}
              onChange={(e) =>
                setEmailSettings({ ...emailSettings, include_ticket_id: e.target.checked })
              }
              className="w-4 h-4 text-emerald border-gray-300 rounded focus:ring-emerald"
            />
            <label htmlFor="include_ticket_id" className="text-sm text-gray-700">
              Include ticket ID in email subject lines
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-navy" />
          <div>
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">
              Configure when to receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { id: "new_ticket", label: "New ticket submitted", checked: true },
            { id: "customer_reply", label: "Customer replies to ticket", checked: true },
            { id: "sla_warning", label: "SLA deadline approaching", checked: true },
            { id: "sla_breach", label: "SLA deadline breached", checked: true },
          ].map((notification) => (
            <div key={notification.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={notification.id}
                defaultChecked={notification.checked}
                className="w-4 h-4 text-emerald border-gray-300 rounded focus:ring-emerald"
              />
              <label htmlFor={notification.id} className="text-sm text-gray-700">
                {notification.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-800">System Information</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Version</p>
            <p className="font-medium text-gray-900">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-600">Environment</p>
            <p className="font-medium text-gray-900">Development</p>
          </div>
          <div>
            <p className="text-gray-600">Database</p>
            <p className="font-medium text-gray-900">Supabase</p>
          </div>
          <div>
            <p className="text-gray-600">Email Provider</p>
            <p className="font-medium text-gray-900">Resend</p>
          </div>
        </div>
      </div>
    </div>
  );
}
