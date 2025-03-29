import React, { useEffect, useState } from 'react'
const API_KEY = import.meta.env.VITE_APP_API_KEY;

function CoinInfo({image, name, symbol}) {
    const [price, setPrice] = useState(null)

    useEffect(() => {
        const getCoinPrice = async () => {
            const res = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=` + API_KEY);
            const json = await res.json();
            console.log(json)
            setPrice(json)
        };
        getCoinPrice().catch(console.error)
    },[symbol])
    return (
        <div>
            {price ? (
                <li className="main-list" key={symbol}>
                    <img
                    className="icons"
                    src={`https://www.cryptocompare.com${image}`}
                    alt={`Small icon for ${name} crypto coin`}
                    />
                    {name} <span className="tab"></span> ${price.USD} USD
                </li>
            ) : null
            }
        </div>
    )
}

export default CoinInfo
