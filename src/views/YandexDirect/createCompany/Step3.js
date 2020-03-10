import React, {useEffect, useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {useImageByIdApi, uploadCompany} from "../useYandexDirectApi";
import {FormGroup, Input, Label, FormFeedback, Button} from "reactstrap";

const validateInput = (value, maxValue, minValue = null) => { // weeklyBudget don't have min value
  const isBigger = value > maxValue;

  if (isBigger) {
    return `Сумма не должна превышать ${maxValue}`
  }

  if (minValue) {
    const isSmaller = value < minValue;

    return isSmaller ? `Сумма не должна быть меньше ${minValue}` : null
  }

  return null
};

const imagePresizer = (file) => {
  let width,
    height;
  const i = new Image();

  i.onload = () => {
    width = i.width;
    height = i.height;
  };

  i.src = file;

  const ratio = width / height;

  if (ratio > 1.2) {
    return 170
  }

  return 130
};

const renderAdverts = (adTexts, images) => {
  if (images.length) {
    const adverts = adTexts.map(advert => {
      const advertImage = images.find(image => advert.imageId === image.id);

      return {
        ...advert,
        image: advertImage
      }
    });

    return adverts.map((advert, index) => {
      const width = imagePresizer(advert.image.data);

      return (
        <div
          key={index+'key'}
          className='border d-flex m-2'
          style={{width: '426px', height: '128px', maxWidth: '426px'}}
        >
          <div className='mr-2 d-flex'>
            <img src={advert.image.data} alt='error' className='img-fluid' style={{objectFit: 'cover', maxWidth: width+'px'}}/>
          </div>
          <div className='pt-2'>
            <h3 className='font-20px mb-0 text-dark-blue font-weight-bold'>
              {advert.title}
            </h3>
            <span className='font-10px'>
            {advert.text}
          </span>
          </div>
        </div>
      )
    })
  }
};

const handleSubmit = async (price, companyInfo) => {
  const {selectedCity, selectedProfiles, adTexts} = companyInfo;
  const profileIds = selectedProfiles.map(profile => profile.id);
  const company = {...price, regionId: selectedCity.id, profileIds, adTexts};

  return await uploadCompany(company).then((res) => res)
};

const Component = ({setStep, companyInfo}) => {
  let history = useHistory();

  const [price, setPrice] = useState({weeklyBudget: 2990, bidCeiling: 3.5});
  const [images, loadImages] = useImageByIdApi();

  const { adTexts } = companyInfo;
  const imageIds = adTexts.map(ad => ad.imageId);

  useEffect(() => {
    loadImages(imageIds);
  }, []);

  //validateInput return string of error message or null

  const invalidMessage = {
    weekPrise: validateInput(price.weeklyBudget, 199000),
    clickPrise: validateInput(price.bidCeiling, 50, 0.5)
  };

  return (
    <div className='d-flex flex-column align-items-center'>
      <div style={{maxWidth: '500px'}} className='text-center mb-3'>
        <h2>
          Шаг 3: Бюджет и подтверждение
        </h2>
        <span>
          Ваши объявления будут выглядеть так
        </span>
      </div>
      <div
        style={{maxWidth: '890px', maxHeight: '710px'}}
        className='d-flex flex-wrap overflow-auto mb-3'
      >
        {renderAdverts(adTexts, images)}
      </div>
      <div style={{maxWidth: '500px'}} className='text-center mb-3'>
        <span>
          Если все в порядке, то укажите недельный бюджет и максимальную цену клика:
        </span>
        <FormGroup className='mt-3'>
          <Label className='w-100 text-left'>
            Укажите недельный бюджет
            <Input
              invalid={Boolean(invalidMessage.weekPrise)}
              type='number'
              defaultValue='2990'
              max='199000'
              onChange={(e) => setPrice({...price, weeklyBudget: e.currentTarget.value})}
            />
            <FormFeedback>
              {invalidMessage.weekPrise}
            </FormFeedback>
          </Label>
        </FormGroup>
        <FormGroup>
          <Label className='w-100 text-left'>
            Укажите максимальную стоимость клика
            <Input
              invalid={Boolean(invalidMessage.clickPrise)}
              type='number'
              defaultValue='3.50'
              step='0.1' max='50' min='0.5'
              onChange={(e) => setPrice({...price, bidCeiling: e.currentTarget.value})}
            />
            <FormFeedback>
              {invalidMessage.clickPrise}
            </FormFeedback>
          </Label>
        </FormGroup>
      </div>
      <div className='d-flex justify-content-between mb-3' style={{width: '500px'}}>
        <Button
          className='mr-2'
          onClick={() => setStep(2)}
        >
          &lt; Назад
        </Button>
        <Button
          className='ml-2 bg-turquoise-button text-white'
          disabled={Boolean(invalidMessage.weekPrise || invalidMessage.clickPrise)}
          onClick={() => handleSubmit(price, companyInfo).then(() => history.push('/yandex-direct'))}
        >
          Запустить кампанию
        </Button>
      </div>
    </div>
  )
};

export default Component;
