import { connectDB } from "@/lib/mongodb";

import User from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export  async function POST(req){

try {
    const {username,email,password,confirmpassword}= await  req.json()


if (!username || !email || !password || !confirmpassword) {
      return NextResponse.json(
        { message: "সকল তথ্য সঠিকভাবে পূরণ করুন।" },
        { status: 400 }
      );
    }


if(password !== confirmpassword){
    return NextResponse.json(
       { message: "password not match" },
        { status: 400 }
       
    )
}
await connectDB()

const existingUser= await User.findOne({ $or: [{ email }, { username }] })
if(existingUser){
    return NextResponse.json(
       { message: "ইউজারনেম বা ইমেইল ইতিমধ্যেই ব্যবহৃত হয়েছে।" },
        { status: 400 }
       
    )
}

const hashedPassword= await bcrypt.hash(password,10)
const newUser= await User.create({
    username,
    email,
    password:hashedPassword
})
return NextResponse.json(newUser,{status: 201})
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
}

}