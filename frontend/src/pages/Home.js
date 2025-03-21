import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"fruits"} heading={"top fruits"}/>
      <HorizontalCardProduct category={"fruits"} heading={"Popular fruits"}/>

      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>
      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>
      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>
      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>
      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>
      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>
      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>
      <VerticalCardProduct category={"fruits"} heading={"fruits"}/>

    </div>
  )
}

export default Home