import jwt from "jsonwebtoken";
import { findVideoIdByUser, updatestats, insertstats } from "../../lib/db/hasura";

export default async function stats(req,res){
    if (req.method === "POST"){
        console.log({ cookies:req.cookies});

        try{
            const token = req.cookies.token;
            if (!token){
                res.status(403).send ();
            } else {
                const videoId = req.query.videoId;
                const decodedToken = jwt.verify(token, process.env.HASURA_GRAPHQL_JWT_SECRET);
                console.log(decodedToken);
                
                const userId = decodedToken.issuer;
                
                const doesStatsExist = await findVideoIdByUser(token, userId,videoId);

                if(doesStatsExist){
                    //update it
                    const response = await updatestats(token,{
                        watched:true,
                        userId,
                        videoId,
                        favourited:3,
                    });
                    res.send({ msg:"it works",updatestats:response});
                } else {
                    //add it
                    const response = await insertstats(token,{
                        watched:true,
                        userId,
                        videoId,
                        favourited:10,

                    });
                    res.send({ msg:"it works",insertstats:response});

                    
                }

                
               
    
            }

        } catch (error) {
            console.error("Error occured/stats",error);
            res.status(500).send({ done: false, error: error?.message});

        }
       
        
    }
}