const dialogflow = require('dialogflow');	
const LANGUAGE_CODE = 'en-US' 

class DialogFlow {
	constructor (agentInfo) {
		this.projectId = agentInfo.project_id;
		let privateKey = agentInfo.private_key;
		let clientEmail = agentInfo.client_email;
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