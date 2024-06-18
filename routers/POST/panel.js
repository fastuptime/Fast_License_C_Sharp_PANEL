module.exports = function() {
    app.post('/create_script', async (req, res) => {
        let {
            name
        } = req.body;

        if(!name) return res.redirect('/create_script?error=true&message=Script adı boş bırakılamaz.');

        new scripts({
            name: name,
        }).save();

        log(`${res.locals.user.username} adlı yetkili ${name} adlı scripti oluşturdu.`.yellow);

        res.redirect('/panel?success=true&message=Script başarıyla oluşturuldu.');
    });

    app.post('/create_license', async (req, res) => {
        let {
            ip,
            script,
            expire,
            owner_name,
            owner_surname,
            owner_mail,
            owner_phone,
            owner_note
        } = req.body;

        if(!ip || !script || !expire || !owner_name || !owner_surname || !owner_mail || !owner_phone || !owner_note) return res.redirect('/create_license?error=true&message=Tüm alanları doldurunuz.');

        if(ip.length < 7) return res.redirect('/create_license?error=true&message=Geçersiz ip adresi.');
        
        let ip_check = await licenses.findOne({ ip: ip });
        if(ip_check) return res.redirect('/create_license?error=true&message=ip zaten kayıtlı.');

        let script_check = await scripts.findOne({ _id: script });
        if(!script_check) return res.redirect('/create_license?error=true&message=Script bulunamadı.');

        let randomStr = function(l) { let r = ''; let x = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; for (let i = 0; i < l; i++) { r += x.charAt(Math.floor(Math.random() * x.length)); } return r; };

        let key = randomStr(32);
        new licenses({
            ip: ip,
            key,
            script,
            owner: {
                mail: owner_mail,
                name: owner_name,
                surname: owner_surname,
                phone: owner_phone,
                note: owner_note,
            },
            expire: expire,
        }).save();

        log(`${res.locals.user.username} adlı yetkili ${ip} adlı ip için ${script} adlı script için lisans oluşturdu. Son kullanma tarihi: ${expire}`.yellow);

        res.redirect(`/panel?success=true&message=Lisans başarıyla oluşturuldu. Lisans anahtarı: ${key}`);
    });

    //edit_license/:id
    app.post('/edit_license/:id', async (req, res) => {
        let {
            ip,
            script,
            expire,
            owner_name,
            owner_surname,
            owner_mail,
            owner_phone,
            owner_note
        } = req.body;

        if(!ip || !script || !expire || !owner_name || !owner_surname || !owner_mail || !owner_phone || !owner_note) return res.redirect('/edit_license/' + req.params.id + '?error=true&message=Tüm alanları doldurunuz.');

        if(ip.length < 7) return res.redirect('/edit_license/' + req.params.id + '?error=true&message=Geçersiz ip adresi.');
        
        let ip_check = await licenses.findOne({ ip: ip });
        if(ip_check) return res.redirect('/edit_license/' + req.params.id + '?error=true&message=ip zaten kayıtlı.');

        let script_check = await scripts.findOne({ _id: script });
        if(!script_check) return res.redirect('/edit_license/' + req.params.id + '?error=true&message=Script bulunamadı.');

        let license = await licenses.findOne({ _id: req.params.id });
        if(!license) return res.redirect('/edit_license/' + req.params.id + '?error=true&message=Lisans bulunamadı.');

        license.ip = ip;
        license.script = script;
        license.expire = expire;
        license.owner = {
            mail: owner_mail,
            name: owner_name,
            surname: owner_surname,
            phone: owner_phone,
            note: owner_note,
        };
        license.save();

        log(`${res.locals.user.username} adlı yetkili ${ip} adlı ip için ${script} adlı script için lisans düzenledi. Son kullanma tarihi: ${expire}`.yellow);

        res.redirect(`/panel?success=true&message=Lisans başarıyla düzenlendi.`);
    });

    app.post('/', async (req, res) => {
        let {
            search,
            script,
        } = req.body;

        if(!search) return res.redirect('/?error=true&message=Lisans anahtarı boş bırakılamaz.');
        if(!script) return res.redirect('/?error=true&message=Script boş bırakılamaz.');
        if(script.length != 24) return res.redirect('/?error=true&message=Geçersiz script.');

        let license = await licenses.findOne({ key: search, script: script });
        if(!license) {
            log(`${search} adlı key için ${script} adlı script için lisans bulunamadı.`.red);
            let checkReport = await reports.findOne({ ip: search, script: script, status: 'Görülmedi' });
            if(!checkReport) {
                new reports({
                    key: search,
                    ip: req.ip,
                    script: script,
                }).save();
            }
            res.redirect('/?error=true&message=Lisans geçersiz.');
            return;
        }

        if(license.status == 'inactive') return res.redirect('/?error=true&message=Lisans aktif değil.');
        if(moment(license.expire).isBefore(moment())) return res.redirect('/?error=true&message=Lisans süresi dolmuş.');
        if(license.status == 'active') return res.redirect('/?success=true&message=Lisans geçerli.');
        if(license.status == 'expired') return res.redirect('/?error=true&message=Lisans süresi dolmuş.');

        res.redirect('/?error=true&message=Bilinmeyen bir hata oluştu.');
    });

    app.post('/license_check', async (req, res) => {
        let {
            script,
            ip
        } = req.body;

        if(!script) return res.redirect('/license_check?error=true&message=Script boş bırakılamaz.');
        if(!ip) return res.redirect('/license_check?error=true&message=ip boş bırakılamaz.');

        let license = await licenses.findOne({ $or: [{ ip: ip }, { key: ip }], script: script });
        if(!license) return res.redirect('/license_check?error=true&message=Lisans bulunamadı.');

        log(`${res.locals.user.username} adlı yetkili ${ip} adlı ip için ${script} adlı script için lisans kontrol etti.`.yellow);

        res.json({
            data: license,
        });
    });
};