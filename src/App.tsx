import { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DramaDetail } from './components/DramaDetail';
import { HomePage } from './pages/HomePage';
import { HotPage } from './pages/HotPage';
import { ForYouPage } from './pages/ForYouPage';
import { LibraryPage } from './pages/LibraryPage';
import { WatchPage } from './pages/WatchPage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { useDramas } from './hooks/useDramas';
import { useLibrary } from './hooks/useLibrary';
import type { TabType, Drama, ContentGroup } from './types/drama';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [watchingDrama, setWatchingDrama] = useState<Drama | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ContentGroup | null>(null);
  const { contentGroups, allDramas, isLoading } = useDramas();
  const { library, isInLibrary, toggleLibrary, removeFromLibrary } = useLibrary();

  const handleDramaClick = (drama: Drama) => {
    setSelectedDrama(drama);
  };

  const handleCloseDetail = () => {
    setSelectedDrama(null);
  };

  const handleWatch = (drama: Drama) => {
    setSelectedDrama(null);
    setWatchingDrama(drama);
  };

  const handleCloseWatch = () => {
    setWatchingDrama(null);
  };

  const handleSeeAll = (group: ContentGroup) => {
    setSelectedCategory(group);
  };

  const handleSearchDramaClick = (drama: Drama) => {
    setShowSearch(false);
    setSelectedDrama(drama);
  };

  const handleCategoryDramaClick = (drama: Drama) => {
    setSelectedDrama(drama);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            contentGroups={contentGroups}
            allDramas={allDramas}
            isLoading={isLoading}
            onDramaClick={handleDramaClick}
            onSeeAll={handleSeeAll}
          />
        );
      case 'hot':
        return (
          <HotPage
            allDramas={allDramas}
            isLoading={isLoading}
            onDramaClick={handleDramaClick}
          />
        );
      case 'foryou':
        return (
          <ForYouPage
            onDramaClick={handleDramaClick}
          />
        );
      case 'library':
        return (
          <LibraryPage
            library={library}
            onDramaClick={handleDramaClick}
            onRemove={removeFromLibrary}
          />
        );
      default:
        return null;
    }
  };

  if (watchingDrama) {
    return (
      <WatchPage
        drama={watchingDrama}
        isInLibrary={isInLibrary(watchingDrama.shortPlayId)}
        onBack={handleCloseWatch}
        onToggleLibrary={() => toggleLibrary(watchingDrama)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl" />
      </div>
      <div className="relative z-10">
        <Header onSearchClick={() => setShowSearch(true)} />
        <main className="pt-2">
          {renderContent()}
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {selectedDrama && (
        <DramaDetail
          drama={selectedDrama}
          isInLibrary={isInLibrary(selectedDrama.shortPlayId)}
          onClose={handleCloseDetail}
          onWatch={() => handleWatch(selectedDrama)}
          onToggleLibrary={() => toggleLibrary(selectedDrama)}
        />
      )}

      {showSearch && (
        <SearchPage
          onClose={() => setShowSearch(false)}
          onDramaClick={handleSearchDramaClick}
        />
      )}

      {selectedCategory && (
        <CategoryPage
          group={selectedCategory}
          onBack={() => setSelectedCategory(null)}
          onDramaClick={handleCategoryDramaClick}
        />
      )}
    </div>
  );
}

export default App;
