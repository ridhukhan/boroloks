import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // ১. ফিল্ডগুলো চেক করা
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "সবগুলো ফিল্ড পূরণ করুন।" },
        { status: 400 }
      );
    }

    // ২. ডাটাবেজ কানেক্ট করা
    await connectDB();

    // ৩. ইমেইল অনুযায়ী ইউজার খোঁজা
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!" },
        { status: 400 }
      );
    }

    // ৪. পাসওয়ার্ড ম্যাচ করানো
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!" },
        { status: 400 }
      );
    }

    // ৫. JWT টোকেন তৈরি করা
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // .env ফাইল থেকে গোপন কী (Secret Key) ব্যবহার করা ভালো
    const secretKey = process.env.JWT_SECRET ;
    
    // টোকেন তৈরি (১ দিনের মেয়াদ)
    const token = jwt.sign(tokenData, secretKey, { expiresIn: "1d" });

    // ৬. রেসপন্স তৈরি এবং কুকিতে টোকেন সেট করা
    const response = NextResponse.json(
      {
        success: true,
        message: "লগইন সফল হয়েছে!",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Cookie সেটিং (HTTP-Only যা নিরাপত্তার জন্য সেরা)
    response.cookies.set("token", token, {
      httpOnly: true, // ক্লায়েন্ট সাইড JS দিয়ে অ্যাক্সেস করা যাবে না (XSS প্রটেকশন)
      secure: true, 
      sameSite: "strict", // CSRF অ্যাটাক প্রতিরোধের জন্য
      maxAge: 24 * 60 * 60, // ১ দিন (সেকেন্ডে)
      path: "/", // পুরো সাইটে সহজলভ্য
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "সার্ভারে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}