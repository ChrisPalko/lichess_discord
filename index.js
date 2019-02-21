const gif = require('./utilities.js');
const discord = require('discord.js')

let app = new discord.Client()

app.on('ready', () => {
	app.user.setActivity("taking a break from discord");
	console.log(`Logged in as ${app.user.tag}!`);
});
app.on('message', message => {
if (message.content.includes("https://lichess.org/") && message.content.split("/")[3].length === 8) {
	console.log("test");
	gif(message.content.split("/")[3])
		.then(data => {
			console.log(data)
			let embed = new discord.RichEmbed()
			message.channel.send({
				embed: embed,
				files: data.toString(),
				name: "file.gif"
			})
		})
		.catch(err=>console.log(err))
}
})
app.login(process.env.BOT_TOKEN)