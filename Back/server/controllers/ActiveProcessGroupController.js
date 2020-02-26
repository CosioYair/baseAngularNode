const ActiveProcessGroup = require('../models').ActiveProcessGroup;
const SharedController = require('./SharedController');

ActiveProcessGroupController = {
    index(req, res) {
        return ActiveProcessGroup.findAndCountAll()
            .then(activeProcessGroups => res.status(200).send({ ActiveProcessGroups: activeProcessGroups }))
            .catch(error => res.status(400).send(error));
    },

    show(req, res) {

    },

    create(req, res) {

    },

    update(req, res) {

    },

    delete(req, res) {

    },

    async finish(req, res) {
        const oid = req.params.Oid;
        let activeProcessGroup = await ActiveProcessGroup.findOne({ where: { Oid: oid } });
        if (activeProcessGroup) {
            activeProcessGroup = await activeProcessGroup.finish();
            return res.json({ ActiveProcessGroup: activeProcessGroup });
        }
        res.status(500).send("Invalid active process group");
    }
};

module.exports = ActiveProcessGroupController;