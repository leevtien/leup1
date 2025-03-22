'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getProductById, 
  addProduct, 
  updateProduct 
} from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { uploadProductImage } from '@/services/storageService';
import { FaUpload, FaImage, FaSave, FaTimes } from 'react-icons/fa';

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEditing = !!productId;
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    price: 0,
    salePrice: 0,
    category: '',
    tags: [],
    features: [],
    isActive: true,
    isFeatured: false,
    isNew: false,
    productType: 'one-time',
    deliveryInfo: '',
    requirements: []
  });
  
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Load product data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // If editing, fetch product data
        if (isEditing && productId) {
          const product = await getProductById(productId);
          if (product) {
            setFormData({
              name: product.name,
              slug: product.slug,
              shortDescription: product.shortDescription,
              description: product.description,
              price: product.price,
              salePrice: product.salePrice || 0,
              category: product.category,
              tags: product.tags,
              features: product.features,
              isActive: product.isActive,
              isFeatured: product.isFeatured,
              isNew: product.isNew,
              productType: product.productType,
              deliveryInfo: product.deliveryInfo,
              requirements: product.requirements || []
            });
            
            setImages(product.images || []);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isEditing, productId]);
  
  // Generate slug from product name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'price' || name === 'salePrice') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Auto-generate slug when name changes
      if (name === 'name') {
        setFormData({ ...formData, name: value, slug: generateSlug(value) });
      }
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  // Handle tags and features (comma-separated inputs)
  const handleArrayInput = (e, field) => {
    const value = e.target.value;
    const array = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item);
    
    setFormData({ ...formData, [field]: array });
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
    
    // Create preview URLs
    const previewURLs = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...previewURLs]);
  };
  
  // Remove image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    if (index < imageFiles.length) {
      const newImageFiles = [...imageFiles];
      newImageFiles.splice(index, 1);
      setImageFiles(newImageFiles);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Product slug is required';
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (images.length === 0 && imageFiles.length === 0) {
      newErrors.images = 'At least one product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Upload new images if any
      let uploadedImageURLs = [];
      if (imageFiles.length > 0) {
        uploadedImageURLs = await Promise.all(
          imageFiles.map(file => uploadProductImage(file))
        );
      }
      
      // Combine existing image URLs with new ones
      const finalImages = [
        ...images.filter(img => !img.startsWith('blob:')), // Keep existing remote URLs
        ...uploadedImageURLs
      ];
      
      const productData = {
        ...formData,
        images: finalImages,
        thumbnail: finalImages[0] || '' // First image as thumbnail
      };
      
      if (isEditing) {
        // Update existing product
        await updateProduct(productId, productData);
      } else {
        // Add new product
        await addProduct(productData);
      }
      
      // Redirect to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading product data...</div>;
  }
  
  return (
    <div className="product-form-page">
      <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Product Name <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="slug">Slug <span className="required">*</span></label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={errors.slug ? 'error' : ''}
            />
            {errors.slug && <p className="error-text">{errors.slug}</p>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) <span className="required">*</span></label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <p className="error-text">{errors.price}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="salePrice">Sale Price ($)</label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category <span className="required">*</span></label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="productType">Product Type</label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
            >
              <option value="one-time">One-time Purchase</option>
              <option value="subscription">Subscription</option>
              <option value="account">Account</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Description</h2>
          
          <div className="form-group">
            <label htmlFor="shortDescription">Short Description <span className="required">*</span></label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className={errors.shortDescription ? 'error' : ''}
            />
            {errors.shortDescription && <p className="error-text">{errors.shortDescription}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Full Description <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              rows={8}
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayInput(e, 'tags')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="features">Features (comma-separated)</label>
            <textarea
              id="features"
              name="features"
              rows={3}
              value={formData.features.join(', ')}
              onChange={(e) => handleArrayInput(e, 'features')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="deliveryInfo">Delivery Information</label>
            <textarea
              id="deliveryInfo"
              name="deliveryInfo"
              rows={3}
              value={formData.deliveryInfo}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="requirements">Requirements (comma-separated)</label>
            <textarea
              id="requirements"
              name="requirements"
              rows={3}
              value={formData.requirements.join(', ')}
              onChange={(e) => handleArrayInput(e, 'requirements')}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Images</h2>
          
          <div className="form-group">
            <label>Product Images <span className="required">*</span></label>
            <div className="file-upload">
              <label htmlFor="images" className="upload-button">
                <FaUpload /> Select Images
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden-input"
              />
            </div>
            {errors.images && <p className="error-text">{errors.images}</p>}
          </div>
          
          <div className="image-preview-container">
            {images.length > 0 ? (
              <div className="image-grid">
                {images.map((img, index) => (
                  <div key={index} className="image-item">
                    <img 
                      src={img} 
                      alt={`Product image ${index + 1}`} 
                      className="preview-image" 
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-images">
                <FaImage />
                <p>No images uploaded yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Product Options</h2>
          
          <div className="form-checkboxes">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive">Active (visible to customers)</label>
            </div>
            
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <label htmlFor="isFeatured">Featured Product</label>
            </div>
            
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="isNew"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
              />
              <label htmlFor="isNew">Mark as New</label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => router.push('/admin/products')}
            disabled={saving}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className="btn-save"
            disabled={saving}
          >
            {saving ? 'Saving...' : (
              <>
                <FaSave /> {isEditing ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}