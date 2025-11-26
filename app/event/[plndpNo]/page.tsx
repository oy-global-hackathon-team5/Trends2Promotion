import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function EventDetailPage({ params }: { params: { plndpNo: string } }) {
  const promotionId = params.plndpNo

  // Mock promotion data based on promotion ID
  const promotions: Record<string, any> = {
    "1958": {
      title: "BLACK FRIDAY MEGA SALE",
      subtitle: "Up to 50% Off Everything",
      description:
        "Our biggest sale of the year is here! Get up to 50% off on your favorite beauty and skincare products.",
      image: "/placeholder.svg?height=600&width=1200",
      discount: "50%",
      validity: "Valid until November 29, 2024",
    },
    "1959": {
      title: "SKINCARE COLLECTION",
      subtitle: "New Arrivals",
      description: "Discover our latest skincare essentials, carefully curated for your beauty routine.",
      image: "/placeholder.svg?height=600&width=1200",
      discount: "30%",
      validity: "Limited time offer",
    },
    "1960": {
      title: "WINTER BEAUTY",
      subtitle: "Stay Glowing This Winter",
      description: "Combat dry skin and stay radiant with our winter beauty essentials.",
      image: "/placeholder.svg?height=600&width=1200",
      discount: "25%",
      validity: "Until December 31, 2024",
    },
  }

  const promotion = promotions[promotionId] || promotions["1958"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-96 bg-gray-900">
        <img src={promotion.image || "/placeholder.svg"} alt={promotion.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Promotion Info */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{promotion.title}</h1>
              <p className="text-xl text-gray-600">{promotion.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-red-500 mb-2">{promotion.discount} OFF</div>
              <p className="text-sm text-gray-500">{promotion.validity}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-700 text-lg leading-relaxed">{promotion.description}</p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Promotion Details</h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How to Use</h3>
              <p>
                Browse our collection, add items to your cart, and apply the promotion code at checkout to receive your
                discount.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Eligibility</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Valid for all registered users</li>
                <li>Cannot be combined with other promotions</li>
                <li>Excludes certain brands and products</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Validity Period</h3>
              <p>{promotion.validity}</p>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <p className="text-gray-900 font-medium">Product {item}</p>
                <p className="text-red-500 font-bold mt-2">Save ${(Math.random() * 30).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/">
            <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
