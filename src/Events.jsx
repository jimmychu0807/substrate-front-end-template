import React, { useEffect, useState } from "react";

import { Feed, Grid } from "semantic-ui-react";

export default function Metadata(props) {
  const { api } = props;

  const [eventFeed, setEventFeed] = useState([]);

  useEffect(() => {
    api.query.system.events(events => {
      // loop through the Vec<EventRecord>
      events.forEach(record => {
        // extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;

        // show what we are busy with
        let eventName = `${event.section}:${
          event.method
        }:: (phase=${phase.toString()})`;

        // loop through each of the parameters, displaying the type and data
        let params = event.data.map((data, index) => {
          return `${types[index].type}: ${data.toString()}`;
        });


        if (
          eventName !== 'system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":0})'
        ) {
          let feedEvent = {
            icon: "bell",
            date: "X Blocks Ago",
            summary: eventName,
            extraText: event.meta.documentation.join().toString(),
            content: params
          };

          setEventFeed(e => [feedEvent, ...e]);
        }
      });
    });
  }, [api.query.system]);

  return (
    <Grid.Column>
      <h1>Events</h1>
      <Feed style={{ overflow: "auto", maxHeight: 250 }} events={eventFeed} />
    </Grid.Column>
  );
}
