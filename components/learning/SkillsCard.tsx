"use client";

import { LearningSkill } from "@/lib/learning/skills";

interface SkillsCardProps {
  skills: LearningSkill[];
  language: "en" | "id";
  creatorName?: string;
}

const DOMAIN_STYLES: Record<string, string> = {
  emotional: "bg-amber-100 text-amber-800",
  spatial: "bg-teal-100 text-teal-800",
  auditory: "bg-purple-100 text-purple-800",
  creative: "bg-yellow-100 text-yellow-800",
};

export default function SkillsCard({
  skills,
  language,
  creatorName,
}: SkillsCardProps) {
  const heading =
    language === "id" ? "Keterampilan hari ini" : "Skills practiced today";
  const subline = creatorName
    ? language === "id"
      ? `Sesi yang bagus, ${creatorName}!`
      : `Great session, ${creatorName}!`
    : null;
  const footer =
    language === "id"
      ? "Setiap pilihan yang kamu buat membangun keterampilan nyata."
      : "Each choice you made built a real skill.";

  return (
    <div
      role="region"
      aria-label="Learning outcomes"
      className="w-full bg-surface border border-ink/10 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🏆</span>
        <div>
          <p className="font-creator text-lg font-bold text-ink leading-tight">
            {heading}
          </p>
          {subline && (
            <p className="font-body text-sm text-muted">{subline}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {skills.map((skill) => (
          <span
            key={skill.id}
            aria-label={`${skill.label_en} skill practiced`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              DOMAIN_STYLES[skill.domain] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            <span aria-hidden="true">{skill.emoji}</span>
            {language === "id" ? skill.label_id : skill.label_en}
          </span>
        ))}
      </div>

      <p className="font-body text-xs text-muted mt-3">{footer}</p>
    </div>
  );
}
