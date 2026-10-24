const { EmbedBuilder } = require('discord.js');

// Sesuaikan ID dengan ID Channel Discord kamu
const YOUTUBE_CHANNELS = {
    'youtube-share': '1562759855075495989',   // Ganti dengan ID Channel PMR
};

async function handleShareYoutube(interaction) {
    await interaction.deferReply({ ephemeral: true });

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
        return interaction.editReply({
            content: `❌ Channel Discord untuk kategori **${kategori}** tidak ditemukan atau ID belum diisi di file 3.youtubeHandler.js.`
        });
    }

    const ytEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(`📺 Video Baru [${kategori.toUpperCase()}]`)
        .setDescription(`${deskripsi}\n\n🔗 **Tonton di sini:**\n${url}`)
        .setFooter({ text: `Bagikan oleh: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

    try {
        await targetChannel.send({ content: `@everyone\n${url}`, embeds: [ytEmbed] });

        await interaction.editReply({
            content: `✅ Video YouTube berhasil dikirim ke channel <#${targetChannelId}>!`
        });
    } catch (err) {
        console.error('Gagal mengirim video YouTube:', err);
        await interaction.editReply({
            content: '❌ Gagal mengirim pesan ke channel tersebut. Cek izin/permissions bot di channel itu!'
        });
    }
}

module.exports = { handleShareYoutube };