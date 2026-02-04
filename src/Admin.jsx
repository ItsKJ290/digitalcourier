import React from 'react'
import { PlusCircle, Truck, Box, CheckCircle, MapPin} from 'lucide-react'

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-800 italic">Admin Panel</h1>
        <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100">
          <PlusCircle size={20} /> New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Box /></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Total Parcels</p><p className="text-2xl font-black">1,284</p></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-orange-100 p-4 rounded-2xl text-orange-600"><Truck /></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">On Route</p><p className="text-2xl font-black">432</p></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600"><CheckCircle /></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Delivered</p><p className="text-2xl font-black">852</p></div>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white text-lg font-bold">Register New Shipment</div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Sender Name</label>
            <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Rahul Kumar" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Receiver Name</label>
            <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Amit Singh" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Delivery Address</label>
            <textarea className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 h-24" placeholder="Full address with Pincode"></textarea>
          </div>
          <button className="md:col-span-2 bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all">
            Save Shipment to Database
          </button>
        </div>
      </div>
    </div>
  )
}
