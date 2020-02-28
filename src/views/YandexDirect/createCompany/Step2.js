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
} from "reactstrap";
import {useCardsApi, useImageByIdApi} from "../useYandexDirectApi";

const handleDelete = (templates, index, setTemplates) => {
  if (templates.length > 1) {
    const newCards = templates.filter((template, i) => index !== i);
    setTemplates(newCards)
  }
};

const handleChange = (templates, index, value, type, setTemplates) => {
  let newCards = [...templates];
  let currentCard = templates.find((template, i) => i === index);

  currentCard[type] = value;
  newCards[index] = currentCard;

  setTemplates(newCards)
};

const validateInput = (textLength, maxSymbols) => {
  const isValid = maxSymbols >= textLength;
  const isEmpty = textLength === 0;

  return isValid && !isEmpty
};

const renderCard = (templates, setTemplates) => {
  return templates.map((template, index) => {
    return (
      <Col md='6' key={index + 'key'}>
        <Card>
          <CardHeader>
            Объявление #{index+1}
            <div className="template-header-actions">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => handleDelete(templates, index, setTemplates)}
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
                  onChange={(e) => handleChange(templates, index, e.currentTarget.value, 'header', setTemplates)}
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
                  onChange={(e) => handleChange(templates, index, e.currentTarget.value, 'body', setTemplates)}
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

const renderImages = (images) => {
  if (images.length) {
    return images.map(image => {
      return (
        <Col
          key={image.id}
          className='my-2'
          md='3'
          xs='6'
        >
          <img
            className='border border-2 img-fluid'
            src={`data:${image.contentType};base64, ${image.data}`}
            alt={image.name}
          />
        </Col>
      )
    })
  }
};

const Component = ({setStep, selectedCity, selectedProfiles}) => {
  const [templates, setTemplates] = useState([]);

  const [allCards, loadCards] = useCardsApi();
  const [images, loadImage] = useImageByIdApi();

  useEffect(() => {
    loadCards(selectedCity, selectedProfiles)
  }, []);

  if (allCards.templates && !templates.length) {
    loadImage(allCards.imageIds);

    const newTemplates = allCards.templates.map(template => {
      return templateSplitter(template)
    });

    setTemplates(newTemplates)
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
        {renderCard(templates, setTemplates)}
        <Col md='6'>
          <Button
            className='bg-turquoise-button text-white'
            onClick={() => setTemplates([...templates, {header: '', body: ''}])}
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
      <Row className='border w-100 p-3 border-2'>
        {renderImages(images)}
      </Row>
      <div className='d-flex justify-content-between mb-3' style={{width: '400px'}}>
        <Button className='mr-2' onClick={() => setStep(1)}>
          &lt; Назад
        </Button>
        <Button className='ml-2 bg-turquoise-button text-white' onClick={() => setStep(3)}>
          Далее &gt;
        </Button>
      </div>
    </div>
  )
};

export default Component;
