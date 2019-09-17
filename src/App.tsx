import React from 'react';
import { EntityTagger } from './components/entities';
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

  return (
    <Fragment>
      <EntityTagger utteranceText="Can you help me find my insurance provider" entities={entities} />
      <EntityTagger utteranceText="Can you help with my insurance company" entities={entities} />
      <EntityTagger utteranceText="my birthday is january 25" entities={entities} />
      <EntityTagger utteranceText="What is my insurance company called" entities={entities} />
      <EntityTagger utteranceText="How can i use health insurance" entities={entities} />
      <EntityTagger utteranceText="can you help me with some help i need to get help" entities={entities} />

    </Fragment>
    );
};
