const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

//declare & enable cors (to share Api)
const cors = require('cors');
//option 1: enable CORS for all frontend domain (flexicility)
app.use(cors());
//option 2: enable CORS for specific frontend domain (security)

// var corsOptions = {
//     origin: 'http://localhost:3001', // replace with your frontend URL
//     optionSuccuressStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
//     app.use(cors(corsOptions));

//3, declare & config parser(to get data from client request)
//option 1: old version of ẽxpress => use body-parser


// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json())

//option 2: new version of express => use express parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const database = "mongodb+srv://minhlhgch230258:Csxmx6e5tBgi5ETv@cluster0.bpqrlza.mongodb.net/MindClean?retryWrites=true&w=majority&appName=Cluster0" 
mongoose.connect(database)
    .then(() => console.log("Connect to the DB success"))
    .catch((err) => console.error ("Connect fail"))

const userRoute = require("./routes/userRoute")
const streakRoute = require("./routes/streakDataRoute")
const milestoneRoute = require("./routes/milestoneReflectionsRoute")
const journalRoute = require('./routes/dailyJournalRoute');
const checklistRoute = require('./routes/dailyActivitiesChecklistRoute');

checklistRoute(app);
journalRoute(app);
milestoneRoute(app);
streakRoute(app);
userRoute(app);



app.listen(port, () => {
    console.log("http://localhost:" + port);
})