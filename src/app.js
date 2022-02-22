import tmi from 'tmi.js';
import domainPing from 'domain-ping';
import dotenv from 'dotenv';

dotenv.config();

const oauthPassword = process.env.OAUTH_PASSWORD;
const botUserName = process.env.BOT_USERNAME;

const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: 'info' },
    connection: {
        reconnect: true,
        secure: true,
    },
    identity: {
        username: botUserName,
        password: oauthPassword,
    },

    // Channel the bot is going to be in
    channels: ['aidanjbennett'],
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    // Checks if first message or not
    if (tags['first-msg'] == true) {
        // Shows message
        console.log(`First message ${tags['display-name']}: ${message}`);

        /* 

		Checks if message can be
		pinged by the bot to
		see if its not some code
		e.g. a console.log() etc

			*/

        domainPing(message)
            .then((res) => {
                if (res.success == true) {
                    console.log(`successful ping`);

                    // Timeout person to delete message
                    client.say(
                        channel,
                        `/timeout @${tags.username} 5 Posting Links / First Message`
                    );

                    // Ban person
                    client.say(
                        channel,
                        `/ban @${tags.username} Posting Links / First Message`
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
});
