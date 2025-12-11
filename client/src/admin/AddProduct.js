import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Image,
  Card,
  Spinner
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addProduct, fetchBrands } from '../api'; // import API functions

function AddProduct() {
  const navigate = useNavigate();
  const [imagesPreview, setImagesPreview] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch brands on component mount
  useEffect(() => {
    const getBrands = async () => {
      try {
        const result = await fetchBrands();
        setBrands(result);
      } catch (error) {
        setErrorMsg('Failed to load brands');
      } finally {
        setLoadingBrands(false);
      }
    };

    getBrands();
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      sku: '',
      name: '',
      description: '',
      quantity: '',
      price: '',
      taxable: false,
      isActive: true,
      brand: '',
      images: []
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
      images: Yup.mixed().required('Please upload at least one image')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const formData = new FormData();
        formData.append('sku', values.sku);
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('quantity', values.quantity);
        formData.append('price', values.price);
        formData.append('taxable', values.taxable);
        formData.append('isActive', values.isActive);
        formData.append('brand', values.brand);

        values.images.forEach(file => formData.append('image[]', file));

        const response = await addProduct(formData);

        setSuccessMsg(response.message);
        resetForm();
        setImagesPreview([]);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }
  });

  // Handle image selection and preview
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    formik.setFieldValue('images', files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagesPreview(previewUrls);
  };

  return (
    <Container className='my-5'>
      <Row className='mb-4 align-items-center'>
        <Col>
          <h2>Add Product</h2>
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
                  placeholder='Enter SKU'
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.sku && formik.errors.sku}
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
                  placeholder='Enter product name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && formik.errors.name}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.name}
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
                  placeholder='Enter product description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.description && formik.errors.description
                  }
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
                  placeholder='Enter quantity'
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
                  name='price'
                  placeholder='Enter price'
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

            {/* Brand Dropdown */}
            <Form.Group as={Row} className='mb-3' controlId='brand'>
              <Form.Label column sm={2}>
                Brand
              </Form.Label>
              <Col sm={10}>
                {loadingBrands ? (
                  <Spinner animation='border' size='sm' />
                ) : (
                  <Form.Select
                    name='brand'
                    value={formik.values.brand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.brand && formik.errors.brand}
                  >
                    <option value=''>Select Brand</option>
                    {brands.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
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

            {/* Images */}
            <Form.Group as={Row} className='mb-4' controlId='images'>
              <Form.Label column sm={2}>
                Images
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageChange}
                  isInvalid={formik.touched.images && formik.errors.images}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.images}
                </Form.Control.Feedback>

                <div className='mt-3 d-flex flex-wrap gap-2'>
                  {imagesPreview.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      thumbnail
                      width={100}
                      height={100}
                      alt={`preview-${idx}`}
                    />
                  ))}
                </div>
              </Col>
            </Form.Group>

            {/* Submit */}
            <Row>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type='submit' variant='primary' disabled={loading}>
                  {loading ? 'Submitting...' : 'Add Product'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddProduct;
