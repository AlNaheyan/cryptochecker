import { useState, useEffect} from 'react'
import './App.css'
import CoinInfo from './components/CoinInfo'
const API_KEY = import.meta.env.VITE_APP_API_KEY

function App() {
  const [list, setList] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function fetchAllCoinData() {
      const res = await fetch("https://min-api.cryptocompare.com/data/all/coinlist?&api_key" + API_KEY);
      console.log(res)
      const jsoned = await res.json();
      console.log(jsoned)
      setList(jsoned);
    }
  fetchAllCoinData().catch(console.error);
  }, []);

  const searchItems = searchValue => {
    setSearchInput(searchValue);
    if (searchValue !== "") {
      const filteredData = Object.keys(list.Data).filter((item) =>
        Object.values(item).join("").toLowerCase().includes(searchValue.toLowerCase())
      )
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(Object.keys(list.Data))
    }
  };

  return (
    <div className='whole-page'>
      <h1> my Crypto List</h1>
      <input 
        type='text'
        placeholder='Search...'
        onChange={(inputString) => searchItems(inputString.target.value)}
      />
      <ul>
        {list?.Data && Object.entries(list.Data).map(([coin]) =>
          list.Data[coin].PlatformType === "blockchain" ? (
              <CoinInfo 
                image={list.Data[coin].ImageUrl}
                name={list.Data[coin].FullName}
                symbol={list.Data[coin].Symbol}
              />
            ) : null
        )}
      </ul>
    </div>
  )
}

export default App
