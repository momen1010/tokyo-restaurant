import { httpsCallable } from 'firebase/functions'
import { getFunctionsClient } from '../firebase/client.js'

// The only way UI code calls trusted server logic. Feature services wrap this.
export const callFn = async (name, payload) => (await httpsCallable(getFunctionsClient(), name)(payload)).data
