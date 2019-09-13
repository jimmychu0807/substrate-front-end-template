import React, { useState, useEffect } from "react";

import { Menu, Dropdown, Container, Icon, Image } from "semantic-ui-react";

export default function NodeInfo(props) {
  const { keyring, setAccountAddress, api } = props;

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: "user"
  }));

  // Setup state
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountSelected, setAccountSelected] = useState(
    keyringOptions.length > 0
    ? keyringOptions[0].value
    : ""
  );

  const onChange = (address) => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  // When account address changes, update subscriptions
  useEffect(() => {

    let unsubscribe;

    // If the user has selected an address, create a new subscription
    console.log("about to create subscription if address exists");
    console.log(accountSelected);
    if (accountSelected) {
      console.log("creating a subscription to account");
      console.log(accountSelected);
      api.query.balances.freeBalance(accountSelected, (balance) => {
        // For some reason this callback doesn't get called when transferring tokens!?
        console.log(`about to update accountBalance to ${balance}`)
        setAccountBalance(balance.toString());
      })
      .then(u => {
        unsubscribe = u;
      })
      .catch(console.error);
    }

    return () => unsubscribe && unsubscribe();
  }, [accountSelected, api.query.balances]);

  return (
    <Menu
      attached="top"
      tabular
      style={{
        backgroundColor: "#fff",
        borderColor: "#fff",
        paddingTop: "1em",
        paddingBottom: "1em"
      }}
    >
      <Container>
        <Menu.Menu>
          <Image src='Substrate-Logo.png' size='mini' />
        </Menu.Menu>
        {api.query.balances && accountSelected ?
          (
            <Menu.Menu>
              <Icon
                name="money bill alternate outline"
                size="large"
                circular
              ></Icon>
              { accountBalance }
            </Menu.Menu>
          ) :
          ""
        }
        <Menu.Menu position="right">
          <Icon
            name="users"
            size="large"
            circular
            color={accountSelected ? "green" : "red"}
          ></Icon>
          <Dropdown
            search
            selection
            clearable
            placeholder="Select an account"
            options={keyringOptions}
            onChange={(_, dropdown) => { onChange(dropdown.value) }}
            value={accountSelected}
          />
        </Menu.Menu>
      </Container>
    </Menu>
  );
}
