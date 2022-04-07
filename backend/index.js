const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const imagesRoutes = require("./routes/images-routes");
const usersRoutes = require("./routes/users-routes");
const uploadsRoutes = require("./routes/uploads-routes");
const healthCheckRoutes = require("./routes/healthcheck-routes");
const deploymentRoutes = require("./routes/deployment-routes");
const legacyRoutes = require("./routes/legacy-routes");
const http = require("http");

const HttpErrors = require("./middleware/http-errors");
const { header } = require("express-validator");
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join("public/build")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/images", imagesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/", healthCheckRoutes);
app.use("/", legacyRoutes);
app.use("/", deploymentRoutes);

app.use((req, res, next) => {
    const error = new HttpErrors("Could not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {});
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

//const mongoURL = "mongodb://tprokop-win3:27017,tprokop-win3:27018,tprokop-win3:27019/domel?replicaSet=rs";
//const useUnifiedTopology = true;
const mongoURL = "mongodb+srv://99foto:99foto@cluster0-9qo5l.mongodb.net/99fotopl?retryWrites=true&w=majority";
const useUnifiedTopology = true;

mongoose.set("useCreateIndex", true);
mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: useUnifiedTopology })
    .then(() => {

        const httpServer = http.createServer(app);
       
        httpServer.listen(5000, () => {
            console.log('HTTP Server running on port 5000');
        });       
    })
    .catch((err) => {});
