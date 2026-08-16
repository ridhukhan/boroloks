import { NextResponse } from "next/server";


export function POST(){


    const response = NextResponse.json({
        success:true, message:"logout success"
    },{
        status:200
    })
    response.cookies.delete("token")

    return response
}