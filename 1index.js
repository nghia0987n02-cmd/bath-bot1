const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 💰 Giá
const RATE_NORMAL = 862;
const BONUS_NORMAL = 20000;

const RATE_VIP = 800;
const BONUS_VIP = 10000;

// 📌 Lệnh
const commands = [
  new SlashCommandBuilder()
    .setName('bath')
    .setDescription('💰 Giá thường')
    .addIntegerOption(option =>
      option.setName('so_tien')
        .setDescription('Nhập số bath')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('bathvip')
    .setDescription('💎 Giá VIP')
    .addIntegerOption(option =>
      option.setName('so_tien')
        .setDescription('Nhập số bath')
        .setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log("✅ Đã đăng ký lệnh");
})();

client.on('ready', () => {
  console.log(`🚀 Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const amount = interaction.options.getInteger('so_tien');
  let result;
  let title;

  if (interaction.commandName === 'bath') {
    result = Math.round(amount * RATE_NORMAL + BONUS_NORMAL);
    title = "💰 Giá Thường";
  }

  if (interaction.commandName === 'bathvip') {
    result = Math.round(amount * RATE_VIP + BONUS_VIP);
    title = "💎 Giá VIP";
  }

  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle(title)
    .setDescription(`**${amount} bath → ${result.toLocaleString()} VND**`)
    .setFooter({ text: "Cung Cấp Tài Chính" });

  await interaction.reply({ embeds: [embed] });
});

client.login(TOKEN);
