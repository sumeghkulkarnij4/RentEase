import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "./components/AdminSidebar";
import { API_BASE_URL, getImageUrl } from "./config/api";
import "./styles/admin.css";

function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [editing, setEditing] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    rent: "",
    deposit: "",
    stock: "",
    image: "",
    description: "",
    tenureOptions: [3,6,12],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {

      const res = await fetch(
        `${API_BASE_URL}/api/products`
      );

      const data = await res.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );

    }

    catch(err){

      console.log(err);

    }

    finally{

      setLoading(false);

    }

  };

  const categories = useMemo(()=>{

    return [

      "All",

      ...new Set(
        products.map(
          p=>p.category
        )
      )

    ];

  },[products]);

  const filteredProducts = useMemo(()=>{

    return products.filter(product=>{

      const matchesSearch=
      product.name
      .toLowerCase()
      .includes(search.toLowerCase());

      const matchesCategory=
      category==="All" ||
      product.category===category;

      return matchesSearch &&
      matchesCategory;

    });

  },[
    products,
    search,
    category
  ]);

  const handleChange=(e)=>{

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });

  };

  const resetForm=()=>{

    setEditing(null);

    setImageFile(null);

    setForm({

      name:"",
      category:"",
      rent:"",
      deposit:"",
      stock:"",
      image:"",
      description:"",
      tenureOptions:[3,6,12],

    });

  };

  const handleEdit=(product)=>{

    setEditing(product._id);

    setImageFile(null);

    setForm({

      ...product,

    });

    window.scrollTo({

      top:0,

      behavior:"smooth",

    });

  };

  const saveProduct = async () => {

    const method=
    editing
    ? "PUT"
    : "POST";

    const url=
    editing
    ? `${API_BASE_URL}/api/products/${editing}`
    : `${API_BASE_URL}/api/products`;

    const formData=
    new FormData();

    formData.append(
      "name",
      form.name
    );

    formData.append(
      "category",
      form.category
    );

    formData.append(
      "rent",
      form.rent
    );

    formData.append(
      "deposit",
      form.deposit
    );

    formData.append(
      "stock",
      form.stock
    );

    formData.append(
      "description",
      form.description
    );

    formData.append(
      "tenureOptions",
      JSON.stringify(
        form.tenureOptions
      )
    );

    if(imageFile){

      formData.append(
        "image",
        imageFile
      );

    }

    try{

      const res=
      await fetch(url,{

        method,

        body:formData,

      });

      const data=
      await res.json();

      toast.success(
        data.message ||
        "Saved Successfully"
      );

      resetForm();

      fetchProducts();

    }

    catch(err){

      console.log(err);

    }

  };
    const deleteProduct = async (id) => {

    if (
      !window.confirm(
        "Delete this product?"
      )
    )
      return;

    try {

      const res = await fetch(
        `${API_BASE_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await res.json();

      toast.success(data.message || "Product deleted.");

      fetchProducts();

    } catch (err) {

      console.log(err);

    }

  };

  if (loading) {

    return (

      <div className="admin-loading">

        Loading Products...

      </div>

    );

  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>Product Management</h1>
            <p>Add, edit and remove products from your catalogue.</p>
          </div>
        </div>
        <div className="admin-page-content">

    <div className="admin-page">

      {/* Header */}

      <div className="admin-header">

        <h1>Product Management</h1>

        <Link
          to="/admin"
          className="back-btn"
        >
          ← Dashboard
        </Link>

      </div>

      {/* Product Form */}

      <div className="admin-form">

        <h2>

          {editing
            ? "Edit Product"
            : "Add Product"}

        </h2>

        <div className="form-grid">

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />

          <input
            type="number"
            name="rent"
            placeholder="Monthly Rent"
            value={form.rent}
            onChange={handleChange}
          />

          <input
            type="number"
            name="deposit"
            placeholder="Deposit"
            value={form.deposit}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />

          {/* Cloudinary Image Upload */}

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>
              setImageFile(
                e.target.files[0]
              )
            }
          />

        </div>

        {(imageFile || form.image) && (

          <div
            style={{
              marginTop:"20px",
              marginBottom:"20px",
            }}
          >

            <img
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : form.image
              }
              alt="Preview"
              style={{
                width:"180px",
                height:"180px",
                objectFit:"cover",
                borderRadius:"12px",
                border:"1px solid #ddd",
              }}
            />

          </div>

        )}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <div className="form-actions">

          <button
            onClick={saveProduct}
          >

            {editing
              ? "Update Product"
              : "Add Product"}

          </button>

          {editing && (

            <button
              className="cancel-btn"
              onClick={resetForm}
            >

              Cancel

            </button>

          )}

        </div>

      </div>
            {/* Filters */}

      <div className="admin-filters">

        <input
          placeholder="Search Products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          {categories.map((cat) => (

            <option
              key={cat}
              value={cat}
            >

              {cat}

            </option>

          ))}

        </select>

      </div>

      {/* Products Table */}

      <table className="admin-table">

        <thead>

          <tr>

            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Rent</th>
            <th>Deposit</th>
            <th>Stock</th>
            <th>Rating</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredProducts.map((product) => (

            <tr key={product._id}>

              <td>

                <img
                  className="product-thumb"
                  src={product.image}
                  alt={product.name}
                  onError={(e)=>{
                    e.target.src =
                    "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />

              </td>

              <td>

                {product.name}

              </td>

              <td>

                {product.category}

              </td>

              <td>

                ₹{product.rent}

              </td>

              <td>

                ₹{product.deposit}

              </td>

              <td>

                <span
                  className={
                    product.stock === 0
                      ? "stock-out"
                      : product.stock <= 5
                      ? "stock-low"
                      : "stock-good"
                  }
                >

                  {product.stock}

                </span>

              </td>

              <td>

                ⭐ {product.rating || 0}

              </td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(product)
                  }
                >

                  Edit

                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteProduct(
                      product._id
                    )
                  }
                >

                  Delete

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {filteredProducts.length === 0 && (

        <div className="empty-state">

          No products found.

        </div>

      )}

    </div>

        </div>
      </main>
    </div>
  );
}

export default AdminProducts;
