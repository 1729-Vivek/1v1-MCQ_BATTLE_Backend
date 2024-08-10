const express=require('express')
const auth=require('../middleware/authMiddleware')
const Game=require('../models/Game')

const router =express.Router();

//create game
router.post('/',auth,async(req,res)=>{
    try{
        const game=new Game({
            owner:req.user.id,
            mcqs:[],
        })
        await game.save();
        res.json(game)
    }
    catch(err){
        res.status(500).send('Server Error')
    }
})

//List Games 
router.get('/',async(req,res)=>{
    try{
        const games=await Game.find({status:'waiting'});
        res.json(games);
    }
    catch(err)
    {
        res.status(500).send('Server error')
    }
})

module.exports=router;