
export default function AmbassadorsList() {
  const ambassadors = [
    {
      id: 1,
      name: "ambassadors",
      role: "ambassadors",
      location: "ambassadors",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      programs: 12
    },
    {
      id: 2,
      name: "ambassadors",
      role: "ambassadors",
      location: "ambassadors",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      programs: 8
    },
    {
      id: 3,
      name: "ambassadors",
      role: "ambassadors",
      location: "ambassadors",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      programs: 15
    },
    {
      id: 4,
      name: "ambassadors",
      role: "ambassadors",
      location: "ambassadors",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      programs: 6
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            ambassadors
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors ambassadors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ambassadors.map((ambassador) => (
            <div key={ambassador.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square">
                <img
                  src={ambassador.image}
                  alt={ambassador.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {ambassador.name}
                </h3>
                <p className="text-emerald-600 font-medium mb-2">
                  {ambassador.role}
                </p>
                <div className="flex items-center text-slate-600 text-sm mb-3">
                  <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {ambassador.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ml-1 ${
                          i < ambassador.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {ambassador.programs} ambassadors
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
