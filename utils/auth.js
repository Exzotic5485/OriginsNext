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

module.exports = { checkNotAuthenticated, checkAuthenticated, checkCanManageDatapack }