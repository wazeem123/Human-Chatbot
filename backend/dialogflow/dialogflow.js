const dialogflow = require('dialogflow');
const key = require('./cred/config')	
const LANGUAGE_CODE = 'en-US' 

class DialogFlow {
	constructor (projectId) {
		this.projectId = projectId
		let privateKey = (process.env.NODE_ENV=="production") ? JSON.parse(key.private_key) : key.private_key
		let clientEmail = key.client_email
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
		}
	
		this.sessionClient = new dialogflow.SessionsClient(config)
	}

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
		}
		try {
            let responses = await this.sessionClient.detectIntent(request);	
			return responses
		}
		catch(err) {
			throw err
		}
	}
}
module.exports = DialogFlow;