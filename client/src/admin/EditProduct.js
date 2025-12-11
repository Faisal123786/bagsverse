import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, updateProduct } from '../api';

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formik = useFormik({
    initialValues: {
      sku: '',
      name: '',
      description: '',
      quantity: 0,
      price: 0,
      taxable: false,
      isActive: true,
      brand: '',
      slug: ''
    },
    validationSchema: Yup.object({
      sku: Yup.string().required('SKU is required'),
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      quantity: Yup.number()
        .typeError('Quantity must be a number')
        .required('Quantity is required'),
      price: Yup.number()
        .typeError('Price must be a number')
        .required('Price is required'),
      brand: Yup.string().required('Brand is required'),
      slug: Yup.string().required('Slug is required')
    }),
    onSubmit: async values => {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const response = await updateProduct(id, values);
        setSuccessMsg(response.message || 'Product updated successfully');

        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } catch (error) {
        setErrorMsg(error.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetchProductById(id);
        const product = response.product || response.data?.product || response;

        formik.setValues({
          sku: product.sku || '',
          name: product.name || '',
          description: product.description || '',
          quantity: product.quantity || 0,
          price: product.price || 0,
          taxable: product.taxable || false,
          isActive: product.isActive !== undefined ? product.isActive : true,
          brand: product.brand?._id || product.brand || '',
          slug: product.slug || ''
        });
      } catch (error) {
        setErrorMsg('Failed to load product data.');
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Container className='my-5'>
      <Row className='mb-4 align-items-center'>
        <Col>
          <h2>Edit Product</h2>
        </Col>
        <Col className='text-end'>
          <Button
            variant='secondary'
            onClick={() => navigate('/admin/products')}
          >
            Back
          </Button>
        </Col>
      </Row>

      {successMsg && <Alert variant='success'>{successMsg}</Alert>}
      {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}

      <Card className='shadow-sm'>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            {/* SKU */}
            <Form.Group as={Row} className='mb-3' controlId='sku'>
              <Form.Label column sm={2}>
                SKU
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='text'
                  name='sku'
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.sku && formik.errors.sku}
                  placeholder='Enter SKU'
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.sku}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Name */}
            <Form.Group as={Row} className='mb-3' controlId='name'>
              <Form.Label column sm={2}>
                Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='text'
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && formik.errors.name}
                  placeholder='Enter product name'
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Slug */}
            <Form.Group as={Row} className='mb-3' controlId='slug'>
              <Form.Label column sm={2}>
                Slug
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='text'
                  name='slug'
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.slug && formik.errors.slug}
                  placeholder='Enter slug'
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.slug}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Description */}
            <Form.Group as={Row} className='mb-3' controlId='description'>
              <Form.Label column sm={2}>
                Description
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as='textarea'
                  rows={3}
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.description && formik.errors.description
                  }
                  placeholder='Enter product description'
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.description}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Quantity & Price */}
            <Row className='mb-3'>
              <Form.Group as={Col} md={6} controlId='quantity'>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type='number'
                  name='quantity'
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.quantity && formik.errors.quantity}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  step='0.01'
                  name='price'
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.price && formik.errors.price}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            {/* Brand */}
            <Form.Group as={Row} className='mb-3' controlId='brand'>
              <Form.Label column sm={2}>
                Brand
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='text'
                  name='brand'
                  value={formik.values.brand}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.brand && formik.errors.brand}
                  placeholder='Enter brand ID'
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.brand}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Checkboxes */}
            <Form.Group as={Row} className='mb-3'>
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  type='checkbox'
                  label='Taxable'
                  name='taxable'
                  checked={formik.values.taxable}
                  onChange={formik.handleChange}
                  className='mb-2'
                />
                <Form.Check
                  type='checkbox'
                  label='Active'
                  name='isActive'
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                />
              </Col>
            </Form.Group>

            {/* Submit */}
            <Row>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type='submit' variant='primary' disabled={loading}>
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditProduct;
