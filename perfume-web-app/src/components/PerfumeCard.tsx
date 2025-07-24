import type { Perfume } from '../types/perfume';
import PerfumeImage from './PerfumeImage';

interface PerfumeCardProps {
  perfume: Perfume;
  onClick: (perfume: Perfume) => void;
}

export function PerfumeCard({ perfume, onClick }: PerfumeCardProps) {

  return (
    <div 
      className="perfume-card p-0 cursor-pointer group relative"
      onClick={() => onClick(perfume)}
    >
      {/* Image */}
      <div className="aspect-[3/4] mb-4 relative group">
        <PerfumeImage 
          perfume={perfume}
          className="group-hover:scale-110 transition-transform duration-500"
          width={240}
          height={320}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 line-clamp-2 text-lg leading-tight mb-2">
            {perfume.title || perfume.name}
          </h3>
          <p className="gradient-text font-bold text-base">
            {perfume.brand}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          {perfume.year && (
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
              {perfume.year}
            </span>
          )}
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-sm font-bold">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}