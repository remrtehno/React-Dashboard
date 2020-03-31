import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {Button, Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import Select from "react-select";

import {get, put} from '../../api';

const renderImage = (image, newImage) => {
  if (image && image.data) {
    const src = `data:${image.contentType};base64,${image.data}`;

    return (
      <img src={src} alt='current-image' className='img-fluid'/>
    )
  }

  return null
};

const uploadImage = (imageId, newImage, history) => {
  let image = {...newImage};

  if (image.ProfileId) {
    image.Type = 'Profile';
  }

  if (!image.ProfileId) {
    image.Type = 'Default'
  }

  put(`/api/images/${imageId}`, image)
    .then(res => {
      if (res) {
        console.log('check')
      }
    })
};

const Component = (props) => {
  const imageId = props.match.params.id;
  let history = useHistory();
  const [image, setImage] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [newImage, setNewImage] = useState({});

  useEffect(() => {
    get(`/api/images/${imageId}`)
      .then(res => res && setImage(res));

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

  useEffect(() => {
    setNewImage({
      Name: image.name || '',
      Description: image.description || '',
      ProfileId: image.profileId || '',
    })
  }, [image]);

  console.log(newImage)

  return (
    <Row>
      <Col className='flex-grow-0' sm='12'>
        <h2>
          Редактирование изображения
        </h2>
      </Col>
      <Col sm='12' className='d-flex flex-wrap'>
        <Col sm='12' className='d-flex mb-3'>
          <Col sm='9' className='p-0'>
            {renderImage(image, newImage)}
          </Col>
        </Col>
        <Col sm='6'>
          <InputGroup>
            <Label className='w-100'>
              Название
              <Input
                defaultValue={newImage.Name}
                type='text'
                onChange={e => setNewImage({...newImage, Name: e.target.value})}
              />
            </Label>
          </InputGroup>
        </Col>
        <Col sm='6'>
          <InputGroup className='d-flex flex-nowrap align-items-end'>
            <Label className='w-100'>
              ID профиля
              <Select
                value={profiles.find(profile => profile.value === newImage.ProfileId) || ''}
                options={profiles}
                onChange={profile => setNewImage({...newImage, ProfileId: profile.value})}
              />
            </Label>
            {
              newImage.ProfileId && (
                <i
                  className='cui-circle-x icons text-danger font-2xl ml-1 mb-3 cursor-pointer'
                  onClick={() => setNewImage({...newImage, ProfileId: null})}
                />
              )
            }
          </InputGroup>
        </Col>
        <Col sm='12'>
          <InputGroup>
            <Label className='w-100'>
              Описание
              <Input
                defaultValue={newImage.Description}
                type='textarea'
                onChange={e => setNewImage({...newImage, Description: e.target.value})}
              />
            </Label>
          </InputGroup>
        </Col>
        <Col>
          <Button
            onClick={() => uploadImage(imageId, newImage, history)}
          >
            Создать
          </Button>
        </Col>
      </Col>
    </Row>
  )
};

export default Component
