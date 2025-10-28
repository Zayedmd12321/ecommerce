// File: app/admin/page.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { IProduct } from '@/models/Product';
import styles from './admin.module.css';
import {
  AlertCircle,
  Edit2,
  LogOut,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '@/components/LoginForm'; // <<< CORRECTED IMPORT PATH
import MessageAlert from '@/components/MessageAlert'; // <<< CORRECTED IMPORT PATH

type ProductFormData = Omit<IProduct, '_id' | 'lastUpdated'>;

const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  category: '',
  inventory: 0,
  imageUrl: '',
};

export default function AdminPage() {
  const { isAuthenticated, apiKey, logout } = useAuth();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [addForm, setAddForm] = useState<ProductFormData>(initialFormData);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductFormData>>({});

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(
    null
  );

  // --- DATA FETCHING ---
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, apiKey, logout]); // Added logout to dependency array

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  });


  const fetchProducts = async () => {
    if (!apiKey) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/products', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }
      const data: IProduct[] = await res.json();
      setProducts(data);
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      if (error.message.includes('Unauthorized')) {
        logout();
      }
    }
    setIsLoading(false);
  };

  // --- FORM HANDLERS (Unchanged logic) ---
  const handleAddFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleEditFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // --- API SUBMISSION (Unchanged logic) ---
  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      setAddForm(initialFormData);
      await fetchProducts();
      setMessage({ type: 'success', text: 'Product created successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
    setIsLoading(false);
  };

  const handleSelectForEdit = (product: IProduct) => {
    setEditSlug(product.slug);
    setEditForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      inventory: product.inventory,
      imageUrl: product.imageUrl,
    });
    window.scrollTo(0, 0);
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editSlug) return;
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/products/${editSlug}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      setEditSlug(null);
      setEditForm({});
      await fetchProducts();
      setMessage({ type: 'success', text: 'Product updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
    setIsLoading(false);
  };

  // --- DELETE HANDLERS (Unchanged logic) ---
  const openDeleteModal = (product: IProduct) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/products/${productToDelete.slug}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      await fetchProducts(); // Refresh list
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
    closeDeleteModal();
    setIsLoading(false);
  };

  // --- RENDER ---

  if (!isAuthenticated) {
    return (
      <LoginForm
        pageTitle="Admin Panel"
        pageSubtitle="Please enter your ADMIN Key to proceed."
      />
    );
  }

  return (
    <>
      {showDeleteModal && (
        <div className={styles.modalBackdrop}>
          <div className={`card ${styles.modalContent}`}>
            <div className={styles.modalHeader}>
              <AlertCircle size={24} className={styles.modalIconError} />
              <h3>Delete Product</h3>
            </div>
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to delete this product?
                <br />
                <strong>{productToDelete?.name}</strong>
              </p>
              <p>This action cannot be undone.</p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.buttonSecondary}
                onClick={closeDeleteModal}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className={styles.buttonDanger}
                onClick={handleDeleteProduct}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className={styles.header}>
          <h1>Admin Panel</h1>
          <button
            className={styles.buttonSecondary}
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <p className={styles.pageDescription}>
          This page is <strong>Client-Side Rendered (CSR)</strong>. All
          data is fetched from the API in the browser.
        </p>

        <MessageAlert message={message} />

        <div className={styles.adminContent}>
          <div className={`card ${styles.formContainer}`}>
            <h2>{editSlug ? `Editing: ${editSlug}` : 'Add New Product'}</h2>
            <form onSubmit={editSlug ? handleUpdateSubmit : handleAddSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input-field"
                    value={editSlug ? editForm.name ?? '' : addForm.name}
                    onChange={
                      editSlug ? handleEditFormChange : handleAddFormChange
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="slug">Slug</label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    className="input-field"
                    value={editSlug ? editForm.slug ?? '' : addForm.slug}
                    onChange={
                      editSlug ? handleEditFormChange : handleAddFormChange
                    }
                    required
                  />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  className="input-field"
                  placeholder="https://example.com/image.png"
                  value={
                    editSlug ? editForm.imageUrl ?? '' : addForm.imageUrl
                  }
                  onChange={
                    editSlug ? handleEditFormChange : handleAddFormChange
                  }
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="input-field"
                  rows={4}
                  value={
                    editSlug
                      ? editForm.description ?? ''
                      : addForm.description
                  }
                  onChange={
                    editSlug ? handleEditFormChange : handleAddFormChange
                  }
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    className="input-field"
                    value={editSlug ? editForm.price ?? 0 : addForm.price}
                    onChange={
                      editSlug ? handleEditFormChange : handleAddFormChange
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    className="input-field"
                    value={
                      editSlug ? editForm.category ?? '' : addForm.category
                    }
                    onChange={
                      editSlug ? handleEditFormChange : handleAddFormChange
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="inventory">Inventory</label>
                  <input
                    type="number"
                    id="inventory"
                    name="inventory"
                    step="1"
                    className="input-field"
                    value={
                      editSlug
                        ? editForm.inventory ?? 0
                        : addForm.inventory
                    }
                    onChange={
                      editSlug ? handleEditFormChange : handleAddFormChange
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Saving...'
                    : editSlug
                    ? 'Update Product'
                    : 'Add Product'}
                </button>
                {editSlug && (
                  <button
                    type="button"
                    className={styles.buttonSecondary}
                    onClick={() => {
                      setEditSlug(null);
                      setEditForm({});
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className={`card ${styles.productList}`}>
            <h2>Current Products</h2>
            {isLoading && !products.length ? (
              <p className={styles.loading}>Loading products...</p>
            ) : (
              <div className={styles.listContainer}>
                {products.map((product) => (
                  <div key={product._id} className={styles.productItem}>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>
                        {product.name}
                      </span>
                      <small className={styles.productMeta}>
                        ${product.price} • {product.inventory} in stock
                      </small>
                    </div>
                    <div className={styles.productActions}>
                      <button
                        className={styles.buttonOutline}
                        onClick={() => handleSelectForEdit(product)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={`${styles.buttonOutline} ${styles.buttonOutlineDanger}`}
                        onClick={() => openDeleteModal(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}