import jwt from "jsonwebtoken";
import { findVideoIdByUser } from "../../lib/db/hasura";

export default async function stats(req,res){
    if (req.method === "POST"){
        console.log({ cookies:req.cookies});

        try{
            const token = req.cookies.token;
            if (!token){
                res.stats(403).send ();
            } else {
                const videoId = req.query.videoId;
                const decodedToken = jwt.verify(token, process.env.HASURA_GRAPHQL_JWT_SECRET);
                console.log(decodedToken);
                
                const userId = decodedToken.issuer;
                //const videoId = "2uK12nP2LIw";
                const findVideoId = await findVideoIdByUser(token, userId,videoId);
                console.log({ findVideoId})
                res.send({ msg: "it works", decodedToken, findVideoId});
    
            }

        } catch (error) {
            console.error("Error occured/stats",error);
            res.status(500).send({ done: false, error: error?.message});

        }
       
        
    }
}