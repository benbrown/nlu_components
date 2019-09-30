import React, { useEffect, useState, Fragment } from 'react';
import { EntityTagger } from '../entities/index';
import { TextField } from 'office-ui-fabric-react';

export const UtteranceList: React.FunctionComponent = (props) => {

  const { utterances, entities } = props;
  
  const [ utteranceList, updateUtteranceList ] = useState(utterances);
  const [ currentUtterance, setCurrentUtterance ] = useState([]);

  const addUtterance = (e) => {
    e.preventDefault();
    updateUtteranceList([
      <EntityTagger utteranceText={currentUtterance} entities={entities} />
      ...utteranceList,
    ]);
    setCurrentUtterance('');
    console.log('ADD UTTERANCE');
  }

  const updateUtterance = (e, val) => {
    setCurrentUtterance(val);
  }


  useEffect(() => {

    updateUtteranceList(utterances.map((utterance) => <EntityTagger utteranceText={utterance} entities={entities} />))

  },[utterances])

  return (
    <Fragment>
      <form onSubmit={addUtterance}>
        <TextField
          label="Add example"
          value={currentUtterance}
          onChange={updateUtterance}
        />
      </form>
      {utteranceList}      
    </Fragment>
  )

}