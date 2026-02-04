import React from 'react'
import { Truck } from 'lucide-react'

export default function TrackingCard() {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 mt-10">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <span className="text-xs font-bold tracking-widest opacity-60 uppercase">Status</span>
        <span className="text-emerald-400 font-black tracking-tighter">● IN TRANSIT</span>
      </div>
      
      <div className="p-8">
        <div className="flex items-center gap-5 mb-10">
          <div className="text-5xl bg-slate-50 w-20 h-20 flex items-center justify-center rounded-3xl shadow-inner">📦</div>
          <div>
            <h3 className="text-2xl font-black italic text-slate-800 tracking-tight">On The Way</h3>
            <p className="text-slate-400 text-sm">Arriving: <span className="font-bold text-slate-600">Today, 6:00 PM</span></p>
          </div>
        </div>

        {/* Visual Progress */}
        <div className="relative flex justify-between px-2 mb-4">
          <div className="absolute top-3 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
          <div className="absolute top-3 left-0 w-2/3 h-1 bg-emerald-500 rounded-full"></div>
          
          <div className="relative z-10 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white"></div>
          <div className="relative z-10 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white"></div>
          <div className="relative z-10 w-6 h-6 bg-white rounded-full border-4 border-emerald-500 animate-pulse"></div>
          <div className="relative z-10 w-6 h-6 bg-slate-200 rounded-full border-4 border-white"></div>
        </div>
        
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
          <span>Packed</span>
          <span>Shipped</span>
          <span className="text-emerald-600">On Way</span>
          <span>Home</span>
        </div>
      </div>
    </div>
  )
}