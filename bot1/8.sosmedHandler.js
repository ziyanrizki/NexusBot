const { EmbedBuilder, MessageFlags } = require('discord.js');

const SOSMED_CHANNEL_ID = '1330937238057517086'; // ID channel sosmed kamu[cite: 10]

async function handleShareSosmed(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral }); //[cite: 10]

    const platform = interaction.options.getString('platform'); //[cite: 10]
    let url = interaction.options.getString('url'); //[cite: 10]
    const deskripsi = interaction.options.getString('deskripsi') || 'Nih ada konten sosmed menarik!'; //[cite: 10]

    const targetChannel = interaction.guild.channels.cache.get(SOSMED_CHANNEL_ID); //[cite: 10]

    if (!targetChannel) { //[cite: 10]
        const reply = await interaction.editReply({ //[cite: 10]
            content: '❌ Channel untuk share sosmed tidak ditemukan!' //[cite: 10]
        });
        setTimeout(() => interaction.deleteReply().catch(() => {}), 5000); //[cite: 10]
        return reply; //[cite: 10]
    }

    const colors = { //[cite: 10]
        'instagram': '#E1306C', //[cite: 10]
        'tiktok': '#000000', //[cite: 10]
        'twitter': '#1DA1F2', //[cite: 10]
        'facebook': '#1877F2', //[cite: 10]
        'lainnya': '#9B59B6' //[cite: 10]
    };

    // Bersihkan link dari tracking parameter (?utm_source=...)
    const cleanUrl = url.split('?')[0]; //[cite: 10]

    const sosmedEmbed = new EmbedBuilder() //[cite: 10]
        .setColor(colors[platform] || '#9B59B6') //[cite: 10]
        .setTitle(`📱 Konten Baru [${platform.toUpperCase()}]`) //[cite: 10]
        .addFields( //[cite: 10]
            { name: '📝 Catatan:', value: deskripsi }, //[cite: 10]
            { name: '🔗 Link Original:', value: `[Klik di sini untuk membuka](${cleanUrl})` } //[cite: 10]
        )
        .setFooter({ text: `Dibagikan oleh: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }) //[cite: 10]
        .setTimestamp(); //[cite: 10]

    // LOGIKA EXTRACTION THUMBNAIL PER PLATFORM
    if (platform === 'instagram' && cleanUrl.includes('instagram.com')) { //[cite: 10]
        const match = cleanUrl.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/); //
        if (match && match[1]) { //
            sosmedEmbed.setImage(`https://ddinstagram.com/images/share/${match[1]}.jpg`); //
        }
    } else if (platform === 'tiktok' && cleanUrl.includes('tiktok.com')) {
        // Trik vxtiktok generator thumbnail
        const match = cleanUrl.match(/video\/(\d+)/);
        if (match && match[1]) {
            sosmedEmbed.setImage(`https://vxtiktok.com/generate/tiktok?url=${encodeURIComponent(cleanUrl)}`);
        }
    } else if (platform === 'twitter' && (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com'))) {
        // Trik fxtwitter image preview
        const tweetId = cleanUrl.split('/').pop();
        if (tweetId) {
            sosmedEmbed.setImage(`https://fxtwitter.com/i/status/${tweetId}/photo/1`);
        }
    } else if (platform === 'facebook' || platform === 'lainnya') {
        // Menggunakan microlink API untuk generate preview thumbnail otomatis dari Facebook / Web apapun
        sosmedEmbed.setImage(`https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=true&embed=screenshot.url`);
    }

    try {
        // Kirim mention @everyone beserta link original dan embed
        await targetChannel.send({ 
            content: `@everyone\n${cleanUrl}`,  //
            embeds: [sosmedEmbed]  //
        });

        await interaction.editReply({ //
            content: `✅ Link **${platform}** berhasil dikirim ke <#${SOSMED_CHANNEL_ID}>!` //
        });

        setTimeout(() => interaction.deleteReply().catch(() => {}), 5000); //
    } catch (err) {
        console.error('Gagal mengirim link sosmed:', err); //
        await interaction.editReply({ //
            content: '❌ Gagal mengirim ke channel. Cek izin/permissions bot!' //
        });
        setTimeout(() => interaction.deleteReply().catch(() => {}), 5000); //
    }
}

module.exports = { handleShareSosmed }; //