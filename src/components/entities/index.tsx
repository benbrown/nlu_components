import React from 'react';
import { useState, useMemo } from 'react';
import { ContextualMenu,ContextualMenuItemType } from 'office-ui-fabric-react';
import { RenderedUtterance } from './renderedUtterance';
import './styles.css';

export const EntityTagger: React.FunctionComponent = (props) => {
  const { utteranceText, entities } = props;

  const [renderedText, setRenderedText] = useState(utteranceText);
  const [menuVisible, setMenuVisibility] = useState(false);
  const [targetPoint, setTargetPoint] = useState(null);
  const [existingEntities, setEntitiesMenu] = useState(null);
  const [currentSelection, setCurrentSelection] = useState({
    text: '',
    start: 0,
    end: 0,
  });

  const [taggedUtterance, setTaggedUtterance] = useState({
    text: utteranceText,
    currentSelection: currentSelection,
    entities: []
  });

  const selectEntity = (e, item) => {
    console.log('clicked item', item);
    console.log('current selection', currentSelection);
    setTaggedUtterance({
      text: utteranceText,
      entities: [
        ...taggedUtterance.entities,
        {
          ...currentSelection,
          entity: item
        }
      ]
    });
    setMenuVisibility(false);
  }

  useMemo(() => { 

    setEntitiesMenu(
      [
        {
          text: 'Create entity',
          key: 'z',
          onClick: () => {
            console.log(currentSelection);
          }
        },
        {
          itemType: ContextualMenuItemType.Section,
          sectionProps: {
            topDivider: true,
            bottomDivider: true,
            title: 'Entities',
            items: entities.map((entity) => {
              return {
                text: entity.name,
                key: entity.key,
                onClick: selectEntity
              }
            })
          }
        }
      ]
    );

    setTaggedUtterance({
      ...taggedUtterance,
      currentSelection: currentSelection,
    });

  }, [entities, currentSelection])


  

  const resetSelection = (e) => {
      setMenuVisibility(false);
      setRenderedText(utteranceText);
  }

  const getSelection = (e) => {
    let selection = window.getSelection();
    
    let text = selection.toString().replace(/<.*?>/g,'');
    let range = selection.getRangeAt(0);
    let start = range.startOffset;
    let end = range.endOffset;


    if (text) {

      // find left wordbreak
      while (start >= 1 && utteranceText[start-1].match(/\s/) === null) {
        start--;
      }

      // find right wordbreak
      while (end < (utteranceText.length) && utteranceText[end].match(/\s/) === null) {
        end++;
      }

      text = utteranceText.substring(start, end);

      let rendered = utteranceText.replace(text,'<span class="highlight">' + text + '</span>');

      setCurrentSelection({
        ...currentSelection,
        text: text,
        start: start,
        end: end
      });

      setTargetPoint({
        x: e.clientX,
        y: e.clientY
      });

      setMenuVisibility(true);

      setRenderedText(rendered);
      
    } else {
      setCurrentSelection(null);
      setRenderedText(utteranceText);
    }

  }


  return (
    <div onMouseDown={resetSelection} onMouseUp={getSelection} style={{border: '1px solid #CCC', padding: '1rem'}}>
      <RenderedUtterance utterance={taggedUtterance} />
      <ContextualMenu hidden={!menuVisible} items={existingEntities} target={targetPoint} gapSpace={10} />
    </div>
  );
};
