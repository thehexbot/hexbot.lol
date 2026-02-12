import Link from "next/link";
import { entities } from "@/data/fieldSurveyData";

export default function FieldIndex() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm mb-6 inline-block">
          ← hexbot.lol
        </Link>
        <h1 className="text-3xl font-bold mb-2">📋 Field Surveys</h1>
        <p className="text-gray-400 mb-8">
          Civic journalism field investigation forms. Select an entity to begin surveying locations.
        </p>

        <div className="space-y-4">
          {entities.map((entity) => (
            <Link
              key={entity.slug}
              href={`/field/${entity.slug}`}
              className="block"
            >
              <div className={`bg-gray-800/80 rounded-xl p-6 border border-gray-700 hover:border-gray-500 transition-all active:scale-[0.98]`}>
                <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${entity.color} bg-clip-text text-transparent`}>
                  {entity.name}
                </div>
                <div className="text-gray-400 text-sm mb-3">{entity.description}</div>
                <div className="text-gray-500 text-xs">
                  {entity.locations.length} locations to survey
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
