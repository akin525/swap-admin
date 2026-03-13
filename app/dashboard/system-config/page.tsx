"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { settingsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Save, Plus, Trash2, Settings2, DollarSign, ArrowLeftRight, Globe } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";

import type { BasicSettings, SystemFee, CurrencyPair, ExchangeRate } from "@/types";

type TabKey = 'general' | 'fees' | 'currency_pairs' | 'exchange_rates';

export default function SystemConfigPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General settings
  const [settings, setSettings] = useState<BasicSettings | null>(null);
  // Fees
  const [fees, setFees] = useState<SystemFee[]>([]);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editFee, setEditFee] = useState<Partial<SystemFee>>({});
  // Currency pairs
  const [pairs, setPairs] = useState<CurrencyPair[]>([]);
  const [showPairModal, setShowPairModal] = useState(false);
  const [editPair, setEditPair] = useState<Partial<CurrencyPair>>({});
  // Exchange rates
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [settingsRes, feesRes, pairsRes, ratesRes] = await Promise.all([
        settingsApi.getBasic(token),
        settingsApi.getFees(token),
        settingsApi.getCurrencyPairs(token),
        settingsApi.getExchangeRates(token),
      ]);
      if (settingsRes.success) setSettings(settingsRes.data);
      if (feesRes.success) setFees(feesRes.data || []);
      if (pairsRes.success) setPairs(pairsRes.data || []);
      if (ratesRes.success) setRates(ratesRes.data || []);
    } catch (err) {
      toast.error("Failed to load system configuration");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── General Settings Handlers ──
  const handleSaveSettings = async () => {
    if (!token || !settings) return;
    setSaving(true);
    try {
      await settingsApi.updateBasic(token, settings);
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof BasicSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  // ── Fee Handlers ──
  const handleSaveFee = async () => {
    if (!token) return;
    setSaving(true);
    try {
      if (editFee.id) {
        await settingsApi.updateFee(token, editFee.id, editFee);
      } else {
        await settingsApi.createFee(token, editFee);
      }
      toast.success("Fee saved");
      setShowFeeModal(false);
      setEditFee({});
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save fee");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFee = async (id: number) => {
    if (!token || !confirm("Delete this fee?")) return;
    try {
      await settingsApi.deleteFee(token, id);
      toast.success("Fee deleted");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete fee");
    }
  };

  // ── Currency Pair Handlers ──
  const handleSavePair = async () => {
    if (!token) return;
    setSaving(true);
    try {
      if (editPair.id) {
        await settingsApi.updateCurrencyPair(token, editPair.id, editPair);
      } else {
        await settingsApi.createCurrencyPair(token, editPair);
      }
      toast.success("Currency pair saved");
      setShowPairModal(false);
      setEditPair({});
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save currency pair");
    } finally {
      setSaving(false);
    }
  };

  // ── Exchange Rate Handlers ──
  const handleUpdateRate = async (rate: ExchangeRate, newRate: string) => {
    if (!token) return;
    try {
      await settingsApi.updateExchangeRate(token, rate.id, { rate: newRate });
      toast.success("Exchange rate updated");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update rate");
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'general', label: 'General', icon: <Settings2 size={14} /> },
    { key: 'fees', label: 'System Fees', icon: <DollarSign size={14} /> },
    { key: 'currency_pairs', label: 'Currency Pairs', icon: <ArrowLeftRight size={14} /> },
    { key: 'exchange_rates', label: 'Exchange Rates', icon: <Globe size={14} /> },
  ];

  if (loading) return <LoadingSkeleton type="page" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader title="System Configuration" description="Manage platform settings, fees, and exchange rates." />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-100 dark:border-gray-800 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-[#7C5CFF] text-[#7C5CFF]'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && settings && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] p-6 space-y-8">
          {/* Site Info */}
          <Section title="Site Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Site Name" value={settings.sitename} onChange={(v) => updateSetting('sitename', v)} />
              <FormField label="Email" value={settings.email || ''} onChange={(v) => updateSetting('email', v)} />
              <FormField label="Phone" value={settings.phone || ''} onChange={(v) => updateSetting('phone', v)} />
              <FormField label="Address" value={settings.address || ''} onChange={(v) => updateSetting('address', v)} />
            </div>
            <div className="mt-4">
              <FormField label="Description" value={settings.description || ''} onChange={(v) => updateSetting('description', v)} multiline />
            </div>
            <div className="mt-4">
              <FormField label="Keywords" value={settings.keywords || ''} onChange={(v) => updateSetting('keywords', v)} placeholder="comma, separated, keywords" />
            </div>
          </Section>

          {/* Feature Toggles */}
          <Section title="Feature Toggles">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ToggleField label="Registration" description="Allow new user registration" enabled={!!settings.registration} onToggle={() => updateSetting('registration', settings.registration ? 0 : 1)} />
              <ToggleField label="Login" description="Allow user login" enabled={!!settings.login} onToggle={() => updateSetting('login', settings.login ? 0 : 1)} />
              <ToggleField label="Maintenance Mode" description="Put site in maintenance" enabled={!!settings.maintain} onToggle={() => updateSetting('maintain', settings.maintain ? 0 : 1)} />
              <ToggleField label="Email Verification" description="Require email verification" enabled={!!settings.email_verification} onToggle={() => updateSetting('email_verification', settings.email_verification ? 0 : 1)} />
              <ToggleField label="Email Notifications" description="Send email notifications" enabled={!!settings.email_notification} onToggle={() => updateSetting('email_notification', settings.email_notification ? 0 : 1)} />
              <ToggleField label="Telegram Notifications" description="Send Telegram notifications" enabled={!!settings.telegram_notification} onToggle={() => updateSetting('telegram_notification', settings.telegram_notification ? 0 : 1)} />
            </div>
          </Section>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={handleSaveSettings} disabled={saving} className="px-6 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
              <span className="flex items-center gap-2"><Save size={16} />{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditFee({}); setShowFeeModal(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all">
              <Plus size={16} /> Add Fee
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Currency</th>
                  <th className="px-6 py-4">Fee</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Cap</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">{fee.currency}</span></td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{fee.fee}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 capitalize">{fee.fee_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{fee.fee_cap}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setEditFee(fee); setShowFeeModal(true); }} className="px-3 py-1.5 text-[10px] font-bold text-[#7C5CFF] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all">Edit</button>
                        <button onClick={() => handleDeleteFee(fee.id)} className="px-3 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No system fees configured.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal isOpen={showFeeModal} onClose={() => setShowFeeModal(false)} title={editFee.id ? 'Edit Fee' : 'Add Fee'}>
            <div className="space-y-4">
              <FormField label="Currency" value={editFee.currency || ''} onChange={(v) => setEditFee(p => ({ ...p, currency: v }))} placeholder="NGN" />
              <FormField label="Fee" value={editFee.fee || ''} onChange={(v) => setEditFee(p => ({ ...p, fee: v }))} placeholder="0.00" />
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Fee Type</label>
                <select
                  value={editFee.fee_type || ''}
                  onChange={(e) => setEditFee(p => ({ ...p, fee_type: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm"
                >
                  <option value="">Select type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <FormField label="Fee Cap" value={editFee.fee_cap || ''} onChange={(v) => setEditFee(p => ({ ...p, fee_cap: v }))} placeholder="0.00" />
              <button onClick={handleSaveFee} disabled={saving} className="px-6 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Fee'}
              </button>
            </div>
          </Modal>
        </div>
      )}

      {activeTab === 'currency_pairs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditPair({}); setShowPairModal(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all">
              <Plus size={16} /> Add Pair
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pairs.map((pair) => (
              <div key={pair.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{pair.from}</span>
                    <ArrowLeftRight size={16} className="text-gray-400" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{pair.to}</span>
                  </div>
                  <StatusBadge status={pair.status ? 'active' : 'inactive'} />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                  <div><p className="text-[10px] text-gray-400">Rate</p><p className="text-sm font-bold text-gray-900 dark:text-white">{pair.rate}</p></div>
                  <div><p className="text-[10px] text-gray-400">Fee</p><p className="text-sm font-bold text-gray-900 dark:text-white">{pair.fee}</p></div>
                  <div><p className="text-[10px] text-gray-400">Fee Type</p><p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{pair.fee_type}</p></div>
                </div>
                <button onClick={() => { setEditPair(pair); setShowPairModal(true); }} className="w-full text-center text-xs font-bold text-[#7C5CFF] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 py-2 rounded-xl transition-all">
                  Edit Pair
                </button>
              </div>
            ))}
            {pairs.length === 0 && (
              <div className="col-span-full p-12 text-center text-sm text-gray-400 rounded-2xl border border-gray-100 dark:border-gray-800">No currency pairs configured.</div>
            )}
          </div>

          <Modal isOpen={showPairModal} onClose={() => setShowPairModal(false)} title={editPair.id ? 'Edit Currency Pair' : 'Add Currency Pair'}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="From" value={editPair.from || ''} onChange={(v) => setEditPair(p => ({ ...p, from: v }))} placeholder="USD" />
                <FormField label="To" value={editPair.to || ''} onChange={(v) => setEditPair(p => ({ ...p, to: v }))} placeholder="NGN" />
              </div>
              <FormField label="Rate" value={editPair.rate || ''} onChange={(v) => setEditPair(p => ({ ...p, rate: v }))} placeholder="0.00" />
              <FormField label="Fee" value={editPair.fee || ''} onChange={(v) => setEditPair(p => ({ ...p, fee: v }))} placeholder="0.00" />
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Fee Type</label>
                <select value={editPair.fee_type || ''} onChange={(e) => setEditPair(p => ({ ...p, fee_type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm">
                  <option value="">Select type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <button onClick={handleSavePair} disabled={saving} className="px-6 py-2.5 bg-[#7C5CFF] hover:bg-[#6A4DED] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Pair'}
              </button>
            </div>
          </Modal>
        </div>
      )}

      {activeTab === 'exchange_rates' && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">To</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {rates.map((rate) => (
                <RateRow key={rate.id} rate={rate} onSave={handleUpdateRate} />
              ))}
              {rates.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No exchange rates configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Helper Components ──
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const cls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm text-gray-900 dark:text-white focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] outline-none";
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls + " resize-none"} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

function ToggleField({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
        enabled
          ? 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-500/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15]'
      }`}
    >
      <div>
        <p className={`text-sm font-bold ${enabled ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>
      </div>
      <div className={`h-6 w-11 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} relative`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}

function RateRow({ rate, onSave }: { rate: ExchangeRate; onSave: (rate: ExchangeRate, newRate: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(rate.rate);

  return (
    <tr className="hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
      <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">{rate.from_currency}</span></td>
      <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold">{rate.to_currency}</span></td>
      <td className="px-6 py-4">
        {editing ? (
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-32 px-3 py-1.5 rounded-lg border border-[#7C5CFF] text-sm bg-white dark:bg-[#0B0B15] outline-none" autoFocus />
        ) : (
          <span className="text-sm font-bold text-gray-900 dark:text-white">{rate.rate}</span>
        )}
      </td>
      <td className="px-6 py-4 text-xs text-gray-400">{new Date(rate.updated_at).toLocaleDateString()}</td>
      <td className="px-6 py-4 text-center">
        {editing ? (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => { onSave(rate, value); setEditing(false); }} className="px-3 py-1.5 text-[10px] font-bold text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg">Save</button>
            <button onClick={() => { setValue(rate.rate); setEditing(false); }} className="px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="px-3 py-1.5 text-[10px] font-bold text-[#7C5CFF] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all">Edit</button>
        )}
      </td>
    </tr>
  );
}