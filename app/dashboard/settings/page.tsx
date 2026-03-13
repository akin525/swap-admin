"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { adminApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Save, Plus, Trash2, Eye, EyeOff, UserPlus } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

import type { Admin } from "@/types";

type TabKey = 'profile' | 'team' | 'password';

export default function SettingsPage() {
  const { token, user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile
  const [profile, setProfile] = useState<Partial<Admin>>({});
  // Team
  const [team, setTeam] = useState<Admin[]>([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Partial<Admin & { password?: string }>>({});
  // Password
  const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [profileRes, teamRes] = await Promise.all([
        adminApi.getProfile(token),
        adminApi.getTeam(token),
      ]);
      if (profileRes.success) setProfile(profileRes.data);
      if (teamRes.success) setTeam(teamRes.data || []);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Profile Handlers ──
  const handleSaveProfile = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await adminApi.updateProfile(token, profile);
      if (res.success) {
        toast.success("Profile updated successfully");
        // Update auth context with new data
        if (res.data && token) {
          login(token, res.data);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ── Password Handlers ──
  const handleChangePassword = async () => {
    if (!token) return;
    if (passwords.password !== passwords.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await adminApi.changePassword(token, passwords);
      toast.success("Password changed successfully");
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // ── Team Handlers ──
  const handleSaveAdmin = async () => {
    if (!token) return;
    setSaving(true);
    try {
      if (editAdmin.id) {
        await adminApi.updateAdmin(token, editAdmin.id, editAdmin);
      } else {
        await adminApi.createAdmin(token, editAdmin);
      }
      toast.success("Admin saved successfully");
      setShowTeamModal(false);
      setEditAdmin({});
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save admin");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!token || !confirm("Delete this admin?")) return;
    try {
      await adminApi.deleteAdmin(token, id);
      toast.success("Admin deleted");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete admin");
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'team', label: 'Team Management' },
    { key: 'password', label: 'Change Password' },
  ];

  if (loading) return <LoadingSkeleton type="page" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader title="Settings" description="Manage your profile, team, and security settings." />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-100 dark:border-gray-800 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.key ? 'border-[#7C5CFF] text-[#7C5CFF]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] p-6 space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" value={profile.name || ''} onChange={(v) => setProfile(p => ({ ...p, name: v }))} />
            <FormField label="Username" value={profile.username || ''} onChange={(v) => setProfile(p => ({ ...p, username: v }))} />
            <FormField label="Email" value={profile.email || ''} onChange={(v) => setProfile(p => ({ ...p, email: v }))} />
            <FormField label="Phone" value={profile.phone || ''} onChange={(v) => setProfile(p => ({ ...p, phone: v }))} />
            <FormField label="Address" value={profile.address || ''} onChange={(v) => setProfile(p => ({ ...p, address: v }))} />
            <FormField label="City" value={profile.city || ''} onChange={(v) => setProfile(p => ({ ...p, city: v }))} />
            <FormField label="State" value={profile.state || ''} onChange={(v) => setProfile(p => ({ ...p, state: v }))} />
            <FormField label="Role" value={profile.role || ''} onChange={(v) => setProfile(p => ({ ...p, role: v }))} disabled />
          </div>
          <button onClick={handleSaveProfile} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditAdmin({}); setShowTeamModal(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all">
              <UserPlus size={16} /> Add Admin
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((admin) => (
              <div key={admin.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#0E0627] text-sm font-bold text-white">
                      {admin.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{admin.name}</p>
                      <p className="text-[10px] text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={admin.status ? 'active' : 'inactive'} />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
                  <div><p className="text-[10px] text-gray-400">Username</p><p className="text-xs font-semibold text-gray-700 dark:text-gray-300">@{admin.username}</p></div>
                  <div><p className="text-[10px] text-gray-400">Role</p><p className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">{admin.role}</p></div>
                  {admin.phone && <div><p className="text-[10px] text-gray-400">Phone</p><p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{admin.phone}</p></div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditAdmin(admin); setShowTeamModal(true); }} className="flex-1 text-center py-2 text-xs font-bold text-[#7C5CFF] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
                    Edit
                  </button>
                  {admin.id !== user?.id && (
                    <button onClick={() => handleDeleteAdmin(admin.id)} className="flex-1 text-center py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Modal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} title={editAdmin.id ? 'Edit Admin' : 'Add Admin'}>
            <div className="space-y-4">
              <FormField label="Full Name" value={editAdmin.name || ''} onChange={(v) => setEditAdmin(p => ({ ...p, name: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Username" value={editAdmin.username || ''} onChange={(v) => setEditAdmin(p => ({ ...p, username: v }))} />
                <FormField label="Email" value={editAdmin.email || ''} onChange={(v) => setEditAdmin(p => ({ ...p, email: v }))} />
              </div>
              <FormField label="Phone" value={editAdmin.phone || ''} onChange={(v) => setEditAdmin(p => ({ ...p, phone: v }))} />
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Role</label>
                <select value={editAdmin.role || ''} onChange={(e) => setEditAdmin(p => ({ ...p, role: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm">
                  <option value="">Select role</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="support">Support</option>
                </select>
              </div>
              {!editAdmin.id && (
                <FormField label="Password" value={(editAdmin as any).password || ''} onChange={(v) => setEditAdmin(p => ({ ...p, password: v }))} type="password" />
              )}
              <button onClick={handleSaveAdmin} disabled={saving} className="px-6 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Admin'}
              </button>
            </div>
          </Modal>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] p-6 space-y-6 max-w-md">
          <PasswordField
            label="Current Password"
            value={passwords.current_password}
            onChange={(v) => setPasswords(p => ({ ...p, current_password: v }))}
            show={showPasswords.current}
            onToggle={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
          />
          <PasswordField
            label="New Password"
            value={passwords.password}
            onChange={(v) => setPasswords(p => ({ ...p, password: v }))}
            show={showPasswords.new}
            onToggle={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
          />
          <PasswordField
            label="Confirm New Password"
            value={passwords.password_confirmation}
            onChange={(v) => setPasswords(p => ({ ...p, password_confirmation: v }))}
            show={showPasswords.confirm}
            onToggle={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
          />
          {passwords.password && passwords.password_confirmation && passwords.password !== passwords.password_confirmation && (
            <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
          )}
          <button onClick={handleChangePassword} disabled={saving || !passwords.current_password || !passwords.password || passwords.password !== passwords.password_confirmation} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
            <Save size={16} /> {saving ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, disabled, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm text-gray-900 dark:text-white focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm text-gray-900 dark:text-white focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] outline-none"
        />
        <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}