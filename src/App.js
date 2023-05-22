import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Product = ({ name, price, description, images, addToCart }) => {
  let productImage = null;

  if (Array.isArray(images) && images.length > 0) {
    productImage = images[0];
  }

  return (
    <div className="product">
      <div className="product-image">
        {productImage && <img src={productImage} alt={name} />}
      </div>
      <div className="product-details">
        <h3>{name}</h3>
        <p>{description}</p>
        <p>Price: {price}</p>
        <button onClick={() => addToCart({ name, price, description, images })}>
          Aggiungi al Carrello
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <Product
          key={product.id}
          name={product.title}
          price={product.price}
          description={product.description}
          images={product.images}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
};

const SearchBar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div className="header">
      <div className="logo">
        <img src={require("./components/Amazonlogo.png")} alt="LogoAmazon" style={{ width: "160px", height: "100px" }} />
      </div>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input type="text" value={searchTerm} onChange={handleChange} placeholder="Cerca articoli" />
        <button type="submit">Cerca</button>
      </form>
      <div className="user-actions">
        <button>Accedi al tuo account/Registrati</button>
        <button>Carrello</button>
      </div>
    </div>
  );
};

const Cart = ({ cartItems, removeFromCart }) => {
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price;
    });
    return total;
  };

  const handleBuyNow = () => {
    alert('Hai effettuato l\'acquisto!');
  };

  return (
    <div className="cart">
      <h2>Carrello Provvisorio</h2>
      {cartItems.length == 0 ? (
        <p>Il tuo carrello è vuoto</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-image">
                {item.images && item.images.length > 0 && (
                  <img src={item.images[0]} alt={item.name} />
                )}
              </div>
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p id="Prezzo">Prezzo: {item.price} ( Quantità: {item.quantity} )</p>
                <button onClick={() => removeFromCart(index)}>Rimuovi dal carrello</button>
              </div>
            </div>
          ))}
          <p id="Totale">Totale provvisorio: {calculateTotal().toFixed(2)}$</p>
          <button id="acquista" onClick={handleBuyNow}>Acquista ora!</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex((item) => item.name === product.name);

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      updatedCartItems[existingItemIndex].price += product.price;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    const item = updatedCartItems[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      item.price -= item.price / (item.quantity + 1);
    } else {
      updatedCartItems.splice(index, 1);
    }

    setCartItems(updatedCartItems);
  };

  const handleSearch = (searchTerm) => {
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProducts(response.data.products);
        setSearchResults(response.data.products);
      } catch (error) {
        console.error('Errore durante il recupero dei dati dei prodotti:', error);
      }
    };

    fetchProducts();
  }, []);

  const Advertisement = () => {
    return (
      <div className="advertisement">
        <div className="advertisement-item">
        <img src={require("./components/pub1.jpg")} alt="Pubblicita" style={{ width: "500px", height: "300px" }} />
        </div>
        <div className="advertisement-item">
        <img src={require("./components/pub2.jpg")} alt="Pubblicita" style={{ width: "500px", height: "300px" }} />
        </div>
        <div className="advertisement-item">
        <img src={require("./components/pub3.jpg")} alt="Pubblicita" style={{ width: "500px", height: "300px" }} />
        </div>
        <div className="advertisement-item">
        <img src={require("./components/pub4.jpg")} alt="Pubblicita" style={{ width: "500px", height: "300px" }} />
        </div>
        <div className="advertisement-item">
        <img src={require("./components/pub5.jpg")} alt="Pubblicita" style={{ width: "500px", height: "300px" }} />
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <SearchBar handleSearch={handleSearch} />
      <div className="main-content">
        <ProductList products={searchResults} addToCart={addToCart} />
        <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
        <Advertisement /> {}
      </div>
    </div>
  );
};

export default App;