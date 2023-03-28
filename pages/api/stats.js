import jwt from "jsonwebtoken";

export default async function stats(req,res){
    if (req.method === "POST"){
        console.log({ cookies:req.cookies});

        try{
            const token = req.cookies.token;
            if (!token){
                res.stats(403).send ();
            } else {
                const decoded = jwt.verify(token, process.env.HASURA_GRAPHQL_JWT_SECRET);
                console.log(decoded);
                
                const userId = "did:ethr:0xc584521102204e3803437934b48e294011a65bE4";
                const videoId = "2uK12nP2LIw";
                const findVideoId = await findVideoIdByUser(userId,videoId);
                console.log({ findVideoId})
                res.send({ msg: "it works", decoded, findVideoId});
    
            }

        } catch (error) {
            console.error("Error occured/stats",error);
            res.status(500).send({ done: false, error: error?.message});

        }
       
        
    }
}