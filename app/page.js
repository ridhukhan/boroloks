"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lineicons, WwwCursorStrokeRounded } from "@lineiconshq/react-lineicons";
import { AnchorBulk, CloudBolt1Bulk, EnterDownBulk, ExitUpBulk } from "@lineiconshq/free-icons";





export default async function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/logout", { method: "POST" });
      
      if (res.ok) {
        router.push("/login");
        router.refresh(); 
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-amber-600 flex flex-col items-center  p-6">
      <nav className="bg-red-700 p-5 w-full
      justify-between items-center text-center 
       flex rounded-2xl shadow-[0px_27px_8px_-15px_#000]
      text-white">
<h1 className="font-sans font-bold text-3xl">BOROLOKS</h1>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="bg-red-600  hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </nav>
      <div className="bg-white h-20 w-full mt-15 rounded-2xl justify-center items-center">
<h1 className="font-bold text-2xl ">{user?`Name: ${user.username}`: "UNKNOWN"}</h1>
      </div>
      <div className="bg-white h-50 w-full mt-15 rounded-2xl 
      shadow-[10px_27px_48px_-10px_#001]">
       <div className="flex">
       <button className="flex flex-col font-bold ml-5 mt-4 border-4 rounded-2xl p-2 border-solid border-black">
<Lineicons icon={EnterDownBulk} size={40} color="black" className="ml-1.5"/>
     <span >deposit</span>

       </button>
       <button className="flex flex-col font-bold ml-5 mt-4 border-4 rounded-2xl p-2 border-solid border-black">
<Lineicons icon={ExitUpBulk} size={40} color="black" className="ml-2.5"/>
     <span >widthrow</span>

       </button>
       <button className="flex flex-col font-bold ml-5 mt-4 border-4 rounded-2xl p-2 border-solid border-black">
<Lineicons icon={AnchorBulk} size={40} color="black" className="ml-1.5"/>
     <span >deposit</span>

       </button>
       <button className="flex flex-col font-bold ml-5 mt-4 border-4 rounded-2xl p-2 border-solid border-black">
<Lineicons icon={EnterDownBulk} size={40} color="black"/>
     <span >deposit</span>

       </button>
       </div>
        
      </div>
    </main>
  );
}