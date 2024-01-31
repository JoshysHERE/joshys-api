const { Thought } = require('../models');
const User = require('../models/User');

module.exports = {

  getUsers(req, res) {
    User.find({})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(500).json(err));
  },
  
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .populate("thoughts")
    .populate("friends")
    .select("-__v")
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: "No user found" });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(500).json(err));
  },
  
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch(err => res.status(500).json(err));
  },


  updateOneUser({ params, body }, res)  {
    User.findOneAndUpdate({ _id: params.userId }, body, { runValidators: true })
    .then((dbUserData) => {
      if(!dbUserData) {
        res.status(404).json({ message: "No user found" });
        return;
      }
      res.json (dbUserData);
    })
    .catch(err => res.status(500).json(err));  
  },

  deleteOneUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json ({ message: "No user found" });
        return;
      }
      User.updateMany({ _id: { $in: dbUserData.friends }},
        { $pull: { friends: params.id } }
    )
    .then(() => {
      Thought.deleteMany({ username: dbUserData.username }) 
    .then(() => {
      res.json({ message: "Deleted user, friend(s) and thought(s)" });
    })
    .catch(err => res.status(500).json(err));
    }) 
    .catch(err => res.status(500).json(err));    
    })
    .catch(err => res.status(500).json(err));
  },

  
  addFriend(req, res) {

    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId }},
      { new: true, runValidators: true }
    ) 
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: "No user found" })
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(500).json(err));
  },

  deleteFriend({ params}, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId }},
      { new: true, runValidators: true }
      )
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: "No user found" });
        return;
      }
      res.json(dbUserData);
    })
      .catch(err => res.status(500).json(err))
    },
};