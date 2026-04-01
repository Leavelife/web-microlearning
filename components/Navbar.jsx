import Login from "@/app/login/page";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      <h1 className="text-xl font-bold">MICROLAB</h1>

      <div className="hidden md:flex gap-6 text-sm">
        <a href="#" className="hover:text-blue-500 transition">Home</a>
        <a href="#" className="hover:text-blue-500 transition">About</a>
        <a href="#" className="hover:text-blue-500 transition">Course</a>
        <a href="#" className="hover:text-blue-500 transition">VLab</a>
        <a href="#" className="hover:text-blue-500 transition">Contact</a>
      </div>

      <div className="w-10 h-10 rounded-full border"></div>
    </nav>
  );
}