const Datapacks = require("../../models/Datapacks");
const Reports = require("../../models/Reports");

const fs = require("fs");

const {
    Types: { ObjectId },
} = require("mongoose");

const { checkAuthenticated, checkCanManageDatapack } = require("../../utils/auth");

const { datapackImageUpload, datapackFileUpload, datapackImageAndFileUpload } = require("../../utils/multer");
const axios = require("axios");

function generateId(req, res, next) {
    req.generatedId = new ObjectId();
    next();
}

module.exports = {
    route: "/datapack",
    execute: ({ router, nextApp }) => {
        router.post("/create", checkAuthenticated, generateId, datapackImageAndFileUpload.fields([{ name: "image", maxCount: 1}, { name: "file", maxCount: 1 }]), async (req, res) => {
            try {
                const { title, slug, description, summary, tags } = req.body;

                if (!title || !slug || !description || !summary || !tags) return res.send({ error: "Missing fields!" });

                if (await Datapacks.exists({ slug: slug.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase() })) return res.send({ error: "Slug already taken!" });

                const datapack = await Datapacks.create({
                    _id: req.generatedId,
                    title,
                    slug: slug.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase(),
                    description,
                    summary,
                    tags: JSON.parse(tags),
                    owner: req.user._id,
                    image: req.files.image > 0 ? req.files.image[0].filename : "default.png",
                    created: new Date(),
                });

                if(req.files.file) {
                    const file = req.files.file[0]
        
                    const { fileDisplayName, fileVersions } = req.body;
        
                    await Datapacks.updateOne(
                        { _id: datapack._id },
                        {
                            $push: {
                                files: {
                                    displayName: fileDisplayName,
                                    supportedVersions: JSON.parse(fileVersions),
                                    fileName: file.filename,
                                    featured: true,
                                    uploaded: new Date(),
                                },
                            },
                        }
                    );
                }

                res.sendStatus(200);

                axios.post(process.env.WEBHOOK_URL, {
                    content: null,
                    embeds: [
                        {
                            title: `${datapack.title}`,
                            description: `${datapack.summary}`,
                            url: `https://originsdatapacks.com/datapack/${datapack.slug}`,
                            color: 2197199,
                            footer: {
                                text: `${req.user.username}`,
                                icon_url: `https://originsdatapacks.com/uploads/user/${req.user.image}`,
                            },
                            thumbnail: {
                                url: `https://originsdatapacks.com/uploads/datapack/${datapack.image}`,
                            },
                        },
                    ],
                    attachments: [],
                });
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        });

        router.post("/:id/upload", checkAuthenticated, checkCanManageDatapack, datapackFileUpload.single("file"), async (req, res) => {
            const file = req.file;

            if (!file) return res.sendStatus(400);

            const { displayName, versions } = req.body;

            const datapack = await Datapacks.findByIdOrSlug(req.params.id, { _id: 1 }).lean();

            await Datapacks.updateOne(
                { _id: datapack._id },
                {
                    $push: {
                        files: {
                            displayName,
                            supportedVersions: JSON.parse(versions),
                            fileName: file.filename,
                            featured: true,
                            uploaded: new Date(),
                        },
                    },
                }
            );

            res.sendStatus(200);
        });

        router.post("/:id/edit", checkAuthenticated, checkCanManageDatapack, datapackImageUpload.single("image"), async (req, res) => {
            const id = req.params.id;

            const { title, description, summary, tags } = req.body;

            await Datapacks.updateOne({ _id: id }, { $set: { title, description, summary, tags: JSON.parse(tags) } });

            if (req.file) await Datapacks.updateOne({ _id: id }, { $set: { image: req.file.filename } });

            res.sendStatus(200);
        });

        router.post("/:id/like", checkAuthenticated, async (req, res) => {
            const id = req.params.id;

            const datapack = await Datapacks.findById(id);

            if (!datapack) return res.sendStatus(404);

            if (datapack.likes.includes(req.user._id)) {
                await Datapacks.updateOne({ _id: id }, { $pull: { likes: req.user._id } });

                return res.send({ liked: false });
            }

            await Datapacks.updateOne({ _id: id }, { $push: { likes: req.user._id } });

            res.send({ liked: true });
        });

        router.delete(`/:id/file/:fileId`, checkAuthenticated, checkCanManageDatapack, async (req, res) => {
            const { id, fileId } = req.params;

            const datapack = await Datapacks.findByIdOrSlug(id).lean();

            const file = datapack.files.find((f) => f._id.toString() === fileId);

            if (!file) return res.sendStatus(404);

            await Datapacks.updateOne({ _id: id }, { $pull: { files: { _id: file._id } } });

            fs.rmSync(`./public/uploads/files/${datapack._id}/${file.fileName}`);

            res.sendStatus(200);
        });

        router.delete("/:id", checkAuthenticated, checkCanManageDatapack, async (req, res) => {
            try {
                const datapack = await Datapacks.findByIdOrSlug(req.params.id);

                if (!datapack) return res.sendStatus(404);

                if (datapack.deleted) {
                    await datapack.unDelete();
                } else {
                    await datapack.softDelete();
                }

                res.sendStatus(200);
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        });

        router.post("/:id/report", checkAuthenticated, async (req, res) => {
            try {
                const { id } = req.params;
                const { reason, description } = req.body;

                if (!reason || !description) return res.sendStatus(400);

                const datapack = await Datapacks.findByIdOrSlug(id);

                if (!datapack) return res.sendStatus(404);

                await Reports.create({
                    reporter: req.user._id,
                    datapack: datapack._id,
                    reason,
                    description,
                });

                res.send({ success: true });
            } catch (e) {
                res.sendStatus(500);
            }
        });

        /*
        router.get('/datapack/:id', async (req, res) => {
            const idOrSlug = req.params.id;

            const datapack = await Datapacks.findOne(isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug }).lean();

            if(!datapack) return res.sendStatus(404)

            datapack.id = datapack._id.toString();
            delete(datapack._id)


            datapack.userLiked = datapack.likes.includes(req?.user?.id)
            datapack.likes = datapack.likes.length

            datapack.owner = await Users.findById(datapack.owner, { username: 1, image: 1, _id: 0 }).lean()

            res.send(datapack)
        })
        */
    },
};
