import React, {useState, useEffect} from 'react';
import {Row, Col, InputGroup, Input, Label, FormGroup, Button} from 'reactstrap';
import Select from 'react-select';
import {useHistory} from 'react-router-dom';

import {get, post} from '../../api';

const renderImage = (image) => {
  if (image) {
    const src = URL.createObjectURL(image);

    return (
      <img src={src} alt='selected-image' className='img-fluid'/>
    )
  }

  return null
};

const uploadImage = (image, history) => {
  if (image.file) {
    const formData = new FormData();

    if (image.profileId && image.profileId.length) {
      formData.append('Type', 'Profile')
    } else {
      formData.append('Type', 'Default')
    }

    formData.append('File', image.file);
    formData.append('Description', image.description);
    formData.append('Name', image.name);
    formData.append('ProfileId', image.profileId);

    post('/api/images', formData)
      .then(res => {
        if (res.status === 200) {
          history.push('/images')
        } else {
          alert('Произошла ошибка')
        }
      })
  }
};

const Component = () => {
  let history = useHistory();
  const [image, setImage] = useState({});
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    get('/api/profiles')
      .then(res => {
        if (res.items) {
          const profiles = res.items.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          });

          setProfiles(profiles)
        }
      })
  }, []);

  return (
    <Row>
      <Col className='flex-grow-0' sm='12'>
        <h2>
          Создание изображения
        </h2>
      </Col>
      <Col sm='12' className='d-flex flex-wrap'>
        <Col sm='12' className='d-flex justify-content-end'>
          <Col sm='9' className='p-0'>
            {renderImage(image.file)}
          </Col>
          <Col sm='3'>
            <FormGroup className='w-100 m-0'>
              <Label className='w-100 cursor-pointer btn btn-secondary bg-turquoise-button text-white'>
                <input
                  className='d-none'
                  type='file'
                  size='5242880'
                  onChange={e => setImage({...image, file: e.target.files[0]})}
                />
                Загрузить
              </Label>
            </FormGroup>
            <div className='text-center'>
              Максимальный размер 5MB
            </div>
          </Col>
        </Col>
        <Col sm='6'>
          <InputGroup>
            <Label className='w-100'>
              Название
              <Input
                type='text'
                onChange={e => setImage({...image, name: e.target.value})}
              />
            </Label>
          </InputGroup>
        </Col>
        <Col sm='6'>
          <InputGroup>
            <Label className='w-100'>
              ID профиля
              <Select
                options={profiles}
                onChange={profile => setImage({...image, profileId: profile.value})}
              />
            </Label>
          </InputGroup>
        </Col>
        <Col sm='12'>
          <InputGroup>
            <Label className='w-100'>
              Описание
              <Input
                type='textarea'
                onChange={e => setImage({...image, description: e.target.value})}
              />
            </Label>
          </InputGroup>
        </Col>
        <Col>
          <Button
            disabled={!image.file}
            color={image.file ? 'primary' : 'secondary'}
            onClick={() => uploadImage(image, history)}
          >
            Создать
          </Button>
        </Col>
      </Col>
    </Row>
  )
};

export default Component
