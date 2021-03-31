# Chainlink External Adapter for the [CodBets Dapp](https://github.com/viken33/CodBets)

Build base on the NodeJS External Adapter Template from [this repo](https://github.com/thodges-gh/CL-EA-NodeJS-Template.git)

Hosted as a Serverless host on GCP, instructions bellow.

---

## Chainlink NodeJS External Adapter Template

This template provides a basic framework for developing Chainlink external adapters in NodeJS. Comments are included to assist with development and testing of the external adapter. Once the API-specific values (like query parameters and API key authentication) have been added to the adapter, it is very easy to add some tests to verify that the data will be correctly formatted when returned to the Chainlink node. There is no need to use any additional frameworks or to run a Chainlink node in order to test the adapter.


### Serverless hosts

After [installing locally](#install-locally):

### Create the zip

```bash
zip -r external-adapter.zip .
```

### Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `external-adapter.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: API_KEY
  - VALUE: Your_API_key
