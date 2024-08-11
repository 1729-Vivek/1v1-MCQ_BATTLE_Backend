const express=require('express')
const router = express.Router(); // Create router instance
const auth=require('../middleware/authMiddleware')
const MCQ=require('../models/MCQ')

//Create MCQ

router.post('/', auth, async (req, res) => {
    const { body, explanation, options, difficulty } = req.body;
    try {
        if (!body || !options || !difficulty) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        const mcq = new MCQ({
            body,
            explanation,
            options,
            difficulty,
            createdBy: req.user.id,
        });

        await mcq.save();
        res.json(mcq);
    } catch (err) {
        console.error(err.message);  // Log the error message
        res.status(500).json({ msg: 'Server error', error: err.message });  // Send more details in the response
    }
});


//Read MCQs
router.get('/',async(req,res)=>{
    try{
        const mcqs=await MCQ.find();
        res.json(mcqs);
    }
    catch(err){
        res.status(500).send('Server error')
    }
})
// Backend route for fetching an MCQ by ID
router.get('/:id', async (req, res) => {
  try {
    const mcq = await MCQ.findById(req.params.id);
    if (!mcq) return res.status(404).json({ msg: 'MCQ not found' });
    res.json(mcq);
  } catch (err) {
    console.error(err.message); // Log the error
    res.status(500).send('Server error');
  }
});

//Update MCQ

router.put('/:id',auth,async(req,res)=>{
    const {body,explanation,options,difficulty}=req.body;
    try{
        let mcq=await MCQ.findById(req.params.id);
        if(!mcq) return res.status(404).json({msg:'MCQ not found'})

            if(mcq.createdBy.toString()!==req.user.id)
                return res.status(401).json({msg:'Not Authorized'})

            mcq=await MCQ.findByIdAndUpdate(
                req.params.id,
                {
                    $set:{body,explanation,options,difficulty}
                },
                {
                    new: true
                }
            );
            res.json(mcq);
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

//Delete MCQ

router.delete('/:id',auth,async(req,res)=>{
    try{
        const mcq=await MCQ.findById(req.params.id);
        if(!mcq) return res.status(404).json({msg:'MCQ not found'})

        if(mcq.createdBy.toString()!==req.user.id)
            return res.status(401).json({msg:'Not authorized'})
        await MCQ.findByIdAndDelete(req.params.id);
        res.json({msg:'MCQ removed'})
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

module.exports=router;