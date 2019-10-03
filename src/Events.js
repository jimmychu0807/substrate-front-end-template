import React, { useEffect, useState } from 'react';
import { Feed, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

export default function Events (props) {
  const { api } = useSubstrate();
  const [eventFeed, setEventFeed] = useState([]);

  useEffect(() => {
    // Filter some event from feed
    const filter = [
      'system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":0})',
      'system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":1})'
    ];

    api.query.system.events(events => {
      // loop through the Vec<EventRecord>
      events.forEach(record => {
        // extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;

        // show what we are busy with
        const eventName = `${event.section}:${
          event.method
        }:: (phase=${phase.toString()})`;

        if (filter.includes(eventName)) return;

        // loop through each of the parameters, displaying the type and data
        const params = event.data.map((data, index) =>
          `${types[index].type}: ${data.toString()}`
        );

        setEventFeed(e => [{
          icon: 'bell',
          date: 'X Blocks Ago',
          summary: `${eventName}-${e.length}`,
          extraText: event.meta.documentation.join(', ').toString(),
          content: params.join(', ')
        }, ...e]);
      });
    });
  }, [api.query.system]);

  return (
    <Grid.Column>
      <h1>Events</h1>
      <Feed style={{ overflow: 'auto', maxHeight: 250 }} events={eventFeed} />
    </Grid.Column>
  );
}
