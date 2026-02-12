import { entities } from "@/data/fieldSurveyData";
import EntitySurvey from "./EntitySurvey";

export function generateStaticParams() {
  return entities.map((e) => ({ slug: e.slug }));
}

export default async function EntityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EntitySurvey slug={slug} />;
}
