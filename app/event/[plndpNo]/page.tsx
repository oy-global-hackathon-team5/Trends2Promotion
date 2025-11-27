"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useState, use } from "react"
import Header from "@/components/header"

export default function EventDetailPage({ params }: { params: Promise<{ plndpNo: string }> }) {
  const [selectedCountry, setSelectedCountry] = useState("USA")

  const resolvedParams = use(params)
  const promotionId = resolvedParams.plndpNo

  // Mock promotion data based on promotion ID
  const promotions: Record<string, any> = {
    "1958": {
      image: "/black-friday-beauty-products.jpg",
      title: "Black Friday Beauty Sale",
      description:
        "Discover our curated selection of premium skincare and makeup products with exclusive discounts on the most sought-after beauty brands.",
    },
    "1959": {
      image: "/skincare-collection-new-arrivals.jpg",
      title: "New Skincare Arrivals",
      description:
        "Explore our latest collection of innovative skincare solutions crafted with the finest natural ingredients and scientific breakthroughs.",
    },
    "1960": {
      image: "/winter-beauty-skincare.jpg",
      title: "Winter Beauty Collection",
      description:
        "Protect and nourish your skin through the seasons with our specially selected winter beauty essentials.",
    },
  }

  const promotion = promotions[promotionId] || promotions["1958"]

  // Sample products for the promotion
  const products = [
    { id: 1, name: "Premium Face Serum", price: 45, discount: 50, image: "/face-serum.jpg" },
    { id: 2, name: "Hydrating Moisturizer", price: 38, discount: 40, image: "/hydrating-moisturizer.jpg" },
    { id: 3, name: "Cleansing Milk", price: 28, discount: 35, image: "/cleansing-milk.jpg" },
    { id: 4, name: "Eye Cream", price: 52, discount: 45, image: "/eye-cream.jpg" },
    { id: 5, name: "Essence Toner", price: 32, discount: 40, image: "/essence-toner.jpg" },
    { id: 6, name: "Sheet Mask Pack", price: 15, discount: 30, image: "/sheet-mask.jpg" },
    { id: 7, name: "Sunscreen SPF 50", price: 35, discount: 40, image: "/sunscreen.png" },
    { id: 8, name: "Night Sleeping Mask", price: 42, discount: 50, image: "/night-mask.jpg" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Navigation Back Button */}
      <div className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition w-fit text-sm font-light"
          >
            <ChevronLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto" style={{ maxWidth: "800px" }}>
        {/* Promotion Image Section with Overlay Text */}
        <div className="relative w-full bg-stone-100" style={{ height: "2000px" }}>
          <img
            src={promotion.image || "/placeholder.svg?height=2000&width=800"}
            alt={promotion.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end">
            <div className="px-6 pb-12 text-white">
              <h1 className="text-4xl font-light tracking-tight mb-4 leading-tight">{promotion.title}</h1>
              <p className="text-sm font-light text-stone-200 leading-relaxed max-w-sm">{promotion.description}</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="px-6 py-16">
          <h2 className="text-2xl font-light text-stone-900 mb-12 tracking-wide">FEATURED PRODUCTS</h2>

          <div className="grid grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative bg-stone-100 rounded-sm overflow-hidden mb-4 aspect-square group-hover:shadow-lg transition duration-300">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-semibold">
                    -{product.discount}%
                  </div>
                </div>
                <p className="text-stone-900 font-light text-sm mb-2 line-clamp-2">{product.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-light text-stone-900">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-xs text-stone-400 line-through">${product.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/">
              <button className="px-10 py-3 bg-stone-900 text-white text-sm font-light tracking-wide rounded-sm hover:bg-stone-800 transition">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
