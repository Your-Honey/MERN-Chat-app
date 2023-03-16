export const getSender = (user, chats) => {
  const sender = chats.filter((chat) => chat._id !== user._id);
  return sender[0].name;
};

export const getSenderFull = (user, chats) => {
  const sender = chats.filter((chat) => chat._id !== user._id);
  return sender[0];
};
