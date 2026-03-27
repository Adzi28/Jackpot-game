const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let db = { users: [] };

if (fs.existsSync("database.json")) {
  db = JSON.parse(fs.readFileSync("database.json"));
}

function saveDB(){
  fs.writeFileSync("database.json", JSON.stringify(db));
}

app.post("/register", (req, res)=>{
  const {username, password} = req.body;

  if(db.users.find(u=>u.username === username)){
    return res.send({status:"user sudah ada"});
  }

  db.users.push({ username, password, coins: 100 });
  saveDB();
  res.send({status:"berhasil"});
});

app.post("/login", (req,res)=>{
  const {username, password} = req.body;
  let user = db.users.find(u=>u.username===username && u.password===password);

  if(!user){
    return res.send({status:"gagal"});
  }

  res.send({status:"ok", user});
});

app.post("/update", (req,res)=>{
  let {username, coins} = req.body;
  let user = db.users.find(u=>u.username===username);
  if(user){
    user.coins = coins;
    saveDB();
  }
  res.send({status:"updated"});
});

app.get("/leaderboard",(req,res)=>{
  let top = [...db.users].sort((a,b)=>b.coins-a.coins).slice(0,10);
  res.send(top);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server jalan"));
