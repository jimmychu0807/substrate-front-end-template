import React, { useState, useEffect } from "react";

import { Menu, Dropdown, Container, Icon, Image } from "semantic-ui-react";

export default function NodeInfo(props) {
  const { keyring, setAccountAddress, api } = props;
  const [accountSelected, setAccountSelected] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: "user"
  }));

  const initialAddress = keyringOptions.length > 0
    ? keyringOptions[0].value
    : "";

  // Set the initial address
  useEffect(() => {
    setAccountSelected(initialAddress);
    setAccountAddress(initialAddress);
  }, [setAccountAddress, initialAddress])

  const onChange = (address) => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  // When account address changes, update subscriptions
  useEffect(() => {

    let unsubscribe;

    // If the user has selected an address, create a new subscription
    if (accountSelected) {
      api.query.balances.freeBalance(accountSelected, (balance) => {
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
