const authRouter = require('express').Router()
const User = require('./userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

authRouter.post('/login', async (request:any, response:any) => {
    const {username, password} = request.body
    const user = await User.findOne({username: username.toLowerCase()})
    const validPass = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    
    if (!(user && validPass)){
        return response.status(400).json({error: 'Invalid username/password'})
    }
    console.log("login success")
    const token = jwt.sign(user._id.toString(), process.env.SECRET)
    response.status(200).send({token: token})
})

authRouter.post('/signup', async (request:any, response:any) => {
    const {username, password} = request.body
    console.log(username)

    //input validation
    if (username === undefined || password === undefined) return response.status(400).json({error: 'Missing fields.'})
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    const pwdRegex = /^[a-zA-Z0-9_\-!@#$%^&*()]+$/

    if (!(username.length >= 3 && username.length <= 16 )) return response.status(400).json({error: 'Username needs to be between 3 and 16 characters long.'})
    else if (!usernameRegex.test(username)) return response.status(400).json({error: 'Username must contain only letters, numbers, underscores, and dashes.'})

    if (!(password.length >= 8 && password.length <= 32 )) return response.status(400).json({error: 'Password needs to be between 8 and 32 characters long.'})
    else if (!pwdRegex.test(password)) return response.status(400).json({error: 'Password must contain letters, numbers, underscores, dashes, and the following special characters: ! @ # $ % ^ & * ( )'})

    //dupe searches
    if (await User.findOne({username: username}) !== null) return response.status(400).json({error: `Username ${username} is taken.`})

    //bcrypt shit
    const saltReps = 10
    const passwordHash = await bcrypt.hash(password, saltReps)

    const user = new User({username: username, passwordHash: passwordHash})
    await user.save()
    const token = jwt.sign(user._id.toString(), process.env.SECRET)
    console.log('POST: Log in success for ', username)
    response
        .status(200)
        .send({token: token})
})

const userExtractor = async (request:any, response:any, next:any) => {
    const auth = request.get('Authorization')
    const token = (auth && auth.startsWith('Bearer ')) ? auth.replace('Bearer ', '') : ''
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        request.user = await User.findById(decodedToken)
        if (request.user === null) return response.status(404).json({error: 'Not found'})
        next()
    }catch(e){
        return response.status(404).json({error: e})
    }
}

authRouter.get("/info", userExtractor, async (request:any, response:any) => {
    //authenticated user is extracted from JWT and placed in request.user
    return response.status(200).json(request.user)
})

authRouter.post("/addStreak", userExtractor, async (request:any, response:any) => {
    const givenDate = request.user.lastUpdated
    const currentDate = new Date();
    const givenDateOnly = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const oneDay = 24 * 60 * 60 * 1000; 
    const differenceInDays = (currentDateOnly.getTime() - givenDateOnly.getTime()) / oneDay;
    if (differenceInDays === 1 ) {
        request.user.streak = request.user.streak + 1
        request.user.lastUpdated = new Date();
    }else if (differenceInDays === 0){
        return response.status(200).json({newStreak: request.user.streak})
    }
    else{
        request.user.streak = 0;
    }
    await request.user.save()
    return response.status(200).json({newStreak: request.user.streak})
})



module.exports = authRouter