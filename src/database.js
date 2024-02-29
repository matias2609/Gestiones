const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://matias2609:gg7YAjB1NKoXohBK@clusterredsocial.fphcxv8.mongodb.net/")
    .then(db => console.log("DB is connected"))
    .catch(err => console.error(err));