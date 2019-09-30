import React, { Fragment, useEffect, useMemo, useState } from 'react';

import './styles.css';
import { ContextualMenu } from 'office-ui-fabric-react';

export const RenderedUtterance: React.FunctionComponent = (props) => {
  const { utterance } = props;
  let [children, setChildren ] = useState([]);
  const [entities, setEntities ] = useState(utterance.entities);

  useMemo(() => {
    const newchildren = [];
    const text = utterance.text;
    setEntities(utterance.entities);

    if (entities.length === 0) {
      newchildren.push(text);
    } else {

      let start = 0;
      for (let e = 0; e < entities.length; e++) {
        let chunka = text.substring(start, entities[e].start);
        let chunkb = text.substring(entities[e].start, entities[e].end);
        start = entities[e].end;

        const menu = [{
          text: 'Remove label',
          key: 'remove',
          onClick: function () {
            setEntities(entities.splice(e,1));
            console.log(utterance);
          }
        }];

        newchildren.push(chunka);
        newchildren.push(<RenderedEntity menu={menu} entity={entities[e].entity.text} value={entities[e].text}/>);

      }
      // last piece
      newchildren.push(text.substring(entities[entities.length-1].end, text.length));
    }

    console.log('NEW CHILDREN', newchildren);
    setChildren(newchildren);

  }, [utterance, entities]);

  return (
    <div>
      {children}
    </div>
  );
};


export const RenderedEntity: React.FunctionComponent = (props) => {
  const { entity, value, menu } = props;
  let [menuVisible, setMenuVisible] = useState(false);
  let [targetPoint, setTargetPoint] = useState({x: 0, y: 0});

  
  const showMenu = (e) => {
    setMenuVisible(true);
    setTargetPoint({
      x: e.clientX,
      y: e.clientY
    });
  }

  const hideMenu = (e) => {
    setMenuVisible(false);
  }

  return (
    <Fragment>
      <span className="taggedEntity" onClick={showMenu} data-rawtext={value}>
        {value}
        <span class="entityName">{entity}</span>
      </span>
      <ContextualMenu hidden={!menuVisible} items={menu} target={targetPoint} onDismiss={hideMenu} gapSpace={10} />
    </Fragment>

  );
}
