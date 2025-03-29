import { useState, useEffect } from 'react';
import './App.css';
import CoinInfo from './components/CoinInfo';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [displayCount, setDisplayCount] = useState(10); 

  useEffect(() => {
    async function fetchAllCoinData() {
      try {
        const res = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?api_key=${API_KEY}`);
        const jsoned = await res.json();
        setList(jsoned);
        console.log(jsoned)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchAllCoinData();
  }, []);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== "") {
      const filteredData = Object.keys(list.Data).filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(Object.keys(list.Data));
    }
  };

  // Infinite scrolling logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setDisplayCount((prevCount) => prevCount + 10); // Load 10 more
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className='whole-page'>
      <h1>My Crypto List</h1>
      <input
        type='text'
        placeholder='Search...'
        onChange={(e) => searchItems(e.target.value)}
      />
      <ul>
        {searchInput.length > 0
          ? filteredResults.slice(0, displayCount).map((coin) =>
              list.Data[coin]?.PlatformType === "blockchain" ? (
                <CoinInfo
                  key={coin}
                  image={list.Data[coin].ImageUrl}
                  name={list.Data[coin].FullName}
                  symbol={list.Data[coin].Symbol}
                />
              ) : null
            )
          : list &&
            Object.entries(list.Data)
              .slice(0, displayCount) // Only show limited coins
              .map(([coin, coinData]) =>
                coinData.PlatformType === "blockchain" ? (
                  <CoinInfo
                    key={coin}
                    image={coinData.ImageUrl}
                    name={coinData.FullName}
                    symbol={coinData.Symbol}
                  />
                ) : null
              )}
      </ul>
    </div>
  );
}

export default App;
