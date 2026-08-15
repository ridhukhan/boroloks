"use client"; // ১. App Router এর জন্য ক্লায়েন্ট কম্পোনেন্ট নিশ্চিত করা

import Link from "next/link";
import { useRouter } from "next/navigation"; // ২. correct import for App Router
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // এরর দেখানোর জন্য স্টেট

  const router = useRouter();

  const loginhandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("সবগুলো ফিল্ড পূরণ করুন!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ৩. res.ok বা data.success চেক করা
      if (!res.ok || !data.success) {
        setError(data.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!");
        setLoading(false); // লোডিং বন্ধ করা
        return;
      }

      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false); // ৪. এরর খেলেও যেন লোডিং বন্ধ হয়
      setError("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-yellow-400 w-[300px] rounded-lg p-4 text-center shadow-lg">
        <h1 className="bg-black text-yellow-400 px-3 py-1.5 mt-1 mx-auto w-fit rounded-md text-sm font-semibold tracking-wide">
          ENTER YOUR DETAILS
        </h1>

        <hr className="border-black/20 my-3" />

        {/* এরর মেসেজ UI */}
        {error && (
          <p className="bg-red-500 text-white text-xs py-1 px-2 rounded mb-2 font-medium">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4 mt-4" onSubmit={loginhandler}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
            className="border-b-2 border-black bg-transparent text-center font-sans text-lg placeholder-black/60 focus:outline-none focus:border-b-4 py-1"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
            className="border-b-2 border-black bg-transparent text-center font-sans text-lg placeholder-black/60 focus:outline-none focus:border-b-4 py-1"
          />

          <button
            disabled={loading}
            type="submit"
            className="bg-black text-yellow-400 font-sans font-semibold py-2 px-6 w-fit mx-auto rounded-2xl mt-2 hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Submit"}
          </button>

          {/* লিঙ্ক অংশটি সুন্দর করা হয়েছে */}
          <div className="mt-2 text-sm">
            <span>Don't have an account? </span>
            <Link
              href="/registration"
              className="font-bold underline text-red-600 hover:text-black"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}