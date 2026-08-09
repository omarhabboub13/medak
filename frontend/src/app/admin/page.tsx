"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logout, clearSession } from "@/lib/auth";
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import type {
  AudienceItem,
  FeatureBlock,
  LandingContent,
  StepItem,
  WhyItem,
} from "@/lib/landing-types";
import {
  LanguageSwitcher,
  LocaleProvider,
  useLocale,
} from "@/lib/LocaleProvider";
import { LOCALE_META, type Locale, type UiKey } from "@/lib/i18n";

type Tab =
  | "hero"
  | "why"
  | "patients"
  | "doctors"
  | "how"
  | "audience"
  | "download";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]";

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </label>
  );
}

function TitleDescListEditor({
  items,
  onChange,
  itemLabel,
  labels,
}: {
  items: Array<{ title: string; desc: string }>;
  onChange: (items: Array<{ title: string; desc: string }>) => void;
  itemLabel: string;
  labels: { add: string; delete: string; title: string; description: string };
}) {
  function update(index: number, key: "title" | "desc", value: string) {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">{itemLabel}</p>
        <button
          type="button"
          onClick={() => onChange([...items, { title: "", desc: "" }])}
          className="text-sm rounded-lg bg-[var(--color-teal)] text-white px-3 py-1.5"
        >
          {labels.add}
        </button>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-500">
              {itemLabel} {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="text-xs text-red-600 hover:underline"
            >
              {labels.delete}
            </button>
          </div>
          <Field
            label={labels.title}
            value={item.title}
            onChange={(v) => update(index, "title", v)}
          />
          <Field
            label={labels.description}
            value={item.desc}
            onChange={(v) => update(index, "desc", v)}
            multiline
          />
        </div>
      ))}
    </div>
  );
}

function StringListEditor({
  items,
  onChange,
  itemLabel,
  labels,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  itemLabel: string;
  labels: { add: string; delete: string };
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">{itemLabel}</p>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-sm rounded-lg bg-[var(--color-teal)] text-white px-3 py-1.5"
        >
          {labels.add}
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-start">
          <input
            value={item}
            onChange={(e) =>
              onChange(items.map((x, i) => (i === index ? e.target.value : x)))
            }
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="shrink-0 text-sm text-red-600 px-2 py-2"
          >
            {labels.delete}
          </button>
        </div>
      ))}
    </div>
  );
}

function FeatureBlocksEditor({
  blocks,
  onChange,
  labels,
}: {
  blocks: FeatureBlock[];
  onChange: (blocks: FeatureBlock[]) => void;
  labels: {
    add: string;
    delete: string;
    featureGroups: string;
    addGroup: string;
    deleteGroup: string;
    groupTitle: string;
    bullet: string;
  };
}) {
  function updateBlock(index: number, next: FeatureBlock) {
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {labels.featureGroups}
        </p>
        <button
          type="button"
          onClick={() => onChange([...blocks, { title: "", items: [""] }])}
          className="text-sm rounded-lg bg-[var(--color-teal)] text-white px-3 py-1.5"
        >
          {labels.addGroup}
        </button>
      </div>
      {blocks.map((block, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              {labels.featureGroups} {index + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(blocks.filter((_, i) => i !== index))}
              className="text-xs text-red-600 hover:underline"
            >
              {labels.deleteGroup}
            </button>
          </div>
          <Field
            label={labels.groupTitle}
            value={block.title}
            onChange={(v) => updateBlock(index, { ...block, title: v })}
          />
          <StringListEditor
            items={block.items || []}
            itemLabel={labels.bullet}
            labels={{ add: labels.add, delete: labels.delete }}
            onChange={(items) => updateBlock(index, { ...block, items })}
          />
        </div>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const { dir, locale: contentLang, tt } = useLocale();
  const [tab, setTab] = useState<Tab>("hero");
  const [content, setContent] = useState<LandingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const tabs: { id: Tab; labelKey: UiKey }[] = [
    { id: "hero", labelKey: "tabIntro" },
    { id: "why", labelKey: "tabWhy" },
    { id: "patients", labelKey: "tabPatients" },
    { id: "doctors", labelKey: "tabDoctors" },
    { id: "how", labelKey: "tabHow" },
    { id: "audience", labelKey: "tabAudience" },
    { id: "download", labelKey: "tabDownload" },
  ];

  const loadContent = useCallback(async (lang: Locale) => {
    setLoading(true);
    try {
      const data = await apiGet<LandingContent>(`/landing?lang=${lang}`, {
        auth: false,
      });
      setContent(data);
    } catch {
      setMsg("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "ADMIN") {
      clearSession();
      router.replace("/admin/login");
      return;
    }
    loadContent(contentLang);
  }, [router, contentLang, loadContent]);

  function patch<K extends keyof LandingContent>(
    key: K,
    value: LandingContent[K],
  ) {
    setContent((c) => (c ? { ...c, [key]: value } : c));
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMsg(null);
    try {
      const { id: _id, updatedAt: _u, ...payload } = content as LandingContent & {
        id?: string;
        updatedAt?: string;
      };
      const updated = await apiPatch<LandingContent>(
        `/landing?lang=${contentLang}`,
        payload,
      );
      setContent(updated);
      setMsg(tt("saved"));
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function resetDefaults() {
    if (!confirm(tt("reset") + "?")) return;
    setSaving(true);
    try {
      const updated = await apiPost<LandingContent>(
        `/landing/reset?lang=${contentLang}`,
      );
      setContent(updated);
      setMsg(tt("saved"));
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  }

  const listLabels = {
    add: tt("add"),
    delete: tt("delete"),
    title: tt("title"),
    description: tt("description"),
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        {tt("loading")}
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 shrink-0 sticky top-0 h-screen bg-white border-e border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-xl font-bold text-[var(--color-teal)]">مدك</p>
          <p className="text-xs text-gray-500 mt-1">{tt("adminTitle")}</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="text-xs font-semibold text-gray-500 mb-2 px-1">
            {tt("sections")}
          </p>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`w-full text-start rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-teal-50 text-[var(--color-teal)]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tt(t.labelKey)}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2 px-1">
            {tt("uiLang")}
          </p>
          <LanguageSwitcher className="flex-wrap justify-start" />
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-ink">{tt(tabs.find((t) => t.id === tab)!.labelKey)}</h1>
            <p className="text-sm text-gray-500">
              {LOCALE_META[contentLang].native}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              {tt("preview")}
            </Link>
            <button
              type="button"
              onClick={resetDefaults}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              {tt("reset")}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-[var(--color-teal)] text-white font-semibold px-5 py-2 text-sm disabled:opacity-50"
            >
              {saving ? tt("saving") : tt("save")}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg text-red-600 px-3 py-2 text-sm"
            >
              {tt("logout")}
            </button>
          </div>
        </header>

        {msg && (
          <div className="mx-6 mt-4 text-sm bg-teal-50 text-teal-900 border border-teal-100 rounded-lg px-4 py-3">
            {msg}
          </div>
        )}

        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 max-w-3xl">
            {tab === "hero" && (
            <>
              <Field
                label={tt("brandName")}
                value={content.brandName}
                onChange={(v) => patch("brandName", v)}
              />
              <Field
                label={tt("brandNameEn")}
                value={content.brandNameEn}
                onChange={(v) => patch("brandNameEn", v)}
              />
              <Field
                label={tt("heroTitle")}
                value={content.heroTitle}
                onChange={(v) => patch("heroTitle", v)}
              />
              <Field
                label={tt("heroHighlight")}
                value={content.heroHighlight}
                onChange={(v) => patch("heroHighlight", v)}
              />
              <Field
                label={tt("heroSubtitle")}
                value={content.heroSubtitle}
                onChange={(v) => patch("heroSubtitle", v)}
                multiline
              />
              <Field
                label={tt("heroSupport")}
                value={content.heroSupport || ""}
                onChange={(v) => patch("heroSupport", v)}
                multiline
              />
            </>
          )}

          {tab === "why" && (
            <>
              <Field
                label={tt("sectionTitle")}
                value={content.whyTitle}
                onChange={(v) => patch("whyTitle", v)}
              />
              <Field
                label={tt("intro")}
                value={content.whyIntro || ""}
                onChange={(v) => patch("whyIntro", v)}
                multiline
              />
              <TitleDescListEditor
                itemLabel={tt("whyItem")}
                items={(content.whyItems || []) as WhyItem[]}
                onChange={(items) => patch("whyItems", items)}
                labels={listLabels}
              />
            </>
          )}

          {tab === "patients" && (
            <>
              <Field
                label={tt("sectionTitle")}
                value={content.patientsTitle}
                onChange={(v) => patch("patientsTitle", v)}
              />
              <Field
                label={tt("intro")}
                value={content.patientsIntro || ""}
                onChange={(v) => patch("patientsIntro", v)}
                multiline
              />
              <FeatureBlocksEditor
                blocks={(content.patientFeatures || []) as FeatureBlock[]}
                onChange={(blocks) => patch("patientFeatures", blocks)}
                labels={{
                  ...listLabels,
                  featureGroups: tt("featureGroups"),
                  addGroup: tt("addGroup"),
                  deleteGroup: tt("deleteGroup"),
                  groupTitle: tt("groupTitle"),
                  bullet: tt("bullet"),
                }}
              />
            </>
          )}

          {tab === "doctors" && (
            <>
              <Field
                label={tt("sectionTitle")}
                value={content.doctorsTitle}
                onChange={(v) => patch("doctorsTitle", v)}
              />
              <Field
                label={tt("intro")}
                value={content.doctorsIntro || ""}
                onChange={(v) => patch("doctorsIntro", v)}
                multiline
              />
              <StringListEditor
                itemLabel={tt("featureItem")}
                items={content.doctorFeatures || []}
                onChange={(items) => patch("doctorFeatures", items)}
                labels={listLabels}
              />
            </>
          )}

          {tab === "how" && (
            <>
              <Field
                label={tt("sectionTitle")}
                value={content.howTitle}
                onChange={(v) => patch("howTitle", v)}
              />
              <Field
                label={tt("intro")}
                value={content.howIntro || ""}
                onChange={(v) => patch("howIntro", v)}
                multiline
              />
              <TitleDescListEditor
                itemLabel={tt("stepItem")}
                items={(content.howSteps || []) as StepItem[]}
                onChange={(items) => patch("howSteps", items)}
                labels={listLabels}
              />
            </>
          )}

          {tab === "audience" && (
            <>
              <Field
                label={tt("sectionTitle")}
                value={content.audienceTitle}
                onChange={(v) => patch("audienceTitle", v)}
              />
              <TitleDescListEditor
                itemLabel={tt("audienceItem")}
                items={(content.audiences || []) as AudienceItem[]}
                onChange={(items) => patch("audiences", items)}
                labels={listLabels}
              />
            </>
          )}

          {tab === "download" && (
            <>
              <Field
                label={tt("downloadTitle")}
                value={content.downloadTitle}
                onChange={(v) => patch("downloadTitle", v)}
              />
              <Field
                label={tt("downloadSubtitle")}
                value={content.downloadSubtitle}
                onChange={(v) => patch("downloadSubtitle", v)}
                multiline
              />
              <Field
                label={tt("appStoreUrl")}
                value={content.appStoreUrl || ""}
                onChange={(v) => patch("appStoreUrl", v)}
              />
              <Field
                label={tt("playStoreUrl")}
                value={content.playStoreUrl || ""}
                onChange={(v) => patch("playStoreUrl", v)}
              />
              <Field
                label={tt("footerTagline")}
                value={content.footerTagline}
                onChange={(v) => patch("footerTagline", v)}
              />
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <LocaleProvider>
      <AdminDashboard />
    </LocaleProvider>
  );
}
