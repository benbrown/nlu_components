import React, { useEffect } from 'react';
import { useState, useMemo } from 'react';
import { ContextualMenu,ContextualMenuItemType } from 'office-ui-fabric-react';
import { RenderedUtterance } from './renderedUtterance';
import './styles.css';

export const EntityTagger: React.FunctionComponent = (props) => {
  const { utteranceText, entities } = props;

  // const [renderedText, setRenderedText] = useState(utteranceText);
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

  useEffect(() => {
    console.log('TAGGED UTTERANCE:', taggedUtterance);
  },[taggedUtterance]);


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
      ].sort((a,b) => {
        if (a.start < b.start) {
          return -1;
        } else if (a.start > b.start) {
          return 1;
        } else {
          return 0;
        }
      })
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


  const isOverlapping = (r1, r2) => {
    console.log('is overlapping?', r1, r2);
    return (
      (r2.start <= r1.end && r1.end <= r2.end) ||   //  r1 overlaps r2 on the left
      (r2.start <= r1.start && r1.start <= r2.end) || // r1 overlaps r2 on the right
      (r1.start >= r2.start && r1.end <= r2.end) || // r1 is inside r2
      (r1.start <= r2.start && r1.end >= r2.end)  // r2 is inside r1
    )
  }

  const resetSelection = (e) => {
      setMenuVisibility(false);
      // setRenderedText(utteranceText);
  }

  const getSelection = (e) => {
    let selection = window.getSelection();
    
    let text = selection.toString().replace(/<.*?>/g,'');
    let range = selection.getRangeAt(0);

    if (range.startContainer != range.endContainer) {
      console.log('MULTIPLE CONTAINERS!!!', range);

      // selection started in the main utterance
      if (range.startContainer.parentNode.tagName==='DIV') {
        // snap the range to this piece.
        range.setStart(range.startContainer,range.startOffset);
        range.setEnd(range.startContainer,range.startContainer.length-1);
      } else if (range.endContainer.parentNode.tagName==='DIV') {
        range.setStart(range.endContainer, 0);
        range.setEnd(range.endContainer, range.endOffset);
      }

    }

    let start = range.startOffset;
    let end = range.endOffset - 1;

    if (text) {

      console.log('SELECTED TEXT', text);
      const innerText = range.startContainer.textContent;

      console.log('first char is', innerText[start], innerText[start].match(/\s/));
      while (innerText[start].match(/\s/) !== null) {
        console.log('MOVE FORWARD 1 SPACE BECAUSE CHAR')
        start++;
      }

      // find left wordbreak
      while (start >= 1 && innerText[start-1].match(/\s/) === null) {
        start--;
      }


      console.log('end char', innerText[end]);

      while (innerText[end].match(/\s/) !== null) {
        console.log('MOVE BACK 1 SPACE BECAUSE CHAR')
        end--;
      }

      // find right wordbreak
      while (end < (innerText.length) && innerText[end].match(/\s/) === null) {
        console.log('looking for a better end char', innerText[end]);
        end++;
      }

      range.setStart(range.startContainer, start);
      range.setEnd(range.startContainer, end);


      console.log('FINAL RANGE', range, start, end);

      // our selection is now correct.
      // now we need to find the position of the selected text in the original utterance...
      text = range.toString();

      let offset = 0;
      let x = 0;
      while (range.startContainer.parentElement.childNodes[x] != range.startContainer) {
        // extract the length of actual value, instead of what might be an expanded/rendered version of the tagged entity?
        if (range.startContainer.parentElement.childNodes[x].attributes && range.startContainer.parentElement.childNodes[x].getAttribute('data-rawtext')) {
          let rawtext = range.startContainer.parentElement.childNodes[x].getAttribute('data-rawtext');
          offset = offset + rawtext.length;
        } else {
          offset = offset + range.startContainer.parentElement.childNodes[x].textContent.length;
        }
        x++;
      }

      start = start + offset;
      end = start + text.length;

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
      
    } else {
      setCurrentSelection(null);
    }

  }


  return (
    <div onMouseDown={resetSelection} onMouseUp={getSelection} style={{border: '1px solid #CCC', padding: '1rem'}}>
      <RenderedUtterance utterance={taggedUtterance} />
      <ContextualMenu hidden={!menuVisible} items={existingEntities} target={targetPoint} gapSpace={10} />
    </div>
  );
};
