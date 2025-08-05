const express = require('express');
const app = express();
const port = 4000;
// process.env.PORT ||
//declare & enable cors (to share Api)
const cors = require('cors');
//enable CORS for all frontend domain (flexicility)
app.use(cors());
//new version of express => use express parser////mongodb+srv://minhlhgch230258:Csxmx6e5tBgi5ETv@cluster0.bpqrlza.mongodb.net/MindClean?retryWrites=true&w=majority&appName=Cluster0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const database = "mongodb://localhost:27017/MindClean"; 
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