const http = require('http');

// Server dummy supaya Render tau app kita tetep 'live'
http.createServer((req, res) => {
    res.write('NexusBot is running!');
    res.end();
}).listen(process.env.PORT || 3000);

require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes, 
    EmbedBuilder, 
    PermissionFlagsBits,
    MessageFlags,
    AttachmentBuilder 
} = require('discord.js');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// =========================================================
// 📁 IMPORT MODULE & HANDLER DARI FILE TERPISAH
// =========================================================
const { HARI_NASIONAL, HARI_AGAMA } = require('./2.hariBesar');
const { handleShareYoutube } = require('./3.youtubeHandler');
const { checkYoutubeUpdates } = require('./4.autoYoutube');
const { handleModeration, checkTempBans, handleAntiSpam } = require('./5.moderationHandler');
const { handleSetupRoles, handleButtonRoles } = require('./6.roleHandler');
const { handleMeme } = require('./7.memeHandler');

// Inisialisasi Client Discord Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// =========================================================
// 🖼️ HELPER MEME JUMATAN (OTOMATIS BACA FOLDER ASSETS)
// =========================================================
function buildJumatanMessage() {
    const assetsPath = path.join(__dirname, 'assets');
    
    // Baca semua nama file di dalam folder assets secara otomatis
    const files = fs.readdirSync(assetsPath).filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    if (files.length === 0) {
        throw new Error('Folder assets kosong atau tidak ada file gambar!');
    }

    // Ambil 1 file gambar secara acak dari folder
    const randomFileName = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(assetsPath, randomFileName);
    const attachment = new AttachmentBuilder(filePath, { name: randomFileName });

    const embed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle('🕌 HANYA MENGINGATKAN')
        .setDescription('Gak jumatan kah bang? Yuks siap-siap OTW masjid terdekat! 🕌✨')
        .setImage(`attachment://${randomFileName}`)
        .setFooter({ text: 'NexusBot • Pengingat Jumatan' })
        .setTimestamp();

    return { embeds: [embed], files: [attachment] };
}

// =========================================================
// 1. DAFTAR SLASH COMMANDS (REGISTER KE DISCORD API)
// =========================================================
const commands = [
    {
        name: 'ping',
        description: 'Cek respon dan latency bot',
    },
    {
        name: 'halo',
        description: 'Sapa bot NexusBot',
    },
    {
        name: 'setup-roles',
        description: 'Kirim pesan pilihan role pakai tombol (Khusus Admin)',
        default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    },
    {
        name: 'share-youtube',
        description: 'Kirim link video YouTube ke channel khusus',
        options: [
            {
                name: 'kategori',
                description: 'Pilih channel tujuan (Indonesia / Gaming)',
                type: 3,
                required: true,
                choices: [
                    { name: '🇮🇩 Indonesia', value: 'indonesia' },
                    { name: '🎮 Gaming', value: 'gaming' }
                ]
            },
            {
                name: 'url',
                description: 'Link URL Video YouTube',
                type: 3,
                required: true
            },
            {
                name: 'deskripsi',
                description: 'Pesan tambahan / deskripsi singkat video (Opsional)',
                type: 3,
                required: false
            }
        ]
    },
    {
        name: 'clear',
        description: 'Menghapus pesan massal di channel (Khusus Admin/Mod)',
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString(),
        options: [
            {
                name: 'jumlah',
                description: 'Jumlah pesan yang ingin dihapus (1-100)',
                type: 4,
                required: true
            }
        ]
    },
    {
        name: 'kick',
        description: 'Mengelegarkan member dari server (Khusus Admin/Mod)',
        default_member_permissions: PermissionFlagsBits.KickMembers.toString(),
        options: [
            {
                name: 'user',
                description: 'Member yang mau dikick',
                type: 6,
                required: true
            },
            {
                name: 'alasan',
                description: 'Alasan kick',
                type: 3,
                required: false
            }
        ]
    },
    {
        name: 'ban',
        description: 'Memblokir member dari server (Permanen/Sementara)',
        default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
        options: [
            {
                name: 'user',
                description: 'Member yang mau diban',
                type: 6,
                required: true
            },
            {
                name: 'hari',
                description: 'Lama durasi ban dalam hari (Kosongkan / Isi 0 untuk permanen)',
                type: 4,
                required: false
            },
            {
                name: 'alasan',
                description: 'Alasan ban',
                type: 3,
                required: false
            }
        ]
    },
    {
        name: 'meme',
        description: 'Mengambil foto/GIF meme acak yang kocak dari API'
    },
    {
        name: 'unban',
        description: 'Membuka blokir (unban) member menggunakan Username atau User ID (Khusus Admin/Mod)',
        default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
        options: [
            {
                name: 'userid',
                description: 'Username atau User ID Discord yang mau di-unban',
                type: 3,
                required: true
            },
            {
                name: 'alasan',
                description: 'Alasan unban',
                type: 3,
                required: false
            }
        ]
    },
    {
        name: 'timeout',
        description: 'Memberi mute sementara ke member (Khusus Admin/Mod)',
        default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
        options: [
            {
                name: 'user',
                description: 'Member yang mau dimute',
                type: 6,
                required: true
            },
            {
                name: 'menit',
                description: 'Durasi mute dalam hitungan menit',
                type: 4,
                required: true
            },
            {
                name: 'alasan',
                description: 'Alasan timeout',
                type: 3,
                required: false
            }
        ]
    },
    {
        name: 'userinfo',
        description: 'Melihat profil dan informasi detail member',
        options: [
            {
                name: 'user',
                description: 'Pilih member yang ingin dilihat infonya (Opsional)',
                type: 6,
                required: false
            }
        ]
    },
    {
        name: 'serverinfo',
        description: 'Melihat statistik dan informasi lengkap server'
    },
    {
        name: 'help',
        description: 'Menampilkan daftar perintah dan panduan penggunaan NexusBot'
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// =========================================================
// 🚀 EVENT: CLIENT READY (SAAT BOT BERHASIL ONLINE)
// =========================================================
client.once('clientReady', async () => {
    console.log(`🤖 Bot berhasil login sebagai ${client.user.tag}!`);

    try {
        console.log('Sedang mendaftarkan Slash Commands...');
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
                { body: commands },
            );
            console.log('✅ Slash Commands Server berhasil di-update!');
        } else {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log('✅ Slash Commands Global berhasil di-update!');
        }
    } catch (error) {
        console.error('Gagal mendaftarkan Slash Command:', error);
    }

    // Cron Job 1: Cek Update Video Baru YouTube Setiap 15 Menit
    cron.schedule('*/15 * * * *', async () => {
        console.log('🔄 Sedang memeriksa video baru dari YouTube...');
        await checkYoutubeUpdates(client);
    });

    // Cron Job 2: Cek & Auto-Unban Member Tempban Setiap 1 Jam
    cron.schedule('0 * * * *', async () => {
        console.log('🔍 Memeriksa daftar temporary ban...');
        await checkTempBans(client);
    });
});

// =========================================================
// 📢 CRON JOB HARIAN (UCAPAN HARI BESAR JAM 00:01 WIB)
// =========================================================
const CHANNEL_PENGUMUMAN_ID = '1508325054813962250';

cron.schedule('1 0 * * *', async () => {
    const channel = client.channels.cache.get(CHANNEL_PENGUMUMAN_ID);
    if (!channel) return;

    const options = { timeZone: 'Asia/Jakarta' };
    const now = new Date();

    const day = String(now.toLocaleDateString('en-US', { ...options, day: '2-digit' })).padStart(2, '0');
    const month = String(now.toLocaleDateString('en-US', { ...options, month: '2-digit' })).padStart(2, '0');
    const year = now.toLocaleDateString('en-US', { ...options, year: 'numeric' });

    const formatHariBulan = `${day}-${month}`;
    const formatLengkap = `${day}-${month}-${year}`;

    const eventHariIni = 
        HARI_NASIONAL.find(event => event.tanggal === formatHariBulan) ||
        HARI_AGAMA.find(event => event.tanggal === formatLengkap);

    if (eventHariIni) {
        const embed = new EmbedBuilder()
            .setColor(eventHariIni.warna || '#3498DB')
            .setTitle(eventHariIni.judul)
            .setDescription(`${eventHariIni.pesan}\n\n───────────────────────────\n*Mari kita sambut momen ini dengan penuh rasa syukur dan semangat kebersamaan!*`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: 'NexusBot • Peringatan Hari Besar', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await channel.send({ content: '@everyone', embeds: [embed] });
        console.log(`✅ Ucapan otomatis terkirim untuk: ${eventHariIni.judul}`);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});

// =========================================================
// 🕌 CRON JOB HARIAN JUMAT (MEME JUMATAN JAM 11:30 WIB)
// =========================================================
cron.schedule('30 11 * * 5', async () => {
    const channel = client.channels.cache.get(CHANNEL_PENGUMUMAN_ID);
    if (!channel) return;

    try {
        const messagePayload = buildJumatanMessage();
        await channel.send({ content: '@everyone', ...messagePayload });
        console.log('✅ Meme Jumatan otomatis terkirim!');
    } catch (err) {
        console.error('Gagal kirim meme jumatan otomatis:', err.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});

// =========================================================
// 🛡️ EVENT: MESSAGE CREATE (DETEKSI ANTI-SPAM)
// =========================================================
client.on('messageCreate', async (message) => {
    await handleAntiSpam(message);
});

// =========================================================
// ⚡ EVENT: INTERACTION CREATE (HANDLING COMMAND & BUTTON)
// =========================================================
client.on('interactionCreate', async (interaction) => {

    // 1. HANDLER SLASH COMMANDS
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'ping') {
            const ping = interaction.client.ws.ping;
            await interaction.reply({ 
                content: `🏓 Pong! Latency API adalah **${ping}ms**.`, 
                flags: MessageFlags.Ephemeral 
            });
        }
        else if (commandName === 'halo') {
            await interaction.reply(`Halo ${interaction.user.username}! Ada yang bisa NexusBot bantu?`);
        }
        else if (commandName === 'setup-roles') {
            await handleSetupRoles(interaction);
        }
        else if (commandName === 'share-youtube') {
            await handleShareYoutube(interaction);
        }
        else if (['clear', 'kick', 'ban', 'unban', 'timeout', 'userinfo', 'serverinfo'].includes(commandName)) {
            await handleModeration(interaction);
        }
        else if (commandName === 'meme') {
            await handleMeme(interaction);
        }
        else if (commandName === 'help') {
            const helpEmbed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('🤖 Panduan & Daftar Perintah NexusBot')
                .setDescription('Berikut adalah daftar perintah yang tersedia di NexusBot:')
                .addFields(
                    { 
                        name: '📌 Informasi & Utama', 
                        value: '• `/help` - Menampilkan daftar perintah ini\n• `/ping` - Cek latensi dan respon bot\n• `/userinfo` - Informasi akun pengguna\n• `/serverinfo` - Informasi server ini' 
                    },
                    { 
                        name: '🎥 YouTube Integration', 
                        value: '• `/share-youtube` - Membagikan link video YouTube ke channel khusus' 
                    },
                    { 
                        name: '🛡️ Moderasi (Khusus Admin)', 
                        value: '• `/setup-roles` - Menampilkan tombol ambil role\n• `/clear [jumlah]` - Hapus pesan secara masal\n• `/timeout [user] [durasi]` - Bisukan anggota\n• `/kick [user] [alasan]` - Keluarkan anggota\n• `/ban [user] [durasi] [alasan]` - Ban anggota (sementara/permanen)\n• `/unban [username/user_id]` - Buka ban anggota' 
                    }
                )
                .setFooter({ text: 'NexusBot • Selalu Siap Membantu!' })
                .setTimestamp();

            await interaction.reply({
                embeds: [helpEmbed],
                flags: MessageFlags.Ephemeral
            });
        }
    }

    // 2. HANDLER BUTTON ROLES
    else if (interaction.isButton()) {
        await handleButtonRoles(interaction);
    }
});

// Login Bot ke Gateway Discord
client.login(process.env.DISCORD_TOKEN);