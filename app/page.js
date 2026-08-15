import Link from "next/link"
export default function Home() {
  return <main>

    <div>
      <Link href="login" className="bg-cyan-800 max-w-0.5 text-center m-6
      font-bold text-red-600" ><h1>LOGIN NOW</h1></Link>
    </div>
  </main>
}
