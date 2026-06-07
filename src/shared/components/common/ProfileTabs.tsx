"use client";

import { BookPlus } from "lucide-react";
import { useState } from "react";
import CreateCourseRequestAutenticatedDialog from "@/domains/courses/components/CreateCourseRequestAutenticatedDialog";
import ListEnrolledCourses from "@/domains/courses/components/ListEnrolledCourses";
import ListCourseRequestsTeachers from "@/domains/users/components/ListCourseRequestsTeachers";

type TabType = "courses" | "teachers";

interface ProfileTabsProps {
  institute: string;
}

export default function ProfileTabs({ institute }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("courses");

  return (
    <div className="grid gap-4">
      {/* Horizontal Menu */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "courses"
              ? "border-b-2 border-black text-black dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Mis cursos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("teachers")}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "teachers"
              ? "border-b-2 border-black text-black dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Solicitudes de cursos de profesores
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "courses" && (
          <div className="grid gap-4">
            <ListEnrolledCourses institute={institute} />
            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/35 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between py-6">
              <div className="grid gap-1">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BookPlus className="size-4 text-primary" aria-hidden="true" />
                  Solicitar un curso nuevo
                </p>
                <p className="max-w-prose text-sm text-muted-foreground">
                  Abre una solicitud de un curso nuevo dentro de tu instituto.
                </p>
              </div>

              <CreateCourseRequestAutenticatedDialog institute={institute} />
            </div>
          </div>
        )}
        {activeTab === "teachers" && <ListCourseRequestsTeachers institute={institute} />}
      </div>
    </div>
  );
}
