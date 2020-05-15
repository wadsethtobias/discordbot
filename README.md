# Commands:
* config setlogchannel (channel)
* config setsuggestionschannel (channel)
* config setsuggestionslogchannel (channel)
* config commands
* config setprefix (prefix)
* permission (add|remove) (command) [@role]
* permission list (command)
* ban (@user) (reason)
* tempban (@user) (time (1w)) (reason)
* unban (@user)
* kick (@user) (reason)
* warn (@user) (reason)
* warnings (@user)
* delwarn (@user) (uid)
* suggest (suggestion)
* suggestmod (approve|reject) (uid)
---
## Config
```json
{
    "token":"YOUR_BOT_TOKEN_HERE", 
    "prefix":"%",
    "ip":"mc.example.com",
    "color":"#ff0000",
    "logchannel":"",
    "suggestionschannel":"",
    "suggestionslogchannel":""
}
```
token: Your discord bot token [Click me for instructions on how to get yours](https://www.writebots.com/discord-bot-token/)  
prefix: The command prefix [%(command)]  
ip: Your server ip  
color: Specifies the color applicable to the embeds for the bot  
logchannel: Defines which channel the commands should be logged in (Set this with command)  
suggestionschannel: Defines which channel the suggestions should be logged in (Set this with command)  
suggestionslogchannel: Defines which channel the approved or rejected suggestions should be logged in (Set this with command)  