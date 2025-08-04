import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// API Base URL
const API_BASE = 'https://api.alquran.cloud/v1';

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-green-400">📖</div>
            <span className="text-xl font-semibold text-white">Quran Reader</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/navigate" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Navigate Quran
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-400" style={{ fontFamily: 'Uthmanic' }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
          <div className="w-24 h-1 bg-green-400 mx-auto rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Welcome to Quran Reader</h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            A beautiful, respectful digital companion for reading and exploring the Holy Quran. 
            Experience the sacred text with authentic Uthmani script, multiple translations, 
            and an interface designed for contemplation and study.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/navigate"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🕌 Start Reading
            </Link>
            <Link
              to="/about"
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-600"
            >
              📖 Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-400 transition-all duration-300 hover:transform hover:scale-105">
          <div className="text-3xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-3 text-green-400">Browse Chapters</h3>
          <p className="text-gray-300 text-sm leading-relaxed">Explore all 114 Surahs with beautiful Arabic script and easy navigation through verses</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-400 transition-all duration-300 hover:transform hover:scale-105">
          <div className="text-3xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-3 text-green-400">Smart Search</h3>
          <p className="text-gray-300 text-sm leading-relaxed">Find specific verses, topics, and concepts with our intelligent search functionality</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-400 transition-all duration-300 hover:transform hover:scale-105">
          <div className="text-3xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold mb-3 text-green-400">Multiple Languages</h3>
          <p className="text-gray-300 text-sm leading-relaxed">Read authentic translations in English, Urdu, Indonesian and other languages</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-400 transition-all duration-300 hover:transform hover:scale-105">
          <div className="text-3xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-3 text-green-400">Mobile Optimized</h3>
          <p className="text-gray-300 text-sm leading-relaxed">Perfect reading experience across all devices with responsive design</p>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700 mb-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-white">Quick Access</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-green-400">Popular Chapters</h4>
            <div className="space-y-3">
              <Link to="/chapter/1" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">1. Al-Fatiha</span>
                <span className="text-gray-400 text-sm ml-2">(The Opening)</span>
              </Link>
              <Link to="/chapter/2" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">2. Al-Baqarah</span>
                <span className="text-gray-400 text-sm ml-2">(The Cow)</span>
              </Link>
              <Link to="/chapter/36" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">36. Ya-Sin</span>
                <span className="text-gray-400 text-sm ml-2">(Ya Sin)</span>
              </Link>
              <Link to="/chapter/67" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">67. Al-Mulk</span>
                <span className="text-gray-400 text-sm ml-2">(The Sovereignty)</span>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-green-400">Browse by Juz</h4>
            <div className="space-y-3">
              <Link to="/juz/1" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">Juz 1</span>
                <span className="text-gray-400 text-sm ml-2">(Alif Lam Meem)</span>
              </Link>
              <Link to="/juz/15" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">Juz 15</span>
                <span className="text-gray-400 text-sm ml-2">(Subhan Allahi)</span>
              </Link>
              <Link to="/juz/28" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">Juz 28</span>
                <span className="text-gray-400 text-sm ml-2">(Qad Sami Allah)</span>
              </Link>
              <Link to="/juz/30" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                <span className="text-green-400 font-medium">Juz 30</span>
                <span className="text-gray-400 text-sm ml-2">(Amma Yatasa'alun)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-green-900/20 to-gray-800 rounded-2xl p-8 border border-green-400/20">
        <h3 className="text-2xl font-bold text-center mb-8 text-white">The Holy Quran</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">114</div>
            <div className="text-gray-300 text-sm">Chapters (Surahs)</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">6,236</div>
            <div className="text-gray-300 text-sm">Verses (Ayahs)</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">30</div>
            <div className="text-gray-300 text-sm">Sections (Juz)</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">1400+</div>
            <div className="text-gray-300 text-sm">Years Old</div>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="text-center mt-12 py-8">
        <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-green-400">
          <p className="text-lg md:text-xl text-gray-300 italic mb-3" style={{ fontFamily: 'Uthmanic' }}>
            وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ
          </p>
          <p className="text-gray-400 text-sm">
            "And We send down of the Quran that which is healing and mercy for the believers" - Quran 17:82
          </p>
        </div>
      </div>
    </div>
  );
};

// About Page
const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-400">About Quran Reader</h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            This Quran Reader application was created with the utmost respect and reverence for the Holy Quran. 
            Our goal is to provide a simple, clean, and accessible way to read and explore the Quran on digital devices.
          </p>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Purpose & Mission</h2>
            <p className="leading-relaxed">
              To make the Holy Quran easily accessible to Muslims and anyone interested in reading it, 
              with a focus on clarity, respect, and ease of use. We believe technology should serve 
              spiritual growth and learning.
            </p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Inspiration & Credits</h2>
            <p className="leading-relaxed mb-4">
              This project draws inspiration from Quran.com, one of the most respected digital Quran platforms. 
              We acknowledge their pioneering work in making the Quran accessible online.
            </p>
            <p className="leading-relaxed">
              The Quranic text and translations are sourced through the Al-Quran Cloud API, 
              which provides authentic and verified Islamic content.
            </p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Browse all 114 chapters (Surahs) of the Quran</li>
              <li>Navigate by Juz (Para) divisions</li>
              <li>Search functionality for finding specific verses</li>
              <li>Multiple translation options</li>
              <li>Mobile-first responsive design</li>
              <li>Dark mode for comfortable reading</li>
              <li>Clean, distraction-free interface</li>
              <li>Uthmani script for authentic Arabic text display</li>
            </ul>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Data Sources</h2>
            <p className="leading-relaxed">
              All Quranic text, translations, and metadata are provided by the Al-Quran Cloud API, 
              ensuring authenticity and accuracy. We are grateful for their service to the Muslim community.
            </p>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8 pt-6 border-t border-gray-600">
            May Allah accept this humble effort and make it beneficial for all who use it. Ameen.
          </p>
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
            placeholder="Search by Surah name..."
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

// Chapter Reader Page
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
      setCurrentPage(1);
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
              </div>

              <div className="text-right mb-3 sm:mb-4">
                <p className="text-xl sm:text-2xl leading-relaxed sm:leading-loose text-white" style={{ fontFamily: 'Uthmani' }}>
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
                <span className="bg-green-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  {verse.numberInSurah}
                </span>
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
                <Link
                  to={`/chapter/${result.surah.number}`}
                  className="text-green-400 hover:text-green-300 text-sm font-medium"
                >
                  Go to Chapter
                </Link>
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