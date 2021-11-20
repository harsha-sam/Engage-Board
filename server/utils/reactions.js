const { Reaction } = require('../models');

module.exports.createReaction = async (message_id, user_id, reaction) => {
  let reactions = await Reaction.findAll({
    where: {
      message_id,
      user_id,
      reaction
    }
  })
  if (reactions.length) {
    await this.deleteReaction(message_id, user_id, reaction)
  }
  else {
    return Reaction.create({
      message_id,
      user_id,
      reaction
    })
  }
}

module.exports.deleteReaction = async (message_id, user_id, reaction) => {
  return Reaction.destroy({
    where: {
      message_id,
      user_id,
      reaction,
    }
  })
}