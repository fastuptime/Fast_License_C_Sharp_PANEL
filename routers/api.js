module.exports = function() {
    app.post('/api/v1', async (req, res) => {
        let {
            ip,
            key,
            action,
            computerName,
            processorName,
            osName,
            diskName,
            localIP,
            script,
        } = req.body;

        if(!ip || !key || !action || !computerName || !processorName || !osName || !diskName || !localIP || !script) return res.json({ status: "error", message: "Tüm alanları doldurunuz." });

        let license = await licenses.findOne({ key: key });
        if(!license) return res.json({ status: "error", message: "Lisans bulunamadı." });
        if(license.ip != ip) return res.json({ status: "error", message: "Lisans ip adresi uyuşmuyor." });


        license.logs.push({ computerName, processorName, osName, diskName, localIP, action, date: moment().format('YYYY-MM-DD HH:mm:ss') });

        license.ip = ip;

        license.connected_device = {
            computerName: computerName,
            processorName: processorName,
            osName: osName,
            diskName: diskName,
            localIP: localIP,
        };

        await license.save();

        switch(action) {
            case "check":
                if(license.status == "active") return res.json({ status: "success", message: "Lisans aktif." });
                if(license.status == "inactive") return res.json({ status: "error", message: "Lisans pasif." });
                if(license.status == "expired") return res.json({ status: "error", message: "Lisans süresi dolmuş." });
                break;
            case "expire_date":
                return res.json({ status: "success", date: license.expire });
                break;
            case "owner":
                return res.json({ status: "success", owner: license.owner });
                break;
            default:
                return res.json({ status: "error", message: "Geçersiz işlem. İşlemler: check, expire_date, owner" });
                break;
        }
    });
};