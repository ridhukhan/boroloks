"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // লগআউট হ্যান্ডলার (কুকি ডিলিট করার জন্য)
  const handleLogout = async () => {
    try {
      setLoading(true);
      // কুকি রিমুভ করার API কল (যদি তৈরি করা থাকে) অথবা ক্লায়েন্ট থেকে হ্যান্ডেল
      const res = await fetch("/api/logout", { method: "POST" });
      
      if (res.ok) {
        router.push("/login");
        router.refresh(); // পেজ রিফ্রেশ করে মিডলওয়্যারকে অ্যাক্টিভ করা
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
          Welcome to Dashboard! 🎉
        </h1>
        <p className="text-slate-600 mb-6">
          আপনি সফলভাবে লগইন করেছেন এবং এটি আপনার প্রটেক্টেড হোম পেজ।
        </p>

        {/* লগআউট বাটন */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </main>
  );
}