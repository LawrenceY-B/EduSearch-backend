const sch = require('../models/schoolModel');
const fav = require('../models/fav.model');
const { validateSchool, validateFav } = require("../services/school.service");

const AddNewSchool = async (req, res) => {

    try {
        const { error } = validateSchool(req.body);
        if (error)
            return res
                .status(400)
                .json({ success: false, message: error.details[0].message });
        let schoolName = req.body.name
        const school = await sch.find({ name: schoolName });
        if (school.length === 1)
            return res
                .status(403)
                .json({ success: false, message: "School already exists" });
        const result = sch.create({
            name: req.body.name,
            curriculum: req.body.curriculum,
            level: req.body.level,
            size: req.body.size,
            price: req.body.price,
            Location: req.body.location,
            Rating: req.body.rating,
            ImgUrl: req.body.ImgUrl,
            isSaved: false,
        });
        if (result) {
            return res.status(200).json({ succcess: true, message: "School has been succesfully added" })
        }
        else {
            return res.status(400).json({ succcess: false, message: "Couldn't add school" })
        }
    }
    catch (e) {
        return res.status(400).json({ success: false, message: "Something wrong happened here" })
    }
};

const AddFavorite = async (req, res) => {
    try {
        const { error } = validateFav(req.body)
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message })
        // let schoolName = req.body.name
        // const school = await sch.find({ name: schoolName }, (err, User) => { console.log(err) });
        // if (school.length === 1)
        //     return res
        //         .status(403)
        //         .json({ success: false, message: "School already exists in favorite" });
        const NewFav = fav.create({
            name: req.body.name,
            Location: req.body.location,
            Rating: req.body.rating,
            ImgUrl: req.body.ImgUrl,
            isSaved: false,
        })

        if (NewFav) {
            return res
                .status(200)
                .json({ succcess: true, message: "School has been added to favourites" });
        }
        else {
            return res
                .status(400)
                .json({ succcess: false, message: "Couldn't add school to favorites" })

        }

    } catch (e) {
        return res.status(400).json({ success: false, message: "Oops! Something went wrong" })
    }
};

const DeleteFavorite = async (req, res) => {
    try {
        const { error } = validateFav(req.body)
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message })
        const Schname = req.body.name
        const school = await sch.find({ name: Schname });
        if (school.length !== 1) {
            AddFavorite(req.body)
            return res.status(400).json({
                success: false, message: "School not available"
            })
        }
        fav.findOneAndDelete({ name: Schname }, (err, deletedUser) => {
            if (err) {
                res.status(400).json({ success: false, message: "Couldn't delete" })
            } else {
                res.status(200).json({ success: true, message: `Deleted user: ${deletedUser}` });
            }
        })



    } catch (e) {
        return res.status(400).json({ success: false, message: "Oops! Something went wrong" })

    }
};
module.exports = {
    AddNewSchool,
    AddFavorite,
    DeleteFavorite
};