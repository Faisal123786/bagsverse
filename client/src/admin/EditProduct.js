import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Image,
  Badge
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

  // State for images - keeping track of existing and new
  const [existingImages, setExistingImages] = useState([]);
  const [existingThumbnails, setExistingThumbnails] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newThumbnails, setNewThumbnails] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState([]);

  // Track which existing images to delete
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [thumbnailsToDelete, setThumbnailsToDelete] = useState([]);

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
        // Calculate remaining images after deletion
        const remainingImages = existingImages.filter(
          img => !imagesToDelete.includes(img.imageKey)
        );
        const remainingThumbnails = existingThumbnails.filter(
          thumb => !thumbnailsToDelete.includes(thumb.imageKey)
        );

        // Validate total images after changes
        const totalImages = remainingImages.length + newImages.length;
        const totalThumbnails =
          remainingThumbnails.length + newThumbnails.length;

        if (totalThumbnails > 2) {
          setErrorMsg('Maximum 2 thumbnails allowed in total.');
          setLoading(false);
          return;
        }

        const formData = new FormData();

        // Add form fields
        Object.keys(values).forEach(key => {
          formData.append(key, values[key]);
        });

        // Add images to keep (existing ones not marked for deletion)
        formData.append('existingImages', JSON.stringify(remainingImages));
        formData.append(
          'existingThumbnails',
          JSON.stringify(remainingThumbnails)
        );

        // Add images to delete
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        formData.append(
          'thumbnailsToDelete',
          JSON.stringify(thumbnailsToDelete)
        );

        // Add new main images
        newImages.forEach(file => {
          formData.append('image[]', file);
        });

        // Add new thumbnail images
        newThumbnails.forEach(file => {
          formData.append('thumbnail[]', file);
        });

        const response = await updateProduct(id, formData);
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

  // Validate image dimensions
  const validateImageDimensions = (file, requiredWidth, requiredHeight) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width === requiredWidth && img.height === requiredHeight) {
          resolve(true);
        } else {
          reject(
            `Image must be ${requiredWidth}x${requiredHeight}px. Selected image is ${img.width}x${img.height}px.`
          );
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject('Failed to load image');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle main image file selection with validation
  const handleImageChange = async e => {
    const files = Array.from(e.target.files);
    setErrorMsg('');

    // Calculate total after adding new images
    const remainingExisting = existingImages.filter(
      img => !imagesToDelete.includes(img.imageKey)
    ).length;
    const totalAfterAdd = remainingExisting + newImages.length + files.length;

    if (totalAfterAdd > 10) {
      setErrorMsg(
        `Cannot add ${
          files.length
        } images. You can only have 10 images in total. Currently you have ${
          remainingExisting + newImages.length
        } images.`
      );
      e.target.value = '';
      return;
    }

    try {
      // Validate dimensions for each file
      for (const file of files) {
        await validateImageDimensions(file, 461, 461);
      }

      setNewImages(prev => [...prev, ...files]);

      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...previews]);
    } catch (error) {
      setErrorMsg(error);
      e.target.value = '';
    }
  };

  // Handle thumbnail file selection with validation
  const handleThumbnailChange = async e => {
    const files = Array.from(e.target.files);
    setErrorMsg('');

    // Calculate total after adding new thumbnails
    const remainingExisting = existingThumbnails.filter(
      thumb => !thumbnailsToDelete.includes(thumb.imageKey)
    ).length;
    const totalAfterAdd =
      remainingExisting + newThumbnails.length + files.length;

    if (totalAfterAdd > 2) {
      setErrorMsg(
        `Cannot add ${
          files.length
        } thumbnails. Maximum 2 thumbnails allowed. Currently you have ${
          remainingExisting + newThumbnails.length
        } thumbnails.`
      );
      e.target.value = '';
      return;
    }

    try {
      // Validate dimensions for each file
      for (const file of files) {
        await validateImageDimensions(file, 279, 419);
      }

      setNewThumbnails(prev => [...prev, ...files]);

      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setThumbnailPreview(prev => [...prev, ...previews]);
    } catch (error) {
      setErrorMsg(error);
      e.target.value = '';
    }
  };

  // Remove existing main image (mark for deletion)
  const removeExistingImage = imageKey => {
    setImagesToDelete(prev => [...prev, imageKey]);
  };

  // Undo removal of existing main image
  const undoRemoveExistingImage = imageKey => {
    setImagesToDelete(prev => prev.filter(key => key !== imageKey));
  };

  // Remove existing thumbnail (mark for deletion)
  const removeExistingThumbnail = imageKey => {
    setThumbnailsToDelete(prev => [...prev, imageKey]);
  };

  // Undo removal of existing thumbnail
  const undoRemoveExistingThumbnail = imageKey => {
    setThumbnailsToDelete(prev => prev.filter(key => key !== imageKey));
  };

  // Remove new image from selection
  const removeNewImage = index => {
    const updatedImages = [...newImages];
    const updatedPreviews = [...imagePreview];

    URL.revokeObjectURL(updatedPreviews[index]);
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setNewImages(updatedImages);
    setImagePreview(updatedPreviews);
  };

  // Remove new thumbnail from selection
  const removeNewThumbnail = index => {
    const updatedThumbnails = [...newThumbnails];
    const updatedPreviews = [...thumbnailPreview];

    URL.revokeObjectURL(updatedPreviews[index]);
    updatedThumbnails.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setNewThumbnails(updatedThumbnails);
    setThumbnailPreview(updatedPreviews);
  };

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

        // Set existing images
        if (product.images && Array.isArray(product.images)) {
          setExistingImages(product.images);
        }

        // Set existing thumbnails
        if (product.thumbnails && Array.isArray(product.thumbnails)) {
          setExistingThumbnails(product.thumbnails);
        }
      } catch (error) {
        setErrorMsg('Failed to load product data.');
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreview.forEach(url => URL.revokeObjectURL(url));
      thumbnailPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreview, thumbnailPreview]);

  // Calculate totals for display
  const getRemainingImagesCount = () => {
    return existingImages.filter(img => !imagesToDelete.includes(img.imageKey))
      .length;
  };

  const getRemainingThumbnailsCount = () => {
    return existingThumbnails.filter(
      thumb => !thumbnailsToDelete.includes(thumb.imageKey)
    ).length;
  };

  const getTotalImagesCount = () => {
    return getRemainingImagesCount() + newImages.length;
  };

  const getTotalThumbnailsCount = () => {
    return getRemainingThumbnailsCount() + newThumbnails.length;
  };

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

            {/* Main Images Section */}
            <hr className='my-4' />
            <h5 className='mb-3'>
              Main Images{' '}
              <Badge bg='info'>{getTotalImagesCount()} / 10 (461x461px)</Badge>
            </h5>

            {/* Existing Main Images */}
            {existingImages.length > 0 && (
              <Form.Group as={Row} className='mb-3'>
                <Form.Label column sm={2}>
                  Current Images
                </Form.Label>
                <Col sm={10}>
                  <div className='d-flex flex-wrap gap-2'>
                    {existingImages.map((img, index) => {
                      const isMarkedForDeletion = imagesToDelete.includes(
                        img.imageKey
                      );
                      return (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            opacity: isMarkedForDeletion ? 0.4 : 1
                          }}
                        >
                          <Image
                            src={img.imageUrl}
                            thumbnail
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              border: isMarkedForDeletion
                                ? '3px solid red'
                                : 'none'
                            }}
                          />
                          {isMarkedForDeletion ? (
                            <Button
                              variant='success'
                              size='sm'
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                fontSize: '10px'
                              }}
                              onClick={() =>
                                undoRemoveExistingImage(img.imageKey)
                              }
                            >
                              Undo
                            </Button>
                          ) : (
                            <Button
                              variant='danger'
                              size='sm'
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px'
                              }}
                              onClick={() => removeExistingImage(img.imageKey)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Form.Text className='text-muted'>
                    Click × to mark an image for deletion. Click "Undo" to keep
                    it.
                  </Form.Text>
                </Col>
              </Form.Group>
            )}

            {/* Upload New Main Images */}
            <Form.Group as={Row} className='mb-3' controlId='images'>
              <Form.Label column sm={2}>
                Add Images
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageChange}
                />
                <Form.Text className='text-muted'>
                  Add new images (461x461px). Total limit: 10 images.
                </Form.Text>

                {/* Preview New Images */}
                {imagePreview.length > 0 && (
                  <div className='mt-3 d-flex flex-wrap gap-2'>
                    {imagePreview.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Image
                          src={preview}
                          thumbnail
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            border: '3px solid green'
                          }}
                        />
                        <Badge
                          bg='success'
                          style={{
                            position: 'absolute',
                            top: '5px',
                            left: '5px',
                            fontSize: '9px'
                          }}
                        >
                          NEW
                        </Badge>
                        <Button
                          variant='danger'
                          size='sm'
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px'
                          }}
                          onClick={() => removeNewImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Col>
            </Form.Group>

            {/* Thumbnails Section */}
            <hr className='my-4' />
            <h5 className='mb-3'>
              Thumbnails{' '}
              <Badge bg='info'>
                {getTotalThumbnailsCount()} / 2 (279x419px)
              </Badge>
            </h5>

            {/* Existing Thumbnails */}
            {existingThumbnails.length > 0 && (
              <Form.Group as={Row} className='mb-3'>
                <Form.Label column sm={2}>
                  Current Thumbnails
                </Form.Label>
                <Col sm={10}>
                  <div className='d-flex flex-wrap gap-2'>
                    {existingThumbnails.map((thumb, index) => {
                      const isMarkedForDeletion = thumbnailsToDelete.includes(
                        thumb.imageKey
                      );
                      return (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            opacity: isMarkedForDeletion ? 0.4 : 1
                          }}
                        >
                          <Image
                            src={thumb.imageUrl}
                            thumbnail
                            style={{
                              width: '90px',
                              height: '135px',
                              objectFit: 'cover',
                              border: isMarkedForDeletion
                                ? '3px solid red'
                                : 'none'
                            }}
                          />
                          {isMarkedForDeletion ? (
                            <Button
                              variant='success'
                              size='sm'
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                fontSize: '10px'
                              }}
                              onClick={() =>
                                undoRemoveExistingThumbnail(thumb.imageKey)
                              }
                            >
                              Undo
                            </Button>
                          ) : (
                            <Button
                              variant='danger'
                              size='sm'
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px'
                              }}
                              onClick={() =>
                                removeExistingThumbnail(thumb.imageKey)
                              }
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Form.Text className='text-muted'>
                    Click × to mark a thumbnail for deletion. Click "Undo" to
                    keep it.
                  </Form.Text>
                </Col>
              </Form.Group>
            )}

            {/* Upload New Thumbnails */}
            <Form.Group as={Row} className='mb-3' controlId='thumbnails'>
              <Form.Label column sm={2}>
                Add Thumbnails
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleThumbnailChange}
                />
                <Form.Text className='text-muted'>
                  Add new thumbnails (279x419px). Total limit: 2 thumbnails.
                </Form.Text>

                {/* Preview New Thumbnails */}
                {thumbnailPreview.length > 0 && (
                  <div className='mt-3 d-flex flex-wrap gap-2'>
                    {thumbnailPreview.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Image
                          src={preview}
                          thumbnail
                          style={{
                            width: '90px',
                            height: '135px',
                            objectFit: 'cover',
                            border: '3px solid green'
                          }}
                        />
                        <Badge
                          bg='success'
                          style={{
                            position: 'absolute',
                            top: '5px',
                            left: '5px',
                            fontSize: '9px'
                          }}
                        >
                          NEW
                        </Badge>
                        <Button
                          variant='danger'
                          size='sm'
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px'
                          }}
                          onClick={() => removeNewThumbnail(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Col>
            </Form.Group>

            {/* Checkboxes */}
            <hr className='my-4' />
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
                <div className='mt-2'>
                  <small className='text-muted'>
                    {imagesToDelete.length > 0 && (
                      <div>Will delete {imagesToDelete.length} image(s)</div>
                    )}
                    {thumbnailsToDelete.length > 0 && (
                      <div>
                        Will delete {thumbnailsToDelete.length} thumbnail(s)
                      </div>
                    )}
                    {newImages.length > 0 && (
                      <div>Will add {newImages.length} new image(s)</div>
                    )}
                    {newThumbnails.length > 0 && (
                      <div>
                        Will add {newThumbnails.length} new thumbnail(s)
                      </div>
                    )}
                  </small>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditProduct;
