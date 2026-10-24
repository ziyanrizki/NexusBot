const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

// Daftar subreddit meme paling aktif
const MEME_SUBREDDITS = [
    'dankmemes',
    'memes',
    'wholesomememes',
    'me_irl',
    'shitposting'
];

async function handleMeme(interaction) {
    await interaction.deferReply();

    try {
        // Ambil 1 subreddit acak dari daftar
        const randomSub = MEME_SUBREDDITS[Math.floor(Math.random() * MEME_SUBREDDITS.length)];
        const response = await axios.get(`https://meme-api.com/gimme/${randomSub}`);
        const data = response.data;

        if (data.nsfw || data.spoiler) {
            return await interaction.editReply({
                content: '⚠️ Meme yang didapat bertanda NSFW/Spoiler, coba ketik `/meme` lagi ya!'
            });
        }

        const memeEmbed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle(data.title || 'Meme Keren Hari Ini')
            .setURL(data.postLink)
            .setImage(data.url)
            .setFooter({ 
                text: `r/${data.subreddit} • Disukai oleh ${data.ups} orang • Di-request oleh ${interaction.user.username}` 
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [memeEmbed] });

    } catch (error) {
        console.error('Gagal mengambil meme:', error.message);
        await interaction.editReply({
            content: '❌ Gagal mengambil meme dari API. Coba lagi nanti!'
        });
    }
}

module.exports = { handleMeme };