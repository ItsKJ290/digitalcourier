import React from 'react'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white text-center">
          <h2 className="text-3xl font-black italic">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Admin Access Only</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
              <input type="email" placeholder="admin@parceltrack.com" className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
              <input type="password" placeholder="••••••••" className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
          </div>

          <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            Login Now <ArrowRight size={20} />
          </button>

          <div className="text-center">
            <Link to="/" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  )
}