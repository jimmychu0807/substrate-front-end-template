import React, { useEffect, useState } from "react";

export default function Metadata(props) {
  const { api } = props;

  useEffect(() => {
    api.query.system.events(events => {
      console.log(`\nReceived ${events.length} events:`);

      // loop through the Vec<EventRecord>
      events.forEach(record => {
        // extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;

        // show what we are busy with
        console.log(
          `\t${event.section}:${event.method}:: (phase=${phase.toString()})`
        );
        console.log(`\t\t${event.meta.documentation.toString()}`);

        // loop through each of the parameters, displaying the type and data
        event.data.forEach((data, index) => {
          console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
        });
      });
    });
  }, [api.query.system]);

  return null;
}
