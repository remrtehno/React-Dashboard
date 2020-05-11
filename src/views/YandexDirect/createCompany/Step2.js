import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  CustomInput,
} from "reactstrap";
import {post, get, getImagesByIdsApi} from '../../../api';

const handleDeleteTemplate = (cards, index, setCards) => {
  if (cards.templates.length > 1) {
    const newTemplates = cards.templates.filter((template, i) => index !== i);
    setCards({...cards, templates: [...newTemplates]});
  }
};

const handleChangeTemplate = (cards, index, value, type, setCards) => {
  let newTemplates = [...cards.templates];
  let currentTemplate = cards.templates.find((template, i) => i === index);

  currentTemplate[type] = value;
  newTemplates[index] = currentTemplate;

  setCards({...cards, templates: [...newTemplates]});
};

const validateInput = (textLength, maxSymbols) => {
  const isValid = maxSymbols >= textLength;
  const isEmpty = textLength === 0;

  return isValid && !isEmpty
};

const renderCard = (cards, setCards) => {
  return cards.templates.map((template, index) => {
    return (
      <Col md='6' key={index + 'key'}>
        <Card>
          <CardHeader className='d-flex justify-content-between'>
            Объявление #{index+1}
            <div className="template-header-actions">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => handleDeleteTemplate(cards, index, setCards)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label className='font-italic w-100'>
                Заголовок объявления
                <Input
                  invalid={!validateInput(template.header.length, 35)}
                  defaultValue={template.header}
                  onChange={(e) => handleChangeTemplate(cards, index, e.currentTarget.value, 'header', setCards)}
                />
                <FormFeedback>
                  {
                    template.header.length === 0 ?
                      `Поле обязательно для заполнения` :
                      `Слишком много символов ${35 - template.header.length}`
                  }
                </FormFeedback>
              </Label>
            </FormGroup>
            <FormGroup>
              <Label className='font-italic w-100'>
                Текст объявления
                <Input
                  invalid={!validateInput(template.body.length, 81)}
                  type='textarea'
                  defaultValue={template.body}
                  onChange={(e) => handleChangeTemplate(cards, index, e.currentTarget.value, 'body', setCards)}
                />
                <FormFeedback>
                  {
                    template.body.length === 0 ?
                      `Поле обязательно для заполнения` :
                      `Слишком много символов ${81 - template.body.length}`
                  }
                </FormFeedback>
              </Label>
            </FormGroup>
          </CardBody>
        </Card>
      </Col>
    )
  })
};

const templateSplitter = (template) => {
  let newTemplate = template;
  if (template.header.length > 35) {
    newTemplate.header = template.header.slice(0, 35);
  }

  if (template.body.length > 81) {
    newTemplate.body = template.body.slice(0, 81);
  }

  return newTemplate;
};

const handleCheckImage = (e, setSelectedImages, image, selectedImages) => {
  const isChecked = e.currentTarget.checked;
  let newSelectedImages = [];

  if (isChecked) {
    newSelectedImages = [...selectedImages, image.id];
  } else {
    newSelectedImages = selectedImages.filter(selectedImage => selectedImage !== image.id);
  }

  setSelectedImages(newSelectedImages);
};

const handleImage = (e, uploadedImages, selectedImages, setUploadedImages, setSelectedImages) => {
  const maxSize = e.currentTarget.size;
  const file = e.currentTarget.files[0];
  if (file.size <= maxSize) {
    const fileId = `f${(+new Date).toString(16)}`;
    setSelectedImages([...selectedImages, fileId]);
    setUploadedImages([...uploadedImages, {file, id: fileId}]);
  }
};

const renderImages = (cards, images, uploadedImages, selectedImages, setSelectedImages) => {
  let currentImages = images.filter(image => {
    return cards.imageIds.includes(image.id)
  });

  currentImages = [...currentImages, ...uploadedImages];

  if (images.length) {
    return currentImages.map((image, index) => {
      const isLastChecked = selectedImages.length <= 1;
      const isChecked = selectedImages.find(selectedImage => selectedImage === image.id);
      const isUploadedImage = Boolean(image.file);

      const src = isUploadedImage ? URL.createObjectURL(image.file) : `data:${image.contentType};base64,${image.data}`;

      return (
        <Col
          key={image.id}
          className='my-2'
          md='3'
          xs='6'
        >
          <div className='d-flex justify-content-between'>
            <FormGroup>
              <CustomInput
                className='m-0'
                disabled={isLastChecked && isChecked}
                defaultChecked={true}
                id={image.id}
                type='checkbox'
                onChange={(e) => handleCheckImage(e, setSelectedImages, image, selectedImages)}
              />
            </FormGroup>
            <Label for={image.id}>
              <p className='font-italic font-weight-bold'>
                {`Изображение #${index+1}`}
              </p>
            </Label>
          </div>
          <Label for={image.id}>
            <img
              className='border border-2 img-fluid'
              src={src}
              alt='image'
            />
          </Label>
        </Col>
      )
    })
  }
};

const uploadCards = async (cards, selectedImages, uploadedImages, setAdTexts, setStep) => {
  let cardsToUpload = {
    ...cards,
    imageIds: selectedImages.filter(id => id.length >= 24)
  };

  let imagesToUpload = await Promise.all(selectedImages
      .filter(id => id.length < 24)
      .map(id => {
        const image = uploadedImages.find(image => image.id === id);

        const data = new FormData();
        data.append('File', image.file);
        data.append('Type', 'Temporary');

        return data
      })
      .map(formData => post('/api/images', formData)));

  const uploadedImageIds = imagesToUpload.map(img => img.data);

  cardsToUpload.imageIds = [...cardsToUpload.imageIds, ...uploadedImageIds];

  if (cardsToUpload.imageIds.length === selectedImages.length) {
    post('/api/yandex-direct/creation-wizard/ad-previews', cardsToUpload)
      .then(res => {
        setAdTexts(res.data.adTexts);
      })
  }
};

const Component = ({setStep, setAdTexts, selectedCity, selectedProfiles}) => {
  const [cards, setCards] = useState({
    regionId: selectedCity,
    profileIds: selectedProfiles,
    templates: [],
    imageIds: []
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [allCards, setAllCards] = useState([]);

  const [images, loadImages] = getImagesByIdsApi();

  useEffect(() => {
    const selectedProfileIds = selectedProfiles.map(prof => prof.id);
    get(
      '/api/yandex-direct/creation-wizard/ad-text-templates',
      {
        RegionId: selectedCity.id,
        ProfileIds: selectedProfileIds + ''
      }
    ).then(res => res && setAllCards(res))
  }, []);

  if (allCards.templates && cards.templates && !cards.templates.length) {
    loadImages(allCards.imageIds);

    const newTemplates = allCards.templates.map(template => {
      return templateSplitter(template)
    });

    setCards({...allCards, templates: [...newTemplates]});
    if (!selectedImages.length) {
      setSelectedImages([...allCards.imageIds])
    }
  }

  return (
    <div className='d-flex flex-column align-items-center mx-auto'>
      <div style={{width: '400px'}} className='text-center mb-3'>
        <h2>
          Шаг 2: Тексты и изображения
        </h2>
        <span>
          Тексты заполнены заранее, но иногда требуют редактирования. Например, когда название города слишком длинное
        </span>
      </div>
      <Row className='w-100 mb-3'>
        {renderCard(cards, setCards)}
        <Col md='6'>
          <Button
            className='bg-turquoise-button text-white'
            onClick={() => setCards({...cards, templates: [...cards.templates, {header: '', body: ''}]})}
          >
            Добавить объявление +
          </Button>
        </Col>
      </Row>
      <Row className='w-100'>
        <Col xs='12' className='text-center mb-3'>
          <span>
            Выберите изображения, которые будут добавлены к объявлениям
          </span>
        </Col>
      </Row>
      <Row className='border w-100 p-3 border-2 mb-3'>
        {renderImages(cards, images, uploadedImages, selectedImages, setSelectedImages)}
        <Col xs='3'>
          <FormGroup className='w-100 m-0'>
            <Label className='w-100 cursor-pointer btn btn-secondary bg-turquoise-button text-white'>
              <input
                className='d-none'
                type='file'
                size='5242880'
                onChange={e => handleImage(e, uploadedImages, selectedImages, setUploadedImages, setSelectedImages)}
              />
              <span className='font-weight-bolder'>+</span> Добавить
            </Label>
          </FormGroup>
          <div className='text-center'>
            Максимальный размер 5MB
          </div>
        </Col>
      </Row>
      <div className='d-flex justify-content-between mb-3' style={{width: '400px'}}>
        <Button className='mr-2' onClick={() => setStep(1)}>
          &lt; Назад
        </Button>
        <Button
          className='ml-2 bg-turquoise-button text-white'
          onClick={() => uploadCards(cards, selectedImages, uploadedImages, setAdTexts, setStep)}
        >
          Далее &gt;
        </Button>
      </div>
    </div>
  )
};

export default Component;
