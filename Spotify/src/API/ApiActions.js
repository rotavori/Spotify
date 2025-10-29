import axios from 'axios'
import { getAccessToken, getClientCredentialsToken } from './LoginApiActions'

const recURL = 'https://api.spotify.com/v1/recommendations?'
const topURL = `https://api.spotify.com/v1/me/top/`



const getUserTop = async (type, limit) => {
    const reqURL = `${topURL + type}?limit=${limit}`
    const accessToken = getAccessToken()
    if (!accessToken) {
        throw new Error('No access token found, user must log in')
    }

    try {
        const resp = await axios.get(reqURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return resp.data
    } catch (error) {
        console.error('Error fetching top artists:', error.response?.data || error.message)
        throw error
    }
}

export const getUserTopArtists = async () => {
    return await getUserTop('artists', 20)
}

export const getUserTopTracks = async () => {
    return await getUserTop('tracks', 20)
}


export const getRecommendationsList = async () => {
    const topArtistResp = await getUserTopArtists()
    const topTracksResp = await getUserTopTracks()

    const artistsItems = topArtistResp?.items || []
    const tracksItems = topTracksResp?.items || []

    // const seedArtists = artistsItems.slice(0,2).map(artist => artist.id).join(',')
    // const seedTracks = tracksItems.slice(0,2).map(track => track.id).join(',')

    const seedArtists = artistsItems[0].id

    const seedTracks  = tracksItems[0].id

    console.log('aaaaaaaa ='+ seedArtists)

    if(seedArtists.length === 0 && seedTracks.length === 0){
        throw new Error('No valid seed artists or tracks found')
    }

    const seedsParams = new URLSearchParams()
    if (seedArtists.length){
        seedsParams.append('seed_artists', seedArtists)
    }
    if(seedTracks.length){
        seedsParams.append('seed_tracks', seedTracks)
    }
    seedsParams.append('seed_genres', 'classical')

    const recBaseURL = 'https://api.spotify.com/v1/recommendations'
    const reqURL = `${recBaseURL}?${seedsParams.toString()}`
    // const reqURL = 'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA'

    const accessToken = getAccessToken()
    if (!accessToken) {
        throw new Error('No access token found, user must log in')
    }

    const credToken = getClientCredentialsToken()

    try {
        const meResp = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        console.log('Token belongs to user:', meResp.data?.id || '(unknown user id)')
    } catch (err) {
        console.error('Token validation failed (not a valid user token):', err.response?.status, err.response?.data || err.message)
        throw err
    }

    try {
        const resp = await axios.get(reqURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return resp.data
    } catch (error) {
        console.error('Error fetching recommendations:', error.response?.data || error.message)
        throw error
    }
}
