const Datapacks = require('../models/Datapacks')

const { isValidObjectId } = require('mongoose')

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect(`/`)
    }

    next()
}

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect(`/auth/login`)
}

function checkCanManageDatapack(req, res, next) {
    const idOrSlug = req.params.id;

    if(req?.user?.moderator) return next()

    Datapacks.findByIdOrSlug(idOrSlug).then((result) => {
        if(!result) {
            return res.redirect('/datapacks')
        }

        if(result.owner.equals(req.user._id)) return next()

        res.sendStatus(403)
    }).catch(e => {
        res.sendStatus(403)
    })
}

function checkCanManageProfile(req, res, next) {
    if(!req.user) return;

    if(req?.user?.moderator || req.params.id == req.user._id) return next()
}

function checkIsModerator(req, res, next) {
    if(!req.user || !req?.user?.moderator) return res.sendStatus(403)

    next()
}

function checkNotDeleted(req, res, next) {
    const idOrSlug = req.params.id;

    Datapacks.findByIdOrSlug(idOrSlug).then((result) => {
        if(!result) {
            return res.sendStatus(404)
        }

        if(!result.deleted || req?.user?.moderator) return next();
        res.sendStatus(404)
    }).catch(e => {
        res.sendStatus(404)
    })
}

module.exports = { checkNotAuthenticated, checkAuthenticated, checkCanManageDatapack, checkCanManageProfile, checkIsModerator, checkNotDeleted }