const { EmbedBuilder, MessageFlags } = require('discord.js');

const YOUTUBE_CHANNELS = {
    'youtube-share': '1562759855075495989', // ID Channel Discord kamu
};

function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

async function handleShareYoutube(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const kategori = interaction.options.getString('kategori');
    const url = interaction.options.getString('url');
    const deskripsi = interaction.options.getString('deskripsi') || 'Nih ada rekomendasi video YouTube keren!';

    const targetChannelId = YOUTUBE_CHANNELS[kategori];
    
    let targetChannel = interaction.guild.channels.cache.get(targetChannelId);
    if (!targetChannel) {
        try {
            targetChannel = await interaction.guild.channels.fetch(targetChannelId);
        } catch (e) {
            targetChannel = null;
        }
    }

    if (!targetChannel) {
        const reply = await interaction.editReply({
            content: `❌ Channel Discord untuk kategori **${kategori}** tidak ditemukan.`
        });
        setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
        return reply;
    }

    const videoId = getYouTubeVideoId(url);
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

    const ytEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(`📺 Video Baru [${kategori.toUpperCase()}]`)
        .addFields(
            { name: '📝 Deskripsi / Catatan:', value: deskripsi },
            { name: '🔗 Link Nonton:', value: `[Klik di sini untuk menonton](${url})` }
        )
        .setFooter({ text: `Dibagikan oleh: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

    if (thumbnailUrl) {
        ytEmbed.setImage(thumbnailUrl);
    }

    try {
        await targetChannel.send({ content: `@everyone\n${url}`, embeds: [ytEmbed] });

        // Kirim pesan konfirmasi ephemeral
        await interaction.editReply({
            content: `✅ Video YouTube berhasil dikirim ke channel <#${targetChannelId}>!`
        });

        // Hapus pesan konfirmasi otomatis setelah 5 detik (5000 ms)
        setTimeout(() => {
            interaction.deleteReply().catch(() => {});
        }, 5000);

    } catch (err) {
        console.error('Gagal mengirim video YouTube:', err);
        await interaction.editReply({
            content: '❌ Gagal mengirim pesan ke channel tersebut. Cek izin/permissions bot di channel itu!'
        });
        setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
    }
}

module.exports = { handleShareYoutube };    