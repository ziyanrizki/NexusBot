const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require('discord.js');

// Helper untuk hapus balasan otomatis
function autoDeleteReply(interaction, timeMs = 5000) {
    setTimeout(() => {
        interaction.deleteReply().catch(() => { });
    }, timeMs);
}

// 1. HANDLER COMMAND /setup-roles (Admin)
async function handleSetupRoles(interaction) {
    const roleEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🎭 Pilih Role Kamu')
        .setDescription(
            'Selamat datang! Klik tombol di bawah untuk memilih role yang sesuai dengan kamu:\n\n' +
            '👤 **Warga**\n' +
            'Role utama server. Memberikan akses penuh ke channel obrolan umum & tag `| ᴺᵉˣᵘˢ` di nickname kamu. *(Wajib diambil terlebih dahulu)*\n\n' +
            '🎮 **Gamer**\n' +
            'Buka akses ke sub-role game favoritmu (Mobile Legend, Genshin, Roblox, Minecraft, HSR, dll) untuk cari kawan mabar.\n\n' +
            '⛩️ **The Pavilion**\n' +
            'Buka akses ke sub-role penikmat pop-kultur Asia (Anime Lovers, Donghua Watcher, & Manwha Reader).\n\n' +
            '💡 *Klik sekali untuk mengambil role, klik lagi untuk melepas.*')
        .setFooter({ text: 'Klik sekali untuk ambil, klik lagi untuk lepas.' })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('role_warga')
            .setLabel('👤 Warga')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('role_gamer')
            .setLabel('🎮 Gamer')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('role_pavilion')
            .setLabel('⛩️ The Pavilion')
            .setStyle(ButtonStyle.Primary),
    );

    await interaction.reply({ content: 'Menu role berhasil dibuat!', flags: MessageFlags.Ephemeral });
    autoDeleteReply(interaction);
    await interaction.channel.send({ embeds: [roleEmbed], components: [row] });
}

// 2. HANDLER KLIK TOMBOL ROLE
async function handleButtonRoles(interaction) {
    const member = interaction.member;

    // A. PENGECEKAN ROLE LOCK WARGA
    const wargaRole = interaction.guild.roles.cache.find(r => r.name === 'Warga');
    const hasWargaRole = wargaRole && member.roles.cache.has(wargaRole.id);

    if (!hasWargaRole && interaction.customId !== 'role_warga') {
        await interaction.reply({
            content: '⚠️ **Akses Ditolak!** Kamu harus mengambil **Role Warga** terlebih dahulu sebelum bisa memilih role lainnya.',
            flags: MessageFlags.Ephemeral
        });
        autoDeleteReply(interaction);
        return;
    }

    // B. TOMBOL THE PAVILION -> SUB-MENU (Anime, Donghua, Manwha)
    if (interaction.customId === 'role_pavilion') {
        const pavilionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('pav_anime')
                .setLabel('Anime Lovers')
                .setEmoji('🌸')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('pav_donghua')
                .setLabel('Donghua Watcher')
                .setEmoji('🐉')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('pav_manwha')
                .setLabel('Manwha Reader')
                .setEmoji('📖')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            content: '⛩️ **Menu The Pavilion!**\nKlik tombol di bawah ini untuk mengambil atau melepas role hobi kamu:',
            components: [pavilionRow],
            flags: MessageFlags.Ephemeral
        });
        autoDeleteReply(interaction, 15000);
        return;
    }

    // C. TOMBOL GAMER -> SUB-MENU GAME
    if (interaction.customId === 'role_gamer') {
        const gameRow1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('game_ml')
                .setLabel('Mobile Legend')
                .setEmoji('⚔️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('game_genshin')
                .setLabel('Genshin Impact')
                .setEmoji('👁️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('game_hsr')
                .setLabel('Honkai StarRail')
                .setEmoji('🚂')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('game_roblox')
                .setLabel('Roblox')
                .setEmoji('🟥')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('game_minecraft')
                .setLabel('Minecraft')
                .setEmoji('⛏️')
                .setStyle(ButtonStyle.Secondary)
        );

        const gameRow2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('game_lainnya')
                .setLabel('Lainnya')
                .setEmoji('🎮')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            content: '🎮 **Role Gamer Aktif!**\nKlik tombol di bawah ini untuk mengambil atau melepas role game yang kamu mainkan:',
            components: [gameRow1, gameRow2],
            flags: MessageFlags.Ephemeral
        });
        autoDeleteReply(interaction, 15000);
        return;
    }

    // D. HANDLER SUB-ROLE THE PAVILION (Anime, Donghua, Manwha)
    if (interaction.customId.startsWith('pav_')) {
        const pavMap = {
            'pav_anime': 'Anime Lovers',
            'pav_donghua': 'Donghua Watcher',
            'pav_manwha': 'Manwha Reader'
        };

        const targetName = pavMap[interaction.customId];
        const role = interaction.guild.roles.cache.find(r => r.name === targetName);
        const pavilionDivider = interaction.guild.roles.cache.find(r => r.name.includes('The Pavilion'));

        if (!role) {
            await interaction.reply({
                content: `❌ Role **${targetName}** belum dibuat oleh Admin di server Discord ini.`,
                flags: MessageFlags.Ephemeral
            });
            autoDeleteReply(interaction);
            return;
        }

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            
            // Cek apakah member masih punya sub-role Pavilion lainnya
            const allPavNames = Object.values(pavMap);
            const stillHasOtherPavRole = member.roles.cache.some(r => allPavNames.includes(r.name) && r.id !== role.id);

            // Jika tidak ada sub-role tersisa, hapus divider Pavilion
            if (!stillHasOtherPavRole && pavilionDivider && member.roles.cache.has(pavilionDivider.id)) {
                await member.roles.remove(pavilionDivider);
            }

            await interaction.reply({ content: `❌ Role **${role.name}** berhasil dilepas.`, flags: MessageFlags.Ephemeral });
        } else {
            await member.roles.add(role);
            if (pavilionDivider && !member.roles.cache.has(pavilionDivider.id)) {
                await member.roles.add(pavilionDivider);
            }
            await interaction.reply({ content: `✅ Kamu berhasil mendapatkan role **${role.name}**!`, flags: MessageFlags.Ephemeral });
        }
        autoDeleteReply(interaction);
        return;
    }

    // E. HANDLER SUB-ROLE GAMER
    if (interaction.customId.startsWith('game_')) {
        const gameMap = {
            'game_ml': 'Mobile Legend',
            'game_genshin': 'Genshin Impact',
            'game_hsr': 'Honkai StarRail',
            'game_roblox': 'Roblox',
            'game_minecraft': 'Minecraft',
            'game_lainnya': 'Lainnya'
        };

        const targetGame = gameMap[interaction.customId];
        const role = interaction.guild.roles.cache.find(r => r.name === targetGame);
        const gamerDivider = interaction.guild.roles.cache.find(r => r.name.includes('Gamer'));

        if (!role) {
            await interaction.reply({
                content: `❌ Role **${targetGame}** belum dibuat oleh Admin di server Discord ini.`,
                flags: MessageFlags.Ephemeral
            });
            autoDeleteReply(interaction);
            return;
        }

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);

            // Cek apakah member masih punya sub-role Gamer lainnya
            const allGameNames = Object.values(gameMap);
            const stillHasOtherGameRole = member.roles.cache.some(r => allGameNames.includes(r.name) && r.id !== role.id);

            // Jika tidak ada sub-role tersisa, hapus divider Gamer
            if (!stillHasOtherGameRole && gamerDivider && member.roles.cache.has(gamerDivider.id)) {
                await member.roles.remove(gamerDivider);
            }

            await interaction.reply({ content: `❌ Role **${role.name}** berhasil dilepas.`, flags: MessageFlags.Ephemeral });
        } else {
            await member.roles.add(role);
            if (gamerDivider && !member.roles.cache.has(gamerDivider.id)) {
                await member.roles.add(gamerDivider);
            }
            await interaction.reply({ content: `✅ Kamu berhasil mendapatkan role **${role.name}**!`, flags: MessageFlags.Ephemeral });
        }
        autoDeleteReply(interaction);
        return;
    }

    // F. HANDLER ROLE WARGA (BERSIHKAN SEMUA SUB-ROLE JIKA WARGA DILEPAS)
    if (interaction.customId === 'role_warga') {
        const role = interaction.guild.roles.cache.find(r => r.name === 'Warga');
        if (!role) {
            await interaction.reply({ content: '❌ Role **Warga** tidak ditemukan di server ini.', flags: MessageFlags.Ephemeral });
            autoDeleteReply(interaction);
            return;
        }

        const tagNexus = ' | ᴺᵉˣᵘˢ';
        let currentName = member.displayName;

        if (member.roles.cache.has(role.id)) {
            // Daftar nama semua sub-role dan divider yang harus dibersihkan
            const subRoleNames = [
                'Anime Lovers', 'Donghua Watcher', 'Manwha Reader',
                'Mobile Legend', 'Genshin Impact', 'Honkai StarRail', 'Roblox', 'Minecraft', 'Lainnya'
            ];

            // Cari role yang dimiliki user dan cocok untuk dilepas
            const rolesToRemove = member.roles.cache.filter(r => 
                r.id === role.id || 
                subRoleNames.includes(r.name) || 
                r.name.includes('Gamer') || 
                r.name.includes('The Pavilion')
            );

            await member.roles.remove(rolesToRemove);

            if (currentName.endsWith(tagNexus)) {
                const newName = currentName.replace(tagNexus, '').trim();
                try { await member.setNickname(newName); } catch (err) { }
            }
            await interaction.reply({ 
                content: `❌ Role **${role.name}** dan seluruh sub-role kategori di bawahnya berhasil dibersihkan!`, 
                flags: MessageFlags.Ephemeral 
            });
        } else {
            await member.roles.add(role);
            if (!currentName.endsWith(tagNexus)) {
                let baseName = currentName;
                if ((baseName + tagNexus).length > 32) baseName = baseName.substring(0, 32 - tagNexus.length);
                try { await member.setNickname(`${baseName}${tagNexus}`); } catch (err) { }
            }
            await interaction.reply({ content: `✅ Kamu berhasil mendapatkan role **${role.name}**!`, flags: MessageFlags.Ephemeral });
        }
        autoDeleteReply(interaction);
    }
}

module.exports = {
    handleSetupRoles,
    handleButtonRoles
};