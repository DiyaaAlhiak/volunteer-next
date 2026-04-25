import React from 'react';
import Header from "@/components/Header";

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header 
        title="Challenge!!"
        description="Take on exciting challenges and make a real impact in your community"
        showButton={false}
        breadcrumb="Home / Challenge"
      />
      
      <main className="container mx-auto px-4 py-20">
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Current Challenges
            </h2>
            <p className="text-gray-700 mb-6">
              Join our ongoing challenges and compete with other volunteers to make the biggest impact.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-yellow-400 rounded-lg p-6 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Community Impact</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Complete 50 volunteer hours this month and earn special recognition
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">245 participants</span>
                  <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
                    Join Challenge
                  </button>
                </div>
              </div>
              
              <div className="border-2 border-yellow-400 rounded-lg p-6 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Team Leader</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Form and lead a volunteer team of 10+ members for a community project
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">89 participants</span>
                  <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
                    Join Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Leaderboard
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">1</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ahmed Mohammed</h4>
                    <p className="text-sm text-gray-600">850 points</p>
                  </div>
                </div>
                <span className="text-yellow-600 font-semibold">Top Performer</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">2</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Al-Rashid</h4>
                    <p className="text-sm text-gray-600">720 points</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">3</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Khalid Al-Fahad</h4>
                    <p className="text-sm text-gray-600">680 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
