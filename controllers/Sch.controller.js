const sch = require('../models/schoolModel');
const { validateSchool } = require("../services/auth.services");

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
module.exports = AddNewSchool;