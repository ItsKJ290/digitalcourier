import React, { useState } from 'react'
import TrackingCard from './components/TrackingCard'

export default function Home() {
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black text-center mb-2">Track Parcel</h1>
      <p className="text-slate-500 text-center mb-10 text-sm">Enter tracking ID to see live updates</p>

      <div className="flex gap-2 mb-10">
        <input 
          type="text" 
          placeholder="PKG123456" 
          className="flex-1 p-4 rounded-2xl border-none shadow-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-lg font-medium"
        />
        <button 
          onClick={() => setShowResult(true)}
          className="bg-emerald-500 text-white px-8 rounded-2xl font-bold hover:bg-emerald-600 transition shadow-lg"
        >
          Track
        </button>
      </div>

      {showResult && <TrackingCard />}
    </div>
  )
}