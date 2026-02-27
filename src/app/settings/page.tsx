"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const activeTab = searchParams.get("tab") ?? "profile";

  const changeTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-500/10 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <IconChevronLeft size={20} />
          </button>

          <h1 className="text-lg font-semibold text-gray-900">
            Account Settings
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-5">
          <button
            onClick={() => changeTab("profile")}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
              activeTab === "profile"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => changeTab("preferences")}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
              activeTab === "preferences"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 min-h-[420px]">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {!isLoaded ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-40" />
                  <div className="h-20 w-20 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded w-60" />
                  <div className="h-4 bg-gray-200 rounded w-72" />
                </div>
              ) : user ? (
                <>
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <img
                      src={user.imageUrl}
                      alt="User avatar"
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-sm"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user.fullName}
                      </h2>
                      <p className="text-sm text-gray-500">Active</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-gray-900">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>

                    {/* <div>
                      <p className="text-xs text-gray-500 mb-1">User ID</p>
                      <p className="text-sm text-gray-900 break-all">
                        {user.id}
                      </p>
                    </div> */}

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Joined</p>
                      <p className="text-sm text-gray-900">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  No user information available.
                </p>
              )}
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Preferences coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
