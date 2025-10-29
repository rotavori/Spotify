import { useEffect, useState } from 'react'
import { ensureValidAccessToken, ensureValidClientCredentialsToken } from '../../API/LoginApiActions'
import { getUserTopArtists, getUserTopTracks } from '../../API/ApiActions'
import DetailsList from '../../Components/CommonComponents/DetailsList'

function HomePage() {
  const [topArtists, setTopArtists] = useState([])
  const [topTracks, setTopTracks] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      await ensureValidAccessToken()
      await ensureValidClientCredentialsToken()
      
      const [topArtistsResp, topTracksResp] = await Promise.all([
        getUserTopArtists(),
        getUserTopTracks()
      ])

      setTopArtists(topArtistsResp.items)
      setTopTracks(topTracksResp.items)
      console.log(topArtistsResp.items[0])
      console.log(topTracksResp)
    }
    fetchData()
  }, [])

  const getTrackImage = (item) => {
    return item.album.images[2].url 
  }

  const getArtistImage = (item) => {
    return item.images[2].url
  }

  return (
    <div>
      <DetailsList lst={topArtists} type={'artists'} getImage={getArtistImage}/><br/>
      <DetailsList lst={topTracks} type={'tracks'} getImage={getTrackImage}/><br/>
    </div>
  )
}

export default HomePage