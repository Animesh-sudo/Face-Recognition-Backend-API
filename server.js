const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
    },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
})

// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     port : 5432,
//     user : 'postgres',
//     password : 'webtest',
//     database : 'smart-brain'
//   }
// });

// db.select('*').from('users')
// 	.then(data => {
// 		console.log(data);
// 	});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'Christine',
// 			email: 'christine@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'skating',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	]
// }

app.get('/', (req, res) => {
	res.json('success');
})

app.post('/signin',(req ,res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
 // the returning method specifies which column should be returned by the insert, 
 // update and delete methods. Passed column parameter may be a string or an array 
 // of strings. 

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user object
/profile/:userId --> GET = user
/image --> PUT (because updating exisiting user object info) --> user
*/