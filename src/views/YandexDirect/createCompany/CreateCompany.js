import React, {useState} from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const Component = () => {
  const [state, setState] = useState({
    currentStep: 1,
    selectedCity: {},
    selectedProfiles: [],
    adTexts: [],
  });

  if (state.currentStep === 2) {
    return (
      <Step2
        setStep={value => setState({...state, currentStep: value})}
        setAdTexts={value => setState({...state, adTexts: value, currentStep: 3})}
        selectedCity={state.selectedCity}
        selectedProfiles={state.selectedProfiles}
      />
    )
  } else if (state.currentStep === 3) {
    return (
      <Step3
        setStep={value => setState({...state, currentStep: value})}
        companyInfo={state}
      />
    )
  } else {
    return (
      <Step1
        setStep={value => setState({...state, currentStep: value})}
        setCity={value => setState({...state, selectedCity: value})}
        setProfiles={value => setState({...state, selectedProfiles: value})}
        selectedProfiles={state.selectedProfiles}
      />
    )
  }
};

export default Component;
