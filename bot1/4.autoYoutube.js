const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

// =========================================================
// 📺 DAFTAR CHANNEL YOUTUBE & TARGET DISCORD
// =========================================================
const MONITORED_CHANNELS = [
    // 🎮 CHANNEL GAMING (Target ke Channel Discord Gaming: 1561397100065980436)
    {
        nama: 'MPL Indonesia',
        channelId: 'UC1dGHGJTXU_dkiR8tW3qQgg',
        discordChannelId: '1562761073172545586',
        lastVideoId: null
    },
    {
        nama: 'Angga Mzrbest',
        channelId: 'UC1mwKq8Y2ELWAT9ol0EH-wQ', // Ganti dengan Channel ID YT Gaming 2
        discordChannelId: '1562761073172545586',
        lastVideoId: null
    },
    {
        nama: 'Ozikoto',
        channelId: 'UCoOG3nAwRsKxugOJI5PDhiw', // Ganti dengan Channel ID YT Gaming 3
        discordChannelId: '1562761073172545586',
        lastVideoId: null
    },
    {
        nama: 'MiawAug',
        channelId: 'UC3J4Q1grz46bdJ7NJLd4DGw', // Ganti dengan Channel ID YT Gaming 4
        discordChannelId: '1562761073172545586',
        lastVideoId: null
    },

    // 📰 CHANNEL BERITA POLITIK (Target ke Channel Discord Berita/Politik)
    {
        nama: 'Hitzed',
        channelId: 'UCwkENmicRJCqD21NOin6E8A', // Ganti dengan Channel ID YT Politik 1
        discordChannelId: '1562759808547950592', // Ganti dengan ID Channel Discord Berita
        lastVideoId: null
    },
    {
        nama: 'Kok Bisa?',
        channelId: 'UCu0yQD7NFMyLu_-TmKa4Hqg', // Ganti dengan Channel ID YT Politik 2
        discordChannelId: '1562759808547950592', // Ganti dengan ID Channel Discord Berita
        lastVideoId: null
    }
];

async function checkYoutubeUpdates(client) {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        console.error('⚠️ YOUTUBE_API_KEY belum dipasang di file .env!');
        return;
    }

    for (const channelData of MONITORED_CHANNELS) {
        // Lewati jika Channel ID belum diisi dengan benar
        if (channelData.channelId.startsWith('UC_ISI_ID')) continue;

        try {
            // Ubah UC ke UU untuk mengambil Playlist Uploads resmi (Hemat kuota: 1 unit)
            const uploadsPlaylistId = channelData.channelId.replace(/^UC/, 'UU');
            const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=1`;

            const response = await axios.get(url, { timeout: 10000 });

            if (response.data && response.data.items && response.data.items.length > 0) {
                const latestSnippet = response.data.items[0].snippet;
                const videoId = latestSnippet.resourceId.videoId;

                // Jika terdeteksi video baru yang berbeda dari histori terakhir
                if (channelData.lastVideoId !== videoId) {
                    // Hanya kirim notifikasi jika bukan inisialisasi awal (bot baru nyala)
                    if (channelData.lastVideoId !== null) {
                        const discordChannel = client.channels.cache.get(channelData.discordChannelId);
                        if (discordChannel) {
                            const embed = new EmbedBuilder()
                                .setColor('#FF0000')
                                .setTitle(`📹 Video Baru dari ${channelData.nama}!`)
                                .setDescription(`**[${latestSnippet.title}](https://www.youtube.com/watch?v=${videoId})**`)
                                .setImage(latestSnippet.thumbnails?.high?.url || latestSnippet.thumbnails?.medium?.url)
                                .setFooter({ text: 'NexusBot • YouTube Auto Notifier' })
                                .setTimestamp();

                            await discordChannel.send({
                                content: `📢 **${channelData.nama}** baru saja mengunggah video baru! @everyone`,
                                embeds: [embed]
                            });
                            console.log(`✅ Notifikasi video baru terkirim untuk: ${channelData.nama}`);
                        }
                    }
                    // Simpan ID video terbaru ke dalam memori
                    channelData.lastVideoId = videoId;
                }
            }
        } catch (error) {
            console.error(`⚠️ Gagal mengambil update YouTube untuk ${channelData.nama}: ${error.message}`);
        }
    }
}

module.exports = { checkYoutubeUpdates };