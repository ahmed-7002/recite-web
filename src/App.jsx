import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// API Base URL
const API_BASE = 'https://api.alquran.cloud/v1';

// LocalStorage helper functions
const LocalStorageHelper = {
  getBookmarks: () => {
    try {
      const bookmarks = localStorage.getItem('quran_bookmarks');
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch {
      return [];
    }
  },
  
  addBookmark: (bookmark) => {
    const bookmarks = LocalStorageHelper.getBookmarks();
    const exists = bookmarks.some(b => 
      b.chapterNumber === bookmark.chapterNumber && 
      b.verseNumber === bookmark.verseNumber
    );
    
    if (!exists) {
      bookmarks.unshift(bookmark);
      localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks.slice(0, 20))); // Keep only 20 bookmarks
    }
  },
  
  removeBookmark: (chapterNumber, verseNumber) => {
    const bookmarks = LocalStorageHelper.getBookmarks();
    const filtered = bookmarks.filter(b => 
      !(b.chapterNumber === chapterNumber && b.verseNumber === verseNumber)
    );
    localStorage.setItem('quran_bookmarks', JSON.stringify(filtered));
  },
  
  isBookmarked: (chapterNumber, verseNumber) => {
    const bookmarks = LocalStorageHelper.getBookmarks();
    return bookmarks.some(b => 
      b.chapterNumber === chapterNumber && 
      b.verseNumber === verseNumber
    );
  },
  
  getRecentChapters: () => {
    try {
      const recent = localStorage.getItem('quran_recent_chapters');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  },
  
  addRecentChapter: (chapter) => {
    const recent = LocalStorageHelper.getRecentChapters();
    const filtered = recent.filter(c => c.number !== chapter.number);
    filtered.unshift(chapter);
    localStorage.setItem('quran_recent_chapters', JSON.stringify(filtered.slice(0, 10))); // Keep only 10 recent
  },
  
  getLastRead: () => {
    try {
      const lastRead = localStorage.getItem('quran_last_read');
      return lastRead ? JSON.parse(lastRead) : null;
    } catch {
      return null;
    }
  },
  
  setLastRead: (reading) => {
    localStorage.setItem('quran_last_read', JSON.stringify(reading));
  }
};

// Bookmark Button Component
const BookmarkButton = ({ chapterNumber, verseNumber, chapterName, verseText, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(LocalStorageHelper.isBookmarked(chapterNumber, verseNumber));
  }, [chapterNumber, verseNumber]);

  const toggleBookmark = () => {
    if (isBookmarked) {
      LocalStorageHelper.removeBookmark(chapterNumber, verseNumber);
      setIsBookmarked(false);
    } else {
      const bookmark = {
        chapterNumber,
        verseNumber,
        chapterName,
        verseText: verseText.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      };
      LocalStorageHelper.addBookmark(bookmark);
      setIsBookmarked(true);
    }
    
    if (onBookmarkChange) {
      onBookmarkChange();
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked 
          ? 'text-yellow-400 hover:text-yellow-300' 
          : 'text-gray-400 hover:text-yellow-400'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
};

// Bookmarks Modal Component
const BookmarksModal = ({ isOpen, onClose }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setBookmarks(LocalStorageHelper.getBookmarks());
    }
  }, [isOpen]);

  const removeBookmark = (chapterNumber, verseNumber) => {
    LocalStorageHelper.removeBookmark(chapterNumber, verseNumber);
    setBookmarks(LocalStorageHelper.getBookmarks());
  };

  const goToVerse = (chapterNumber, verseNumber) => {
    navigate(`/chapter/${chapterNumber}?verse=${verseNumber}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-green-400">My Bookmarks</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {bookmarks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No bookmarks yet. Start reading and bookmark your favorite verses!</p>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-green-400 font-medium">
                      {bookmark.chapterName} - Verse {bookmark.verseNumber}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => goToVerse(bookmark.chapterNumber, bookmark.verseNumber)}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Go to verse
                      </button>
                      <button
                        onClick={() => removeBookmark(bookmark.chapterNumber, bookmark.verseNumber)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{bookmark.verseText}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Saved on {new Date(bookmark.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-400">📖</div>
              <span className="text-xl font-semibold text-white">Quran Reader</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/navigate" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Navigate Quran
              </Link>
              <button
                onClick={() => setShowBookmarks(true)}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Bookmarks</span>
              </button>
              <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                to="/navigate"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Navigate
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/navigate"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Navigate Quran
                </Link>
                <button
                  onClick={() => {
                    setShowBookmarks(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  📖 Bookmarks
                </button>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  About
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <BookmarksModal isOpen={showBookmarks} onClose={() => setShowBookmarks(false)} />
    </>
  );
};

// Loading Component
const Loading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
  </div>
);

// Home Page
const Home = () => {
  const [recentChapters, setRecentChapters] = useState([]);
  const [lastRead, setLastRead] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRecentChapters(LocalStorageHelper.getRecentChapters());
    setLastRead(LocalStorageHelper.getLastRead());
  }, []);

  const continueReading = () => {
    if (lastRead) {
      navigate(`/chapter/${lastRead.chapterNumber}?page=${lastRead.page || 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-900/80 to-gray-900/90"></div>
        
        {/* Decorative geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-emerald-400 rotate-45 rounded-lg"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-emerald-400 rotate-12 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 border border-emerald-400 rotate-45 rounded-lg"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
          {/* Bismillah Section */}
          <div  className="relative py-20 bg-cover bg-center text-center mb-16 rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80')`
        }}>
             <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
  
  <div className="relative z-10">
    <div className="inline-block relative">
      <div className="absolute inset-0 bg-emerald-400/15 blur-3xl rounded-full"></div>
      <h1 className="relative text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-emerald-300 leading-relaxed drop-shadow-2xl" 
          style={{ fontFamily: 'Uthmanic' }}>
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
      </h1>
    </div>
    <p className="text-lg md:text-xl text-gray-200 mb-8 font-light drop-shadow-lg">
      In the name of Allah, the Most Gracious, the Most Merciful
    </p>
  </div>
</div>

          {/* Main Hero Card */}
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              {/* Background image contained within the card */}
              <div className="relative bg-cover bg-center rounded-3xl overflow-hidden"
                   style={{
                     backgroundImage: `url('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80')`
                   }}>
                {/* Cinematic gradient overlay with blur */}
                
                <div className="relative bg-gradient-to-br from-gray-800/70 via-slate-800/70 to-gray-900/70 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 border border-gray-700/30 shadow-2xl">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white leading-tight drop-shadow-2xl">
                      Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Quran Reader</span>
                    </h2>
                    <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-12 max-w-4xl mx-auto font-light drop-shadow-lg">
                      A beautiful, respectful digital companion for reading and exploring the Holy Quran. 
                      Experience the sacred text with authentic Uthmani script, multiple translations, 
                      and an interface designed for contemplation and study.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                      {lastRead && (
                        <button
                          onClick={continueReading}
                          className="group relative bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-blue-500/30 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">📖</span>
                            <div className="text-left">
                              <div>Continue Reading</div>
                              <div className="text-sm opacity-90 font-normal">
                                {lastRead.chapterName} - Page {lastRead.page || 1}
                              </div>
                            </div>
                          </div>
                        </button>
                      )}
                      <Link
                        to="/navigate"
                        className="group relative bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-emerald-500/30 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🕌</span>
                          <span>Start Reading</span>
                        </div>
                      </Link>
                      <Link
                        to="/about"
                        className="group relative bg-gray-700/60 hover:bg-gray-600/70 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border border-gray-600/40 hover:border-gray-500/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📖</span>
                          <span>Learn More</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Discover the Features
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore the tools designed to enhance your Quranic reading experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📚",
                title: "Browse Chapters",
                description: "Explore all 114 Surahs with beautiful Arabic script and easy navigation through verses",
                gradient: "from-blue-500/10 to-blue-600/5"
              },
              {
                icon: "🔖",
                title: "Bookmark Verses",
                description: "Save your favorite verses and meaningful passages for easy access and reflection",
                gradient: "from-purple-500/10 to-purple-600/5"
              },
              {
                icon: "🌍",
                title: "Multiple Languages",
                description: "Read authentic translations in English, Urdu, Indonesian and other languages",
                gradient: "from-emerald-500/10 to-emerald-600/5"
              },
              {
                icon: "📱",
                title: "Continue Reading",
                description: "Pick up where you left off with automatic progress tracking across sessions",
                gradient: "from-orange-500/10 to-orange-600/5"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className={`relative bg-gradient-to-br ${feature.gradient} bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-emerald-400/30 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-2xl h-full`}>
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-4 text-emerald-400">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Section with Background */}
        <div className="relative bg-cover bg-center rounded-3xl overflow-hidden"
     style={{
       backgroundImage: `url('https://images.unsplash.com/photo-1596125160970-6f02eeba00d3?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHF1cmFufGVufDB8fDB8fHww')`
     }}>
 
  <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
  
  {/* Background decoration */}
  <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-teal-900/10 to-emerald-900/10 rounded-3xl"></div>
  <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl"></div>
  <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-400/5 rounded-full blur-2xl"></div>
          
          <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/30 shadow-2xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Quick Access
              </h3>
              <p className="text-gray-400 text-lg">
                Jump right into your reading journey
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-semibold text-emerald-400 mb-2">
                    {recentChapters.length > 0 ? 'Recent Chapters' : 'Most Read Chapters'}
                  </h4>
                  <div className="w-16 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {recentChapters.length > 0 ? (
                    recentChapters.slice(0, 4).map((chapter) => (
                      <Link 
                        key={chapter.number} 
                        to={`/chapter/${chapter.number}`} 
                        className="group block bg-gray-700/50 hover:bg-gray-600/70 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 border border-gray-600/30 hover:border-emerald-400/50 hover:transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-emerald-400 font-semibold text-lg">{chapter.number}. {chapter.englishName}</span>
                            <div className="text-gray-400 text-sm">({chapter.englishNameTranslation})</div>
                          </div>
                          <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            →
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <>
                      {[
                        { number: 1, name: "Al-Fatiha", translation: "The Opening" },
                        { number: 2, name: "Al-Baqarah", translation: "The Cow" },
                        { number: 36, name: "Ya-Sin", translation: "Ya Sin" },
                        { number: 67, name: "Al-Mulk", translation: "The Sovereignty" }
                      ].map((chapter) => (
                        <Link 
                          key={chapter.number}
                          to={`/chapter/${chapter.number}`} 
                          className="group block bg-gray-700/50 hover:bg-gray-600/70 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 border border-gray-600/30 hover:border-emerald-400/50 hover:transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-emerald-400 font-semibold text-lg">{chapter.number}. {chapter.name}</span>
                              <div className="text-gray-400 text-sm">({chapter.translation})</div>
                            </div>
                            <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              →
                            </div>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-semibold text-emerald-400 mb-2">Browse by Juz</h4>
                  <div className="w-16 h-1 bg-emerald-400 mx-auto rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[
                    { number: 1, name: "Alif Lam Meem" },
                    { number: 15, name: "Subhan Allahi" },
                    { number: 28, name: "Qad Sami Allah" },
                    { number: 30, name: "Amma Yatasa'alun" }
                  ].map((juz) => (
                    <Link 
                      key={juz.number}
                      to={`/juz/${juz.number}`} 
                      className="group block bg-gray-700/50 hover:bg-gray-600/70 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 border border-gray-600/30 hover:border-emerald-400/50 hover:transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-emerald-400 font-semibold text-lg">Juz {juz.number}</span>
                          <div className="text-gray-400 text-sm">({juz.name})</div>
                        </div>
                        <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

       {/* Statistics Section */}
<div className="relative mb-20 mt-20 bg-cover bg-center rounded-3xl overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1620367274821-be34135cfd22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHF1cmFufGVufDB8fDB8fHww)` }}>
  {/* Cinematic gradient overlay with blur */}
  <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
  
  {/* Islamic geometric pattern effect overlay */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
    </div>
  </div>
  
  <div className="relative z-10 p-8 md:p-12">
    <div className="text-center mb-12">
      <div className="inline-block relative">
        <div className="absolute inset-0 bg-emerald-400/15 blur-3xl rounded-full"></div>
        <h3 className="relative text-3xl md:text-4xl font-bold text-emerald-300 mb-4 drop-shadow-2xl">
          The Holy Quran
        </h3>
      </div>
      <p className="text-gray-200 text-lg font-light drop-shadow-lg">
        Divine guidance preserved for all humanity
      </p>
    </div>
    
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { number: "114", label: "Chapters (Surahs)", icon: "📖" },
        { number: "6,236", label: "Verses (Ayahs)", icon: "✨" },
        { number: "30", label: "Sections (Juz)", icon: "📚" },
        { number: "1400+", label: "Years Old", icon: "⏳" }
      ].map((stat, index) => (
        <div key={index} className="group text-center">
          <div className="relative bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-2xl">
            <div className="text-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
              {stat.icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold text-emerald-300 mb-3 drop-shadow-2xl">
              {stat.number}
            </div>
            <div className="text-gray-200 text-sm font-medium drop-shadow-lg">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

       {/* Footer Quote */}
<div className="text-center mt-20 mb-20">
  <div className="relative group max-w-4xl mx-auto">
    {/* Hover glow effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
    
    {/* Main card with background image */}
    <div className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1677013624162-db18bf12f2be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cXVyYW58ZW58MHx8MHx8fDA%3D')` }}>
      {/* Cinematic gradient overlay with blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
      
      {/* Content */}
      <div className="relative p-8 md:p-12 border-l-4 border-emerald-400">
        <div className="mb-6">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-emerald-400/15 blur-3xl rounded-full"></div>
            <p className="relative text-xl md:text-2xl text-emerald-300 leading-relaxed drop-shadow-2xl" style={{ fontFamily: 'Uthmanic' }}>
              وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ
            </p>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto rounded-full mb-6"></div>
          <p className="text-gray-200 text-base md:text-lg font-light drop-shadow-lg">
            "And We send down of the Quran that which is healing and mercy for the believers"
          </p>
          <p className="text-emerald-300 text-sm mt-2 font-medium drop-shadow-lg">
            — Quran 17:82
          </p>
          <p className="text-gray-200 text-base md:text-lg font-light drop-shadow-lg">
            "And We send down of the Quran that which is healing and mercy for the believers"
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
</div>
  );
};



// About Page
const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Hero Section */}
      <div 
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-slate-900/85 to-gray-900/90"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full"></div>
            <h1 className="relative text-4xl md:text-6xl font-bold text-white mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Quran Reader</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            A digital companion crafted with reverence for the Holy Quran
          </p>
          <div className="flex justify-center mt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Introduction Section */}
        <div className="relative mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-3xl blur opacity-20"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🕌</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
              </div>
            </div>
            <p className="text-lg md:text-xl leading-relaxed text-gray-300 text-center max-w-4xl mx-auto">
              This Quran Reader application was created with the utmost respect and reverence for the Holy Quran. 
              Our goal is to provide a simple, clean, and accessible way to read and explore the Quran on digital devices, 
              making the sacred text available to Muslims and anyone interested in understanding its teachings.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Purpose & Mission */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-emerald-400/30 transition-all duration-300 h-full shadow-lg hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Purpose & Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                To make the Holy Quran easily accessible to Muslims and anyone interested in reading it, 
                with a focus on clarity, respect, and ease of use. We believe technology should serve 
                spiritual growth and learning, bringing people closer to divine guidance.
              </p>
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-400">
                <p className="text-gray-300 text-sm italic">
                  "And We have certainly made the Quran easy for remembrance, so is there any who will remember?" - Quran 54:17
                </p>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-emerald-400/30 transition-all duration-300 h-full shadow-lg hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Authentic Sources</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                All Quranic text, translations, and metadata are provided by the Al-Quran Cloud API, 
                ensuring authenticity and accuracy. We are grateful for their service to the Muslim community.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <span className="text-lg">✓</span>
                  <span>Authentic Uthmani script</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400">
                  <span className="text-lg">✓</span>
                  <span>Verified translations</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400">
                  <span className="text-lg">✓</span>
                  <span>Accurate metadata</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">Features & Capabilities</h3>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Designed with modern technology to enhance your Quranic reading experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📖",
                title: "Complete Quran",
                description: "Browse all 114 chapters (Surahs) with beautiful Arabic script",
                gradient: "from-blue-500/10 to-blue-600/5"
              },
              {
                icon: "🗂️",
                title: "Juz Navigation",
                description: "Navigate by Juz (Para) divisions for structured reading",
                gradient: "from-emerald-500/10 to-emerald-600/5"
              },
              {
                icon: "🔍",
                title: "Search Function",
                description: "Find specific verses and topics with powerful search",
                gradient: "from-purple-500/10 to-purple-600/5"
              },
              {
                icon: "🌍",
                title: "Multi-language",
                description: "Multiple translation options in various languages",
                gradient: "from-orange-500/10 to-orange-600/5"
              },
              {
                icon: "🔖",
                title: "Bookmarks",
                description: "Save favorite verses for easy access and reflection",
                gradient: "from-pink-500/10 to-pink-600/5"
              },
              {
                icon: "📱",
                title: "Progress Tracking",
                description: "Continue reading from where you left off",
                gradient: "from-teal-500/10 to-teal-600/5"
              },
              {
                icon: "📚",
                title: "Recent History",
                description: "Track recently read chapters for quick access",
                gradient: "from-indigo-500/10 to-indigo-600/5"
              },
              {
                icon: "📱",
                title: "Responsive Design",
                description: "Mobile-first design that works on all devices",
                gradient: "from-green-500/10 to-green-600/5"
              },
              {
                icon: "🌙",
                title: "Dark Mode",
                description: "Easy on the eyes for comfortable reading",
                gradient: "from-gray-500/10 to-gray-600/5"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className={`relative bg-gradient-to-br ${feature.gradient} bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-emerald-400/30 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl h-full`}>
                  <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-3 text-emerald-400">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learn More Section */}
        <div 
          className="relative mb-16 bg-cover bg-center rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-slate-900/85 to-gray-900/90"></div>
          <div className="relative p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Explore Further</h3>
              </div>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Deepen your understanding of the Quran with comprehensive resources, 
                scholarly interpretations, and detailed explanations of verses and chapters.
              </p>
              <a
                href="https://quran.com/about-the-quran"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-emerald-500/20"
              >
                <span className="text-xl">📖</span>
                <span>Learn More About the Quran</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="text-sm text-gray-400 mt-4">
                Visit Quran.com for detailed explanations, tafsir, and scholarly resources
              </p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div 
          className="relative bg-cover bg-center rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1677587536653-0d02efbb70ee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-slate-900/90 to-emerald-900/85"></div>
          <div className="relative p-8 md:p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="text-2xl md:text-3xl text-gray-300 leading-relaxed mb-6" style={{ fontFamily: 'Uthmanic' }}>
                  إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto rounded-full mb-6"></div>
                <p className="text-gray-400 text-lg md:text-xl mb-2">
                  "Indeed, it is We who sent down the Quran and indeed, We will be its guardian."
                </p>
                <p className="text-emerald-400 text-sm font-medium">
                  — Quran 15:9
                </p>
              </div>
              
              <div className="pt-8 mt-8 border-t border-gray-700/50">
                <p className="text-gray-400 text-lg italic">
                  May Allah accept this humble effort and make it beneficial for all who use it.
                </p>
                <p className="text-emerald-400 font-semibold text-xl mt-2">
                  آمين (Ameen)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigate Quran Page
const NavigateQuran = () => {
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('chapters');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/surah`);
      const data = await response.json();
      setChapters(data.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.name.includes(searchTerm) ||
    chapter.number.toString().includes(searchTerm)
  );

  const generateJuzList = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      name: `Juz ${i + 1}`,
      arabicName: `الجزء ${i + 1}`
    }));
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-400">Navigate the Holy Quran</h1>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by Surah name, number, or verse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-white"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'chapters'
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Chapters (Surahs)
          </button>
          <button
            onClick={() => setActiveTab('juz')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'juz'
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Juz (Para)
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'chapters' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChapters.map((chapter) => (
            <Link
              key={chapter.number}
              to={`/chapter/${chapter.number}`}
              className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-400 font-bold text-lg">{chapter.number}</span>
                <span className="text-2xl text-green-400" style={{ fontFamily: 'Uthmanic' }}>{chapter.name}</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{chapter.englishName}</h3>
              <p className="text-gray-400 text-sm mb-2">{chapter.englishNameTranslation}</p>
              <p className="text-gray-400 text-xs">
                {chapter.numberOfAyahs} verses • {chapter.revelationType}
              </p>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'juz' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {generateJuzList().map((juz) => (
            <Link
              key={juz.number}
              to={`/juz/${juz.number}`}
              className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-400 font-bold text-lg">{juz.number}</span>
                <span className="text-2xl text-green-400" style={{ fontFamily: 'Uthmanic' }}>{juz.arabicName}</span>
              </div>
              <h3 className="text-white font-semibold text-lg">{juz.name}</h3>
              <p className="text-gray-400 text-sm">Section {juz.number} of 30</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Juz Reader Page
const JuzReader = () => {
  const { juzNumber } = useParams();
  const [verses, setVerses] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState('en.sahih');
  const [translatedVerses, setTranslatedVerses] = useState([]);
  const [readingMode, setReadingMode] = useState('arabic');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 30;
  const navigate = useNavigate();

  useEffect(() => {
    fetchJuzData();
    fetchTranslations();
  }, [juzNumber]);

  useEffect(() => {
    if (readingMode === 'translation' && selectedTranslation) {
      fetchTranslatedVerses();
    }
  }, [selectedTranslation, readingMode, juzNumber]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const fetchJuzData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/juz/${juzNumber}/quran-uthmani`);
      const data = await response.json();
      setVerses(data.data.ayahs);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching juz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslations = async () => {
    try {
      const response = await fetch(`${API_BASE}/edition/type/translation`);
      const data = await response.json();
      setTranslations(data.data.filter(t => t.language === 'en' || t.language === 'ur' || t.language === 'id'));
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  };

  const fetchTranslatedVerses = async () => {
    try {
      const response = await fetch(`${API_BASE}/juz/${juzNumber}/${selectedTranslation}`);
      const data = await response.json();
      setTranslatedVerses(data.data.ayahs);
    } catch (error) {
      console.error('Error fetching translated verses:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(verses.length / versesPerPage);
  const startIndex = (currentPage - 1) * versesPerPage;
  const endIndex = startIndex + versesPerPage;
  const currentVerses = verses.slice(startIndex, endIndex);
  const currentTranslatedVerses = translatedVerses.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 sm:mt-8 mb-4 sm:mb-6 px-4">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-2 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
        )}

        <div className="flex space-x-1 overflow-x-auto max-w-xs sm:max-w-none">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
                currentPage === page
                  ? 'bg-green-600 text-white font-bold'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-2 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
          </button>
        )}
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <button
          onClick={() => navigate('/navigate')}
          className="flex items-center text-green-400 hover:text-green-300 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Navigation
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-2" style={{ fontFamily: 'Uthmanic' }}>الجزء {juzNumber}</h1>
          <h2 className="text-xl text-white mb-2">Juz {juzNumber}</h2>
          <p className="text-gray-300 mb-4">Section {juzNumber} of 30</p>
          <p className="text-gray-400 text-sm">
            {verses.length} total verses
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-center">
            <div className="flex bg-gray-700 rounded-lg p-1 w-full max-w-sm">
              <button
                onClick={() => setReadingMode('arabic')}
                className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm ${
                  readingMode === 'arabic'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Arabic Only
              </button>
              <button
                onClick={() => setReadingMode('translation')}
                className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm ${
                  readingMode === 'translation'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                With Translation
              </button>
            </div>
          </div>

          {readingMode === 'translation' && (
            <div className="flex justify-center px-4">
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-green-400 text-sm w-full max-w-xs"
              >
                {translations.map((translation) => (
                  <option key={translation.identifier} value={translation.identifier}>
                    {translation.englishName.length > 25 
                      ? `${translation.englishName.substring(0, 25)}...` 
                      : translation.englishName
                    } ({translation.language.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Page indicator */}
        {totalPages > 1 && (
          <div className="text-center mt-4">
            <span className="text-gray-400 text-xs sm:text-sm">
              Page {currentPage} of {totalPages} ({verses.length} total verses)
            </span>
          </div>
        )}
      </div>

      {/* Arabic Only Mode - Book-like layout */}
      {readingMode === 'arabic' && (
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg mb-8">
          <div className="text-right leading-relaxed sm:leading-loose" style={{ lineHeight: '2.5' }}>
            {currentVerses.map((verse, index) => (
              <span key={verse.number} className="inline">
                <span className="text-lg sm:text-xl lg:text-2xl text-white" style={{ fontFamily: 'Uthmanic' }}>
                  {verse.text}
                </span>
                <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mx-1 sm:mx-2 bg-green-600 text-white rounded-full text-xs font-bold">
                  {verse.numberInSurah}
                </span>
                {index < currentVerses.length - 1 && ' '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Translation Mode - Individual verse layout */}
      {readingMode === 'translation' && (
        <div className="space-y-4 sm:space-y-6">
          {currentVerses.map((verse, index) => (
            <div key={verse.number} className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="text-sm text-gray-400">
                  Surah {verse.surah.englishName} - Verse {verse.numberInSurah}
                </div>
                <div className="flex items-center space-x-2">
                  <BookmarkButton
                    chapterNumber={verse.surah.number}
                    verseNumber={verse.numberInSurah}
                    chapterName={verse.surah.englishName}
                    verseText={verse.text}
                  />
                  <span className="bg-green-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    {verse.numberInSurah}
                  </span>
                </div>
              </div>

              <div className="text-right mb-3 sm:mb-4">
                <p className="text-xl sm:text-2xl leading-relaxed sm:leading-loose text-white" style={{ fontFamily: 'Uthmanic' }}>
                  {verse.text}
                </p>
              </div>

              {currentTranslatedVerses[index] && (
                <div className="border-t border-gray-600 pt-3 sm:pt-4">
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {currentTranslatedVerses[index].text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}

      {/* Juz Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-600">
        {parseInt(juzNumber) > 1 ? (
          <button
            onClick={() => navigate(`/juz/${parseInt(juzNumber) - 1}`)}
            className="flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <div className="text-xs text-gray-400">Previous Juz</div>
              <div className="text-sm font-medium">Juz {parseInt(juzNumber) - 1}</div>
            </div>
          </button>
        ) : (
          <div></div>
        )}

        {parseInt(juzNumber) < 30 ? (
          <button
            onClick={() => navigate(`/juz/${parseInt(juzNumber) + 1}`)}
            className="flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-gray-400">Next Juz</div>
              <div className="text-sm font-medium">Juz {parseInt(juzNumber) + 1}</div>
            </div>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

// Search Results Page
const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, []);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}/all/en`);
      const data = await response.json();
      setSearchResults(data.data.matches || []);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <button
          onClick={() => navigate('/navigate')}
          className="flex items-center text-green-400 hover:text-green-300 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Navigation
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Search Results</h1>
          <p className="text-gray-300">Results for: "{searchTerm}"</p>
          <p className="text-gray-400 text-sm mt-2">{searchResults.length} results found</p>
        </div>
      </div>

      {searchResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No results found for your search.</p>
          <p className="text-gray-500">Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {searchResults.map((result) => (
            <div key={result.number} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">
                  Surah {result.surah.englishName} - Verse {result.numberInSurah}
                </div>
                <div className="flex items-center space-x-2">
                  <BookmarkButton
                    chapterNumber={result.surah.number}
                    verseNumber={result.numberInSurah}
                    chapterName={result.surah.englishName}
                    verseText={result.text}
                  />
                  <Link
                    to={`/chapter/${result.surah.number}`}
                    className="text-green-400 hover:text-green-300 text-sm font-medium"
                  >
                    Go to Chapter
                  </Link>
                </div>
              </div>

              <div className="text-right mb-4">
                <p className="text-xl leading-loose text-white" style={{ fontFamily: 'Uthmanic' }}>
                  {result.text}
                </p>
              </div>

              {result.translation && (
                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-300 leading-relaxed">
                    {result.translation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component with Uthmanic font loading
function App() {
  useEffect(() => {
    // Load Uthmanic font from Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add custom CSS for Uthmanic font
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');
      
      [style*="font-family: 'Uthmanic'"], [style*="fontFamily: 'Uthmanic'"] {
        font-family: 'Amiri Quran', 'Traditional Arabic', 'Arabic Typesetting', serif !important;
        font-feature-settings: 'liga' 1, 'dlig' 1, 'kern' 1;
        text-rendering: optimizeLegibility;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/navigate" element={<NavigateQuran />} />
            <Route path="/chapter/:chapterNumber" element={<ChapterReader />} />
            <Route path="/juz/:juzNumber" element={<JuzReader />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
const ChapterReader = () => {
  const { chapterNumber } = useParams();
  const [chapter, setChapter] = useState(null);
  const [verses, setVerses] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState('en.sahih');
  const [translatedVerses, setTranslatedVerses] = useState([]);
  const [readingMode, setReadingMode] = useState('arabic');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 30;
  const navigate = useNavigate();

  useEffect(() => {
    fetchChapterData();
    fetchTranslations();
  }, [chapterNumber]);

  useEffect(() => {
    if (readingMode === 'translation' && selectedTranslation) {
      fetchTranslatedVerses();
    }
  }, [selectedTranslation, readingMode, chapterNumber]);

  useEffect(() => {
    // Handle URL parameters for page and verse
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const verse = urlParams.get('verse');
    
    if (page) {
      setCurrentPage(parseInt(page));
    } else if (verse) {
      const verseNumber = parseInt(verse);
      const pageForVerse = Math.ceil(verseNumber / versesPerPage);
      setCurrentPage(pageForVerse);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterNumber]);

  useEffect(() => {
    // Save last read position
    if (chapter) {
      LocalStorageHelper.setLastRead({
        chapterNumber: parseInt(chapterNumber),
        chapterName: chapter.englishName,
        page: currentPage
      });
    }
  }, [currentPage, chapter, chapterNumber]);

  // Function to filter out Bismillah verse
  const filterBismillah = (verses) => {
    if (!verses || verses.length === 0) return [];
    
    // For chapters other than Al-Fatiha (1) and At-Tawbah (9), 
    // filter out the first verse if it's Bismillah
    if (chapterNumber !== '1' && chapterNumber !== '9') {
      const bismillahText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
      if (verses[0] && verses[0].text.includes(bismillahText)) {
        return verses.slice(1);
      }
    }
    
    return verses;
  };

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      const [chapterResponse, versesResponse] = await Promise.all([
        fetch(`${API_BASE}/surah/${chapterNumber}`),
        fetch(`${API_BASE}/surah/${chapterNumber}/quran-uthmani`)
      ]);

      const chapterData = await chapterResponse.json();
      const versesData = await versesResponse.json();

      setChapter(chapterData.data);
      const filteredVerses = filterBismillah(versesData.data.ayahs);
      setVerses(filteredVerses);
      
      // Add to recent chapters
      LocalStorageHelper.addRecentChapter({
        number: chapterData.data.number,
        englishName: chapterData.data.englishName,
        englishNameTranslation: chapterData.data.englishNameTranslation
      });
      
    } catch (error) {
      console.error('Error fetching chapter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslations = async () => {
    try {
      const response = await fetch(`${API_BASE}/edition/type/translation`);
      const data = await response.json();
      setTranslations(data.data.filter(t => t.language === 'en' || t.language === 'ur' || t.language === 'id'));
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  };

  const fetchTranslatedVerses = async () => {
    try {
      const response = await fetch(`${API_BASE}/surah/${chapterNumber}/${selectedTranslation}`);
      const data = await response.json();
      const filteredTranslatedVerses = filterBismillah(data.data.ayahs);
      setTranslatedVerses(filteredTranslatedVerses);
    } catch (error) {
      console.error('Error fetching translated verses:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(verses.length / versesPerPage);
  const startIndex = (currentPage - 1) * versesPerPage;
  const endIndex = startIndex + versesPerPage;
  const currentVerses = verses.slice(startIndex, endIndex);
  const currentTranslatedVerses = translatedVerses.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 sm:mt-8 mb-4 sm:mb-6 px-4">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-2 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
        )}

        <div className="flex space-x-1 overflow-x-auto max-w-xs sm:max-w-none">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
                currentPage === page
                  ? 'bg-green-600 text-white font-bold'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-2 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
          </button>
        )}
      </div>
    );
  };

  if (loading) return <Loading />;

  if (!chapter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Chapter not found</h2>
        <button
          onClick={() => navigate('/navigate')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Back to Navigation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <button
          onClick={() => navigate('/navigate')}
          className="flex items-center text-green-400 hover:text-green-300 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Navigation
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-2" style={{ fontFamily: 'Uthmanic' }}>{chapter.name}</h1>
          <h2 className="text-xl text-white mb-2">{chapter.englishName}</h2>
          <p className="text-gray-300 mb-4">{chapter.englishNameTranslation}</p>
          <p className="text-gray-400 text-sm">
            {chapter.numberOfAyahs} verses • {chapter.revelationType}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-center">
            <div className="flex bg-gray-700 rounded-lg p-1 w-full max-w-sm">
              <button
                onClick={() => setReadingMode('arabic')}
                className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm ${
                  readingMode === 'arabic'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Arabic Only
              </button>
              <button
                onClick={() => setReadingMode('translation')}
                className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors text-sm ${
                  readingMode === 'translation'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                With Translation
              </button>
            </div>
          </div>

          {readingMode === 'translation' && (
            <div className="flex justify-center px-4">
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-green-400 text-sm w-full max-w-xs"
              >
                {translations.map((translation) => (
                  <option key={translation.identifier} value={translation.identifier}>
                    {translation.englishName.length > 25 
                      ? `${translation.englishName.substring(0, 25)}...` 
                      : translation.englishName
                    } ({translation.language.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Page indicator */}
        {totalPages > 1 && (
          <div className="text-center mt-4">
            <span className="text-gray-400 text-xs sm:text-sm">
              Page {currentPage} of {totalPages} ({verses.length} total verses)
            </span>
          </div>
        )}
      </div>

      {/* Bismillah - only show for chapters other than 1 and 9, and only on first page */}
      {chapterNumber !== '1' && chapterNumber !== '9' && currentPage === 1 && (
        <div className="text-center mb-6 sm:mb-8 py-4 sm:py-6 bg-gray-800 rounded-lg">
          <p className="text-2xl sm:text-3xl text-green-400 mb-2 px-4" style={{ fontFamily: 'Uthmanic' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-gray-300 text-xs sm:text-sm px-4">In the name of Allah, the Most Gracious, the Most Merciful</p>
        </div>
      )}

      {/* Arabic Only Mode - Book-like layout */}
      {readingMode === 'arabic' && (
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg mb-8">
          <div className="text-right leading-relaxed sm:leading-loose" style={{ lineHeight: '2.5' }}>
            {currentVerses.map((verse, index) => (
              <span key={verse.number} className="inline">
                <span className="text-lg sm:text-xl lg:text-2xl text-white" style={{ fontFamily: 'Uthmanic' }}>
                  {verse.text}
                </span>
                <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mx-1 sm:mx-2 bg-green-600 text-white rounded-full text-xs font-bold">
                  {verse.numberInSurah}
                </span>
                {index < currentVerses.length - 1 && ' '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Translation Mode - Individual verse layout */}
      {readingMode === 'translation' && (
        <div className="space-y-4 sm:space-y-6">
          {currentVerses.map((verse, index) => (
            <div key={verse.number} className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <span className="bg-green-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  {verse.numberInSurah}
                </span>
                <BookmarkButton
                  chapterNumber={parseInt(chapterNumber)}
                  verseNumber={verse.numberInSurah}
                  chapterName={chapter.englishName}
                  verseText={verse.text}
                />
              </div>

              <div className="text-right mb-3 sm:mb-4">
                <p className="text-xl sm:text-2xl leading-relaxed sm:leading-loose text-white" style={{ fontFamily: 'Uthmanic' }}>
                  {verse.text}
                </p>
              </div>

              {currentTranslatedVerses[index] && (
                <div className="border-t border-gray-600 pt-3 sm:pt-4">
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {currentTranslatedVerses[index].text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}

      {/* Chapter Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-600">
        {parseInt(chapterNumber) > 1 ? (
          <button
            onClick={() => navigate(`/chapter/${parseInt(chapterNumber) - 1}`)}
            className="flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <div className="text-xs text-gray-400">Previous Chapter</div>
              <div className="text-sm font-medium">Surah {parseInt(chapterNumber) - 1}</div>
            </div>
          </button>
        ) : (
          <div></div>
        )}

        {parseInt(chapterNumber) < 114 ? (
          <button
            onClick={() => navigate(`/chapter/${parseInt(chapterNumber) + 1}`)}
            className="flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-gray-400">Next Chapter</div>
              <div className="text-sm font-medium">Surah {parseInt(chapterNumber) + 1}</div>
            </div>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};