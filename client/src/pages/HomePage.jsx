import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Hero секція */}
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <span className="text-[#ff6b2b] text-sm font-semibold uppercase tracking-widest mb-4">
          Crisis & Compassion
        </span>
        <h1 className="text-5xl font-bold text-white mb-6 max-w-3xl leading-tight">
          Every Animal Deserves a <span className="text-[#ff6b2b]">Second Chance</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          We rescue, rehabilitate, and rehome pets from crisis zones. 
          Join our mission to give animals a safe future.
        </p>
        <div className="flex gap-4">
          <Link
            to="/finding-new-beginnings"
            className="bg-[#ff6b2b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e55a1f] transition-colors"
          >
            Find a Pet
          </Link>
          <Link
            to="/success-stories"
            className="border border-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:border-gray-400 transition-colors"
          >
            Success Stories
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto px-8 pb-24">
        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center border border-[#222]">
          <div className="text-3xl font-bold text-[#ff6b2b]">1,200+</div>
          <div className="text-gray-400 text-sm mt-1">Animals Rescued</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center border border-[#222]">
          <div className="text-3xl font-bold text-[#ff6b2b]">850+</div>
          <div className="text-gray-400 text-sm mt-1">Successful Adoptions</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center border border-[#222]">
          <div className="text-3xl font-bold text-[#ff6b2b]">24/7</div>
          <div className="text-gray-400 text-sm mt-1">Active Support</div>
        </div>
      </div>
    </div>
  )
}

export default HomePage