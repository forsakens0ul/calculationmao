// 使用 MongoDB Atlas 作为数据库
const { MongoClient } = require('mongodb');

// 使用专门为猫生活性价比计算器项目配置的MongoDB连接
const uri = process.env.MONGODB_URI_CAT_CALCULATOR;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await client.connect();
        const database = client.db('cat-calculator');
        const collection = database.collection('analytics');

        const { event, data } = req.body;
        const timestamp = new Date();

        await collection.insertOne({
            event,
            data,
            timestamp,
            userAgent: req.headers['user-agent'],
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            project: 'cat-calculator' // 标识项目来源
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.close();
    }
} 
