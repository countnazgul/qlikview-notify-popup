## Qlikview Notify

Qlikview document extension that shows notifications when document is open. 

Notifications are added in the server part and the extension is loading them from there as well.

### Why?

Recently we had data issue and few documents was affected by this. We notified the users by adding textboxes in these documents with a warning an explanation. But while this particular data issue was still active 2-3 more data issues was found and editing the text boxes was not quite an option since the we didn't have enough space in the main sheet also there was no guarantee that the users will navigate straight to the main sheet and also editing all the documents, saving and publish them again was a bit slow process.  

![screenshot](https://raw.githubusercontent.com/countnazgul/qlikview-notify-popup/master/Extension/screenshot.png)

### Server setup

Clone this repo and run `npm install`

Edit `config.js` in the `Server` folder to setup the port (default 8080) and run `node server.js`

### Extension setup

After the extension is installed (download the latest qar file from the releases section) navigate to `C:\Users\USERNAME\AppData\Local\QlikTech\QlikView\Extensions\Document\notify` and open `Script.js` in any text editor. 

Edit `serverUrl` and `txBoxId` values to match your environment (you can leave `txBoxId` as it is. See below why this variable is needed)

### Extension Usage

I haven't found a way to get the qv document name from within document extension API. Because of this to get the notifications create new textbox and add the following expression `=DocumentName()`. Change the textbox id to `Popup` (or to whatever id is specified in the `txBoxId` variable in extension `Script.js` file). Put this textbox somewhere where is not visible (do not hide it with show/hide condition because it will not be calculated)

If you want to change the style of the extension edit the `styles.css` file. Be aware that this change will affect all notifications in all documents

Add the extension to the documents `Settings --> Document properties --> Extensions`

### Server Usage

Navigate to `http://myserver:8080`

There is a simple web page where notifications can be added/updated

Available fields:
  * Document - all documents where the notification will be shown. Separate the documents with ;
  * Description - the text that will be shown
  * Valid To - pick expiry date and time
  * Enabled - if the notification is active or not
 
To edit notification select row in the table and edit the values in the top fields
