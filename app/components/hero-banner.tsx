"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  promotionId: string
}

const bannersByCountry: Record<string, Banner[]> = {
  USA: [
    {
      id: "1",
      title: "BLACK FRIDAY",
      subtitle: "UP TO 50% OFF",
      image: "/black-friday-sale-beauty-products.jpg",
      promotionId: "1958",
    },
    {
      id: "2",
      title: "SKINCARE COLLECTION",
      subtitle: "NEW ARRIVALS",
      image: "/luxury-skincare-products-display.jpg",
      promotionId: "1959",
    },
  ],
  Canada: [
    {
      id: "1",
      title: "WINTER BEAUTY",
      subtitle: "STAY GLOWING",
      image: "/winter-beauty-promotion.jpg",
      promotionId: "1960",
    },
    {
      id: "2",
      title: "MAKEUP ESSENTIALS",
      subtitle: "MUST-HAVES",
      image: "/makeup-essentials-collection.jpg",
      promotionId: "1961",
    },
  ],
  UK: [
    {
      id: "1",
      title: "PREMIUM BRANDS",
      subtitle: "EXCLUSIVE SELECTION",
      image: "/premium-beauty-brands.jpg",
      promotionId: "1962",
    },
    {
      id: "2",
      title: "SEASONAL SALE",
      subtitle: "LIMITED TIME",
      image: "/seasonal-sale-beauty.jpg",
      promotionId: "1963",
    },
  ],
  Australia: [
    {
      id: "1",
      title: "SUMMER GLOW",
      subtitle: "BE RADIANT",
      image: "/summer-glow-skincare.jpg",
      promotionId: "1964",
    },
    {
      id: "2",
      title: "K-BEAUTY STARS",
      subtitle: "BESTSELLERS",
      image: "/korean-beauty-products.jpg",
      promotionId: "1965",
    },
  ],
  Singapore: [
    {
      id: "1",
      title: "TROPICAL BEAUTY",
      subtitle: "HYDRATION FOCUS",
      image: "/tropical-hydrating-beauty.jpg",
      promotionId: "1966",
    },
    {
      id: "2",
      title: "FESTIVAL SALE",
      subtitle: "MEGA DISCOUNTS",
      image: "/festival-sale-beauty.jpg",
      promotionId: "1967",
    },
  ],
}

export default function HeroBanner({ country }: { country: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const banners = bannersByCountry[country] || bannersByCountry["USA"]

  useEffect(() => {
    setCurrentIndex(0)
  }, [country])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative group">
        {/* Banner Image */}
        <Link href={`/event/${currentBanner.promotionId}`}>
          <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden cursor-pointer">
            <img
              src={currentBanner.image || "/placeholder.svg"}
              alt={currentBanner.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center">
              <h2 className="text-5xl font-bold text-white mb-4">{currentBanner.title}</h2>
              <p className="text-2xl text-white">{currentBanner.subtitle}</p>
            </div>
          </div>
        </Link>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-gray-900 w-8" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
