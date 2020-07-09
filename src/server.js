const express = require('express')
const fetch = require('node-fetch')
const redis = require('ioredis')

const app = express()

//redis config

const client = redis.createClient({
    host: 'localhost',
    port: parseInt( 3453 ,10)
})

async function getRepo(req, res) {
    try{
        const { username } = req.params
        
        const response = await fetch(`https://api.github.com/users/${username}`)
        
        const data = await response.json()

        // client.setex(username, 3600, data.public_repos)

        return res.json(`${data}`)

    }catch(e){
        console.log(e)
    }
}

function cache(req, res, next){
    const { username } = req.params

    client.get(username, (err, data) => {
        if(err) throw err

        if(data !== null){
            res.send(`${username} ${data} `)
        } else{
            next()
        }
    })
}


app.get('/repos/:username',  cache, getRepo )

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Magic happening on port ${port}`)
})
