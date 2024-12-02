import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || 'Romanisagood$boy';


const fetchuser=(req,res,next)=>{
   //Get the user from the jwt token and add id to req object
   const token = req.header('auth-token') //jab req bhejunga tab auth token nam se bhejunga
   if(!token){
    res.status(401).send({error:"Please authenticate using a valid token"}); //It there is not token
   }
   //user is valid or not 
   try {
    const data = jwt.verify(token,JWT_SECRET); //token mai se data nikalunga
    req.user = data; //now we get user
    next();
   } catch (error) {
    res.status(401).send({error:"Please authenticate using a valid token"}); //It there is not token
   }
}

export default fetchuser;