import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import './/styles.css';

const App = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ name: '', image: '', });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await axios.put(`https://api.escuelajs.co/api/v1/categories/${selectedCategory.id}`, category);
        setAlertType('success');
        setAlertMessage('Categoría actualizada correctamente');
      } else {
        await axios.post('https://api.escuelajs.co/api/v1/categories', category);
        setAlertType('success');
        setAlertMessage('Categoría creada correctamente');
      }
      fetchCategories();
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error){
      console.error('Error creating category:', error);
      setAlertType('danger');
      setAlertMessage('Error creating category. Please try again.');
      setShowAlert(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      await axios.delete(`https://api.escuelajs.co/api/v1/categories/${selectedCategory.id}`);
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setSelectedCategory(null);
      setCategory({ name: '', image: '' });
      setAlertType('success');
      setAlertMessage('Categoría eliminada correctamente');
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlertType('danger');
      setAlertMessage('Error deleting category. Please try again.');
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleClear = () => {
    setCategory({ name: '', image: '' });
    setSelectedCategory(null);
  };

  return (
    <>
      <h1>Crear categoría</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nombre:</Form.Label>
          <Form.Control type="text" name="name" value={category.name} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL de la imagen:</Form.Label>
          <Form.Control type="text" name="image" value={category.image} onChange={handleInputChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          {selectedCategory ? 'Actualizar categoría' : 'Crear categoría'}
        </Button>
        {selectedCategory && (
          <Button variant="danger" onClick={handleDelete}>
            Eliminar categoría
          </Button>
        )}
        <Button variant="secondary" onClick={handleClear}>
          Limpiar
        </Button>
      </Form>
      <h1>Listado de categorías</h1>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <h3>{cat.name}</h3>
            <img src={cat.image} alt={cat.name} width="200" />
            <Button variant="primary" onClick={() => { setSelectedCategory(cat); setCategory(cat); }}>
              Editar
            </Button>
          </li>
        ))}
      </ul>
      {showAlert && <Alert variant={alertType}>{alertMessage}</Alert>}
    </>
  );
};

export default App;