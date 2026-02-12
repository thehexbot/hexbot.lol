"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { getEntity, getLetterColor, type Question, type Location } from "@/data/fieldSurveyData";

const API_BASE = "https://dusty-weasel-434.convex.site";

function QuestionField({ question, value, onChange }: { question: Question; value: any; onChange: (v: any) => void }) {
  switch (question.type) {
    case "bool":
      return (
        <label className="flex items-center gap-3 py-2 cursor-pointer active:bg-gray-700/30 rounded-lg px-2 -mx-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-6 h-6 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 shrink-0"
          />
          <span className="text-sm text-gray-200">{question.label}</span>
        </label>
      );
    case "choice":
      return (
        <div className="py-2">
          <div className="text-sm text-gray-300 mb-2">{question.label}</div>
          <div className="flex flex-wrap gap-2">
            {question.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(value === opt ? null : opt)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  value === opt
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    case "count":
      return (
        <div className="py-2">
          <label className="text-sm text-gray-300 block mb-1">{question.label}</label>
          <input
            type="number"
            min={0}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      );
    case "text":
      return (
        <div className="py-2">
          <label className="text-sm text-gray-300 block mb-1">{question.label}</label>
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      );
  }
}

function LocationCard({ location, entitySlug }: { location: Location; entitySlug: string }) {
  const [expanded, setExpanded] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState("");

  const updateResponse = useCallback((id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handlePhotoCapture = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    for (const file of Array.from(files)) {
      newPhotos.push(file.name);
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      let gps: { lat: number; lng: number; accuracy?: number } | undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        gps = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
      } catch {
        // GPS not available
      }

      const res = await fetch(`${API_BASE}/api/field/surveys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entitySlug,
          locationLetter: location.letter,
          locationName: location.name,
          responses,
          notes: notes || undefined,
          photos: photos.length > 0 ? photos : undefined,
          gps,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");
      setSubmitted(true);
      setToast("✅ Submitted!");
      setTimeout(() => setToast(""), 3000);
    } catch {
      setToast("❌ Error submitting. Try again.");
      setTimeout(() => setToast(""), 4000);
    } finally {
      setSubmitting(false);
    }
  }, [entitySlug, location, responses, notes, photos]);

  const borderColor = getLetterColor(location.letter);

  return (
    <div className={`bg-gray-800/80 rounded-xl border-l-4 ${borderColor} border border-gray-700 overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left active:bg-gray-700/30"
      >
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold ${submitted ? "bg-green-600" : ""}`}>
            {submitted ? "✓" : location.letter}
          </span>
          <div>
            <div className="font-semibold text-white text-sm">{location.name}</div>
            <div className="text-gray-400 text-xs">{location.address}</div>
            {location.hours && <div className="text-green-400 text-xs mt-0.5">🕐 {location.hours}</div>}
            {location.money && <div className="text-red-400 text-xs font-semibold">{location.money}</div>}
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Quick action buttons — always visible */}
      <div className="flex gap-2 px-4 pb-3 -mt-1 flex-wrap">
        {location.lat && location.lon && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lon}`}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs font-medium active:bg-blue-600/40"
          >
            🧭 Navigate
          </a>
        )}
        {location.phone && (
          <a
            href={`tel:${location.phone.replace(/[^0-9+]/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 text-xs font-medium active:bg-green-600/40"
          >
            📞 Call
          </a>
        )}
        {location.website && (
          <a
            href={location.website}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-medium active:bg-purple-600/40"
          >
            🌐 Website
          </a>
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-1 border-t border-gray-700/50 pt-3">
          {location.questions.map((q) => (
            <QuestionField
              key={q.id}
              question={q}
              value={responses[q.id]}
              onChange={(v) => updateResponse(q.id, v)}
            />
          ))}

          <div className="pt-3 border-t border-gray-700/50">
            <label className="text-sm text-gray-400 block mb-1">Additional notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Anything else noteworthy..."
            />
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm text-gray-300 cursor-pointer hover:bg-gray-600 active:bg-gray-500">
              📷 Add Photos
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>
            {photos.length > 0 && (
              <span className="ml-2 text-xs text-gray-400">{photos.length} photo(s) attached</span>
            )}
          </div>

          <div className="pt-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || submitted}
              className={`w-full py-3 rounded-xl text-lg font-bold transition-all ${
                submitted
                  ? "bg-green-700 text-green-100 cursor-default"
                  : submitting
                  ? "bg-blue-800 text-blue-200 cursor-wait"
                  : "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700"
              }`}
            >
              {submitted ? "✅ Submitted" : submitting ? "Submitting..." : "Submit Survey"}
            </button>
            {submitted && (
              <button
                onClick={() => { setSubmitted(false); setResponses({}); setNotes(""); setPhotos([]); }}
                className="w-full py-2 mt-2 rounded-xl text-sm text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 transition-all"
              >
                ↺ Reset & redo survey
              </button>
            )}
          </div>

          {toast && (
            <div className="text-center text-sm font-medium py-2 animate-pulse">{toast}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EntitySurvey({ slug }: { slug: string }) {
  const entity = getEntity(slug);

  if (!entity) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Entity not found</h1>
          <Link href="/field" className="text-blue-400 hover:underline">← Back to surveys</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        <Link href="/field" className="text-gray-400 hover:text-gray-300 text-sm mb-4 inline-block">
          ← All Surveys
        </Link>
        <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${entity.color} bg-clip-text text-transparent`}>
          {entity.name}
        </div>
        <p className="text-gray-400 text-sm mb-6">{entity.description}</p>

        <div className="space-y-3">
          {entity.locations.map((loc) => (
            <LocationCard key={loc.letter} location={loc} entitySlug={entity.slug} />
          ))}
        </div>
      </div>
    </main>
  );
}
