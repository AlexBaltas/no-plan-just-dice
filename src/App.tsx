<script type="text/javascript">
        var gk_isXlsx = false;
        var gk_xlsxFileLookup = {};
        var gk_fileData = {};
        function filledCell(cell) {
          return cell !== '' && cell != null;
        }
        function loadFileData(filename) {
        if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
            try {
                var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to JSON to filter blank rows
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
                // Filter out blank rows (rows where all cells are empty, null, or undefined)
                var filteredData = jsonData.filter(row => row.some(filledCell));

                // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
                var headerRowIndex = filteredData.findIndex((row, index) =>
                  row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
                );
                // Fallback
                if (headerRowIndex === -1 || headerRowIndex > 25) {
                  headerRowIndex = 0;
                }

                // Convert filtered JSON back to CSV
                var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
                csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
                return csv;
            } catch (e) {
                console.error(e);
                return "";
            }
        }
        return gk_fileData[filename] || "";
        }
        </script><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your D&D Podcast</title>
  <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.22.5/babel.min.js"></script>
  <link href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'IM Fell English', serif;
      background-image: url('/images/parchment-bg.jpg');
      background-repeat: repeat;
      margin: 0;
    }
    .nav-links {
      transition: all 0.3s ease-in-out;
    }
    #fallback {
      text-align: center;
      padding: 20px;
      color: #4a1a7a;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="fallback">
    <p>Loading Your D&D Podcast... If this persists, check the console (F12) for errors or ensure internet connectivity for CDNs.</p>
  </div>
  <script type="text/babel">
    console.log("React app initializing...");

    function NavBar() {
      const [isMenuOpen, setIsMenuOpen] = React.useState(false);

      const toggleMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
      };

      const closeMenu = () => {
        setIsMenuOpen(false);
      };

      React.useEffect(() => {
        const handleOutsideClick = (e) => {
          if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
            setIsMenuOpen(false);
          }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
      }, []);

      return (
        <nav className="flex justify-center items-center relative bg-purple-900 text-white p-4">
          <div className="logo absolute left-4 md:left-6">
            <img src="/images/logo.png" alt="Logo" className="h-12" onError={() => console.log("Logo image failed to load")} />
          </div>
          <button 
            className="menu-toggle md:hidden text-2xl absolute right-4" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <ul className={`nav-links ${isMenuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-purple-700 p-4 text-center' : 'hidden'} md:flex md:static md:flex-row md:bg-transparent md:p-0 md:space-x-6`}>
            {['Home', 'About', 'Episodes', 'Merch'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="block py-2 hover:text-yellow-300" 
                  onClick={closeMenu}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      );
    }

    function Hero() {
      return (
        <section className="text-center text-white bg-purple-900/80 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your D&D Podcast</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Join our party for epic Dungeons & Dragons adventures filled with laughter, danger, and epic dice rolls!
          </p>
        </section>
      );
    }

    function LatestEpisode() {
      return (
        <section className="max-w-4xl mx-auto my-8 px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-900">Latest Episode</h2>
          <div className="party-photo border-4 border-yellow-600 bg-yellow-100 p-4 mx-auto inline-block">
            <img src="/images/party.jpg" alt="Party" className="w-full max-w-md" onError={() => console.log("Party image failed to load")} />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-purple-800">Episode 1: The Tavern Tale</h3>
          <p className="text-gray-700 my-4">
            The party meets in a mysterious tavern, but a shadowy figure has other plans...
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#episodes" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600">
              All Episodes
            </a>
            <a href="#listen" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500">
              Listen Now
            </a>
          </div>
        </section>
      );
    }

    function Footer() {
      return (
        <footer className="bg-purple-900 text-white text-center py-6">
          <p>© 2025 Your D&D Podcast. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            {['Contact Us', 'Twitch', 'Youtube', 'Instagram', 'Facebook', 'Reddit', 'X'].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase().replace(' ', '-')}`} 
                className="hover:text-yellow-300"
              >
                {link}
              </a>
            ))}
          </div>
        </footer>
      );
    }

    function App() {
      return (
        <div>
          <NavBar />
          <Hero />
          <LatestEpisode />
          <Footer />
        </div>
      );
    }

    try {
      ReactDOM.render(<App />, document.getElementById('root'));
      document.getElementById('fallback').style.display = 'none';
      console.log("React app rendered successfully");
    } catch (error) {
      console.error("Failed to render React app:", error);
    }
  </script>
</body>
</html>
