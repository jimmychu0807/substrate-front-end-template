import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useSubstrateState} from './substrate-lib'
import config from './config'

const chainOptions = config.chainOptions


function Main(props) {
    
    const { socket } = useSubstrateState()
    const [selectedOption, setSelectedOption] = useState(null);
    
    const getChainFromChainOptions = (value) => {
      const option = chainOptions.find((option) => option.value === value ||
         option.value+ '/' === value  );
      return option ? option : { label: 'New Chain', value: '' }
    };
    const handleOptionChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        window.location.href = '/?rpc=' + selectedOption.value;
    };
    
    useEffect(()=>{
        setSelectedOption(getChainFromChainOptions(socket))
    }, [socket])
  
    return (
      <div style={{ maxWidth: '500px', }}>
        <Select
          placeholder="Select a chain"
          options={chainOptions}
          value={selectedOption}
          onChange={handleOptionChange}
        />
      </div>
    )
  
}


export default function ChainSelector(props) {
  return <Main {...props} /> 
}
