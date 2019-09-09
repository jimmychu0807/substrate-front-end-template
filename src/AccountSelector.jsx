import React, { useState } from "react";

import { Menu, Dropdown, Container, Icon, Image } from "semantic-ui-react";

export default function NodeInfo(props) {
  const { keyring, setAccountAddress } = props;
  const [accountSelected, setAccountSelected] = useState("");

  // get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: "user"
  }));

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
            onChange={(_, dropdown) => {
              setAccountAddress(dropdown.value);
              setAccountSelected(dropdown.value);
            }}
          />
        </Menu.Menu>
      </Container>
    </Menu>
  );
}
