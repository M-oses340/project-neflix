import Head from 'next/head'
import NavBar from "../components/nav/navbar";
import styles from '@/styles/Home.module.css'
import Banner from "../components/banner";
import SectionCards from "../components/card/section-cards";
import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/videos";



export async function getServerSideProps () {
  const userId = "";
  const token = "";

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  console.log({ watchItAgainVideos });
  const disneyVideos =  await getVideos("disney trailer");
  const travelVideos =  await getVideos("travel");
  const productivityVideos =  await getVideos("productivity");
  const popularVideos = await getPopularVideos();

  return { 
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  }
  
}

export default function Home({ disneyVideos, travelVideos,productivityVideos,popularVideos , watchItAgainVideos,}) {
  console.log({ watchItAgainVideos });
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <NavBar username="mosesomwa7@gmail.com"/>
        <Banner 
          videoId="2uK12nP2LIw"
          title="Blacklist"
          subTitle="Raymond Reddington" 
          imgUrl="/static/blacklist.jpeg"
        />
        <div className={styles.sectionWrapper}>
         <SectionCards title="Disney" videos={disneyVideos} size="large" />
         <SectionCards title="Travel" videos={travelVideos} size="small"/>
         <SectionCards title="Productivity" videos={productivityVideos} size="medium"/>
         <SectionCards title="Popular" videos={popularVideos} size="small"/>
         <SectionCards
            title="Watch it again"
            videos={watchItAgainVideos}
            size="small"
          />
        </div>
      </div>
    </div>
  );   
} 
