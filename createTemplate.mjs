import { SESClient, SendEmailCommand,SendTemplatedEmailCommand,CreateTemplateCommand,DeleteTemplateCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: "ap-south-1" });

export const handler = async (event) => {
    let deleteCommand = new DeleteTemplateCommand({TemplateName:'Leetcode'});
    await client.send(deleteCommand);
      const params = {
          "Template": {
            "TemplateName": "Leetcode",
            "SubjectPart": "Leetcode Analy",
            "HtmlPart": `<!DOCTYPE html>
            <html>
            <head>
            <style>
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
            </head>
            <body>
            <h2>User Data Report</h2>
            <table>
                <tr>
                    <th>User ID</th>
                    <th>Total Solved</th>
                    <th>Easy Solved</th>
                    <th>Medium Solved</th>
                    <th>Hard Solved</th>
                    <th>Rank</th>
                </tr>
                {{#each userData}}
                <tr>
                    <td>{{this.id}}</td>
                    <td>{{this.totalSolved}}</td>
                    <td>{{this.easySolved}}</td>
                    <td>{{this.mediumSolved}}</td>
                    <td>{{this.hardSolved}}</td>
                    <td>{{this.ranking}}</td>
                </tr>
                {{/each}}
            </table>
            </body>
            </html>`
          }
      }
      let command = new CreateTemplateCommand(params);
      let resp = await client.send(command);
      const response = {
        statusCode: 200,
        body: JSON.stringify(resp),
      };
      return response;
};
