const {
  Client,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  throw new Error('Missing DISCORD_TOKEN or CLIENT_ID');
}

const commands = [
  new SlashCommandBuilder()
    .setName('song')
    .setDescription('Share a song with its cover')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Song name')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('artist')
        .setDescription('Artist name')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('cover')
        .setDescription('Direct image URL of the cover')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Song link')
        .setRequired(true))
].map(command => command.toJSON());

const client = new Client({
  intents: []
});

const rest = new REST({ version: '10' }).setToken(token);

async function start() {
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands }
  );

  console.log('Song command registered.');

  await client.login(token);
}

client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'song') return;

  const name = interaction.options.getString('name');
  const artist = interaction.options.getString('artist');
  const cover = interaction.options.getString('cover');
  const link = interaction.options.getString('link');

  const embed = new EmbedBuilder()
    .setColor(0x1DB954)
    .setTitle(name)
    .setURL(link)
    .setDescription(`🎤 Artist: ${artist}`)
    .setImage(cover)
    .setFooter({ text: 'Song Suggestions 🎵' });

  await interaction.reply({ embeds: [embed] });
});

start().catch(console.error);
