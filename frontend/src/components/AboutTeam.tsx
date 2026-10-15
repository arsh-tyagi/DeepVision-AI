import React from "react";
import { Code2, Server, Eye, Palette, GraduationCap, Users } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

export const AboutTeam: React.FC = () => {
  const team: TeamMember[] = [
    {
      name: "Arpit Kumar",
      role: "Backend Development",
      description: "Built the backend server using FastAPI, implemented image routing, and handled file upload handling and processing logic.",
      icon: <Server className="w-5 h-5 text-orange-500" />,
      tags: ["FastAPI", "Python", "Backend Routing"]
    },
    {
      name: "Arpit Rana",
      role: "Documentation & Testing",
      description: "Tested the application with different image types (social media compressed, camera, AI) and created project documentation and reports.",
      icon: <Code2 className="w-5 h-5 text-orange-500" />,
      tags: ["QA Testing", "Documentation", "Project Report"]
    },
    {
      name: "Arsh Tyagi",
      role: "Project Idea, AI/ML & Evaluation",
      description: "Conceived the project concept, worked on AI/ML model integration, data processing, and forensic detection evaluation across multi-signal pipelines.",
      icon: <Eye className="w-5 h-5 text-orange-500" />,
      tags: ["Project Idea", "AI/ML", "Data Processing", "Evaluation"]
    },
    {
      name: "Avni Sharma",
      role: "Frontend & UI Design",
      description: "Designed and styled the web interface, created responsive components, and organized the layout for mobile phones, tablets, and desktop displays.",
      icon: <Palette className="w-5 h-5 text-orange-500" />,
      tags: ["React", "Tailwind CSS", "UI Design"]
    }
  ];

  return (
    <section className="mt-14 pt-8 border-t border-stone-200 dark:border-stone-800">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] font-mono font-medium text-stone-700 dark:text-stone-300 mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
          <span>B.Tech CSE-AI &bull; 2nd Year Mini Project</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
          DeepVision-AI Engineering Team
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          Developed by 2nd-year B.Tech students in Computer Science & Engineering (Artificial Intelligence) at <span className="font-semibold text-stone-800 dark:text-stone-200">ABESIT Ghaziabad</span>, affiliated with <span className="font-semibold text-stone-800 dark:text-stone-200">AKTU</span>.
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="tech-card p-5 flex flex-col justify-between hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  {member.icon}
                </div>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                  Member 0{idx + 1}
                </span>
              </div>

              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-mono">
                {member.name}
              </h4>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-0.5 mb-2">
                {member.role}
              </p>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {member.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-1">
              {member.tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* College Info Box */}
      <div className="mt-6 p-4 rounded-xl bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <Users className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-stone-900 dark:text-white">ABES Institute of Technology (ABESIT), Ghaziabad</h5>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">Department of CSE (Artificial Intelligence) &bull; AKTU</p>
          </div>
        </div>
        <span className="text-[10px] text-stone-500 px-2.5 py-1 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          Academic Year 2026–2027
        </span>
      </div>
    </section>
  );
};