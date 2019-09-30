import React from 'react';
import { EntityTagger } from './components/entities';
import { UtteranceList } from './components/utterances';

import { Fragment } from 'react';

export const App: React.FunctionComponent = () => {

  const entities = [
    {
      name: 'subject',
      key: 'a',
    },
    {
      name: 'date',
      key: 'b',
    }
  ]

  const utterances = [
    'Can you help me find my insurance provider',
    'Can you help me with my insurance company'
  ];

  return (
    <Fragment>
      <UtteranceList utterances={utterances} entities={entities} />
    </Fragment>
    );
};
