const FrameID = require('../models/FrameIDModel');


const getFrameIDs = async () => {
  try {
    const frameIDs = await FrameID.find(); 
    console.log('qweqwe', frameIDs)
    return frameIDs.map(frame => frame.frameId); 
  } catch (error) {
    throw new Error("Veritabanından frameID'leri alırken bir hata oluştu.");
  }
};

module.exports = {
  getFrameIDs,
};
