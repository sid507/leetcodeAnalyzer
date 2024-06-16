import { SESClient, SendEmailCommand,SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBClient, PutItemCommand,GetItemCommand } from "@aws-sdk/client-dynamodb";
import https from 'https';

const client = new SESClient({ region: "ap-south-1" });
const dynamodbClient = new DynamoDBClient({ region: "ap-south-1" }); // Corrected region


 async function sendEmail(data){
  const input = {
      Destination: {
          ToAddresses: ["recipient@gmail.com"]  // Replace with the recipient's email address
      },
      Template:"Leetcode",
      TemplateData:JSON.stringify(data),
      Source: "sender@gmail.com",
    };
    
   
    const command = new SendTemplatedEmailCommand(input);
    let resp = await client.send(command);
    return resp;
}

async function sendEmailWithoutTemplate(data){
  const input = {
      Destination: {
          ToAddresses: ["recipient@gmail.com"]  // Replace with the recipient's email address
      },
      Message: {
        Subject: {
          Data: "Leetcode Update"
        },
        Body: {
          Text: {
            Data: data
          }
        }
      },
      Source: "sender@gmail.com",
    };
    const command = new SendEmailCommand(input);
    let resp = await client.send(command);
    return resp;
}

async function getIds(){
    
  let input={TableName:"LeetcodeUsers",Key:{"id":{S:"1"}}};
  let command = new GetItemCommand(input);
  let resp = await dynamodbClient.send(command);
  let users = [];
  if(resp?.Item?.users){
    users = resp.Item.users.L.map(item=>item.S);
  }
  return users;
}

const getStatus = (defaultOptions, path, payload) => new Promise((resolve, reject) => {
    const options = { ...defaultOptions, path, method: 'GET' };
    const req = https.request(options, res => {
        let buffer = "";
        res.on('data', chunk => {buffer+=chunk.toString()});
        res.on('end',()=>resolve(JSON.parse(buffer)));
    });
    req.on('error', e => reject(e.message));
    req.end();
})

function format(data){
  let final = '';
  for(let i of data){
    let val = i;
    final+=`Id:${val.id}|Total:${val.totalSolved}|Easy:${val.easySolved}|Medium:${val.mediumSolved}|Hard:${val.hardSolved}|Rank:${val.ranking}\n`;
  }
  return final;
}

export const handler = async (event) => {
  try {
    let allIds =  await getIds();
    let userData={};
    const options = {
        host: 'leetcode-stats-api.herokuapp.com',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
    let allPromises = allIds.map(async id=>{
      let status_info = await getStatus(options,id,'');
      return {...status_info,id};
    })
    let result= await Promise.all(allPromises);
    await sendEmail({'userData':result});
    const response = {
        statusCode: 200,
        body: "Success",
    };
    return response;
    
    
  } catch (error) {
    console.error("Error sending email:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify('Error sending email'),
    };
    return response;
  }
};
