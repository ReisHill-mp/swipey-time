import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import type { Category, CategoryWithIdeas } from '../types/category';

interface CategoryData extends Category {
  folderName: string;
  imageUrls?: string[];
}

const categoryFolders = [
  { folder: 'beautiful-blooms', name: 'Beautiful Blooms', emoji: '🌸', color: 'bg-pink-400' },
  { folder: 'hampers', name: 'Hampers', emoji: '🧺', color: 'bg-orange-400' },
  { folder: 'experience-gift-vouchers', name: 'Experience Gift Vouchers', emoji: '🎟️', color: 'bg-indigo-400' },
  { folder: 'celebrate-with-a-pop', name: 'Celebrate With A Pop', emoji: '🍾', color: 'bg-red-400' },
  { folder: 'virgin-wines', name: 'Virgin Wines', emoji: '🍷', color: 'bg-purple-400' },
  { folder: 'our-top-categories', name: 'Our Top Categories', emoji: '⭐', color: 'bg-yellow-400' },
  { folder: 'great-value-gift-sets', name: 'Great Value Gift Sets', emoji: '💰', color: 'bg-green-400' },
  { folder: 'for-the-sweet-tooth', name: 'For The Sweet Tooth', emoji: '🍫', color: 'bg-pink-300' },
  { folder: 'explore-our-brands', name: 'Explore Our Brands', emoji: '🛍️', color: 'bg-blue-400' },
  { folder: 'fun-and-games', name: 'Fun and Games', emoji: '🎲', color: 'bg-teal-400' },
];

const categories: CategoryData[] = categoryFolders.map((item, index) => ({
  id: index + 1,
  name: item.name,
  emoji: item.emoji,
  color: item.color,
  folderName: item.folder,
}));

export const SwipeyTime = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<CategoryWithIdeas[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isInitialCard, setIsInitialCard] = useState(true);
  const [categoriesWithImages, setCategoriesWithImages] = useState<CategoryData[]>([]);
  const [triggerSwipe, setTriggerSwipe] = useState< 'right' | 'left' | null>(null); // State to trigger swipe animation
  const [isAnimating, setIsAnimating] = useState(false); // State to track if card is animating
  const [hasInteractedWithInitialCard, setHasInteractedWithInitialCard] = useState(false); // State to track if user interacted with initial card

  useEffect(() => {
    const loadImages = () => {
      const categoriesWithImageData = categories.map(category => {
        let imageUrls: string[] = [];
        // Use the actual filenames obtained from listing directories
        switch (category.folderName) {
          case 'beautiful-blooms':
            imageUrls = [
              '/img/beautiful-blooms/hjhj-sIl76H7N-large.jpg',
              '/img/beautiful-blooms/tofy large-AFduMUHk-large.jpg',
              '/img/beautiful-blooms/LARGE BLUSH-mdmoRm6K-large.jpg',
              '/img/beautiful-blooms/Flowers (Adults)_Category Image_Pink Blush-6418e0efa072215de9e3cf5070ef1eab.jpeg',
            ];
            break;
          case 'hampers':
            imageUrls = [
              '/img/hampers/HAMP258_1-ar3zpZvb-large.jpg',
              '/img/hampers/HAMP599-tyrGVQL9-large.png',
              '/img/hampers/HAMP248_1-bLx2aDvw-large.jpg',
              '/img/hampers/Happy Birthday Hampe-GNOPOfHa-large.jpg',
            ];
            break;
          case 'experience-gift-vouchers':
            imageUrls = [
              '/img/experience-gift-vouchers/DEXP075-uToNcYaZ-large.png',
              '/img/experience-gift-vouchers/hello 8-U-ouhVkT-large.jpg',
              '/img/experience-gift-vouchers/cineworld gift vouch-4Sbxndwp-large.png',
              '/img/experience-gift-vouchers/cinema gift voucher-4ATCPzxB-large.png',
            ];
            break;
          case 'celebrate-with-a-pop':
            imageUrls = [
              '/img/celebrate-with-a-pop/img-eAGwBI07-large.jpg',
              '/img/celebrate-with-a-pop/fr w1-S0X6Ja8h-large.jpg',
              '/img/celebrate-with-a-pop/hbd-wuiVvXKo-large.jpg',
              '/img/celebrate-with-a-pop/CHOC1093B_1-lItpMMx_-large.jpg',
            ];
            break;
          case 'virgin-wines':
            imageUrls = [
              '/img/virgin-wines/img-HeqAcxEJ-large.jpg',
              '/img/virgin-wines/img-4CxAS5X1-large.jpg',
              '/img/virgin-wines/img-DE1H-9rd-large.jpg',
              '/img/virgin-wines/img-xHcaNISF-large.jpg',
            ];
            break;
          case 'our-top-categories':
            imageUrls = [
              '/img/our-top-categories/Experience Gifts (Adults)_Category Image_Two Night Glamping-731009a8ac0f09e8680553f68d65f111.jpeg',
              '/img/our-top-categories/Chocolate & Sweets (Adults)_Category Image_SWEE758-840b36b128acbcc9a05f16efc0c330f0.jpeg',
              '/img/our-top-categories/Hampers (Adults)_Category Image_HAMP109-b9c019608713cc970bbb9fd0276ed62a.jpeg',
              '/img/our-top-categories/Flowers (Adults)_Category Image_Pink Blush-6418e0efa072215de9e3cf5070ef1eab.jpeg',
            ];
            break;
          case 'great-value-gift-sets':
            imageUrls = [
              '/img/great-value-gift-sets/jd 1-KnBFy7mI-large.jpg',
              '/img/great-value-gift-sets/Lost in moments new -bElFK4s5-large.jpg',
              '/img/great-value-gift-sets/PB GS L 2-Ok3-Rdg4-large.jpg',
              '/img/great-value-gift-sets/Ultimate Craft beer -iZRDXXb2-large.jpg',
            ];
            break;
          case 'for-the-sweet-tooth':
            imageUrls = [
              '/img/for-the-sweet-tooth/image-033-83_pA_-k-large.jpg',
              '/img/for-the-sweet-tooth/CHOC1358_1-SZ2XWy09-large.jpg',
              '/img/for-the-sweet-tooth/nutty-3-vi9taj-large.jpg',
              '/img/for-the-sweet-tooth/Hotel Chocolat (Adults)_Brand Image_CHOC1452-67b1f476a5ce3da68c665f9d53eee2cb.jpeg',
            ];
            break;
          case 'explore-our-brands':
             // This folder seems to have logos, not product images. Skipping for now or you can add specific logic if needed
             imageUrls = [
              '/img/explore-our-brands/og-logo-next.jpg',
              '/img/explore-our-brands/images.png',
              '/img/explore-our-brands/buyagift-logo-vector.png',
              '/img/explore-our-brands/Hotel-Chocolat-logo.f3a6e24d.png',
             ];
            break;
          case 'fun-and-games':
            imageUrls = [
              '/img/fun-and-games/MYO16_1-Sk9i4IP3-large.jpg',
              '/img/fun-and-games/BOOK15_1-wybQdyep-large.jpg',
              '/img/fun-and-games/BAL113-Happy Birthda-RQdzWObU-large.jpeg',
              '/img/fun-and-games/Sucker_1-FVmbH6Cy-large.jpg',
            ];
            break;
          default:
            imageUrls = []; // Default to empty if folder not matched
        }
        return { ...category, imageUrls };
      });
      setCategoriesWithImages(categoriesWithImageData);
    };

    loadImages();
  }, []);

  // Reset trigger swipe after animation starts
  useEffect(() => {
    if (triggerSwipe) {
      setIsAnimating(true); // Start animating
      const timer = setTimeout(() => {
        setTriggerSwipe(null);
        // Don't reset isAnimating here - let handleNextCard do it
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [triggerSwipe]);

  const handleSwipeRight = useCallback(() => {
    if (isInitialCard) {
      // On initial card, both left and right swipes trigger the start
      setHasInteractedWithInitialCard(true);
      setIsInitialCard(false);
      return;
    }

    const category = categories[currentIndex];
    if (category && !selectedCategories.some(sc => sc.id === category.id)) {
      setSelectedCategories(prev => [...prev, { ...category }]);
    }
    handleNextCard();
  }, [currentIndex, isInitialCard, selectedCategories]);

  const handleSwipeLeft = useCallback(() => {
    if (isInitialCard) {
      // On initial card, both left and right swipes trigger the start
      setHasInteractedWithInitialCard(true);
      setIsInitialCard(false);
      return;
    }
    handleNextCard();
  }, [isInitialCard]);

  const handleNextCard = useCallback(() => {
    setIsAnimating(false); // Reset animating state after card is removed
    setCurrentIndex(prev => {
      const nextIndex = prev + 1;
      if (nextIndex >= categories.length) {
        setShowResults(true);
      }
      return nextIndex;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedCategories([]);
    setShowResults(false);
    setIsInitialCard(true);
    setHasInteractedWithInitialCard(false);
  }, []);

  const progress = (currentIndex / categories.length) * 100;

  const handleButtonSwipeRight = useCallback(() => {
    if (isAnimating) return; // Prevent multiple swipes
    if (isInitialCard) {
      setIsInitialCard(false);
      return;
    }
    setTriggerSwipe('right');
  }, [isInitialCard, isAnimating]);

  const handleButtonSwipeLeft = useCallback(() => {
    if (isAnimating) return; // Prevent multiple swipes
    if (isInitialCard) {
      setIsInitialCard(false);
      return;
    }
    setTriggerSwipe('left');
  }, [isInitialCard, isAnimating]);

  if (showResults) {
    return (
      <div className="w-full max-w-md mx-auto mt-24 p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Your Selected Categories:
        </h2>
        <ul className="space-y-3">
          {selectedCategories.length > 0 ? (
            selectedCategories.map(category => (
              <li
                key={category.id}
                className={`category-result-item p-4 rounded-lg shadow-md ${category.color} text-white`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {category.emoji} {category.name}
                  </span>
                  <button
                    className="text-xs sm:text-sm bg-white/20 hover:bg-white/40 text-white font-medium py-2 px-3 rounded-md transition-colors"
                  >
                    ✨ Get Ideas
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-3 rounded-md bg-gray-100 text-gray-600 text-center">
              No categories selected. Try again!
            </li>
          )}
        </ul>
        <button
          onClick={handleRestart}
          className="mt-8 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-600 transition-colors w-full"
        >
          Start Over
        </button>
      </div>
    );
  }

  const cardsToDisplay = categoriesWithImages.slice(currentIndex, currentIndex + 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-slate-50 p-4 z-50 w-full">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={handleRestart}
            className="text-2xl font-bold text-gray-600"
          >
            ×
          </button>
          <span className="text-lg font-semibold text-gray-700">
            Recommended gifts
          </span>
          <div className="w-6" />
        </div>
        {!isInitialCard && (
          <div className="progress-bar-container mt-3 mx-auto">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex-grow flex items-center justify-center w-full mt-24 mb-32">
        <div className="card-stack w-[320px] h-[470px] relative">
          {isInitialCard ? (
            <Card
              isInitialCard
              // onSwipeRight and onSwipeLeft for the initial card now trigger the start
              onSwipeRight={() => setIsInitialCard(false)}
              onSwipeLeft={() => setIsInitialCard(false)}
              totalCategories={categories.length}
              hasInteractedWithInitialCard={hasInteractedWithInitialCard}
              onInitialCardInteraction={() => setHasInteractedWithInitialCard(true)}
            />
          ) : (
            <>
              {/* Only render the top card with swipe triggers */}
              {cardsToDisplay[0] && (
                <div
                  key={cardsToDisplay[0].id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 3,
                  }}
                >
                  <Card
                    category={cardsToDisplay[0]}
                    onSwipeRight={handleSwipeRight}
                    onSwipeLeft={handleSwipeLeft}
                    imageUrls={cardsToDisplay[0].imageUrls}
                    triggerSwipeRight={triggerSwipe === 'right'}
                    triggerSwipeLeft={triggerSwipe === 'left'}
                  />
                </div>
              )}
              {/* Render the stacked cards without swipe triggers */}
              {cardsToDisplay.slice(1).map((category, index) => (
                <div
                  key={category.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translateY(${index * 8 + 8}px) scale(${1 - (index + 1) * 0.05}) rotate(${(index + 1) * 2}deg)`,
                    zIndex: 2 - index,
                    transition: 'all 0.3s ease-out',
                  }}
                >
                  <Card
                    category={category}
                    onSwipeRight={handleSwipeRight}
                    onSwipeLeft={handleSwipeLeft}
                    imageUrls={category.imageUrls}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-50 p-4 pb-6 z-50 w-full">
        {isInitialCard ? (
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center mb-3 max-w-md mx-auto px-6 space-y-3"
          >
             {/* Create Gift Suggestions Button */}
            <button
              onClick={() => { setHasInteractedWithInitialCard(true); handleSwipeRight(); }}
              className="w-full bg-[#0054C8] text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              Create gift suggestions
            </button>
             {/* Skip Gifts Button */}
            <button
              onClick={() => { setHasInteractedWithInitialCard(true); handleSwipeLeft(); }}
              className="text-sm text-gray-600 hover:underline"
            >
              skip gifts
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex justify-around items-center mb-3 max-w-md mx-auto px-6 space-x-3"
          >
            {/* Hide Button */}
            <button
              onClick={handleButtonSwipeLeft}
              className="flex-1 bg-[#484848] text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              disabled={isAnimating}
            >
              <img src="/img/Icon.System.Eye.Closed.svg" alt="Hide" className="w-5 h-5" />
              <span>Hide</span>
            </button>
            {/* Add Button */}
            <button
              onClick={handleButtonSwipeRight}
              className="flex-1 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              style={{ backgroundColor: '#0054C8' }}
              disabled={isAnimating}
            >
              <img src="/img/Icon.System.Tick.svg" alt="Add" className="w-5 h-5" />
              <span>Add</span>
            </button>
          </motion.div>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="text-center max-w-md mx-auto"
        >
          {!isInitialCard && (
            <button
              onClick={() => setShowResults(true)}
              className="mt-4 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-green-600 transition-colors w-full md:w-auto"
            >
              Show {selectedCategories.length} of {categories.length} categories
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}; 