const express=require("express")
const bcrypt=require("bcrypt")
const {User,registerValidation,
    loginValidation,} = require("../model/user")
const router=express.Router()



router.post(("/register"),async(req,res)=>{

    const {error}= registerValidation(req.body)
    if(error){
        res.status(400).json({
            status_code:-1,
                message:error.message,
                data:null
        })

    }

    let user = await User.findOne({email:req.body.email})

    if(!user){

        const salt = await bcrypt.genSalt(10)
        req.body.password =await bcrypt.hash(req.body.password , salt)

        user = new User({
            email:req.body.email,
            userName:req.body.userName,
            password:req.body.password,
            isSeller:req.body.isSeller,
            isAdmin:req.body.isAdmin
        })
        const token = user.generateToken()

        user.token = [token]
        user = await user.save()


    const{password,...other} = user._doc

    res.status(200).json({...other,token});

    } else{
        res.status(400).json({message:"user is already register"})
    }

})



router.post(("/login"),async(req,res) =>{

    const {error}=loginValidation(req.body)
    if(error){
        res.status(400).json({
            
                status_code:-2,
                message:error.message,
                data:null

        })
    }


const user = await User.findOne({email:req.body.email})

if(user){
    res.status(200).json(user)

}else{

    res.status(404).json({message:"user not found"})

}




})






module.exports = router



