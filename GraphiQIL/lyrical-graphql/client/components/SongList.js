import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class SongList extends React.Component {
  render() {
    console.log(this.props)
    return (
      <div>song list</div>
    )
  }
}

const query = gql`
  {
    songs {
      title
    }
  }
`

export default graphql(query)(SongList)