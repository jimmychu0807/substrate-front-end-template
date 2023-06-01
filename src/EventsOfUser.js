import React, { useEffect, useState, useRef } from 'react'
import { Feed, Grid, Button, Card } from 'semantic-ui-react'

import { useSubstrateState} from './substrate-lib'

// Events to be filtered from feed
const FILTERED_EVENTS = [
  'system:ExtrinsicSuccess::(phase={"applyExtrinsic":0})',
]

// Events to be tracked and displayed
const TRACKED_EVENTS = [
  "DidCreationRequest",
  "DidCreationRequestCreated", // deprecated
  "VerificatoinTaskAllotted",
  "VerifierRegistrationRequest",
  "TaskAccepted",
  "VpSubmitted",
  "Revealed",
  "DidCreationResult",
  "VerifierRegistrationRequest",
  "VerifierDeposite", 
  // "Transfer" 
]

const eventName = ev => `${ev.section}:${ev.method}`
const eventParams = ev => JSON.stringify(ev.data)
// const acctAddr = acct => (acct ? acct.address : '')

function Main(props) {
  const { api, currentAccount } = useSubstrateState()
  const [eventFeed, setEventFeed] = useState([])
  const keyNum = useRef(0)
  
  const [address, setAddress] = useState('')
  useEffect(()=>{
    if (currentAccount && address !== currentAccount.address ) {
      setAddress(currentAccount.address)
      // console.log(`useeffect-address: ${address}`)
    }
  }, [currentAccount, address])
  
  
  
  useEffect(() => {
    let unsub = null
    const allEvents = async () => {
      
      unsub = await api.query.system.events(events => {
        if (address.length < 20) return

        // loop through the Vec<EventRecord>
        events.forEach(record => {
          // extract the phase, event and the event types
          const { event, phase } = record

          // show what we are busy with
          const evHuman = event.toHuman()
          const evName = eventName(evHuman)
          const evParams = eventParams(evHuman)
          const evNamePhase = `${evName}::(phase=${phase.toString()})`
          // console.log(`event:${evNamePhase}::->${event.data}, addrs:${address} `)
          
          if (FILTERED_EVENTS.includes(evNamePhase)) return
          // if (event.method !== "DidCreationRequestCreated" ) return
          if (!TRACKED_EVENTS.includes(event.method)) return
          if (!evParams.includes(address.toString())) return
          console.log(`evParams:${evParams}, address: ${address}`)
          // console.log(`-----------------event:${evNamePhase}::->${event.data.toHuman()}, addrs:${address} `)

          setEventFeed(e => [
            {
              key: keyNum.current,
              icon: 'bell',
              summary: evName,
              content: evParams,
            },
            ...e,
          ])

          keyNum.current += 1
        })
      })
    }

    allEvents()
    return () => unsub && unsub()
  }, [address, api.query.system])

  const { feedMaxHeight = 250 } = props

  return (
    <Grid.Column width={8}>
      <Card centered fluid style={{ minHeight: '24em' }} >
        <Card.Content textAlign="center">
        <h1 style={{ float: 'left' }}>Active Account's notifications</h1>
        <Button
          basic
          circular
          size="mini"
          color="grey"
          floated="right"
          icon="erase"
          onClick={_ => setEventFeed([])}
        />
        <Feed
          style={{ clear: 'both', overflow: 'auto', maxHeight: feedMaxHeight }}
          events={eventFeed}
        />
        </Card.Content >
      </Card >
    </Grid.Column>
  )
}

export default function EventsOfAccount(props) {
  const { api } = useSubstrateState()
  return api.query && api.query.system && api.query.system.events ? (
    <Main {...props} />
  ) : null
}
