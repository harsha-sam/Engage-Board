const { Message } = require('../models');

module.exports.createMessage = async (sender_id, receiver_id, channel_id, content) => {
  return Message.create({
    sender_id,
    receiver_id,
    channel_id,
    content
  })
}

module.exports.deleteMessage = async (id) => {
  return Message.destroy({
    where: {
      id
    }
  })
}

module.exports.editMessage = async (id, newContent) => {
  return Message.update({ content: newContent }, {
    where: {
      id
    },
    individualHooks: true,
    returning: true
  })
}

module.exports.formatMessagesResponse = (messages) => {
  // formatting as required by the client
  let response = messages.map((msg) => {
    let reactions = {}
    msg.reactions.forEach((r) => {
      if (r.reaction in reactions)
        reactions[r.reaction].push(r.user)
      else reactions[r.reaction] = [r.user]
    })
    return {
      id: msg.id,
      sender: msg.sender,
      receiver_id: msg.receiver_id,
      channel_id: msg.channel_id,
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      reactions: Object.keys(reactions).map((element) => {
        return {
          key: element,
          title: element,
          users: reactions[element],
          count: reactions[element].length
        }
      })
    }
  })
  return response;
}