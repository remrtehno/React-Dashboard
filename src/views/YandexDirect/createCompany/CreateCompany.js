import React, {useState} from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const Component = () => {
  const [state, setState] = useState({
    currentStep: 2,
    selectedCity: {},
    selectedProfiles: [],
    adverts: [],
  });

  if (state.currentStep === 2) {
    return (
      <Step2
        setStep={value => setState({...state, currentStep: value})}
        selectedCity={state.selectedCity}
        selectedProfiles={state.selectedProfiles}
      />
    )
  } else if (state.currentStep === 3) {
    return (
      <Step3
        setStep={value => setState({...state, currentStep: value})}
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
