const cron = require("node-cron");
const Datapacks = require("../models/Datapacks");

module.exports = () => {
    cron.schedule("0 0 * * *", () => {
        Datapacks.find({ deleted: true }).then((result) => {
            for (const datapack of result) {
                if (datapack.deletedAt.getTime() < Date.now() - 2592000000) {
                    datapack.delete();
                }
            }
        });
    });
};
