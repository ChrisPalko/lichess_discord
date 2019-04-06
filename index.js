const fen = require("./utilities.js")
const discord = require("discord.js")

let app = new discord.Client()

app.on("ready", () => {
	app.user.setActivity("taking a break from discord")
	console.log(`Logged in as ${app.user.tag}!`)
})

app.on("message", message => {
	if (/\w+\/\w+\/\w+\/\w+\/\w+\/\w+\/\w+\/\w+/.test(message.content)) {
		console.log("got fen")
		fen(message.content.split(" ")[0], message.content.split(" ")[1])
			.then(data => {
				message.channel.send("", {
					file: data
				})
			})
			.catch(err => console.log(err))
	}
})

app.login(
	process.env.BOT_TOKEN
)
