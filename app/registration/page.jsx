"use client"; // ১. App Router-এ ক্লায়েন্ট কম্পোনেন্ট হিসেবে চিহ্নিত করার জন্য

import Link from "next/link";
import { useRouter } from "next/navigation"; // রিডাইরেক্ট করার জন্য
import { useState } from "react";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  // মেসেজ ও লোডিং স্টেট
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const Submithandler = async (e) => {
    e.preventDefault();
    setError("");

    // ফ্রন্টএন্ড ভ্যালিডেশন
    if (!username || !email || !password || !confirmpassword) {
      setError("সবগুলো ফিল্ড পূরণ করুন!");
      return;
    }

    if (password !== confirmpassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }

    try {
      setLoading(true);

      // আপনার তৈরি করা POST API-তে রিকুয়েস্ট পাঠানো
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmpassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ব্যাকএন্ড থেকে কোনো এরর আসলে (যেমন: ইউজার আগে থেকেই আছে)
        setError(data.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে!");
        setLoading(false);
        return;
      }

      // রেজিস্ট্রেশন সফল হলে লগইন পেজে পাঠাবো
      setLoading(false);
      alert("রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।");
      router.push("/login");

    } catch (err) {
      setLoading(false);
      setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-yellow-400 w-[300px] rounded-lg p-4 text-center shadow-lg">
        <h1 className="bg-black text-yellow-400 px-3 py-1.5 mt-1 mx-auto w-fit rounded-md text-sm font-semibold tracking-wide">
          ENTER YOUR DETAILS
        </h1>

        <hr className="border-black/20 my-3" />

        {/* এরর মেসেজ দেখানোর জন্য */}
        {error && (
          <p className="bg-red-500 text-white text-xs py-1 px-2 rounded mb-2 font-medium">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4 mt-4" onSubmit={Submithandler}>
          <input
            type="text"
            placeholder="enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-b-2 border-black bg-transparent text-center font-sans text-lg placeholder-black/60 focus:outline-none focus:border-b-4 py-1"
          />
          <input
            type="email"
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b-2 border-black bg-transparent text-center font-sans text-lg placeholder-black/60 focus:outline-none focus:border-b-4 py-1"
          />

          <input
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b-2 border-black bg-transparent text-center font-sans text-lg placeholder-black/60 focus:outline-none focus:border-b-4 py-1"
          />

          <input
            type="password"
            placeholder="re-enter password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            className="border-b-2 border-black bg-transparent text-center font-sans text-lg placeholder-black/60 focus:outline-none focus:border-b-4 py-1"
          />

          {/* type="submit" টাইপো ঠিক করা হয়েছে */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-yellow-400 font-sans font-semibold py-2 px-6 w-fit mx-auto rounded-2xl mt-2 hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <div className="mt-2 text-sm">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold underline text-red-600 hover:text-black"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}