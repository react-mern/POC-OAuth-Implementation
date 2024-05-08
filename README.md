# OAuth

## Overview
- This project implements OAuth authentication for secure access to resources on GitHub and Google. 
- It includes support for the Authorization Code Grant type for GitHub and Google login, as well as the Implicit Grant type for Google.

## OAuth Introduction
- OAuth (Open Authorization) is an open-standard authorization protocol that enables secure access to user data on the internet without sharing passwords directly. 
- It allows third-party applications ("clients") to access resources on behalf of a user, with the user's consent. 
- OAuth operates on a set of predefined roles and grant types to facilitate secure authorization.

### Basic Concepts:
- **Roles**:
  - *Resource Owner*: The user who owns the data and grants access to it.
  - *Client*: The application requesting access to the user's data.
  - *Authorization Server*: Responsible for authenticating the user and issuing access tokens.
  - *Resource Server*: Hosts the protected resources that the client wants to access.
- **Authorization Flow**: OAuth involves a flow of interactions between the resource owner, client, authorization server, and resource server to obtain an access token for accessing protected resources.

## Implemented Grant Types
- **Authorization Code Grant:**
  - *GitHub*: This grant type is implemented for GitHub authentication. It involves exchanging an authorization code for an access token after the user grants permission.
  - *Google*: Similarly, this grant type is implemented for Google login.
- **Implicit Grant:**
  - *Google*: Implemented for Google login, the Implicit Grant type directly issues an access token to the client without exchanging an authorization code.
- **Refresh Token Grant:**
  - *Google*: Implemented along with authorization grant type, the Refresh Token Grant Type is used to obtain a new access token when the current one expires, without requiring the user to re-authenticate. 

## Other Grant Types
In addition to the implemented grant types, OAuth supports other grant types, including:
- *Client Credentials Grant*: Suitable for machine-to-machine authentication where the client is the resource owner.
- *Resource Owner Password Credentials Grant*: Involves the client obtaining the user's username and password directly.

## Usage
To use OAuth authentication in your application:

**1. Clone the Repository**
```
git clone https://github.com/RiteshAdwani/oauth.git
```

**2. Install Dependencies**
```
cd oauth
npm install
```

**3. Registration**
- Register your application with the respective OAuth provider (GitHub, Google).
- Obtain client credentials (client ID and client secret) from the OAuth provider.

**4. Configuration**
- Configure your application to use the appropriate OAuth flow (Authorization Code or Implicit).
- Set up redirect URIs and callback URLs as required.
- For google, add `http://localhost:3000/google/callback/authorization-code` and `http://localhost:3000/google/callback/implicit`
- For github, add `http://localhost:3000/google/callback` (github only allows one redirect uri to be added, however it will allow all the paths that start with the uri you specify)

**5. Implementation**
- Implement the necessary authentication endpoints and handle token exchange as per the selected grant type.
- Ensure proper validation and security measures are in place.

**6. Configure .env variables** 

#### Example .env File (Development)
To configure OAuth authentication in development, create a .env file in the root directory with the following environment variables:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret


GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_HOST_URL=your_host_url(eg: http://localhost:3000)
```
Replace your_github_client_id, your_github_client_secret, your_google_client_id, and your_google_client_secret with your actual client IDs and client secrets obtained during the registration process with GitHub and Google.

#### Example .env File (Production)
For production, set environment variables directly in your hosting environment or container orchestration platform.

**7. Run the development server:**
```
npm run dev
```

## Security
- Ensure secure communication using HTTPS.
- Protect client credentials (client ID and client secret) from unauthorized access.
- Implement proper error handling and logging to identify and mitigate security threats.
- Regularly rotate access and refresh tokens to enhance security.

## Live Link
Find the hosted app at - [OAuth-Implementation](https://oauth-rho.vercel.app)


