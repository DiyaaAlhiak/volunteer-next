export default function Hero() {
  return (
    <section className="relative py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Official Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            <span className="block">ambassadors</span>
          </h1>

          {/* Official Description */}
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors
            ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors
          </p>

          {/* Primary CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <span className="relative z-10">ambassadors</span>
              <div className="absolute inset-0 bg-emerald-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-300 rounded-full opacity-20 blur-xl"></div>
    </section>
  );
}
