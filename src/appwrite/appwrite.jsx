import { Client,Account,Databases } from "appwrite"; 
import conf from "../configure/Config";


const client = new Client();

client.setEndpoint(conf.appwriteURL).setProject(conf.appwriteProjectID);

export const account = new Account(client);

// Database

export const databases = new Databases(client);
