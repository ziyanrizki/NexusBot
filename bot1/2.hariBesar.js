// 1. Hari Nasional Tetap (Format Tanggal: "DD-MM")
const HARI_NASIONAL = [
    // --- JANUARI ---
    {
        tanggal: '01-01',
        judul: '🎆 SELAMAT TAHUN BARU MASEHI',
        pesan: 'Selamat Tahun Baru Masehi! Semoga tahun ini membawa semangat baru, kesehatan, keberkahan, dan deretan pencapaian luar biasa untuk kita semua.',
        warna: '#3498DB'
    },
    {
        tanggal: '03-01',
        judul: '🕌 HARI AMAL BHAKTI KEMENAG',
        pesan: 'Selamat Hari Amal Bhakti Kementerian Agama RI! Mari terus perkuat kerukunan antarumat beragama dan menjaga toleransi di Indonesia.',
        warna: '#16A085'
    },
    {
        tanggal: '10-01',
        judul: '🌱 HARI GERAKAN MENANAM POHON SEJUTA / HARI LINGKUNGAN HIDUP',
        pesan: 'Selamat Hari Gerakan Satu Juta Pohon! Mari bersama-sama menjaga kelestarian alam dan hijau bumi kita demi masa depan generasi penerus.',
        warna: '#2ECC71'
    },
    {
        tanggal: '15-01',
        judul: '⚓ HARI DHARMA SAMUDERA',
        pesan: 'Mengenang jasa para pahlawan samudra yang gugur di pertempuran Laut Arafuru demi mempertahankan kedaulatan NKRI. Hormat setinggi-tingginya!',
        warna: '#2980B9'
    },
    {
        tanggal: '25-01',
        judul: '🥗 HARI GIZI NASIONAL',
        pesan: 'Selamat Hari Gizi Nasional! Mari wujudkan generasi muda yang sehat, cerdas, dan kuat dengan pola makan gizi seimbang.',
        warna: '#2ECC71'
    },

    // --- FEBRUARI ---
    {
        tanggal: '09-02',
        judul: '📰 HARI PERS NASIONAL (HPN)',
        pesan: 'Selamat Hari Pers Nasional! Terima kasih kepada seluruh insan pers yang terus menyajikan informasi edukatif, objektif, dan terpercaya bagi masyarakat.',
        warna: '#F39C12'
    },
    {
        tanggal: '14-02',
        judul: '⚔️ HARI PERINGATAN PETA (PEMBELA TANAH AIR)',
        pesan: 'Mengenang semangat keberanian dan perjuangan Pasukan Pembela Tanah Air (PETA) di Blitar dalam merebut kemerdekaan Indonesia.',
        warna: '#7F8C8D'
    },
    {
        tanggal: '21-02',
        judul: '♻️ HARI PEDULI SAMPAH NASIONAL',
        pesan: 'Selamat Hari Peduli Sampah Nasional! Mari mulai dari diri sendiri untuk mengurangi dan mengelola sampah dengan bijak demi lingkungan yang bersih.',
        warna: '#27AE60'
    },

    // --- MARET ---
    {
        tanggal: '01-03',
        judul: '🛡️ HARI PENEGAKAN KEDAULATAN NEGARA',
        pesan: 'Memperingati Serangan Umum 1 Maret 1949. Mari teladani semangat juang para pahlawan dalam mempertahankan kedaulatan negara.',
        warna: '#8E44AD'
    },
    {
        tanggal: '09-03',
        judul: '🎵 HARI MUSIK NASIONAL',
        pesan: 'Selamat Hari Musik Nasional! Apresiasi dan dukung terus karya-karya musik anak bangsa yang memperkaya kebudayaan Indonesia.',
        warna: '#9B59B6'
    },
    {
        tanggal: '11-03',
        judul: '📄 HARI MEMPERINGATI SUPERSEMAR',
        pesan: 'Memperingati momen bersejarah Surat Perintah Sebelas Maret (Supersemar) dalam perjalanan sejarah tata negara Indonesia.',
        warna: '#34495E'
    },
    {
        tanggal: '30-03',
        judul: '🎬 HARI FILM NASIONAL',
        pesan: 'Selamat Hari Film Nasional! Bangga dan terus dukung perkembangan industri perfilman tanah air agar makin bersinar di kancah dunia.',
        warna: '#E67E22'
    },

    // --- APRIL ---
    {
        tanggal: '06-04',
        judul: '🐟 HARI NELAYAN NASIONAL',
        pesan: 'Selamat Hari Nelayan Nasional! Terima kasih tulus kepada seluruh nelayan Indonesia sebagai pahlawan pangan bahari negeri.',
        warna: '#3498DB'
    },
    {
        tanggal: '09-04',
        judul: '✈️ HARI TNI ANGKATAN UDARA',
        pesan: 'Dirgahayu TNI Angkatan Udara! Terima kasih atas pengabdian dan ketangguhan dalam menjaga kedaulatan wilayah udara Indonesia. Swa Bhuwana Paksa!',
        warna: '#2980B9'
    },
    {
        tanggal: '21-04',
        judul: '👑 HARI KARTINI',
        pesan: 'Selamat Hari Kartini! Mari terus kobarkan semangat emansipasi, pendidikan, dan inspirasi pantang menyerah demi kemajuan perempuan Indonesia.',
        warna: '#E84393'
    },
    {
        tanggal: '22-04',
        judul: '🌍 HARI BUMI (EARTH DAY)',
        pesan: 'Selamat Hari Bumi! Mari jaga dan rawat tempat tinggal kita dengan mengurangi emisi, menghemat energi, dan menjaga ekosistem alam.',
        warna: '#27AE60'
    },

    // --- MEI ---
    {
        tanggal: '01-05',
        judul: '🛠️ HARI BURUH INTERNASIONAL',
        pesan: 'Selamat Hari Buruh Internasional (May Day)! Beri apresiasi setinggi-tingginya kepada seluruh pekerja yang berjuang demi kesejahteraan dan kemajuan bangsa.',
        warna: '#E74C3C'
    },
    {
        tanggal: '02-05',
        judul: '📚 HARI PENDIDIKAN NASIONAL',
        pesan: 'Tut Wuri Handayani. Selamat Hari Pendidikan Nasional! Hormat kami kepada seluruh tenaga pendidik yang tak kenal lelah mencerdaskan kehidupan bangsa.',
        warna: '#0984E3'
    },
    {
        tanggal: '17-05',
        judul: '📖 HARI BUKU NASIONAL & PERPUSNAS',
        pesan: 'Selamat Hari Buku Nasional! Buku adalah jendela dunia, mari budayakan membaca untuk memperluas wawasan dan wawasan generasi penerus.',
        warna: '#6C5CE7'
    },
    {
        tanggal: '20-05',
        judul: '🌅 HARI KEBANGKITAN NASIONAL',
        pesan: 'Selamat Hari Kebangkitan Nasional! Bangkit Kita, Bersatu Kita. Mari satukan langkah dan persatuan untuk membawa Indonesia lebih maju.',
        warna: '#D63031'
    },

    // --- JUNI ---
    {
        tanggal: '01-06',
        judul: '📜 HARI LAHIR PANCASILA',
        pesan: 'Selamat Hari Lahir Pancasila! Mari amalkan nilai-nilai luhur Pancasila dalam kehidupan sehari-hari demi menjaga keutuhan NKRI.',
        warna: '#C0392B'
    },
    {
        tanggal: '24-06',
        judul: '🩺 HARI BIDAN NASIONAL',
        pesan: 'Selamat Hari Bidan Nasional! Terima kasih kepada seluruh bidan yang setia mendampingi dan menjaga kesehatan ibu serta anak di Indonesia.',
        warna: '#FD79A8'
    },

    // --- JULI ---
    {
        tanggal: '01-07',
        judul: '👮 HARI BHAYANGKARA (POLRI)',
        pesan: 'Selamat Hari Bhayangkara! Polri Presisi Mengabdi untuk Negeri. Terima kasih atas dedikasi dalam menjaga keamanan dan ketertiban masyarakat.',
        warna: '#2C3E50'
    },
    {
        tanggal: '12-07',
        judul: '🤝 HARI KOPERASI INDONESIA',
        pesan: 'Selamat Hari Koperasi Indonesia! Koperasi Maju, Ekonomi Rakyat Kuat. Mari tingkatkan semangat gotong royong dalam perekonomian.',
        warna: '#27AE60'
    },
    {
        tanggal: '23-07',
        judul: '🧒 HARI ANAK NASIONAL',
        pesan: 'Selamat Hari Anak Nasional! Anak Terlindungi, Indonesia Maju. Mari wujudkan lingkungan yang aman dan penuh kasih bagi tumbuh kembang anak.',
        warna: '#F1C40F'
    },

    // --- AGUSTUS ---
    {
        tanggal: '10-08',
        judul: '🎖️ HARI VETERAN NASIONAL',
        pesan: 'Hormat dan rasa terima kasih setinggi-tingginya kepada para Veteran Republik Indonesia atas pengorbanan jiwa dan raga demi merdekanya bangsa.',
        warna: '#7F8C8D'
    },
    {
        tanggal: '14-08',
        judul: '⚜️ HARI PRAMUKA',
        pesan: 'Satyaku Kudarmakan, Darmaku Kubaktikan. Selamat Hari Pramuka! Mari bentuk karakter pemuda yang mandiri, disiplin, dan berjiwa sosial tinggi.',
        warna: '#D35400'
    },
    {
        tanggal: '17-08',
        judul: '🇲🇨 HARI KEMERDEKAAN REPUBLIK INDONESIA',
        pesan: 'Dirgahayu Republik Indonesia! Pulih Lebih Cepat, Bangkit Lebih Kuat. Mari terus berkarya dan menjaga persatuan bangsa tercinta!',
        warna: '#FF0000'
    },
    {
        tanggal: '18-08',
        judul: '📜 HARI KONSTITUSI REPUBLIK INDONESIA',
        pesan: 'Memperingati pengesahan UUD 1945 sebagai fondasi hukum, kedaulatan, dan panduan berbangsa dan bernegara di Indonesia.',
        warna: '#C0392B'
    },

    // --- SEPTEMBER ---
    {
        tanggal: '09-09',
        judul: '🏆 HARI OLAHRAGA NASIONAL (HAORNAS)',
        pesan: 'Selamat Hari Olahraga Nasional! Salam Olahraga! Mari bangun pola hidup sehat dan ukir prestasi olahraga setinggi-tingginya.',
        warna: '#2980B9'
    },
    {
        tanggal: '17-09',
        judul: '🩸 HARI PALANG MERAH INDONESIA (PMI)',
        pesan: 'Siamo Tutti Fratelli! Selamat Hari Palang Merah Indonesia. Terima kasih kepada seluruh relawan kemanusiaan yang selalu setia membantu sesama.',
        warna: '#E74C3C'
    },
    {
        tanggal: '24-09',
        judul: '🌾 HARI TANI NASIONAL',
        pesan: 'Selamat Hari Tani Nasional! Hormat kami untuk para petani Indonesia sebagai penyedia pangan dan pilar ketahanan ekonomi negeri.',
        warna: '#27AE60'
    },
    {
        tanggal: '27-09',
        judul: '📮 HARI BAKTI POSTEL & KERETA API',
        pesan: 'Selamat Hari Bakti Postel & Hari Kereta Api Nasional! Terima kasih atas layanan komunikasi dan transportasi publik yang terus berkembang.',
        warna: '#E67E22'
    },

    // --- OKTOBER ---
    {
        tanggal: '01-10',
        judul: '🛡️ HARI KESAKTIAN PANCASILA',
        pesan: 'Selamat Hari Kesaktian Pancasila! Mari jadikan Pancasila sebagai benteng ideologi bangsa yang tak tergoyahkan.',
        warna: '#C0392B'
    },
    {
        tanggal: '02-10',
        judul: '🥋 HARI BATIK NASIONAL',
        pesan: 'Selamat Hari Batik Nasional! Mari pakai dan lestarikan batik warisan budaya leluhur Indonesia yang telah diakui dunia.',
        warna: '#D35400'
    },
    {
        tanggal: '05-10',
        judul: '🪖 HARI TENTARA NASIONAL INDONESIA (TNI)',
        pesan: 'Dirgahayu TNI! TNI Kuat Bersama Rakyat. Terima kasih atas pengabdian tiada henti dalam menjaga keutuhan dan kedaulatan wilayah NKRI.',
        warna: '#16A085'
    },
    {
        tanggal: '22-10',
        judul: '🕌 HARI SANTRI NASIONAL',
        pesan: 'Selamat Hari Santri Nasional! Santri Siap Siaga Jiwa Raga demi menjaga kedamaian, keutuhan bangsa, dan kemajuan negeri.',
        warna: '#27AE60'
    },
    {
        tanggal: '24-10',
        judul: '🩺 HARI DOKTER NASIONAL',
        pesan: 'Selamat Hari Dokter Nasional! Terima kasih tulus atas ketulusan, dedikasi, dan perjuangan para dokter dalam merawat serta menyembuhkan masyarakat Indonesia.',
        warna: '#2980B9'
    },
    {
        tanggal: '28-10',
        judul: '✊ HARI SUMPAH PEMUDA',
        pesan: 'Bersatu, Bangkit, dan Maju! Selamat Hari Sumpah Pemuda. Mari terus kobarkan semangat persatuan dan inovasi dalam membanggakan tanah air.',
        warna: '#E67E22'
    },

    // --- NOVEMBER ---
    {
        tanggal: '10-11',
        judul: '🎖️ HARI PAHLAWAN',
        pesan: 'Selamat Hari Pahlawan! Bangsa yang besar adalah bangsa yang menghargai jasa pahlawannya. Mari teruskan perjuangan mereka lewat karya-karya positif.',
        warna: '#C0392B'
    },
    {
        tanggal: '12-11',
        judul: '🏥 HARI KESEHATAN NASIONAL',
        pesan: 'Selamat Hari Kesehatan Nasional! Generasi Sehat, Indonesia Unggul. Mari jaga gaya hidup sehat untuk mewujudkan masyarakat yang sejahtera.',
        warna: '#2ECC71'
    },
    {
        tanggal: '25-11',
        judul: '👨‍🏫 HARI GURU NASIONAL / PGRI',
        pesan: 'Selamat Hari Guru Nasional! Hormat setinggi-tingginya kepada pahlawan tanpa tanda jasa yang telaten membimbing dan mendidik kita.',
        warna: '#F39C12'
    },

    // --- DESEMBER ---
    {
        tanggal: '13-12',
        judul: '🌊 HARI NUSANTARA',
        pesan: 'Memperingati Deklarasi Djuanda. Laut bukan pemisah, melainkan pemersatu pulau-pulau di seluruh wilayah Nusantara.',
        warna: '#2980B9'
    },
    {
        tanggal: '19-12',
        judul: '🛡️ HARI BELA NEGARA',
        pesan: 'Selamat Hari Bela Negara! Kobarkan semangat bela negara dalam peran dan profesi kita masing-masing demi kemajuan Indonesia.',
        warna: '#C0392B'
    },
    {
        tanggal: '22-12',
        judul: '👩 HARI IBU',
        pesan: 'Selamat Hari Ibu! Kasih ibu sepanjang masa. Terima kasih atas pengorbanan, doa, dan kasih sayang yang tiada tara.',
        warna: '#FD79A8'
    },
    {
        tanggal: '25-12',
        judul: '🎄 HARI RAYA NATAL',
        pesan: 'Selamat Hari Raya Natal bagi kawan-kawan yang merayakan! Semoga kedamaian, sukacita, dan kehangatan senantiasa menyertai kita semua.',
        warna: '#27AE60'
    }
];

// 2. Hari Besar Agama (Format Tanggal Spesifik: "DD-MM-YYYY")
const HARI_AGAMA = [
    // Tahun 2026
    { tanggal: '17-02-2026', judul: '🧧 SELAMAT HARI RAYA IMLEK 2577', pesan: 'Gong Xi Fa Cai! Semoga tahun ini membawa kelimpahan rezeki, kebahagiaan, dan kemakmuran.', warna: '#E74C3C' },
    { tanggal: '20-03-2026', judul: '🌙 HARI RAYA IDUL FITRI 1447 H', pesan: 'Selamat Hari Raya Idul Fitri 1447 H! Mohon maaf lahir dan batin atas segala kekhilafan.', warna: '#2ECC71' },
    { tanggal: '21-03-2026', judul: '🌙 HARI RAYA IDUL FITRI (HARI KE-2)', pesan: 'Selamat merayakan kehangatan Idul Fitri bersama keluarga tercinta!', warna: '#2ECC71' },
    { tanggal: '27-05-2026', judul: '🕋 HARI RAYA IDUL ADHA 1447 H', pesan: 'Selamat Hari Raya Idul Adha 1447 H! Semoga semangat berkurban mempererat keikhlasan dan kepedulian sosial kita.', warna: '#16A085' },
    { tanggal: '16-06-2026', judul: '🕌 TAHUN BARU HIJRIAH 1448 H', pesan: 'Selamat Tahun Baru Islam 1 Muharram 1448 H! Mari buka lembaran baru dengan niat dan amalan yang lebih baik.', warna: '#27AE60' },
    { tanggal: '25-08-2026', judul: '🕌 MAULID NABI MUHAMMAD SAW 1448 H', pesan: 'Selamat Memperingati Maulid Nabi Muhammad SAW. Mari kita meneladani akhlak mulia dan kasih sayang Rasulullah.', warna: '#16A085' },

    // Tahun 2027
    { tanggal: '06-02-2027', judul: '🧧 SELAMAT HARI RAYA IMLEK 2578', pesan: 'Gong Xi Fa Cai! Selamat merayakan Tahun Baru Imlek bersama keluarga.', warna: '#E74C3C' },
    { tanggal: '10-03-2027', judul: '🌙 HARI RAYA IDUL FITRI 1448 H', pesan: 'Selamat Hari Raya Idul Fitri 1448 H! Minta maaf lahir dan batin.', warna: '#2ECC71' },
    { tanggal: '17-05-2027', judul: '🕋 HARI RAYA IDUL ADHA 1448 H', pesan: 'Selamat Hari Raya Idul Adha 1448 H!', warna: '#16A085' }
];

module.exports = { HARI_NASIONAL, HARI_AGAMA };