module.exports = function() {
    app.get('/panel', async (req, res) => {
        res.render('panel/pages/license.ejs', {
            page_name: 'Panel',
            licenses: await licenses.find({}).sort({ _id: -1 }),
            scripts: await scripts.find({}).sort({ _id: -1 }),
        });
    });

    app.get('/edit_license/:id', async (req, res) => {
        if(req.params.id.length != 24) return res.redirect('/panel?error=true&message=Geçersiz lisans.');
        let license = await licenses.findOne({ _id: req.params.id });
        if(!license) return res.redirect('/panel?error=true&message=Geçersiz lisans.');

        res.render('panel/pages/edit_license.ejs', {
            page_name: 'Lisans Düzenle',
            license: license,
            scripts: await scripts.find({}).sort({ _id: -1 }),
        });
    });

    app.get('/panel_license_info/:id/:action', async (req, res) => {
        if(req.params.id.length != 24) return res.redirect('/panel?error=true&message=Geçersiz lisans.');
        if(!req.params.action) return res.redirect('/panel?error=true&message=Geçersiz işlem.');
        
        let license = await licenses.findOne({ _id: req.params.id });
        if(!license) return res.redirect('/panel?error=true&message=Geçersiz lisans.');

        log(`${res.locals.user.username} adlı yetkili ${license.key} lisansındaki ${req.params.action} bilgilerini görüntüledi.`.yellow);

        switch(req.params.action) {
            case "info":
                return res.json({
                    status: "success",
                    license: license,
                });
                break;
            case "logs":
                return res.json({
                    status: "success",
                    logs: license.logs,
                });
                break;
            case "connected_device":
                return res.json({
                    status: "success",
                    connected_device: license.connected_device,
                });
                break;
            default:
                return res.redirect('/panel?error=true&message=Geçersiz işlem.');
                break;
        }
    });

    app.get('/create_license', async (req, res) => {
        res.render('panel/pages/create_license.ejs', {
            page_name: 'Lisans Oluştur',
            scripts: await scripts.find({}).sort({ _id: -1 }),
        });
    });

    app.get('/create_script', async (req, res) => {
        res.render('panel/pages/create_script.ejs', {
            page_name: 'Script Oluştur'
        });
    });

    app.get('/reports', async (req, res) => {
        res.render('panel/pages/reports.ejs', {
            page_name: 'İhbarlar',
            reports: await reports.find({}).sort({ _id: -1 }),
        });
    });

    app.get('/report/:id', async (req, res) => {
        if(req.params.id.length != 24) return res.redirect('/reports?error=true&message=Geçersiz ihbar.');
        let report = await reports.findOne({ _id: req.params.id });
        if(!report) return res.redirect('/reports?error=true&message=Geçersiz ihbar.');

        log(`${res.locals.user.username} adlı yetkili ${report.ip} adlı ip için ${report.script} adlı script için ihbarın durumunu değiştirdi.`.yellow);
        
        report.status = "İncelendi";
        report.save();

        res.redirect('/reports?success=true&message=İhbarın durumu başarıyla değiştirildi.');
    });

    app.get('/license_check', async (req, res) => {
        res.render('panel/pages/license_check.ejs', {
            page_name: 'Lisans Kontrol',
            scripts: await scripts.find({}).sort({ _id: -1 }),
        });
    });

    app.get('/panel_license_deactivate/:id', async (req, res) => {
        if(req.params.id.length != 24) return res.redirect('/panel?error=true&message=Geçersiz lisans.');
        let license = await licenses.findOne({ _id: req.params.id });
        if(!license) return res.redirect('/panel?error=true&message=Geçersiz lisans.');

        log(`${res.locals.user.username} adlı yetkili ${license.key} lisansını deaktif etti.`.yellow);

        license.status = "inactive";
        license.save();

        res.redirect('/panel?success=true&message=Lisans başarıyla deaktif edildi.');
    });

    app.get('/panel_license_activate/:id', async (req, res) => {
        if(req.params.id.length != 24) return res.redirect('/panel?error=true&message=Geçersiz lisans.');
        let license = await licenses.findOne({ _id: req.params.id });
        if(!license) return res.redirect('/panel?error=true&message=Geçersiz lisans.');

        log(`${res.locals.user.username} adlı yetkili ${license.key} lisansını aktif etti.`.yellow);

        license.status = "active";
        license.expire = moment(license.expire, 'YYYY-MM-DD').add(1, 'months').format('YYYY-MM-DD');
        license.save();

        res.redirect('/panel?success=true&message=Lisans başarıyla aktif edildi.');
    });
};