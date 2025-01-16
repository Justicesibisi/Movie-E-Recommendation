const TorrentsAPI = require('torrents-api');

const searchTorrents = async (req, res) => {
  const { query } = req.body;

  try {
    const torrents = await TorrentsAPI.search(query);
    return res.status(200).json({ torrents });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to search torrents.' });
  }
};

module.exports = searchTorrents;
