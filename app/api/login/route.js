import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "সবগুলো ফিল্ড পূরণ করুন।" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!" },
        { status: 400 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!" },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role:user.role
    };

    const secretKey = process.env.JWT_SECRET ;
    
    const token = jwt.sign(tokenData, secretKey, { expiresIn: "1d" });

    const response = NextResponse.json(
      {
        success: true,
        message: "লগইন সফল হয়েছে!",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role:user.role
        },
      },
      { status: 200 }
    );

    // Cookie সেটিং (HTTP-Only যা নিরাপত্তার জন্য সেরা)
    response.cookies.set("token", token, {
  httpOnly: true,
  // প্রোডাকশনে (HTTPS) true হবে, কিন্তু লোকালহোস্টে (HTTP) false হবে
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 24 * 60 * 60, // ১ দিন
  path: "/",
});

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "সার্ভারে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}