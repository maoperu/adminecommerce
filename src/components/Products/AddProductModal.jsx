import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const AddProductModal = ({ open, handleClose, handleAdd, handleUpdate, editProduct }) => {
  const [product, setProduct] = useState({
    product_name: '',
    description: '',
    price: '',
    categories: '',
    stock: '',
    imageUrl: ''
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [errors, setErrors] = useState({});

  // Add this state to track multiple image URLs
  const [imageUrls, setImageUrls] = useState(['']);

  // Modify useEffect to handle multiple images
  useEffect(() => {
    if (editProduct) {
      const urls = editProduct.imageUrl ? editProduct.imageUrl.split(' ') : [''];
      setImageUrls(urls);
      setProduct({
        product_name: editProduct.product_name || '',
        description: editProduct.description || '',
        price: editProduct.price || '',
        categories: editProduct.categories || '',
        stock: editProduct.stock || '',
        imageUrl: editProduct.imageUrl || '',
        id: editProduct.id // Important to keep the id for updating
      });
    } else {
      setImageUrls(['']);
      setProduct({
        product_name: '',
        description: '',
        price: '',
        categories: '',
        stock: '',
        imageUrl: ''
      });
    }
  }, [editProduct]);

  const validateForm = () => {
    const newErrors = {};
    if (!product.product_name?.trim()) newErrors.product_name = 'El nombre es requerido';
    if (!product.description?.trim()) newErrors.description = 'La descripción es requerida';
    if (!product.price) newErrors.price = 'El precio es requerido';
    if (!product.categories?.trim()) newErrors.categories = 'Las categorías son requeridas';
    if (!product.stock) newErrors.stock = 'El stock es requerido';
    if (!product.imageUrl?.trim()) newErrors.imageUrl = 'La URL de la imagen es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setProduct({ ...product, imageUrl: newUrls.join(' ') });
  };

  const removeImageUrl = (indexToRemove) => {
    const newUrls = imageUrls.filter((_, index) => index !== indexToRemove);
    setImageUrls(newUrls);
    setProduct({ ...product, imageUrl: newUrls.join(' ') });
  };

  // Add this function to add new image URL field
  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editProduct) {
      handleUpdate(product);
    } else {
      handleAdd(product);
    }
    setOpenAlert(true);
    setTimeout(() => {
      handleClose();
      setProduct({ product_name: '', description: '', price: '', categories: '', stock: '', imageUrl: '' });
      setErrors({});
    }, 1500);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={3}>
          {editProduct ? 'Editar producto' : 'Añadir nuevo producto'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <TextField
              label="Nombre"
              fullWidth
              value={product.product_name}
              onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
              error={!!errors.product_name}
              helperText={errors.product_name}
            />
            <TextField
              label="Descripcion"
              fullWidth
              multiline
              rows={3}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
            />
            <TextField
              label="Categorias"
              fullWidth
              multiline
              rows={2}
              value={product.categories}
              onChange={(e) => setProduct({ ...product, categories: e.target.value })}
              error={!!errors.categories}
              helperText={errors.categories || "Enter categories separated by commas"}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Precio"
                type="number"
                sx={{ flex: 1 }}
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                error={!!errors.price}
                helperText={errors.price}
              />
              <TextField
                label="Stock"
                type="number"
                inputProps={{ step: 1, min: 0 }}
                sx={{ flex: 1 }}
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: Math.floor(Number(e.target.value)) })}
                error={!!errors.stock}
                helperText={errors.stock}
              />
            </Box>
            {imageUrls.map((url, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label={`Image URL ${index + 1}`}
                  fullWidth
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  error={!!errors.imageUrl && index === 0}
                  helperText={(!!errors.imageUrl && index === 0) ? errors.imageUrl : "Enter the URL of the product image"}
                />
                {index > 0 && (
                  <Button
                    onClick={() => removeImageUrl(index)}
                    color="error"
                    variant="outlined"
                    size="small"
                    sx={{ 
                      minWidth: '40px', 
                      height: '40px', 
                      p: 0,
                      mt: 1 // Add margin top to align with TextField
                    }}
                  >
                    X
                  </Button>
                )}
              </Box>
            ))}
            <Button
              type="button"
              onClick={addImageUrl}
              variant="outlined"
              size="small"
            >
              Añadir otra foto
            </Button>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit">
                {editProduct ? 'Guardar Cambios' : 'Añadir Producto'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProductModal;