"use client";

import { useState } from "react";
import ListEnrolledCourses from "@/domains/courses/components/ListEnrolledCourses";
import AccountRequestTeachersList from "@/domains/users/components/ListAccountRequestTeachers";

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
          Solicitudes de profesores
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "courses" && <ListEnrolledCourses institute={institute} />}
        {activeTab === "teachers" && <AccountRequestTeachersList institute={institute} />}
      </div>
    </div>
  );
}
