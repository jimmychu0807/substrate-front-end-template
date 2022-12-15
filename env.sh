#!/bin/bash

echo "*** Processing $PWD/env-config.js"

# Only expose whitelisted environment variables declared here in the front-end
whitelistVars=(
  "APP"
  "NODE_ENV"
  "PORT"
  "PORT_PROD"
  "PORT_NGINX"
  "NODE_ENV"
  "PUBLIC_URL"
)

# https://stackoverflow.com/a/8574392/3208553
set +e # otherwise the script will exit on error
containsElement () {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

# Reference: https://www.freecodecamp.org/news/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70/

# Recreate config file
rm -rf $PWD/env-config.js
touch $PWD/env-config.js

# Add assignment
echo "window.process_env = {" >> $PWD/env-config.js

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  if containsElement $varname "${whitelistVars[@]}"; then
    # Read value of current variable if exists as Environment variable
    value=$(printf '%s\n' "${!varname}")
    # Otherwise use value from .env file
    [[ -z $value ]] && value=${varvalue}

    # Append configuration property to JS file
    echo "  $varname: \"$value\"," >> $PWD/env-config.js
  fi
done < $PWD/.env

echo "}" >> $PWD/env-config.js
