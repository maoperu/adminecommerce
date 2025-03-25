import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddProductModal from './AddProductModal';
import { 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleEdit = (id) => {
    const productToEdit = products.find(product => product.id === id);
    setEditProduct({
      ...productToEdit,
      imageUrl: productToEdit.image || productToEdit.imageUrl // Map image to imageUrl for editing
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditProduct(null);
  };

  const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/products/${deleteConfirm.id}`);
      await fetchProducts();
      setOpenAlert(true);
      setDeleteConfirm({ open: false, id: null });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const productToAdd = {
        ...newProduct,
        image: newProduct.imageUrl
      };
      
      await axios.post(`${API_URL}/products`, productToAdd);
      await fetchProducts();
      setOpenAlert(true);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const productToUpdate = {
        ...updatedProduct,
        image: updatedProduct.imageUrl
      };
      
      await axios.put(
        `${API_URL}/products/${updatedProduct.id}`,
        productToUpdate
      );
      
      await fetchProducts();
      setOpenAlert(true);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  return (
    <div>
      <h2>Administrador de Productos</h2>
      <Button 
        variant="contained" 
        color="primary" 
        style={{ marginBottom: 20 }}
        onClick={() => setOpenModal(true)}
      >
        Añadir nuevo producto
      </Button>
      
      <AddProductModal
        open={openModal}
        handleClose={handleCloseModal}
        handleAdd={handleAddProduct}
        handleUpdate={handleUpdateProduct}
        editProduct={editProduct}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading products...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No products found</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image || product.imageUrl} 
                      alt={product.product_name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.description?.substring(0, 50)}...</TableCell>
                  <TableCell>{product.categories}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(product.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Cambios guardados exitosamente
        </Alert>
      </Snackbar>
      
      {/* Add confirmation dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar este producto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {deleteConfirm.id ? 'Producto eliminado exitosamente' : 'Cambios guardados exitosamente'}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductList;