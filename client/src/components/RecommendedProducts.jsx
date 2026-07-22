import React, { useEffect, useState } from "react";

function RecommendedProducts({ category }) {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, [category]);

  const fetchRecommendations = async () => {

    const res = await fetch(
      `http://localhost:5000/api/recommendations/${category}`
    );

    const data = await res.json();

    setProducts(data);

  };

  return (
    <div className="recommend-section">

      <h2>Recommended Products</h2>

      <div className="recommend-grid">

        {products.map((product) => (

          <div
            key={product._id}
            className="recommend-card"
          >

            <img
              src={`http://localhost:5000/images/${product.image}`}
              alt={product.name}
            />

            <h3>{product.name}</h3>

            <p>₹{product.rent}/month</p>

            <p>⭐ {product.rating}</p>

          </div>

        ))}

      </div>

    </div>
  );

}

export default RecommendedProducts;