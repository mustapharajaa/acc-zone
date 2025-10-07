import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
interface Game {
  name: string;
  icon: string;
}

interface Category {
  name: string;
  count: number;
}

interface Seller {
  server: string;
  sellerName: string;
  sellerAvatar: string;
  rating: number;
  reviews: number;
  memberSince: string;
  minOrder?: number | string;
  maxOrder?: number | string;
  inStock?: number | string;
  price: number;
  isOnline: boolean;
  isPinned?: boolean;
  averageTime?: string;
}

// --- SVG ICONS ---
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const UkFlagIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="15">
        <clipPath id="t">
            <path d="M0,0 v30 h60 v-30 z"/>
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
    </svg>
);

const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled = true }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const PinnedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// --- CONSTANTS / MOCK DATA ---
const GAMES: Game[] = [
  { name: 'Facebook', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1024px-Facebook_f_logo_%282019%29.svg.png' },
  { name: 'Instagram', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png' },
  { name: 'x.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/X_logo_2023_original.svg/1200px-X_logo_2023_original.svg.png' },
  { name: 'reddit', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/1200px-Reddit_Logo_Icon.svg.png' },
  { name: 'Pinterest', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png' },
  { name: 'Tiktok', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png' },
  { name: 'Snapchat', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1200px-Snapchat_logo.svg.png' },
  { name: 'Telegram', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png' },
];

const gameColors: { [key: string]: string } = {
  'Facebook': 'bg-blue-600',
  'Instagram': 'bg-pink-500',
  'x.com': 'bg-white',
  'reddit': 'bg-orange-500',
  'Pinterest': 'bg-red-600',
  'Tiktok': 'bg-white',
  'Snapchat': 'bg-yellow-400',
  'Telegram': 'bg-blue-400',
};

const CATEGORIES: Category[] = [
  { name: 'Accounts', count: 2067 },
  { name: 'Smm', count: 3224 },
  { name: 'aged acc', count: 1216 },
  { name: 'Forum', count: 1025 },
  { name: 'Services', count: 584 },
  { name: 'deal', count: 7548 },
];

const SELLERS: Seller[] = [
    { server: 'monetized', sellerName: 'VirtTopSeller777', sellerAvatar: 'https://i.pravatar.cc/40?u=virt', rating: 5, reviews: 6378, memberSince: '4 years', inStock: '∞', price: 0.00045, isOnline: true, isPinned: true },
    { server: 'CCDplanet.ru', sellerName: 'Cadzo', sellerAvatar: 'https://i.pravatar.cc/40?u=cadzo', rating: 5, reviews: 523, memberSince: '8 years', inStock: '∞', price: 0.000015, isOnline: true },
    { server: '50-1k', sellerName: 'VirtTopSeller777', sellerAvatar: 'https://i.pravatar.cc/40?u=virt', rating: 5, reviews: 6378, memberSince: '4 years', inStock: '∞', price: 0.00045, isOnline: true },
    { server: '2k-50k', sellerName: 'HotpointA', sellerAvatar: 'https://i.pravatar.cc/40?u=hotpoint', rating: 0, reviews: 9, memberSince: '1 year', inStock: '30 000 kk', price: 0.00074, isOnline: false },
    { server: 'no strike', sellerName: 'VirtTopSeller777', sellerAvatar: 'https://i.pravatar.cc/40?u=virt', rating: 5, reviews: 6378, memberSince: '4 years', inStock: '∞', price: 0.00074, isOnline: true },
    { server: '1m', sellerName: 'Konstantin72720101', sellerAvatar: 'https://i.pravatar.cc/40?u=konstantin', rating: 4, reviews: 164, memberSince: '2 years', inStock: '20 000 kk', price: 0.00104, isOnline: true },
];

const SMM_SELLERS: Seller[] = [
    { server: 'Subscribers', sellerName: 'SMMKing', sellerAvatar: 'https://i.pravatar.cc/40?u=smmking', rating: 5, reviews: 10250, memberSince: '3 years', minOrder: 100, maxOrder: 50000, price: 0.01500, isOnline: true, isPinned: true, averageTime: '1 hour' },
    { server: 'views', sellerName: 'TubeGrower', sellerAvatar: 'https://i.pravatar.cc/40?u=tubegrower', rating: 4, reviews: 4200, memberSince: '5 years', minOrder: 1000, maxOrder: 1000000, price: 0.02000, isOnline: true, averageTime: '30 minutes' },
    { server: 'watchtime', sellerName: 'WatchBoost', sellerAvatar: 'https://i.pravatar.cc/40?u=watchboost', rating: 5, reviews: 850, memberSince: '2 years', minOrder: 10, maxOrder: 4000, price: 1.50, isOnline: false, averageTime: '6 hours' },
    { server: 'comments', sellerName: 'CommentCrew', sellerAvatar: 'https://i.pravatar.cc/40?u=commentcrew', rating: 4, reviews: 1200, memberSince: '1 year', minOrder: 10, maxOrder: 1000, price: 0.10, isOnline: true, averageTime: '2 hours' },
];

// --- HELPER COMPONENTS ---
const CurvedWatermark: React.FC = () => (
    <svg viewBox="0 0 950 950" className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <defs>
        <path id="youtubeCurve" d="M 250, 350 A 200 200 0 0 1 700, 350" fill="transparent" />
      </defs>
      <text className="text-8xl font-black tracking-wider uppercase opacity-80" fill="white">
        <textPath href="#youtubeCurve" startOffset="50%" textAnchor="middle">
          YOUTUBE
        </textPath>
      </text>
    </svg>
  );

const Header: React.FC = () => (
    <header className="bg-white sticky top-0 z-30 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                    <div className="relative">
                        <a href="#" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-blue-600">acc</span>
                            <span className="text-2xl font-bold text-purple-600">zone</span>
                        </a>
                        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-xs font-bold text-green-500">Beta</span>
                    </div>
                    <div className="relative hidden md:block">
                        <input type="text" placeholder="search by name" className="bg-gray-100 rounded-lg py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <div className="flex items-center justify-end flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
                    <a href="#" className="hover:text-blue-600 flex items-center">
                        Support <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </a>
                    <a href="#" className="hover:text-blue-600">Start selling</a>
                    <a href="#" className="hover:text-blue-600">Log In/Sign Up</a>
                    <a href="#" className="flex items-center hover:text-blue-600">
                        <UkFlagIcon />
                        <span className="ml-2">English</span>
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </a>
                    <a href="#" className="flex items-center hover:text-blue-600">
                        USD <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    </header>
);

const Filters: React.FC<{ categoryName: string; sellers: Seller[] }> = ({ categoryName, sellers }) => {
    const isSmm = categoryName === 'Smm';
    
    const options = [...new Set(sellers.map(s => s.server))];
    const defaultOptionText = isSmm ? 'Service' : 'Server';

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Left column */}
            <div>
                {/* Server dropdown */}
                <div className="w-64">
                    <div className="relative border border-gray-300 rounded-md shadow-sm">
                        <select
                            id="server"
                            name="server"
                            className="block w-full pl-3 pr-10 py-2 text-base border-transparent bg-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
                        >
                            {!isSmm && <option>{defaultOptionText}</option>}
                            {options.map((option, index) => (
                                <option key={index}>{option}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDownIcon className="h-4 w-4"/>
                        </div>
                    </div>
                </div>
                {/* Online sellers toggle */}
                <div className="mt-4 flex items-center">
                    <label htmlFor="online-only" className="text-sm font-medium text-gray-700 mr-3">
                      {isSmm ? 'stable services' : 'Online sellers only'}
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="online-only" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="online-only" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                </div>
            </div>
            <style>{`
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #3b82f6;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #3b82f6;
                }
            `}</style>
        </div>
    );
};


const SellerList: React.FC<{ sellers: Seller[]; activeCategory: string }> = ({ sellers, activeCategory }) => {
    const isSmm = activeCategory === 'Smm';
    return (
    <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                 <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    {isSmm ? 'id' : 'Server'}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    {isSmm ? 'Service' : 'Seller'}
                                </th>
                                
                                {isSmm ? (
                                    <>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Min order
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Max order
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Average time
                                        </th>
                                    </>
                                ) : (
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        In stock
                                    </th>
                                )}

                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-gray-900">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                      Price/1kk <ArrowUpIcon className="w-3 h-3" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sellers.map((seller, index) => {
                                const sellerInfoCell = (
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <img className="h-10 w-10 rounded-full" src={seller.sellerAvatar} alt={seller.sellerName} />
                                             {seller.isOnline ? <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span> : <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white"></span>}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900 flex items-center gap-1">
                                                {seller.sellerName}
                                            </div>
                                            {seller.rating > 0 ? (
                                                <div className="flex items-center mt-1">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon key={i} className="h-4 w-4 text-yellow-400" filled={i < seller.rating} />
                                                        ))}
                                                    </div>
                                                    <div className="text-gray-500 ml-1.5">{seller.reviews}</div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 text-sm mt-1">{seller.reviews} reviews</div>
                                            )}
                                            <div className="text-gray-500 text-xs mt-1">{seller.memberSince}</div>
                                        </div>
                                    </div>
                                );
                                
                                const idCellContent = isSmm ? seller.server : seller.server;
                                const serviceCellContent = isSmm ? sellerInfoCell : sellerInfoCell;


                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {idCellContent}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {serviceCellContent}
                                        </td>

                                        {isSmm ? (
                                            <>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{seller.minOrder}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{seller.maxOrder}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{seller.averageTime}</td>
                                            </>
                                        ) : (
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{seller.inStock}</td>
                                        )}

                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                                            <div className="flex items-center justify-start">
                                                <span className="font-bold text-gray-900 text-base">{Number(seller.price).toFixed(5)} $</span>
                                                {seller.isPinned && <span className="ml-2 text-yellow-500"><PinnedIcon className="w-4 h-4" /></span>}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    )
};

const CurvedText: React.FC = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div
                className="absolute text-white text-xl font-semibold tracking-wider uppercase opacity-70"
                style={{ top: '68%', left: '17%', transform: 'rotate(-55deg)' }}
            >Smm</div>
            <div
                className="absolute text-white text-xl font-semibold tracking-wider uppercase opacity-70"
                style={{ top: '61%', left: '26%', transform: 'rotate(-35deg)' }}
            >Accounts</div>
            <div
                className="absolute text-white text-xl font-semibold tracking-wider uppercase opacity-70"
                style={{ top: '56%', left: '38%', transform: 'rotate(-15deg)' }}
            >aged acc</div>
             <div
                className="absolute text-white text-xl font-semibold tracking-wider uppercase opacity-70"
                style={{ top: '55%', left: '50%', transform: 'rotate(5deg)' }}
            >Forum</div>
             <div
                className="absolute text-white text-xl font-semibold tracking-wider uppercase opacity-70"
                style={{ top: '58%', left: '61%', transform: 'rotate(25deg)' }}
            >Services</div>
            <div
                className="absolute text-white text-xl font-semibold tracking-wider uppercase opacity-70"
                style={{ top: '65%', left: '72%', transform: 'rotate(45deg)' }}
            >deal</div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

// Popup Component
const Popup = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      // Set a timer to close the popup after 8 seconds
      timer = setTimeout(() => {
        onClose();
      }, 8000);
    }
    // Cleanup the timer when the component unmounts or when isOpen changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Close when clicking outside the popup content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close popup"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  // Your existing component code here
  const [activeCategory, setActiveCategory] = useState<string>('Accounts');
  const [showSocialMediaPopup, setShowSocialMediaPopup] = useState(false);
  const [clickedPlatform, setClickedPlatform] = useState('');
  
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <Header />

      <main className="relative overflow-hidden">
        <div className="absolute top-0 -right-[400px] md:-right-[300px] lg:-right-[250px] xl:-right-[200px] w-[950px] h-[950px] z-0">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=2832&auto=format&fit=crop" alt="Modern YouTube gaming setup with neon lights" className="w-full h-full object-cover"/>
            </div>
            <CurvedWatermark />
            <CurvedText />
          </div>
        </div>
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 pb-32">
          <div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {GAMES.map(game => (
                <a 
                  href="#" 
                  key={game.name} 
                  className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={(e) => {
                    const socialMediaPlatforms = ['Facebook', 'Instagram', 'x.com', 'reddit', 'Pinterest', 'Tiktok', 'Snapchat', 'Telegram'];
                    if (socialMediaPlatforms.includes(game.name)) {
                      e.preventDefault();
                      setClickedPlatform(game.name);
                      setShowSocialMediaPopup(true);
                    }
                  }}
                >
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${gameColors[game.name] || 'bg-gray-200'}`}>
                    <img src={game.icon} alt={game.name} className="w-7 h-7 rounded-full object-cover p-0.5" />
                  </div>
                  <span>{game.name}</span>
                </a>
              ))}
            </div>

            <Popup isOpen={showSocialMediaPopup} onClose={() => setShowSocialMediaPopup(false)}>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">{clickedPlatform}</h3>
                <p className="mb-4">Coming soon...</p>
                <button 
                  onClick={() => setShowSocialMediaPopup(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </Popup>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-8">YOUTUBE, Services and smm</h1>
            <p className="mt-4 text-gray-600 max-w-2xl">
              Ready to dominate YouTube? Explore our marketplace for a full suite of SMM services to boost subscribers, views, and watch time. Or, jumpstart your journey by buying and selling established channels. Whether you're growing from scratch or acquiring a new asset, find everything you need right here.
            </p>

            <div className="flex flex-wrap items-end gap-3 mt-10">
              {CATEGORIES.map(cat => {
                const isDeal = cat.name === 'deal';
                const isActive = activeCategory === cat.name;
                return (
                    <div 
                      key={cat.name} 
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex flex-col items-center justify-center rounded-full cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                      isActive 
                      ? 'bg-gray-800 text-white w-32 h-32 shadow-lg' 
                      : isDeal 
                        ? 'bg-white text-blue-600 w-36 h-36 shadow-md border border-gray-200 relative left-4 z-10'
                        : 'bg-white text-blue-600 w-28 h-28 shadow-md border border-gray-200'
                    }`}>
                      <span className={`font-bold ${isActive ? 'text-lg' : 'text-base'}`}>{cat.name}</span>
                      <span className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{cat.count}</span>
                    </div>
                )
              })}
            </div>
            
            <div className="mt-12">
                {activeCategory === 'Accounts' && (
                    <>
                        <Filters categoryName={activeCategory} sellers={SELLERS} />
                        <div className="mt-6">
                            <SellerList sellers={SELLERS} activeCategory={activeCategory} />
                        </div>
                    </>
                )}
                {activeCategory === 'Smm' && (
                     <>
                        <Filters categoryName={activeCategory} sellers={SMM_SELLERS} />
                        <div className="mt-6">
                            <SellerList sellers={SMM_SELLERS} activeCategory={activeCategory} />
                        </div>
                    </>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router basename="/en/youtube">
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
};

export default App;
