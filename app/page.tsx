"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import CountrySelector from "@/components/country-selector"
import HeroBanner from "@/components/hero-banner"
import ProductGrid from "@/components/product-grid"
import Header from "@/components/header"

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("USA")

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Country Selector */}
      <CountrySelector selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />

      {/* Hero Banner */}
      <HeroBanner country={selectedCountry} />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Best Sellers in {selectedCountry}</h2>
          <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            View More <ChevronRight size={20} />
          </a>
        </div>

        <ProductGrid country={selectedCountry} />
      </div>

      {/* Our Picks Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Picks</h2>
          <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            View More <ChevronRight size={20} />
          </a>
        </div>

        <ProductGrid country={selectedCountry} variant="picks" />
      </div>
    </div>
  )
}
