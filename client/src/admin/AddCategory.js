import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Spinner,
  Badge
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProducts, addCategory } from '../api';

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // -----------------------------------------
  // Fetch Products on Mount
  // -----------------------------------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetchProducts();

        console.log('Products API Response:', res);

        // API STRUCTURE FIX
        if (Array.isArray(res)) {
          setProductList(res);
        } else if (Array.isArray(res?.products)) {
          setProductList(res.products);
        } else if (Array.isArray(res?.data?.products)) {
          setProductList(res.data.products);
        } else if (Array.isArray(res?.data)) {
          setProductList(res.data);
        } else {
          toast.error('Unexpected product data format');
          console.error('Unexpected product response:', res);
        }
      } catch (err) {
        toast.error('Failed to load products');
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // -----------------------------------------
  // Checkbox Select Handler
  // -----------------------------------------
  const handleCheckboxSelect = id => {
    setSelectedProducts(
      prev =>
        prev.includes(id)
          ? prev.filter(p => p !== id) // remove
          : [...prev, id] // add
    );
  };

  // -----------------------------------------
  // Remove Product Chip
  // -----------------------------------------
  const removeProduct = id => {
    setSelectedProducts(prev => prev.filter(p => p !== id));
  };

  // -----------------------------------------
  // Submit Form
  // -----------------------------------------
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Category name is required.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name,
        description,
        isActive,
        products: selectedProducts
      };

      const result = await addCategory(payload);

      toast.success(result.message || 'Category Added Successfully!');
      setSuccessMsg(result.message);

      // Reset form
      setName('');
      setDescription('');
      setIsActive(true);
      setSelectedProducts([]);
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || 'Failed to add category!';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='my-5'>
      <Row className='mb-4 align-items-center'>
        <Col>
          <h2>Add Category</h2>
        </Col>
        <Col className='text-end'>
          <Button variant='secondary' onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      {successMsg && <Alert variant='success'>{successMsg}</Alert>}
      {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}

      <Card className='shadow-sm'>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Group as={Row} className='mb-3'>
              <Form.Label column sm={2}>
                Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='text'
                  placeholder='Enter category name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>

            {/* Description */}
            <Form.Group as={Row} className='mb-3'>
              <Form.Label column sm={2}>
                Description
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Enter description'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </Col>
            </Form.Group>

            {/* Active Toggle */}
            <Form.Group as={Row} className='mb-3'>
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  type='checkbox'
                  label='Active'
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                />
              </Col>
            </Form.Group>

            {/* Multi Select (Checkbox List) */}
            <Form.Group as={Row} className='mb-4'>
              <Form.Label column sm={2}>
                Products
              </Form.Label>
              <Col sm={10}>
                {loadingProducts ? (
                  <div className='d-flex align-items-center'>
                    <Spinner animation='border' size='sm' className='me-2' />
                    Loading products...
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: '250px',
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      padding: '10px',
                      borderRadius: '5px'
                    }}
                  >
                    {productList.length === 0 && (
                      <p className='text-muted'>No products available</p>
                    )}

                    {productList.map(prod => (
                      <Form.Check
                        key={prod._id}
                        type='checkbox'
                        label={prod.name}
                        value={prod._id}
                        checked={selectedProducts.includes(prod._id)}
                        onChange={() => handleCheckboxSelect(prod._id)}
                        className='mb-1'
                      />
                    ))}
                  </div>
                )}
              </Col>
            </Form.Group>

            {/* Selected Products Chips */}
            {selectedProducts.length > 0 && (
              <Row className='mb-4'>
                <Col sm={{ span: 10, offset: 2 }}>
                  <div className='d-flex flex-wrap gap-2'>
                    {selectedProducts.map(id => {
                      const prod = productList.find(p => p._id === id) || {
                        name: 'Unknown Product'
                      };

                      return (
                        <Badge
                          key={id}
                          bg='primary'
                          pill
                          className='p-2 d-flex align-items-center'
                        >
                          {prod.name}
                          <Button
                            size='sm'
                            variant='light'
                            className='ms-2 py-0 px-2'
                            onClick={() => removeProduct(id)}
                          >
                            ×
                          </Button>
                        </Badge>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            )}

            {/* Submit Button */}
            <Row>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type='submit' disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        className='me-2'
                      />
                      Adding...
                    </>
                  ) : (
                    'Add Category'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddCategory;
