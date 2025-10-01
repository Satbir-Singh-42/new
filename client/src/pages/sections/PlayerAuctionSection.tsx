import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const PlayerAuctionSection = (): JSX.Element => {
  const teamCards = [
    { id: 1, color: "bg-orange-500" },
    { id: 2, color: "bg-blue-500" },
    { id: 3, color: "bg-teal-600" },
    { id: 4, color: "bg-purple-600" },
    { id: 5, color: "bg-orange-400" },
    { id: 6, color: "bg-blue-600" },
    { id: 7, color: "bg-red-600" },
    { id: 8, color: "bg-pink-600" },
    { id: 9, color: "bg-gray-700" },
    { id: 10, color: "bg-red-500" },
  ];

  return (
    <section className="flex flex-col items-center p-5 relative w-full">
      <div className="absolute w-full h-[105.62%] top-0 left-0 bg-[linear-gradient(90deg,rgba(24,24,74,1)_0%,rgba(12,28,158,0.8)_49%,rgba(24,24,74,1)_100%)] opacity-25" />

      <div className="absolute w-full h-full top-0 left-0 shadow-[0px_10px_25px_#329ed94f] bg-[url(/figmaAssets/image-shadow.png)] bg-cover bg-[50%_50%]" />

      <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-4xl">
        <header className="flex flex-col items-center">
          <h1 className="text-center [font-family:'Work_Sans',Helvetica] font-bold text-[34px] leading-[40.8px] tracking-[0]">
            <span className="text-white"> IPL 2025 </span>
            <span className="text-[#fe6804]">Player Auction</span>
          </h1>
        </header>

        <div className="grid grid-cols-5 gap-4 w-full">
          {teamCards.map((team) => (
            <Card key={team.id} className="aspect-square border-0 shadow-lg">
              <CardContent
                className={`${team.color} h-full flex items-center justify-center p-0 rounded-lg`}>
                <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
