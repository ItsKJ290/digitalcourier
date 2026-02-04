import React from 'react'
import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
          <Package size={20} />
        </div>
        <span className="font-bold text-lg text-slate-800 tracking-tight">ParcelTrack</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition">Track</Link>
        <Link to="/admin" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition">Admin Panel</Link>
       
        <button className="text-sm font-bold bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-100 transition">
          <Link to="/login" className="text-sm font-bold bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-100 transition">
            Login
         </Link>
        </button>
         <button className="text-sm font-bold bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-100 transition">
          <Link to="/login" className="text-sm font-bold bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-100 transition">
            Sign-in
         </Link>
        </button>
      </div>
    </nav>
  )
}