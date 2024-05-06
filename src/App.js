import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ProductList from './components/ProductList';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:4003/getSales');
        setProducts(response.data);
        setError(null); // Reset error state on success
      } catch (error) {
        console.error("Error fetching sales data:", error.message);
        setError(error.message); // Set the error message
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="App">
      {error ? (
        <div className="error">
          <p>Error fetching data: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      ) : (
        <ul>
          {products.map((each, index) => (
            <li className="list-style" key={index}>
              <ProductList eachProduct={each} />
            </li>
          ))}
        </ul>
      )}
      <h1>Hello</h1>
    </div>
  );
}

export default App;
