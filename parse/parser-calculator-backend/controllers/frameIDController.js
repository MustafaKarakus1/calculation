const frameIDService = require('../services/frameIDService');

const getFrameIDs = async (req, res) => {
  try {
    const frameIDs = await frameIDService.getFrameIDs(); 
    res.json({ success: true, frameIDs }); 
  } catch (error) {
    console.error("Error fetching frame IDs:", error);
    res.status(500).json({ success: false, error: error.message }); 
  }
};

module.exports = {
  getFrameIDs,
};
