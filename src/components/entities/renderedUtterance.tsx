import React, { useEffect, useState } from 'react';

import './styles.css';
import { EntityTagger } from '.';

export const RenderedUtterance: React.FunctionComponent = (props) => {
  const { utterance } = props;
  const [children, setChildren ] = useState([]);


  useEffect(() => {
    const newchildren = [];
    const text = utterance.text;
    const entities = utterance.entities;
  
    if (entities.length === 0) {
      newchildren.push(text);
    } else {
      for (let e = 0; e < entities.length; e++) {
        newchildren.push(text.substring(0, entities[e].start));
        newchildren.push(RenderedEntity({entity: entities[e].entity.text, value: entities[e].text}));
        newchildren.push(text.substring(entities[e].end, text.length));
      }
    }

    setChildren(newchildren);
  }, [utterance]);

  return (
    <div>
      {children}
    </div>
  );
};


export const RenderedEntity: React.FunctionComponent = (props) => {
  const { entity, value } = props;

  return (
    <span className="taggedEntity">
      {entity}={value}
    </span>
  );
}
