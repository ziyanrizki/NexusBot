const { EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');

// File JSON lokal untuk menyimpan daftar tempban
const BAN_FILE = path.join(__dirname, 'tempbans.json');

// Memori lokal untuk mencatat log pesan member (Anti-Spam)
const userMessageLog = new Map();

// =========================================================
// 📌 DAFTAR CHANNEL YANG DIIZINKAN BEBAS KIRIM LINK
// =========================================================
const ALLOWED_LINK_CHANNELS = [
    '1330937238057517086', // ID Channel Sosmed / Link
    '1562759855075495989', // ID Channel YouTube Share
    // Tambahkan ID Channel Musik Jockie di bawah ini:
    // 'ID_CHANNEL_MUSIK_KAMU_DI_SINI'
];

// Helper untuk membaca & menyimpan data tempban
function loadTempBans() {
    if (!fs.existsSync(BAN_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(BAN_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveTempBans(data) {
    fs.writeFileSync(BAN_FILE, JSON.stringify(data, null, 2));
}

// Helper untuk membalas interaction secara Ephemeral + Auto-Delete
async function sendEphemeralAutoDelete(interaction, contentOptions, timeMs = 5000) {
    await interaction.reply({
        ...contentOptions,
        flags: MessageFlags.Ephemeral
    });
    setTimeout(() => {
        interaction.deleteReply().catch(() => {});
    }, timeMs);
}

// =========================================================
// 🛡️ HANDLER UTAMA MODERASI & UTILITY (SLASH COMMANDS)
// =========================================================
async function handleModeration(interaction) {
    const { commandName, options, guild } = interaction;

    // A. COMMAND /clear (Hapus Pesan Massal)
    if (commandName === 'clear') {
        const amount = options.getInteger('jumlah');

        if (amount < 1 || amount > 100) {
            return sendEphemeralAutoDelete(interaction, {
                content: '❌ Jumlah pesan yang dihapus harus antara 1 sampai 100!'
            });
        }

        try {
            const deleted = await interaction.channel.bulkDelete(amount, true);
            await sendEphemeralAutoDelete(interaction, {
                content: `🧹 Berhasil menghapus **${deleted.size}** pesan!`
            });
        } catch (err) {
            console.error('Gagal hapus pesan:', err);
            await sendEphemeralAutoDelete(interaction, {
                content: '❌ Gagal menghapus pesan. (Pesan yang sudah lebih dari 14 hari tidak bisa dihapus massal oleh Discord API).'
            });
        }
    }

    // B. COMMAND /kick (Keluarkan Member)
    else if (commandName === 'kick') {
        const targetMember = options.getMember('user');
        const reason = options.getString('alasan') || 'Tidak ada alasan yang diberikan.';

        if (!targetMember) {
            return sendEphemeralAutoDelete(interaction, { content: '❌ Member tidak ditemukan di server ini!' });
        }

        if (!targetMember.kickable) {
            return sendEphemeralAutoDelete(interaction, { content: '❌ Bot tidak bisa mengeluarkannya! (Role dia mungkin lebih tinggi dari role bot).' });
        }

        try {
            await targetMember.kick(reason);
            await sendEphemeralAutoDelete(interaction, { content: `👞 **${targetMember.user.tag}** berhasil dikeluarkan dari server.\nAlasan: *${reason}*` });
        } catch (err) {
            await sendEphemeralAutoDelete(interaction, { content: '❌ Gagal mengeluarkan member.' });
        }
    }

    // C. COMMAND /ban (Blokir Member Permanen atau Sementara)
    else if (commandName === 'ban') {
        const targetUser = options.getUser('user');
        const durasiHari = options.getInteger('hari') || 0; // 0 berarti permanen
        const reason = options.getString('alasan') || 'Tidak ada alasan yang diberikan.';

        try {
            await guild.members.ban(targetUser, { reason });

            if (durasiHari > 0) {
                const unbanDate = Date.now() + durasiHari * 24 * 60 * 60 * 1000;
                const tempBans = loadTempBans();

                const updatedBans = tempBans.filter(b => !(b.userId === targetUser.id && b.guildId === guild.id));
                updatedBans.push({
                    userId: targetUser.id,
                    guildId: guild.id,
                    unbanDate: unbanDate
                });

                saveTempBans(updatedBans);

                await sendEphemeralAutoDelete(interaction, {
                    content: `🔨 **${targetUser.tag}** berhasil diblokir sementara selama **${durasiHari} hari**!\nAlasan: *${reason}*`
                });
            } else {
                await sendEphemeralAutoDelete(interaction, {
                    content: `🔨 **${targetUser.tag}** telah diblokir secara **permanen** dari server!\nAlasan: *${reason}*`
                });
            }
        } catch (err) {
            console.error('Gagal ban member:', err);
            await sendEphemeralAutoDelete(interaction, { content: '❌ Gagal memblokir member.' });
        }
    }

    // D. COMMAND /unban (Buka Blokir via User ID, Username, atau Tag)
    else if (commandName === 'unban') {
        const input = options.getString('userid').trim();
        const reason = options.getString('alasan') || 'Tidak ada alasan yang diberikan.';

        try {
            const banList = await guild.bans.fetch();

            const bannedEntry = banList.find(b => 
                b.user.id === input || 
                b.user.username.toLowerCase() === input.toLowerCase() ||
                b.user.tag.toLowerCase() === input.toLowerCase()
            );

            if (!bannedEntry) {
                return sendEphemeralAutoDelete(interaction, {
                    content: `❌ User \`${input}\` tidak ditemukan di dalam daftar banlist server ini!`
                });
            }

            await guild.members.unban(bannedEntry.user.id, reason);

            const tempBans = loadTempBans();
            const updatedBans = tempBans.filter(b => !(b.userId === bannedEntry.user.id && b.guildId === guild.id));
            saveTempBans(updatedBans);

            await sendEphemeralAutoDelete(interaction, {
                content: `🔓 **${bannedEntry.user.tag}** (\`${bannedEntry.user.id}\`) berhasil di-unban!\nAlasan: *${reason}*`
            });
        } catch (err) {
            console.error('Gagal unban user:', err);
            await sendEphemeralAutoDelete(interaction, {
                content: '❌ Gagal membuka blokir user. Pastikan Username atau ID yang dimasukkan benar!'
            });
        }
    }

    // E. COMMAND /timeout (Mute Sementara)
    else if (commandName === 'timeout') {
        const targetMember = options.getMember('user');
        const duration = options.getInteger('menit');
        const reason = options.getString('alasan') || 'Tidak ada alasan yang diberikan.';

        if (!targetMember || !targetMember.moderatable) {
            return sendEphemeralAutoDelete(interaction, { content: '❌ Bot tidak bisa memberi timeout ke member ini!' });
        }

        try {
            await targetMember.timeout(duration * 60 * 1000, reason);
            await sendEphemeralAutoDelete(interaction, { content: `🔇 **${targetMember.user.tag}** diberi timeout selama **${duration} menit**.\nAlasan: *${reason}*` });
        } catch (err) {
            await sendEphemeralAutoDelete(interaction, { content: '❌ Gagal memberikan timeout.' });
        }
    }

    // F. COMMAND /userinfo
    else if (commandName === 'userinfo') {
        const targetUser = options.getUser('user') || interaction.user;
        const targetMember = await guild.members.fetch(targetUser.id);

        const roles = targetMember.roles.cache
            .filter(r => r.name !== '@everyone')
            .map(r => r.toString())
            .join(', ') || 'Tidak ada role khusus';

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle(`👤 Info User: ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: '🆔 ID User', value: targetUser.id, inline: true },
                { name: '🏷️ Tag / Username', value: targetUser.tag, inline: true },
                { name: '📅 Akun Dibuat', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: false },
                { name: '📥 Join Server', value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>`, inline: false },
                { name: '🎭 Role', value: roles }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    // G. COMMAND /serverinfo
    else if (commandName === 'serverinfo') {
        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor('#2ECC71')
            .setTitle(`🏰 Info Server: ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '👑 Server Owner', value: owner.user.tag, inline: true },
                { name: '👥 Total Member', value: `${guild.memberCount} member`, inline: true },
                { name: '💬 Total Channel', value: `${guild.channels.cache.size} channel`, inline: true },
                { name: '📅 Dibuat Pada', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:f>`, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
}

// =========================================================
// ⏰ CHECKER AUTO-UNBAN UNTUK TEMPBAN (DIPANGGIL VIA CRON)
// =========================================================
async function checkTempBans(client) {
    const tempBans = loadTempBans();
    if (tempBans.length === 0) return;

    const now = Date.now();
    const activeBans = [];

    for (const ban of tempBans) {
        if (now >= ban.unbanDate) {
            try {
                const guild = await client.guilds.fetch(ban.guildId);
                if (guild) {
                    await guild.members.unban(ban.userId, 'Masa hukuman temporary ban telah berakhir.');
                    console.log(`🔓 Auto-Unban berhasil untuk User ID: ${ban.userId}`);
                }
            } catch (err) {
                console.error(`Gagal Auto-Unban User ID ${ban.userId}:`, err.message);
            }
        } else {
            activeBans.push(ban);
        }
    }

    if (activeBans.length !== tempBans.length) {
        saveTempBans(activeBans);
    }
}

// =========================================================
// 🛡️ HANDLER DETEKSI ANTI-SPAM (PESAN CEPAT & LINK)
// =========================================================
async function handleAntiSpam(message) {
    if (message.author.bot || !message.guild) return;

    // Abaikan jika pengirim memiliki izin ManageMessages (Admin/Moderator)
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

    const userId = message.author.id;
    const now = Date.now();

    // 1. DETEKSI SPAM LINK
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    if (linkRegex.test(message.content)) {

        // Whitelist otomatis untuk domain Musik & Sosmed populer (Bisa dikirim di mana saja)
        const isSafeLink = /(spotify\.com|youtu\.?be|soundcloud\.com|instagram\.com|tiktok\.com|twitter\.com|x\.com|facebook\.com)/i.test(message.content);

        // Jika BUKAN link safe di atas, baru hapus pesan & beri peringatan
        if (!isSafeLink) {
            try {
                await message.delete();
                const warning = await message.channel.send(`⚠️ ${message.author}, kamu tidak diizinkan mengirim link luar di channel ini!`);
                setTimeout(() => warning.delete().catch(() => {}), 3000);
                return;
            } catch (err) {
                console.error('Gagal hapus pesan link spam:', err);
            }
        }
    }

    // 2. DETEKSI SPAM CHAT CEPAT (> 5 pesan dalam 3 detik)
    if (!userMessageLog.has(userId)) {
        userMessageLog.set(userId, []);
    }

    const timestamps = userMessageLog.get(userId);
    timestamps.push(now);

    const filteredTimestamps = timestamps.filter(time => now - time < 3000);
    userMessageLog.set(userId, filteredTimestamps);

    if (filteredTimestamps.length > 5) {
        try {
            await message.delete();
            await message.member.timeout(5 * 60 * 1000, 'Terdeteksi spamming chat cepat.');

            const alertMsg = await message.channel.send(`🔇 **${message.author.tag}** telah diberi timeout **5 menit** karena terdeteksi spamming!`);
            setTimeout(() => alertMsg.delete().catch(() => {}), 3000);

            userMessageLog.delete(userId);
        } catch (err) {
            console.error('Gagal memberi sanksi anti-spam:', err);
        }
    }
}

module.exports = { handleModeration, checkTempBans, handleAntiSpam };