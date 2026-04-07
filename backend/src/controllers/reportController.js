const Report = require('../models/Report');

const submitReport = async (req, res) => {
  try {
    const { reportedItemId, reportedItemType, reason, description } = req.body;

    if (!reportedItemId || !reportedItemType || !reason) {
      return res.status(400).json({ success: false, message: 'Missing required report fields.' });
    }

    const report = new Report({
      reporter: req.user._id,
      reportedItemId,
      reportedItemType,
      reason,
      description
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully.',
      data: report
    });

  } catch (error) {
    console.error('Submit Report Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit report', error: error.message });
  }
};

module.exports = {
  submitReport
};
