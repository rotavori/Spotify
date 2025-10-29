import axios from "axios"
import { clientID, clientSecret } from "../SecretKey/SecretKey"

const redirectURI = 'http://127.0.0.1:5173'
const scope = 'user-top-read'

const loginParams = new URLSearchParams()
loginParams.append('client_id', clientID)
loginParams.append('response_type', 'code')
loginParams.append('redirect_uri', redirectURI)
loginParams.append('scope', scope)
const authURL = `https://accounts.spotify.com/authorize?${loginParams.toString()}`
const tokenURL = 'https://accounts.spotify.com/api/token'

//Validate token
const isTokenValid = (token, tokenEx) => {
  if (!token || tokenEx) {
    return false
  }
  return Date.now() < Number(tokenEx)
}

const isAccessTokenValid = () => {
  const accessToken = getAccessToken()
  const accessTokenEx = sessionStorage.getItem('accessTokenEx')
  return isTokenValid(accessToken, accessTokenEx)
}

const isClientCredentialsTokenValid = () => {
  const clientCredToken = getClientCredentialsToken()
  const clientCredTokenEx = sessionStorage.getItem('clientCredTokenEx')
  return isTokenValid(clientCredToken, clientCredTokenEx)
}

//Ensure token is valid

const ensureValidAccessToken = async () => {
  if (!isAccessTokenValid()) {
    await getAccessTokenApi()
  }
}

const ensureValidClientCredentialsToken = async () => {
  if (!isClientCredentialsTokenValid()) {
    await getClientCredentialsTokenApi()
  }
}

//Get tokens from session storage
const getClientCredentialsToken = () => {
  return sessionStorage.getItem('clientCredToken')
}

const getAccessToken = () => {
  return sessionStorage.getItem('accessToken')
}

//Get tokens via API
const getClientCredentialsTokenApi = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials')
  params.append('client_id', clientID)
  params.append('client_secret', clientSecret)
  try {
    const resp = await axios.post(tokenURL, params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    const { access_token: clientCredToken, expires_in: clientCredTokenEx } = resp.data
    sessionStorage.setItem('clientCredToken', clientCredToken)
    sessionStorage.setItem('clientCredTokenEx', clientCredTokenEx)
  }
  catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

const getAccessTokenApi = async () => {
  const code = getCode()

  const accessTokenParams = new URLSearchParams()
  accessTokenParams.append('grant_type', 'authorization_code')
  accessTokenParams.append('redirect_uri', redirectURI)
  accessTokenParams.append('client_id', clientID)
  accessTokenParams.append('client_secret', clientSecret)
  accessTokenParams.append('code', code)

  try {
    const resp = await axios.post(tokenURL, accessTokenParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const { access_token: accessToken, expires_in: accessTokenEx } = resp.data
    sessionStorage.setItem('accessToken', accessToken)
    sessionStorage.setItem('accessTokenEx', accessTokenEx)
  } catch (error) {
    console.error('Error fetching access token:', error.response?.data || error.message)
  }
}

//Helpers
const redirectToSpotifyLogin = () => {
  window.location.href = authURL
}

const removeCodeQueryParam = () => {
  const queryParams = new URLSearchParams(window.location.search)
  queryParams.delete('code')
  const newURL = window.location.pathname
  window.history.replaceState({}, '', newURL)
}

const getCode = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const code = queryParams.get('code')
  if (!code) {
    redirectToSpotifyLogin()
  }
  removeCodeQueryParam()
  return code
}

export {
  ensureValidAccessToken,
  ensureValidClientCredentialsToken,
  getAccessToken,
  getClientCredentialsToken
}
