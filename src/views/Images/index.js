import React, {useEffect, useState} from 'react';
import {Col, Row, Button} from "reactstrap";
import {Link} from "react-router-dom";

import {get} from '../../api';

const renderImageCards = (images) => {
  return images.map((image, index) => {
    const src = `data:${image.contentType};base64,${image.data}`;

    return (
      <Row key={index} className="vacancy d-flex">
        <Col sm='7' className='d-flex justify-content-center'>
          <img
            className='img-fluid'
            src={src}
            alt='card-image'
          />
        </Col>
        <Col sm='5' className='d-flex flex-column justify-content-between'>
          <div>
            <Col sm='12'>
              Название: {image.name}
            </Col>
            <Col sm='12'>
              ID профиля: {image.profileId}
            </Col>
            <Col sm='12'>
              Тип: {image.type}
            </Col>
            <Col sm='12'>
              Описание: {image.description}
            </Col>
          </div>
          <div className='px-3 mt-2'>
            <Link to={`/images/edit/${image.id}`}>
              <Button color='primary'>
                Редактировать
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    )
  })
};

const Component = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    get('/api/images')
      .then(res => {
        if (res.items) setImages(res.items)
      })
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className="flex-grow-0" sm='6'><h2 className="mb-0"> Справочник изображений </h2></Col>
            <Col sm='6' className='d-flex justify-content-end'>
              <Link to={`/images/create`} >
                <Button> Добавить </Button>
              </Link>
            </Col>
          </Row>
          <hr color="black"/>
          {renderImageCards(images)}
        </Col>
      </Row>
    </div>
  );
};

export default Component;
