import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import clsx from "classnames";
import NavBar from "../../components/nav/navbar";
import {getYoutubeVideoById} from "../../lib/videos";
import DisLike from "../../components/icons/dislike-icon";
import Like from "../../components/icons/like-icon";
import { useState,useEffect } from "react";



Modal.setAppElement("#root");

export async function getStaticProps(context) {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
   // const video = {
        //title: "Hi cute dog",
       // publishTime: "2023-02-24",
       // description: "A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?",
        //channelTitle: "CNBC",
        //viewCount: 1000,
   // };
   console.log({context});
   const videoId = context.params.videoId;
   const videoArray = await getYoutubeVideoById(videoId); 
   
    
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
         video:videoArray.length > 0 ?videoArray[0] : {},
        },
        revalidate:10,
    };
}
export async function getStaticPaths() {
    const listOfVideos = ["2uK12nP2LIw","9Ji5U2sTlLU","s3kCmizRwR0"];
    
  
    // Get the paths we want to pre-render based on posts
    const paths = listOfVideos.map((videoId) => ({
      params: { videoId},
    }));
  
    // We'll pre-render only these paths at build time.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
}

const Video = ({video}) =>{
    const router = useRouter();
    const videoId = router.query.videoId;

    const [toggleLike,setToggleLike] = useState(false);
    const [toggleDisLike,setToggleDisLike] = useState(false);

    
    const {title,
        publishTime,
        description,
        channelTitle,
        statistics:{viewCount} = {viewCount:0}
    } = video;
    useEffect(() => {
        const handleLikeDislikeService = async (videoId) => {
          const response = await fetch(`/api/stats?videoId=${videoId}`, {
            method: "GET",
          });
          const data = await response.json();
    
            if (data.length > 0) {
                const favourited = data[0].favourited;
                if (favourited === 1) {
                 setToggleLike(true);
                } else if (favourited === 0) {
                  setToggleDisLike(true);
                }
            }
        };
        handleLikeDislikeService(videoId);
    }, [videoId]);

    const handleToggleDisLike = () =>{
        console.log("handleToggleDisLike");
        setToggleDisLike(!toggleDisLike);
        setToggleLike(toggleDisLike);

    };
    const handleToggleLike = () =>{
        console.log("handleToggleLike");
        setToggleLike(!toggleLike);
        setToggleDisLike(toggleLike);

    };

    return(
        <div className={styles.container}>
            <NavBar/>
            <Modal
              isOpen={true}
              contentLabel="Watch the Video"
              onRequestClose={() => router.back()}
              className={styles.modal}
              overlayClassName={styles.overlay}
            >
                <iframe 
                 id="ytplayer" 
                 className={styles.videoPlayer}
                 type="text/html"
                 width="100%" 
                 height="360"
                 src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                 frameBorder="0"
                ></iframe>
                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleLike}>
                            <div className={styles.btnWrapper}>
                             <Like selected={toggleLike} />
                            </div>
                        </button>
                    </div>
                   
                    <button onClick={handleToggleDisLike}>
                        <div className={styles.btnWrapper}>
                         <DisLike selected={toggleDisLike} />
                        </div>  
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>
                             {publishTime}
                            </p>
                            <p className={styles.title}>
                             {title}
                            </p>
                            <p className={styles.description}>
                             {description}
                            </p>
                        </div>
                        <div className={styles.col2}>
                            <p className={clsx (styles.subText,styles.subTextWrapper)}>
                                <span className={styles.textColor}>Cast:</span>
                                <span className={styles.channelTitle}>
                                 {channelTitle}
                                </span>
                            </p>
                            <p className={clsx (styles.subText,styles.subTextWrapper)}>
                                <span className={styles.textColor}>View Count:</span>
                                <span className={styles.channelTitle}>
                                 {viewCount}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
};
export default Video;