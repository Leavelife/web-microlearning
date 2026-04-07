'use client'

import Image from "next/image"
import EditProfile from "./EditProfile"

export default function ProfileSection({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Profil</h2>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8">
        <Image
          src={user.image || "/default-avatar.png"}
          alt="User avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
          width={96}
          height={96}
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {user.wilayah || "Wilayah belum diatur"}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <EditProfile user={user} />
        </div>
      </div>
    </div>
  )
}