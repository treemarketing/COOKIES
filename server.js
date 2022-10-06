const express = require('express')
//const cookieParser = require('cookie-parser')
const session = require('express-session')
//para usar persistencia 
const FileStore = require('session-file-store')(session)
const app = express()

const MongoStore = require('connect-mongo')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.use(
session({
  store: MongoStore.create({
    mongoUrl:
    "mongodb+srv://salo:tako@cluster0.51jwcs4.mongodb.net/test",
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }),
  //store: new FileStore({path: "./sesiones", ttl:300, retries:0}),

  secret: "secreto",
  resave: false,
  saveUninitialized: false,
  // Cookie por 10 minutos
  maxAge: 600000
}),
);

// app.use(cookieParser("A secret"))
function checkIsLogin (req, res, next) {
  if (!req.session.admin) return res.status(403).send("no esta logueado")
  return next()

}


app.get("/root/:name", (req, res) => {
  let {name} = req.params;
  console.log(req.session[name])
  if (!req.session[name]){
  req.session[name] = {};
  req.session[name].name = name;
  req.session[name].cantidadDeLogins = 1;
} else {
  req.session[name].cantidadDeLogins += 1;
}res.send(
  `<h1>Te damos la bienvenida ${name}</h1>. Visitaste ${req.session[name].cantidadDeLogins} veces`
  );
});

app.get("/olvidar", (req, res) => {
  req.session.destroy((err) => {
    if (err) {return res.json({ status: "Logout ERROR", body: err });
  }res.send("Logout ok!");
});
});




app.get('/loginpass', (req, res) => {
  const { username, password } = req.query
  if (username !== 'pepe' || password !== 'pepepass') {
    return res.send('login failed')
  }
  req.session.user = username
  req.session.admin = true
  res.send('login success!')
 })

 
 
app.get('/crearcookie', (req, res) => {
    res.cookie('logueado', { signed: true })
    res.status(400)
    res.send('guardamos tu cookie')
})



app.get('/recuperarcookie', (req, res) => {
    let cookies = req.cookies
    console.log(cookies)
    res.send('mira la consola')
}) 


app.get('/logout', (req, res) => {
  res.session.destroy((err) =>{
    if(err){
    return res.json("logout error")
  }
  
  return res.send(`<h1>hasta luego ${user}</h1>. Visitaste ${req.session[user].cantidadDeLogins} veces`)

  })
  })

//entro al formulario para ingresar usuario
  app.get('/login', (req, res) => {
    let user = req.session;
    console.log(user.user)
    if (req.session.user !==undefined){
      res.sendFile(__dirname + '/logueado.html')
    } else {
      res.sendFile(__dirname + '/loginForm.html')
    }    
   })



  app.post('/login', (req, res) => {
   let {user} = req.body;
 console.log(user)
console.log (user == undefined)
    if (user !==undefined ){
      req.session.user = user
      res.redirect(__dirname + '/logueado.html')
    } else {
      res.sendFile(__dirname + '/loginForm.html')
    }    
   })







  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (!err) res.redirect("/deslogueo")
      else res.send({status : 'desLogeo Error', error: err})
      })
    
   })

   
//entro al formulario para ingresar usuario
app.get('/deslogueo', (req, res) => {
    res.sendFile(__dirname + '/logout.html')

 })


app.listen(8000, () => {

  
  console.log(`Example app listening on port 8000`);
});



