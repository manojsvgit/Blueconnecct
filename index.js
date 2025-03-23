const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const workerController = require('./controllers/worker');
const clientController = require('./controllers/client');
const adminController = require('./controllers/admin');
const adminRoutes = require('./routes/admin');
const workerRoutes = require('./routes/worker');
const clientRoutes = require('./routes/client');
const { requireWorkerAuth, requireClientAuth, requireAdminAuth } = require('./middleware/auth');
const nodemailer = require('nodemailer')

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/upload');
	},
	filename: function (req, file, cb) {
		// console.log(file)
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.set('strictQuery', true);
const port = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_CONNECTION_URI || MONGODB_CONNECTION_URI;
const db = async()=>{
	const connected= await mongoose.connect(dbURI)
	.then((result) => {
		console.log('Connected to database');
	})
	.catch((err) => console.log(err))
}
db();

app.listen(port, () => {
	console.log(`Listening on port http://localhost:${port}`);
});

app.get('/', (req, res) => {
	res.send('Hello Word');
});

//mailer
const GMAIL=process.env.GMAIL || 'cvi23csds@cmrit.ac.in';
const pass=process.env.PASSWORD || 'vishwak@151370';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:{
		user: GMAIL,
		pass: pass
	}
});

app.post('/sendmail',(res,req)=>{
	const mailOptions={
		from : 'cvi23csds@cmrit.ac.in',
		to : 'as23csds@cmrit.ac.in',
		subject : 'demo',
		text : 'hi this is demo email'
	}

	transporter.sendMail(mailOptions,(err,info)=>{
		if (err){
			return res.statusCode(500).send(err.toString());

		}
		res.status(200).send('email sent'+info.response);
	});
});

// Public Route for Admin
app.post('/api/admin/login', adminController.login_post);
app.get('/api/admin/login', (req, res) => {
	res.render('admin/login', { errMsg: '' });
});

// Worker Public Routes
app.post('/api/worker/register', upload.single('addharCard'), workerController.register_post);
app.get('/api/worker/register', (req, res) => {
	res.render("worker/register", {errMsg : ""})
});
app.post('/api/worker/login', workerController.login_post);
app.get('/api/worker/login', (req, res) => {
	res.render("worker/login", {errMsg : ""})
});


// Client Public Routes
app.post('/api/client/register', clientController.register_post);
app.get('/api/client/register', (req, res) => {
	res.render('client/register', { errMsg: '' });
});
app.post('/api/client/login', clientController.login_post);
app.get('/api/client/login', (req, res) => {
	res.render('client/login', { errMsg: '' });
});

// Worker Protected Routes
app.use("/api/worker/", requireWorkerAuth, workerRoutes)

// Client Protected Routes
app.use('/api/client/', requireClientAuth, clientRoutes);

// Admin Protected Routes
// app.use("/api/admin/", requireAdminAuth, adminRoutes)
app.use('/api/admin/', requireAdminAuth, adminRoutes);
